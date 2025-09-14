// ./src/components/magicui/blur-fade.tsx
"use client";

import { AnimatePresence, motion, useInView, Variants } from "framer-motion"; // Removed MarginType import
import { useRef } from "react";

// 1. Infer the type of the 'options' parameter of useInView
type InViewHookOptions = Parameters<typeof useInView>[1];

// 2. Infer the type of the 'margin' property from those options
// This will correctly capture the type framer-motion expects for 'margin',
// including 'undefined' if the property is optional.
type InViewMarginType = InViewHookOptions extends undefined // Check if options object itself is optional
  ? string // Fallback, though typically options is an object if provided
  : NonNullable<InViewHookOptions>['margin'];

interface BlurFadeProps {
  children: React.ReactNode;
  className?: string;
  variant?: {
    hidden: { y: number };
    visible: { y: number };
  };
  duration?: number;
  delay?: number;
  yOffset?: number;
  inView?: boolean;
  inViewMargin?: InViewMarginType; // Use the inferred type here
  blur?: string;
}

const BlurFade = ({
  children,
  className,
  variant,
  duration = 0.4,
  delay = 0,
  yOffset = 6,
  inView = false,
  // The default value "-50px" should be assignable to InViewMarginType
  // if InViewMarginType ultimately resolves to a type compatible with string literals
  // like "string" or specific template literal strings (e.g., `${number}px`).
  inViewMargin = "-50px",
  blur = "6px",
}: BlurFadeProps) => {
  const ref = useRef(null);

  // The 'inViewMargin' passed to the hook will now have the precise type expected by useInView.
  const inViewResult = useInView(ref, { once: true, margin: inViewMargin });
  const isInView = !inView || inViewResult;

  const defaultVariants: Variants = {
    hidden: { y: yOffset, opacity: 0, filter: `blur(${blur})` },
    visible: { y: -yOffset, opacity: 1, filter: `blur(0px)` },
  };
  const combinedVariants = variant || defaultVariants;

  return (
    <AnimatePresence>
      <motion.div
        ref={ref}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        exit="hidden"
        variants={combinedVariants}
        transition={{
          delay: 0.04 + delay,
          duration,
          ease: "easeOut",
        }}
        className={className}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};

export default BlurFade;
