import { useState, useEffect, useRef, useCallback } from "react";

interface ColorPickerProps {
  onColorChange?: (color: string) => void;
  initialColor?: string;
}

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

export function ColorPicker({
  onColorChange,
  initialColor = "#00FF00",
}: ColorPickerProps) {
  const [r, g, b] = hexToRgb(initialColor);
  const [h0, s0, v0] = rgbToHsv(r, g, b);

  const [hue, setHue] = useState(h0);
  const [saturation, setSaturation] = useState(s0);
  const [value, setValue] = useState(v0);

  const [hexInput, setHexInput] = useState(initialColor);
  const [isDragging, setIsDragging] = useState<"hue" | "sv" | null>(null);

  const svRef = useRef<HTMLDivElement>(null);
  const hueRef = useRef<HTMLDivElement>(null);

  const [cr, cg, cb] = hsvToRgb(hue, saturation, value);
  const currentHex = rgbToHex(cr, cg, cb);

  useEffect(() => {
    setHexInput(currentHex);
    onColorChange?.(currentHex);
  }, [currentHex, onColorChange]);

  const handleHexChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setHexInput(val);

    if (!isValidHex(val)) return;

    const [r, g, b] = hexToRgb(val);
    const [h, s, v] = rgbToHsv(r, g, b);

    setHue(h);
    setSaturation(s);
    setValue(v);
  };

  const updateSV = useCallback((x: number, y: number) => {
    if (!svRef.current) return;

    const rect = svRef.current.getBoundingClientRect();

    const nx = Math.max(0, Math.min(x - rect.left, rect.width));
    const ny = Math.max(0, Math.min(y - rect.top, rect.height));

    setSaturation(nx / rect.width);
    setValue(1 - ny / rect.height);
  }, []);

  const updateHue = useCallback((x: number) => {
    if (!hueRef.current) return;

    const rect = hueRef.current.getBoundingClientRect();
    const nx = Math.max(0, Math.min(x - rect.left, rect.width));

    setHue((nx / rect.width) * 360);
  }, []);

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
        <div
          style={{
            position: "absolute",
            left: `${saturation * 100}%`,
            top: `${(1 - value) * 100}%`,
            transform: "translate(-50%, -50%)",
            background: `${currentHex}`,
          }}
          className="border-foreground ring-dim/10 size-5 cursor-pointer rounded-full border-2 ring active:cursor-grabbing"
        />
      </div>

      <div
        ref={hueRef}
        onMouseDown={(e) => {
          setIsDragging("hue");
          updateHue(e.clientX);
        }}
        style={{
          width: "100%",
          cursor: "pointer",
          position: "relative",
          background:
            "linear-gradient(to right, red, yellow, lime, cyan, blue, magenta, red)",
        }}
        className="h-2 shrink-0 rounded-lg"
      >
        <div
          style={{
            position: "absolute",
            left: `${(hue / 360) * 100}%`,
            top: "50%",
            width: 14,
            height: 14,
            background: "#fff",
            borderRadius: "50%",
            transform: "translate(-50%, -50%)",
            boxShadow: "0 0 0 2px rgba(0,0,0,0.25)",
          }}
        />
      </div>

      <input
        maxLength={7}
        pattern="^#([A-Fa-f0-9]{3}|[A-Fa-f0-9]{6})$"
        value={hexInput}
        onChange={handleHexChange}
        className="border-dim/5 bg-dim/5 text-dim focus:border-dim/10 focus:bg-dim/10 h-8 shrink-0 rounded-lg border px-2 font-mono text-sm transition-colors focus:outline-none"
      />
    </div>
  );
}
