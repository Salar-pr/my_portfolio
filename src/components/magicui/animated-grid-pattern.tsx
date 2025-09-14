"use client";

import { motion } from "motion/react"; // Assuming this is the correct import for your setup
import {
  ComponentPropsWithoutRef,
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";

import { cn } from "@/lib/utils";

export interface AnimatedGridPatternProps
  extends ComponentPropsWithoutRef<"svg"> {
  width?: number;
  height?: number;
  x?: number;
  y?: number;
  strokeDasharray?: any;
  numSquares?: number;
  maxOpacity?: number;
  duration?: number;
  repeatDelay?: number;
}

export function AnimatedGridPattern({
  width = 40,
  height = 40,
  x = -1,
  y = -1,
  strokeDasharray = 0,
  numSquares = 50,
  className,
  maxOpacity = 0.5,
  duration = 4,
  repeatDelay = 0.5,
  ...props
}: AnimatedGridPatternProps) {
  const id = useId();
  const containerRef = useRef<SVGSVGElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  // Moved getPos and generateSquares definitions before their use in useState
  const getPos = useCallback(() => {
    // Ensure dimensions are available and positive to avoid division by zero or NaN
    // This is important because dimensions are initialized to 0,0
    if (dimensions.width > 0 && dimensions.height > 0) {
      return [
        Math.floor((Math.random() * dimensions.width) / width),
        Math.floor((Math.random() * dimensions.height) / height),
      ];
    }
    return [0, 0]; // Default position if dimensions are not ready
  }, [dimensions.height, dimensions.width, width, height]);

  const generateSquares = useCallback(
    (count: number) => {
      return Array.from({ length: count }, (_, i) => ({
        id: i, // Unique ID for each square
        pos: getPos(),
      }));
    },
    [getPos] // getPos is a stable dependency due to its own useCallback
  );

  // Initialize squares state after generateSquares is defined
  const [squares, setSquares] = useState(() => generateSquares(numSquares));

  // Function to update a single square's position
  const updateSquarePosition = useCallback(
    (squareId: number) => {
      setSquares((currentSquares) =>
        currentSquares.map((sq) =>
          sq.id === squareId
            ? {
                ...sq,
                pos: getPos(), // Get a new position
              }
            : sq
        )
      );
    },
    [getPos] // getPos is a stable dependency
  );

  // Effect to update squares when dimensions or numSquares change
  useEffect(() => {
    // Only generate new squares if dimensions are valid
    if (dimensions.width > 0 && dimensions.height > 0) {
      setSquares(generateSquares(numSquares));
    }
    // generateSquares is memoized and its dependencies are listed,
    // so this effect will re-run appropriately.
  }, [dimensions, numSquares, generateSquares]);

  // Effect for ResizeObserver to update container dimensions
  useEffect(() => {
    const currentContainer = containerRef.current; // Capture for cleanup
    if (!currentContainer) {
      return;
    }

    const observer = new ResizeObserver((entries) => {
      for (let entry of entries) {
        setDimensions({
          width: entry.contentRect.width,
          height: entry.contentRect.height,
        });
      }
    });

    observer.observe(currentContainer);

    return () => {
      // Cleanup observer
      if (currentContainer) {
        observer.unobserve(currentContainer);
      }
    };
  }, []); // Empty dependency array: runs once on mount, cleans up on unmount

  return (
    <svg
      ref={containerRef}
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute inset-0 h-full w-full fill-gray-400/30 stroke-gray-400/30",
        className
      )}
      {...props}
    >
      <defs>
        <pattern
          id={id}
          width={width}
          height={height}
          patternUnits="userSpaceOnUse"
          x={x} // SVG pattern attribute x
          y={y} // SVG pattern attribute y
        >
          <path
            d={`M.5 ${height}V.5H${width}`}
            fill="none"
            strokeDasharray={strokeDasharray}
          />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
      {/* Render squares inside a nested SVG to apply the x and y props as offset if needed */}
      <svg x={x} y={y} className="overflow-visible">
        {squares.map(({ pos: [squareX, squareY], id: squareId }, index) => (
          <motion.rect
            key={`${squareX}-${squareY}-${squareId}-${index}`} // Enhanced key for better uniqueness
            initial={{ opacity: 0 }}
            animate={{ opacity: maxOpacity }}
            transition={{
              duration,
              repeat: 1, // Animation will play forwards then backwards once
              delay: index * 0.1, // Stagger animation start
              repeatType: "reverse",
            }}
            // When animation completes, update the position of this specific square
            onAnimationComplete={() => updateSquarePosition(squareId)}
            width={width - 1} // Subtract 1 for a slight gap, if desired
            height={height - 1} // Subtract 1 for a slight gap, if desired
            x={squareX * width + 1} // Position based on calculated grid cell
            y={squareY * height + 1} // Position based on calculated grid cell
            fill="currentColor"
            strokeWidth="0"
          />
        ))}
      </svg>
    </svg>
  );
}

