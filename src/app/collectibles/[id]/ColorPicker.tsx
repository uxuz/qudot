import { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "motion/react";

type Tab = "Body" | "Eye" | "Hair";

interface ColorPickerProps {
  onBodyChange?: (color: string) => void;
  onEyeChange?: (color: string) => void;
  onHairChange?: (color: string) => void;

  initialBody?: string;
  initialEye?: string;
  initialHair?: string;
}

type TabColor = {
  h: number;
  s: number;
  v: number;
  hex: string;
};

const hsvToRgb = (
  h: number,
  s: number,
  v: number,
): [number, number, number] => {
  h = ((h % 360) + 360) % 360;

  const c = v * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = v - c;

  let r = 0,
    g = 0,
    b = 0;

  if (h < 60) [r, g, b] = [c, x, 0];
  else if (h < 120) [r, g, b] = [x, c, 0];
  else if (h < 180) [r, g, b] = [0, c, x];
  else if (h < 240) [r, g, b] = [0, x, c];
  else if (h < 300) [r, g, b] = [x, 0, c];
  else [r, g, b] = [c, 0, x];

  return [
    Math.round((r + m) * 255),
    Math.round((g + m) * 255),
    Math.round((b + m) * 255),
  ];
};

const rgbToHsv = (
  r: number,
  g: number,
  b: number,
): [number, number, number] => {
  r /= 255;
  g /= 255;
  b /= 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const diff = max - min;

  let h = 0;

  if (diff !== 0) {
    if (max === r) h = ((g - b) / diff) % 6;
    else if (max === g) h = (b - r) / diff + 2;
    else h = (r - g) / diff + 4;
  }

  h = Math.round(h * 60);
  if (h < 0) h += 360;

  return [h, max === 0 ? 0 : diff / max, max];
};

const rgbToHex = (r: number, g: number, b: number) =>
  `#${[r, g, b].map((v) => v.toString(16).padStart(2, "0")).join("")}`;

const hexToRgb = (hex: string): [number, number, number] => {
  const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return m
    ? [parseInt(m[1], 16), parseInt(m[2], 16), parseInt(m[3], 16)]
    : [255, 0, 0];
};

const isValidHex = (hex: string) => /^#?([a-f\d]{6})$/i.test(hex);

const makeState = (hex: string): TabColor => {
  const [r, g, b] = hexToRgb(hex);
  const [h, s, v] = rgbToHsv(r, g, b);
  return { h, s, v, hex };
};

export function ColorPicker({
  onBodyChange,
  onEyeChange,
  onHairChange,
  initialBody = "#00ff00",
  initialEye = "#ffff00",
  initialHair = "#0000ff",
}: ColorPickerProps) {
  const tabs: Tab[] = ["Body", "Eye", "Hair"];

  const [activeTab, setActiveTab] = useState<Tab>("Body");

  const [colors, setColors] = useState<Record<Tab, TabColor>>({
    Body: makeState(initialBody),
    Eye: makeState(initialEye),
    Hair: makeState(initialHair),
  });

  const current = colors[activeTab];

  const setCurrent = (next: Partial<TabColor>) =>
    setColors((c) => ({
      ...c,
      [activeTab]: { ...c[activeTab], ...next },
    }));

  const hue = current.h;
  const saturation = current.s;
  const value = current.v;
  const hexInput = current.hex;

  const svRef = useRef<HTMLDivElement>(null);
  const hueRef = useRef<HTMLDivElement>(null);

  const [isDragging, setIsDragging] = useState<"hue" | "sv" | null>(null);

  const [cr, cg, cb] = hsvToRgb(hue, saturation, value);
  const currentHex = rgbToHex(cr, cg, cb);

  useEffect(() => {
    setCurrent({ hex: currentHex });
  }, [currentHex]);

  useEffect(() => {
    const hex = current.hex;

    if (activeTab === "Body") onBodyChange?.(hex);
    if (activeTab === "Eye") onEyeChange?.(hex);
    if (activeTab === "Hair") onHairChange?.(hex);
  }, [current.hex, activeTab]);

  const handleHexChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;

    setCurrent({ hex: val });

    if (!isValidHex(val)) return;

    const [r, g, b] = hexToRgb(val);
    const [h, s, v] = rgbToHsv(r, g, b);

    setCurrent({ h, s, v });
  };

  const updateSV = useCallback(
    (x: number, y: number) => {
      if (!svRef.current) return;

      const rect = svRef.current.getBoundingClientRect();

      const nx = Math.max(0, Math.min(x - rect.left, rect.width));
      const ny = Math.max(0, Math.min(y - rect.top, rect.height));

      setCurrent({
        s: nx / rect.width,
        v: 1 - ny / rect.height,
      });
    },
    [activeTab],
  );

  const updateHue = useCallback(
    (x: number) => {
      if (!hueRef.current) return;

      const rect = hueRef.current.getBoundingClientRect();
      const nx = Math.max(0, Math.min(x - rect.left, rect.width));

      setCurrent({
        h: (nx / rect.width) * 360,
      });
    },
    [activeTab],
  );

  useEffect(() => {
    const move = (e: MouseEvent) => {
      if (!isDragging) return;

      if (isDragging === "sv") updateSV(e.clientX, e.clientY);
      else updateHue(e.clientX);
    };

    const up = () => setIsDragging(null);

    window.addEventListener("mousemove", move);
    window.addEventListener("mouseup", up);

    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseup", up);
    };
  }, [isDragging, updateSV, updateHue]);

  return (
    <div className="flex h-full flex-col gap-2 p-2">
      <nav className="border-dim/10 text-dim relative flex overflow-clip rounded-lg border">
        {tabs.map((title) => {
          const active = activeTab === title;

          return (
            <button
              key={title}
              onClick={() => setActiveTab(title)}
              className="relative flex h-8 w-full items-center justify-center text-sm select-none"
            >
              {active && (
                <motion.div
                  layoutId="tabHighlight"
                  className="bg-dim/10 absolute inset-0"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}

              <span className="relative z-10">{title}</span>
            </button>
          );
        })}
      </nav>

      <div
        ref={svRef}
        onMouseDown={(e) => {
          setIsDragging("sv");
          updateSV(e.clientX, e.clientY);
        }}
        style={{
          background: `linear-gradient(to top,#000,transparent), linear-gradient(to right,#fff,hsl(${hue},100%,50%))`,
        }}
        className="relative h-full w-full cursor-crosshair rounded-lg"
      >
        <motion.div
          layoutId="sv-knob"
          transition={
            isDragging === "sv"
              ? { type: "tween", duration: 0 }
              : { type: "spring", stiffness: 420, damping: 32 }
          }
          style={{
            left: `${saturation * 100}%`,
            top: `${(1 - value) * 100}%`,
            background: currentHex,
            marginLeft: -8,
            marginTop: -8,
            boxShadow: "0 0 0 2px rgba(0,0,0,0.25)",
          }}
          className="border-foreground absolute size-4 rounded-full border-2"
        />
      </div>

      <div
        ref={hueRef}
        onMouseDown={(e) => {
          setIsDragging("hue");
          updateHue(e.clientX);
        }}
        style={{
          background:
            "linear-gradient(to right, red, yellow, lime, cyan, blue, magenta, red)",
        }}
        className="relative h-2 shrink-0 cursor-pointer rounded-lg"
      >
        <motion.div
          layoutId="hue-knob"
          transition={
            isDragging === "hue"
              ? { type: "tween", duration: 0 }
              : { type: "spring", stiffness: 420, damping: 32 }
          }
          style={{
            left: `${(hue / 360) * 100}%`,
            top: "50%",
            marginLeft: -6,
            marginTop: -6,
            boxShadow: "0 0 0 2px rgba(0,0,0,0.25)",
          }}
          className="bg-foreground absolute h-3 w-3 rounded-full"
        />
      </div>

      <input
        maxLength={7}
        value={hexInput}
        onChange={handleHexChange}
        className="border-dim/5 text-dim h-8 shrink-0 rounded-lg border px-2 font-mono text-sm focus:outline-none"
      />
    </div>
  );
}
