"use client";

// This is an old component directly used from Qudot beta

import { useEffect, useRef, useState, useCallback } from "react";

interface TraitProps {
  src: string;
  traitId: string;
  alt: string;
  zIndex: number;
  visible?: boolean;
  className: string;
  onLoad?: () => void;
  bodyColor?: string;
  eyeColor?: string;
  hairColor?: string;
}

const svgCache = new Map<string, string>();

const svgStructureCache = new Map<
  string,
  {
    hasColorableContent: boolean;
    processedSVG: string;
    colorableElements: string[];
  }
>();

class OptimizedColorScheduler {
  private pendingUpdates = new Map<string, () => void>();
  private rafId: number | null = null;

  schedule(key: string, callback: () => void) {
    this.pendingUpdates.set(key, callback);

    if (!this.rafId) {
      this.rafId = requestAnimationFrame(() => {
        // Batch all pending updates
        this.pendingUpdates.forEach((cb) => cb());
        this.pendingUpdates.clear();
        this.rafId = null;
      });
    }
  }

  cancel(key: string) {
    this.pendingUpdates.delete(key);
    if (this.pendingUpdates.size === 0 && this.rafId) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
  }
}

const colorScheduler = new OptimizedColorScheduler();

// Color throttling, not even sure if it works, since changing it to a higher delay doesn't really make it any slower
const createThrottledColorUpdate = (fn: () => void, delay = 16) => {
  let lastUpdate = 0;
  return () => {
    const now = performance.now();
    if (now - lastUpdate >= delay) {
      fn();
      lastUpdate = now;
    }
  };
};

