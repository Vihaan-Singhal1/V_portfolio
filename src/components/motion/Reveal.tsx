import { motion, type HTMLMotionProps } from 'motion/react';

import {
  D_MED,
  EASE_OUT,
  getRevealDuration,
  getRevealVariants,
  type RevealVariantName,
  useShouldReduceMotion
} from '../../lib/motion';

type RevealProps = HTMLMotionProps<'div'> & {
  variant?: RevealVariantName;
  delay?: number;
  once?: boolean;
  amount?: number;
};

export function Reveal({
  variant = 'fadeUp',
  delay = 0,
  once = true,
  amount = 0.25,
  children,
  transition,
  ...rest
}: RevealProps) {
  const reducedMotion = useShouldReduceMotion();

  return (
    <motion.div
      initial="hidden"
      whileInView="show"
      viewport={{ once, amount }}
      variants={getRevealVariants(variant, reducedMotion)}
      transition={
        transition ?? {
          duration: reducedMotion ? 0.2 : getRevealDuration(variant),
          ease: EASE_OUT,
          delay
        }
      }
      {...rest}
    >
      {children}
    </motion.div>
  );
}

type StaggerProps = HTMLMotionProps<'div'> & {
  once?: boolean;
  amount?: number;
  stagger?: number;
  delayChildren?: number;
};

export function Stagger({
  once = true,
  amount = 0.18,
  stagger = 0.075,
  delayChildren = 0,
  children,
  ...rest
}: StaggerProps) {
  const reducedMotion = useShouldReduceMotion();

  return (
    <motion.div
      initial="hidden"
      whileInView="show"
      viewport={{ once, amount }}
      variants={{
        hidden: {},
        show: {
          transition: {
            staggerChildren: reducedMotion ? 0 : stagger,
            delayChildren
          }
        }
      }}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

type StaggerItemProps = HTMLMotionProps<'div'> & {
  variant?: RevealVariantName;
};

export function StaggerItem({ variant = 'fadeUp', children, ...rest }: StaggerItemProps) {
  const reducedMotion = useShouldReduceMotion();

  return (
    <motion.div
      variants={getRevealVariants(variant, reducedMotion)}
      transition={{
        duration: reducedMotion ? 0.2 : D_MED,
        ease: EASE_OUT
      }}
      {...rest}
    >
      {children}
    </motion.div>
  );
}
