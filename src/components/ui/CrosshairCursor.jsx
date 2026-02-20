import { useEffect, useRef, useState } from "react";

export default function CrosshairCursor({ extraDot = false }) {
  const cursorRef = useRef(null);
  const [showDot, setShowDot] = useState(false);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(pointer: fine)");
    const sync = () => setEnabled(media.matches);
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    if (!enabled) return;

    document.documentElement.classList.add("crosshair-cursor-hide");

    const move = (event) => {
      if (cursorRef.current) {
        cursorRef.current.style.left = `${event.clientX}px`;
        cursorRef.current.style.top = `${event.clientY}px`;
      }
      const interactive = Boolean(event.target.closest("button, a, [role='button']"));
      setShowDot(interactive);
    };

    const leave = () => setShowDot(false);

    window.addEventListener("mousemove", move);
    window.addEventListener("mouseout", leave);

    return () => {
      document.documentElement.classList.remove("crosshair-cursor-hide");
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseout", leave);
    };
  }, [enabled]);

  if (!enabled) return null;

  const dotVisible = showDot || extraDot;

  return (
    <div
      ref={cursorRef}
      className="pointer-events-none fixed z-[160] -translate-x-1/2 -translate-y-1/2"
    >
      <div className="relative h-9 w-9">
        <span className="absolute left-1/2 top-0 h-3 w-[4px] -translate-x-1/2 rounded-full bg-sky-300 shadow-[0_0_10px_rgba(56,189,248,0.95)]" />
        <span className="absolute bottom-0 left-1/2 h-3 w-[4px] -translate-x-1/2 rounded-full bg-sky-300 shadow-[0_0_10px_rgba(56,189,248,0.95)]" />
        <span className="absolute left-0 top-1/2 h-[4px] w-3 -translate-y-1/2 rounded-full bg-sky-300 shadow-[0_0_10px_rgba(56,189,248,0.95)]" />
        <span className="absolute right-0 top-1/2 h-[4px] w-3 -translate-y-1/2 rounded-full bg-sky-300 shadow-[0_0_10px_rgba(56,189,248,0.95)]" />
        <span className="absolute left-1/2 top-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full border border-sky-300/90 bg-transparent" />
        <span
          className={`absolute left-1/2 top-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-sky-300 shadow-[0_0_10px_rgba(56,189,248,0.95)] transition-opacity duration-100 ${
            dotVisible ? "opacity-100" : "opacity-0"
          }`}
        />
      </div>
    </div>
  );
}
