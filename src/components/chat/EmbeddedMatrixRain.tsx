import { useEffect, useMemo, useRef, useState } from 'react';

import { useShouldReduceMotion } from '../../lib/motion';

type EmbeddedMatrixRainProps = {
  src: string;
  enabled?: boolean;
  className?: string;
};

const CHARSET = '01<>/{}[]()=+*#@%$';
const MASK_W = 180;
const MASK_H = 260;
const TARGET_FPS = 30;
const FRAME_MS = 1000 / TARGET_FPS;

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

export function EmbeddedMatrixRain({ src, enabled = true, className }: EmbeddedMatrixRainProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const maskRef = useRef<Float32Array | null>(null);
  const dropsRef = useRef<number[]>([]);
  const speedRef = useRef<number[]>([]);
  const frameRef = useRef<number>(0);
  const lastTickRef = useRef<number>(0);
  const resizeObserverRef = useRef<ResizeObserver | null>(null);

  const [inView, setInView] = useState(true);
  const [tabVisible, setTabVisible] = useState(
    typeof document === 'undefined' ? true : !document.hidden
  );
  const [maskReady, setMaskReady] = useState(false);
  const shouldReduceMotion = useShouldReduceMotion();

  const isActive = useMemo(
    () => enabled && !shouldReduceMotion && inView && tabVisible && maskReady,
    [enabled, inView, shouldReduceMotion, tabVisible, maskReady]
  );

  useEffect(() => {
    if (typeof document === 'undefined') return;

    const onVisibility = () => {
      setTabVisible(!document.hidden);
    };

    document.addEventListener('visibilitychange', onVisibility);
    return () => {
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        setInView(entry?.isIntersecting ?? false);
      },
      { threshold: 0.1 }
    );

    observer.observe(canvas);

    return () => {
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!enabled || shouldReduceMotion) {
      setMaskReady(false);
      return;
    }

    let cancelled = false;
    setMaskReady(false);

    const image = new Image();
    image.src = src;

    image.onload = () => {
      if (cancelled) return;

      const offscreen = document.createElement('canvas');
      offscreen.width = MASK_W;
      offscreen.height = MASK_H;
      const context = offscreen.getContext('2d', { willReadFrequently: true });

      if (!context) {
        setMaskReady(true);
        return;
      }

      const sourceRatio = image.width / image.height;
      const targetRatio = MASK_W / MASK_H;

      let drawWidth = MASK_W;
      let drawHeight = MASK_H;
      let offsetX = 0;
      let offsetY = 0;

      if (sourceRatio > targetRatio) {
        drawHeight = MASK_H;
        drawWidth = drawHeight * sourceRatio;
        offsetX = (MASK_W - drawWidth) / 2;
      } else {
        drawWidth = MASK_W;
        drawHeight = drawWidth / sourceRatio;
        offsetY = (MASK_H - drawHeight) / 2;
      }

      context.clearRect(0, 0, MASK_W, MASK_H);
      context.drawImage(image, offsetX, offsetY, drawWidth, drawHeight);

      const pixels = context.getImageData(0, 0, MASK_W, MASK_H).data;
      const mask = new Float32Array(MASK_W * MASK_H);

      for (let i = 0; i < mask.length; i += 1) {
        const px = i * 4;
        const r = pixels[px] / 255;
        const g = pixels[px + 1] / 255;
        const b = pixels[px + 2] / 255;

        const lum = 0.2126 * r + 0.7152 * g + 0.0722 * b;
        const alpha = clamp(0.12 + Math.pow(1 - lum, 1.34) * 0.82, 0.12, 0.88);
        mask[i] = alpha;
      }

      maskRef.current = mask;
      setMaskReady(true);
    };

    image.onerror = () => {
      if (cancelled) return;
      maskRef.current = null;
      setMaskReady(true);
    };

    return () => {
      cancelled = true;
    };
  }, [enabled, shouldReduceMotion, src]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !isActive) return;

    const context = canvas.getContext('2d');
    if (!context) return;

    let width = 0;
    let height = 0;
    let dpr = 1;
    const fontSize = 11;

    const setupCanvas = () => {
      const rect = canvas.getBoundingClientRect();
      width = Math.max(1, Math.floor(rect.width));
      height = Math.max(1, Math.floor(rect.height));
      dpr = clamp(window.devicePixelRatio || 1, 1, 2);

      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);

      context.setTransform(1, 0, 0, 1, 0, 0);
      context.scale(dpr, dpr);

      const columns = Math.max(16, Math.floor(width / fontSize));
      const rowSpan = height / fontSize;

      dropsRef.current = new Array(columns)
        .fill(0)
        .map(() => Math.random() * rowSpan);

      speedRef.current = new Array(columns)
        .fill(0)
        .map(() => 0.45 + Math.random() * 0.35);
    };

    setupCanvas();

    resizeObserverRef.current?.disconnect();
    resizeObserverRef.current = new ResizeObserver(() => {
      setupCanvas();
    });

    resizeObserverRef.current.observe(canvas);
    if (canvas.parentElement) {
      resizeObserverRef.current.observe(canvas.parentElement);
    }

    const draw = (time: number) => {
      if (!canvasRef.current || !context) return;

      if (time - lastTickRef.current < FRAME_MS) {
        frameRef.current = window.requestAnimationFrame(draw);
        return;
      }
      lastTickRef.current = time;

      context.setTransform(1, 0, 0, 1, 0, 0);
      context.scale(dpr, dpr);

      context.globalCompositeOperation = 'source-over';
      context.fillStyle = 'rgba(2, 8, 10, 0.085)';
      context.fillRect(0, 0, width, height);

      const mask = maskRef.current;
      const sweepCycle = time % 9500;
      const sweepBoost = sweepCycle < 700 ? 1 + (1 - Math.abs(sweepCycle - 350) / 350) * 0.24 : 1;
      const flicker = 0.995 + (Math.random() - 0.5) * 0.02;

      context.globalCompositeOperation = 'screen';
      context.font = `${fontSize}px "Space Mono", monospace`;
      context.textAlign = 'center';
      context.textBaseline = 'middle';

      const dropCount = dropsRef.current.length;
      for (let i = 0; i < dropCount; i += 1) {
        const x = i * fontSize + fontSize * 0.5;
        const y = dropsRef.current[i] * fontSize;

        let maskAlpha = 0.42;
        if (mask) {
          const mx = clamp(Math.floor((x / width) * (MASK_W - 1)), 0, MASK_W - 1);
          const my = clamp(Math.floor((y / height) * (MASK_H - 1)), 0, MASK_H - 1);
          maskAlpha = mask[my * MASK_W + mx];
        }

        const alpha = clamp((0.1 + maskAlpha * 0.62) * sweepBoost * flicker, 0.05, 0.62);

        context.shadowBlur = 11;
        context.shadowColor = 'rgba(90,210,255,0.26)';

        const trailChar = CHARSET.charAt(Math.floor(Math.random() * CHARSET.length));
        context.fillStyle = `rgba(120,220,255,${alpha * 0.2})`;
        context.fillText(trailChar, x, y - fontSize * 0.9);

        const char = CHARSET.charAt(Math.floor(Math.random() * CHARSET.length));
        context.fillStyle = `rgba(148,236,255,${alpha * 0.92})`;
        context.fillText(char, x, y);

        if (y > height + fontSize * 1.8) {
          dropsRef.current[i] = -Math.random() * (height / fontSize) * 0.35;
          speedRef.current[i] = 0.45 + Math.random() * 0.35;
        } else {
          dropsRef.current[i] += speedRef.current[i];
        }
      }

      frameRef.current = window.requestAnimationFrame(draw);
    };

    frameRef.current = window.requestAnimationFrame(draw);

    return () => {
      if (frameRef.current) {
        window.cancelAnimationFrame(frameRef.current);
      }
      resizeObserverRef.current?.disconnect();
      resizeObserverRef.current = null;
      context.setTransform(1, 0, 0, 1, 0, 0);
      context.clearRect(0, 0, canvas.width, canvas.height);
    };
  }, [isActive]);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      aria-hidden="true"
    />
  );
}
