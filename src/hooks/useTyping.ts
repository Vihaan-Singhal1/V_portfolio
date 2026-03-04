import { useEffect, useState } from 'react';

export function useTyping(texts: string[], speed = 65, pause = 2200) {
  const [display, setDisplay] = useState('');
  const [index, setIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (texts.length === 0) return;

    const active = texts[index % texts.length];
    let timeoutId: number;

    if (!deleting && charIndex < active.length) {
      timeoutId = window.setTimeout(() => setCharIndex((prev) => prev + 1), speed);
    } else if (!deleting && charIndex === active.length) {
      timeoutId = window.setTimeout(() => setDeleting(true), pause);
    } else if (deleting && charIndex > 0) {
      timeoutId = window.setTimeout(() => setCharIndex((prev) => prev - 1), Math.max(35, speed / 2));
    } else {
      setDeleting(false);
      setIndex((prev) => (prev + 1) % texts.length);
    }

    setDisplay(active.slice(0, charIndex));

    return () => window.clearTimeout(timeoutId);
  }, [charIndex, deleting, index, pause, speed, texts]);

  return display;
}
