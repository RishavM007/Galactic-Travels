import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { planets } from "../../data/planets";
import { playClickSfx, playHoverSfx } from "../../utils/sfx";

export default function HudOverlay({ planet }) {
  const activePlanetInfo = planets.find((entry) => entry.id === planet) || null;
  const [typedName, setTypedName] = useState("");
  const [typedTagline, setTypedTagline] = useState("");
  const [typedBlurb, setTypedBlurb] = useState("");
  const [battery, setBattery] = useState(88);

  useEffect(() => {
    if (!activePlanetInfo) {
      setTypedName("");
      setTypedTagline("");
      setTypedBlurb("");
      return;
    }

    setTypedName("");
    setTypedTagline("");
    setTypedBlurb("");

    const name = activePlanetInfo.name.toUpperCase();
    const tagline = activePlanetInfo.vacationTagline;
    const blurb = activePlanetInfo.vacationBlurb;
    const startedAt = performance.now();

    // Smooth, deterministic typing based on elapsed time.
    const nameDelay = 580;
    const taglineDelay = 760;
    const blurbDelay = 930;
    const nameStepMs = 28;
    const taglineStepMs = 18;
    const blurbStepMs = 11;

    const intervalId = setInterval(() => {
      const elapsed = performance.now() - startedAt;

      const nameCount = Math.max(0, Math.min(name.length, Math.floor((elapsed - nameDelay) / nameStepMs)));
      const taglineCount = Math.max(0, Math.min(tagline.length, Math.floor((elapsed - taglineDelay) / taglineStepMs)));
      const blurbCount = Math.max(0, Math.min(blurb.length, Math.floor((elapsed - blurbDelay) / blurbStepMs)));

      setTypedName(name.slice(0, nameCount));
      setTypedTagline(tagline.slice(0, taglineCount));
      setTypedBlurb(blurb.slice(0, blurbCount));

      if (nameCount >= name.length && taglineCount >= tagline.length && blurbCount >= blurb.length) {
        clearInterval(intervalId);
      }
    }, 16);

    return () => {
      clearInterval(intervalId);
    };
  }, [activePlanetInfo]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setBattery((prev) => {
        const next = prev + (Math.random() > 0.5 ? 1 : -1);
        return Math.max(79, Math.min(96, next));
      });
    }, 1800);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <>
      <div className="pointer-events-none absolute left-7 lg:left-[11%] top-3 z-40 rounded-xl bg-black/45 px-2.5 py-2 backdrop-blur-sm md:left-40 md:top-4 md:px-3 min-[2200px]:left-[12%] min-[2200px]:top-6 min-[2200px]:scale-125 min-[2800px]:left-[13%] min-[2800px]:top-8 min-[2800px]:scale-150 origin-top-left">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            {/* <span className="font-space-mono text-[10px] tracking-[0.2em] text-cyan-200/75">NET</span> */}
            <div className="flex h-4 items-end gap-[2px]">
              {[0.35, 0.55, 0.75, 1].map((h, idx) => (
                <motion.span
                  key={`net-${idx}`}
                  className="w-[3px] rounded-[2px] bg-cyan-300"
                  style={{ height: `${Math.round(h * 100)}%` }}
                  animate={{ opacity: [0.28, 1, 0.52, 1] }}
                  transition={{ repeat: Infinity, duration: 1.2, delay: idx * 0.1 }}
                />
              ))}
            </div>
          </div>

          <div className="h-4 w-px bg-cyan-300/30" />

          <div className="flex items-center gap-2">
            {/* <span className="font-space-mono text-[10px] tracking-[0.2em] text-cyan-200/75">BAT</span> */}
            <div className="relative h-4 w-8 rounded-[3px] border border-cyan-300/70 p-[1px]">
              <div className="absolute -right-[3px] top-1/2 h-2 w-[2px] -translate-y-1/2 rounded-r bg-cyan-300/80" />
              <motion.div
                className="h-full rounded-[1px] bg-cyan-300"
                animate={{ width: `${battery}%`, opacity: [0.75, 1, 0.85] }}
                transition={{ opacity: { duration: 1.8, repeat: Infinity } }}
              />
            </div>
            <span className="font-space-mono text-[10px] text-cyan-100/90">{battery}%</span>
          </div>
        </div>
      </div>

      {!activePlanetInfo && (
        <div className="pointer-events-none absolute left-3 top-[60%] z-40 -translate-y-1/2 hidden md:block min-[2200px]:left-10 min-[2200px]:scale-125 min-[2800px]:left-16 min-[2800px]:scale-150 origin-left">
          <div className="origin-left -rotate-90 rounded-lg border border-cyan-300/30 bg-black/40 px-3 py-1.5 backdrop-blur-sm">
            <div className="flex items-center gap-4 font-space-mono text-[10px] tracking-[0.2em] text-cyan-200/80">
              <span>O2 98%</span>
              <span>CO2 01%</span>
              <span>TEMP -12C</span>
              <span>HULL 100%</span>
            </div>
          </div>
        </div>
      )}

      {activePlanetInfo && (
        <>
          <motion.div
            className="absolute top-24 md:top-28 min-[2200px]:top-32 min-[2800px]:top-36 left-1/2 z-40 backdrop-blur-3xl lg:backdrop-blur-none h-auto w-[92%] sm:w-[78%] md:w-[60%] lg:w-[50%] min-[2200px]:w-[46%] min-[2800px]:w-[42%] pb-4 min-[2200px]:pb-6 min-[2800px]:pb-8 flex flex-col justify-start pt-4 min-[2200px]:pt-6 min-[2800px]:pt-8 items-center -translate-x-1/2 overflow-hidden rounded-xl border border-cyan-300/45 bg-gradient-to-b from-cyan-400/8 to-cyan-900/8 text-center shadow-[0_0_18px_rgba(34,211,238,0.2)]"
            initial={{ opacity: 0, clipPath: "inset(0 100% 0 0)" }}
            animate={{
              clipPath: ["inset(0 100% 0 0)", "inset(0 100% 0 0)", "inset(0 0 0 0)"],
              opacity: [0.25, 1, 0.45, 1],
            }}
            transition={{
              clipPath: { duration: 0.95, times: [0, 0.42, 1], ease: "easeOut" },
              opacity: { duration: 0.85, times: [0, 0.3, 0.56, 1] },
            }}
          >
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(34,211,238,0.12),rgba(34,211,238,0)_68%)]" />
            <motion.div
              className="pointer-events-none absolute left-0 right-0 top-0 h-px bg-cyan-200/70"
              animate={{ opacity: [0.35, 0.75, 0.4] }}
              transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
              className="w-full px-4 pt-2 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.62, duration: 0.2 }}
            >
              <p className="text-cyan-200 font-mono text-[11px] min-[2200px]:text-[13px] min-[2800px]:text-[15px] tracking-[0.32em]">
                {typedName}
              </p>
              <p className="mt-1 text-cyan-300/95 text-base min-[2200px]:text-xl min-[2800px]:text-2xl font-semibold">
                {typedTagline}
              </p>
              <p className="mx-auto mt-2 max-w-[96%] text-cyan-100/90 text-sm min-[2200px]:text-lg min-[2800px]:text-xl leading-relaxed">
                {typedBlurb}
                {typedBlurb.length < activePlanetInfo.vacationBlurb.length ? <span className="ml-0.5 animate-pulse">|</span> : null}
              </p>
              <Link
                to={`/destination/${activePlanetInfo.id}`}
                onClick={playClickSfx}
                onMouseEnter={playHoverSfx}
                className="mt-3 inline-block rounded-full border border-cyan-300/55 px-4 py-1.5 min-[2200px]:px-6 min-[2200px]:py-2 min-[2800px]:px-7 min-[2800px]:py-2.5 font-sora text-xs min-[2200px]:text-sm min-[2800px]:text-base tracking-wide text-cyan-100 transition hover:bg-cyan-300 hover:text-black"
              >
                VIEW MISSION
              </Link>
            </motion.div>
          </motion.div>

          <motion.div
            className="absolute left-8 min-[2200px]:left-14 min-[2800px]:left-20 top-1/2 z-40 w-52 min-[2200px]:w-64 min-[2800px]:w-72 -translate-y-1/2 overflow-hidden rounded-[14px] border border-cyan-200/35 bg-gradient-to-br from-cyan-300/10 via-cyan-900/10 to-cyan-950/20 px-4 min-[2200px]:px-5 min-[2800px]:px-6 py-4 min-[2200px]:py-5 min-[2800px]:py-6 shadow-[0_0_14px_rgba(34,211,238,0.2)] hidden xl:block"
            initial={{ opacity: 0, x: -18, rotateY: 18, scale: 0.96 }}
            animate={{ opacity: 1, x: 0, rotateY: 18, scale: 1 }}
            transition={{ duration: 0.24, ease: "easeOut" }}
            style={{ transformPerspective: 900, transformOrigin: "left center", willChange: "transform, opacity" }}
          >
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(34,211,238,0.07)_0%,rgba(34,211,238,0)_45%,rgba(34,211,238,0.05)_100%)]" />
            <div className="pointer-events-none absolute inset-y-0 left-0 w-px bg-cyan-200/70" />
            <p className="mb-3 text-[10px] font-mono tracking-[0.28em] text-cyan-200/70">DATA // LEFT BANK</p>
            {activePlanetInfo.statsLeft.map((item) => (
              <div key={item.label} className="mb-3 pl-3 last:mb-0">
                <p className="text-[10px] font-mono tracking-[0.2em] text-cyan-200/60">{item.label}</p>
                <p className="text-sm font-mono text-cyan-100">{item.value}</p>
              </div>
            ))}
          </motion.div>

          <motion.div
            className="absolute right-8 min-[2200px]:right-14 min-[2800px]:right-20 top-1/2 z-40 w-52 min-[2200px]:w-64 min-[2800px]:w-72 -translate-y-1/2 overflow-hidden rounded-[14px] border border-cyan-200/35 bg-gradient-to-bl from-cyan-300/10 via-cyan-900/10 to-cyan-950/20 px-4 min-[2200px]:px-5 min-[2800px]:px-6 py-4 min-[2200px]:py-5 min-[2800px]:py-6 text-right shadow-[0_0_14px_rgba(34,211,238,0.2)] hidden xl:block"
            initial={{ opacity: 0, x: 18, rotateY: -18, scale: 0.96 }}
            animate={{ opacity: 1, x: 0, rotateY: -18, scale: 1 }}
            transition={{ duration: 0.24, ease: "easeOut" }}
            style={{ transformPerspective: 900, transformOrigin: "right center", willChange: "transform, opacity" }}
          >
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(34,211,238,0.07)_0%,rgba(34,211,238,0)_45%,rgba(34,211,238,0.05)_100%)]" />
            <div className="pointer-events-none absolute inset-y-0 right-0 w-px bg-cyan-200/70" />
            <p className="mb-3 text-[10px] font-mono tracking-[0.28em] text-cyan-200/70">DATA // RIGHT BANK</p>
            {activePlanetInfo.statsRight.map((item) => (
              <div key={item.label} className="mb-3  pr-3 last:mb-0">
                <p className="text-[10px] font-mono tracking-[0.2em] text-cyan-200/60">{item.label}</p>
                <p className="text-sm font-mono text-cyan-100">{item.value}</p>
              </div>
            ))}
          </motion.div>

          <motion.div
            className="absolute bottom-20 left-1/2 z-40 w-[90%] -translate-x-1/2 overflow-hidden rounded-xl border border-cyan-300/35 bg-cyan-900/10 px-3 py-3 xl:hidden"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.22 }}
          >
            <div className="grid grid-cols-2 gap-2">
              {[...activePlanetInfo.statsLeft, ...activePlanetInfo.statsRight].slice(0, 4).map((item) => (
                <div key={item.label} className="rounded-md border border-cyan-300/20 bg-black/25 px-2 py-1.5">
                  <p className="text-[9px] font-mono tracking-[0.15em] text-cyan-200/65">{item.label}</p>
                  <p className="text-[11px] font-mono text-cyan-100">{item.value}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </>
      )}
    </>
  );
}