function analyzeSVGStructure(svgText: string): {
  hasColorableContent: boolean;
  processedSVG: string;
  colorableElements: string[];
} {
  const parser = new DOMParser();
  const doc = parser.parseFromString(svgText, "image/svg+xml");
  const svgElement = doc.documentElement;

  const styleEl = svgElement.querySelector("style");
  let hasColorableStyle = false;
  const colorableSelectors: string[] = [];

  if (styleEl && styleEl.textContent) {
    let cssText = styleEl.textContent;

    // Replace colors with CSS custom properties
    const colorReplacements = [
      {
        pattern: /fill:\s*(lime|#00FF00)\s*;/gi,
        property: "--body-color",
      },
      {
        pattern: /fill:\s*(#FFFF00|#FF0)\s*;/gi,
        property: "--eye-color",
      },
      {
        pattern: /fill:\s*blue\s*;/gi,
        property: "--hair-color",
      },
    ];

    colorReplacements.forEach(({ pattern, property }) => {
      if (pattern.test(cssText)) {
        hasColorableStyle = true;
        cssText = cssText.replace(pattern, `fill: var(${property});`);
      }
    });

    // Extract class selectors that have color properties
    const classMatches = cssText.matchAll(
      /\.([^{]+)\s*\{[^}]*fill:\s*var\([^}]+\}/g,
    );
    for (const match of classMatches) {
      colorableSelectors.push(`.${match[1].trim()}`);
    }

    styleEl.textContent = cssText;
  }

  return {
    hasColorableContent: hasColorableStyle,
    processedSVG: doc.documentElement.outerHTML,
    colorableElements: [...new Set(colorableSelectors)],
  };
}

export function Trait({
  src,
  traitId,
  alt,
  zIndex,
  visible = true,
  className,
  onLoad,
  bodyColor = "lime",
  eyeColor = "#FFFF00",
  hairColor = "blue",
}: TraitProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const shadowRootRef = useRef<ShadowRoot | null>(null);
  const svgElementRef = useRef<SVGElement | null>(null);
  const [rawSVG, setRawSVG] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasColorableContent, setHasColorableContent] = useState(false);

  // Track previous colors to avoid unnecessary updates
  const prevColorsRef = useRef({ bodyColor, eyeColor, hairColor });

  // Fetch SVG with caching
  useEffect(() => {
    if (!visible || !src || !traitId) return;

    if (svgCache.has(traitId)) {
      setRawSVG(svgCache.get(traitId)!);
      return;
    }

    let isCancelled = false;

    const fetchSVG = async () => {
      try {
        const res = await fetch(src);
        const svgText = await res.text();

        if (!isCancelled) {
          svgCache.set(traitId, svgText);
          setRawSVG(svgText);
        }
      } catch (err) {
        if (!isCancelled) {
          console.error(`Failed to fetch SVG for ${traitId}`, err);
        }
      }
    };

    fetchSVG();

    return () => {
      isCancelled = true;
    };
  }, [traitId, visible, src]);

  // Process SVG structure once
  const processSVGStructure = useCallback(
    (svgText: string) => {
      if (svgStructureCache.has(traitId)) {
        return svgStructureCache.get(traitId)!;
      }

      const structure = analyzeSVGStructure(svgText);
      svgStructureCache.set(traitId, structure);

      // Limit cache size
      if (svgStructureCache.size > 100) {
        const firstKey = svgStructureCache.keys().next().value;
        if (firstKey) {
          svgStructureCache.delete(firstKey);
        }
      }

      return structure;
    },
    [traitId],
  );

  // Initial SVG setup, only runs once per trait
  useEffect(() => {
    if (!visible || !rawSVG || !containerRef.current || isLoaded) return;

    try {
      const structure = processSVGStructure(rawSVG);

      // Create shadow root only once
      if (!shadowRootRef.current) {
        shadowRootRef.current = containerRef.current.attachShadow({
          mode: "open",
        });
      }

      // Set the processed SVG
      shadowRootRef.current.innerHTML = structure.processedSVG;
      svgElementRef.current = shadowRootRef.current.querySelector("svg");

      setHasColorableContent(structure.hasColorableContent);

      // Set initial colors if colorable
      if (structure.hasColorableContent && svgElementRef.current) {
        const style = svgElementRef.current.style;
        style.setProperty("--body-color", bodyColor);
        style.setProperty("--eye-color", eyeColor);
        style.setProperty("--hair-color", hairColor);
        prevColorsRef.current = { bodyColor, eyeColor, hairColor };
      }

      setIsLoaded(true);
      onLoad?.();
    } catch (error) {
      console.error(`Error processing SVG for ${traitId}:`, error);
    }
  }, [
    rawSVG,
    visible,
    processSVGStructure,
    traitId,
    onLoad,
    isLoaded,
    bodyColor,
    eyeColor,
    hairColor,
  ]);

  // Optimized color updates
  const updateColors = useCallback(() => {
    if (!svgElementRef.current || !hasColorableContent) return;

    const prev = prevColorsRef.current;

    // Skip if colors haven't changed
    if (
      prev.bodyColor === bodyColor &&
      prev.eyeColor === eyeColor &&
      prev.hairColor === hairColor
    ) {
      return;
    }

    const style = svgElementRef.current.style;

    // Only update properties that have changed
    if (prev.bodyColor !== bodyColor) {
      style.setProperty("--body-color", bodyColor);
    }
    if (prev.eyeColor !== eyeColor) {
      style.setProperty("--eye-color", eyeColor);
    }
    if (prev.hairColor !== hairColor) {
      style.setProperty("--hair-color", hairColor);
    }

    prevColorsRef.current = { bodyColor, eyeColor, hairColor };
  }, [bodyColor, eyeColor, hairColor, hasColorableContent]);

  // Throttled color update function
  const throttledUpdate = useCallback(
    createThrottledColorUpdate(updateColors),
    [updateColors],
  );

  // Handle color changes with optimized scheduling
  useEffect(() => {
    if (!hasColorableContent || !visible || !isLoaded) return;

    colorScheduler.schedule(traitId, throttledUpdate);

    return () => {
      colorScheduler.cancel(traitId);
    };
  }, [
    bodyColor,
    eyeColor,
    hairColor,
    visible,
    hasColorableContent,
    isLoaded,
    traitId,
    throttledUpdate,
  ]);

  // Early return for non-visible traits
  if (!visible || !traitId) return null;

  return (
    <div
      ref={containerRef}
      aria-label={alt}
      className={className}
      style={{
        zIndex,
        isolation: "isolate",
        willChange: hasColorableContent ? "auto" : undefined,
      }}
    />
  );
}
