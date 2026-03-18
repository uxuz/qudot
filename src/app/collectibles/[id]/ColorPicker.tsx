import { useState, useEffect, useRef } from "react";
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

  const updateSV = (x: number, y: number) => {
    if (!svRef.current) return;

    const rect = svRef.current.getBoundingClientRect();

    const nx = Math.max(0, Math.min(x - rect.left, rect.width));
    const ny = Math.max(0, Math.min(y - rect.top, rect.height));

    const nextS = nx / rect.width;
    const nextV = 1 - ny / rect.height;
    const [r, g, b] = hsvToRgb(hue, nextS, nextV);

    setCurrent({
      s: nextS,
      v: nextV,
      hex: rgbToHex(r, g, b),
    });
  };

  const updateHue = (y: number) => {
    if (!hueRef.current) return;

    const rect = hueRef.current.getBoundingClientRect();
    const ny = Math.max(0, Math.min(y - rect.top, rect.height));
    const nextH = (1 - ny / rect.height) * 360;
    const [r, g, b] = hsvToRgb(nextH, saturation, value);

    setCurrent({
      h: nextH,
      hex: rgbToHex(r, g, b),
    });
  };

  useEffect(() => {
    const move = (e: PointerEvent) => {
      if (!isDragging) return;

      if (isDragging === "sv") updateSV(e.clientX, e.clientY);
      else updateHue(e.clientY);
    };

    const up = () => setIsDragging(null);

    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);

    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
    };
  }, [isDragging, updateSV, updateHue]);

  return (
    <div className="flex h-full flex-col gap-2 p-2">
      <nav className="border-dim/10 text-dim relative flex w-full overflow-clip rounded-lg border">
        {tabs.map((title) => {
          const active = activeTab === title;

          return (
            <button
              key={title}
              onClick={() => setActiveTab(title)}
              className="hover:text-foreground relative flex h-8 w-full cursor-pointer items-center justify-center text-sm transition-colors select-none"
            >
              {active && (
                <motion.div
                  layoutId="tabHighlight"
                  className="ring-dim/10 bg-dim/5 absolute inset-0 rounded-md ring-1"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}

              <span className="relative z-10">{title}</span>
            </button>
          );
        })}
      </nav>

      <div className="flex h-full w-full gap-2">
        <div
          ref={svRef}
          onPointerDown={(e) => {
            e.preventDefault();
            e.currentTarget.setPointerCapture(e.pointerId);
            // Unfocus the hex input when interacting with the color picker
            document.activeElement instanceof HTMLElement &&
              document.activeElement.blur();
            setIsDragging("sv");
            updateSV(e.clientX, e.clientY);
          }}
          style={{
            background: `linear-gradient(to top,#000,transparent), linear-gradient(to right,#fff,hsl(${hue},100%,50%))`,
          }}
          className="relative flex-1 cursor-crosshair touch-none rounded-lg"
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
          onPointerDown={(e) => {
            e.preventDefault();
            e.currentTarget.setPointerCapture(e.pointerId);
            // Unfocus the hex input when interacting with the hue slider
            document.activeElement instanceof HTMLElement &&
              document.activeElement.blur();
            setIsDragging("hue");
            updateHue(e.clientY);
          }}
          style={{
            background:
              "linear-gradient(to top, red, yellow, lime, cyan, blue, magenta, red)",
          }}
          className="relative w-3 cursor-pointer touch-none rounded-lg"
        >
          <motion.div
            layoutId="hue-knob"
            transition={
              isDragging === "hue"
                ? { type: "tween", duration: 0 }
                : { type: "spring", stiffness: 420, damping: 32 }
            }
            style={{
              top: `${(1 - hue / 360) * 100}%`,
              left: "50%",
              marginLeft: -8,
              marginTop: -8,
              boxShadow: "0 0 0 2px rgba(0,0,0,0.25)",
            }}
            className="bg-foreground absolute size-4 rounded-lg"
          />
        </div>
      </div>

      <input
        maxLength={7}
        // type "search" to disable autofill with passwords and credit cards, I wish I was joking, but this is the easiest way to do so
        type="search"
        placeholder="#ffffff"
        value={hexInput}
        onChange={handleHexChange}
        className="border-dim/10 text-dim focus:bg-dim/5 h-8 w-full shrink-0 rounded-lg border px-2 font-mono text-sm transition-colors focus:outline-none"
      />
    </div>
  );
}
