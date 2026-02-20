import React, { useState, lazy, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { HiSpeakerWave, HiSpeakerXMark } from "react-icons/hi2";
import { planets } from "../data/planets";
import HudOverlay from "../components/hud/HudOverlay";
import PlanetControls from "./hud/PlanterStatus";
import { isMuted, playClickSfx, playHoverSfx, startSpaceAmbience, stopSpaceAmbience, toggleMuted } from "../utils/sfx";

const SpaceCanvas = lazy(() => import("../components/canvas/SpaceCanvas"));
const PRELOADER_PROGRESS_MS = 2100;
const PRELOADER_SPLIT_MS = 2300;
const PRELOADER_HIDE_MS = 3100;

const Hero = () => {
    const navigate = useNavigate();
    const [activePlanet, setActivePlanet] = useState(null);
    const [hoveredPlanet, setHoveredPlanet] = useState(null);
    const [muted, setMuted] = useState(isMuted());
    const [preloaderVisible, setPreloaderVisible] = useState(true);
    const [splitOpen, setSplitOpen] = useState(false);
    const [loadingProgress, setLoadingProgress] = useState(0);

    useEffect(() => {
      const timers = [];
      timers.push(setTimeout(() => setSplitOpen(true), PRELOADER_SPLIT_MS));
      timers.push(setTimeout(() => setPreloaderVisible(false), PRELOADER_HIDE_MS));

      return () => timers.forEach((timerId) => clearTimeout(timerId));
    }, []);

    useEffect(() => {
      if (!preloaderVisible) return;

      setLoadingProgress(0);
      let rafId;
      const startTs = performance.now();

      const animate = (ts) => {
        const elapsed = ts - startTs;
        const progress = Math.min((elapsed / PRELOADER_PROGRESS_MS) * 100, 100);
        setLoadingProgress(progress);
        if (progress < 100) rafId = requestAnimationFrame(animate);
      };

      rafId = requestAnimationFrame(animate);
      return () => cancelAnimationFrame(rafId);
    }, [preloaderVisible]);

    useEffect(() => {
      if (!preloaderVisible) startSpaceAmbience();
      return () => stopSpaceAmbience();
    }, [preloaderVisible]);
    
    const handleBook = () => {
        playClickSfx();
        navigate(`/destination/${activePlanet ?? "earth"}`);
    };

    const handleToggleMute = () => {
      playClickSfx();
      setMuted(toggleMuted());
    };

return (
  <div className="relative h-[100svh] min-h-[100svh] w-full bg-black overflow-hidden flex items-center justify-center">
    {preloaderVisible && (
      <div className="absolute inset-0 z-[120] overflow-hidden bg-[#02050a]">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(34,211,238,0.06),transparent_54%)]" />
        <div className="pointer-events-none absolute inset-0 opacity-[0.045] [background-image:radial-gradient(#ffffff_0.45px,transparent_0.45px)] [background-size:2px_2px]" />

        <div
          className={`absolute inset-y-0 left-0 w-1/2 bg-[#03070d] transition-transform duration-[820ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${
            splitOpen ? "-translate-x-full" : "translate-x-0"
          }`}
        />
        <div
          className={`absolute inset-y-0 right-0 w-1/2 bg-[#03070d] transition-transform duration-[820ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${
            splitOpen ? "translate-x-full" : "translate-x-0"
          }`}
        />

        <div className="absolute left-6 top-5 text-[10px] font-space-mono tracking-[0.28em] text-cyan-200/70">
          LOADING
        </div>
        <div className="absolute right-6 top-5 text-[10px] font-space-mono tracking-[0.22em] text-cyan-200/85">
          {`${Math.round(loadingProgress).toString().padStart(2, "0")}%`}
        </div>

        <div className="absolute left-1/2 top-1/2 w-[88%] max-w-[1200px] min-[2200px]:max-w-[1700px] min-[2800px]:max-w-[2100px] -translate-x-1/2 -translate-y-1/2">
          <div className="relative h-px bg-cyan-300/15">
            <div
              className="absolute left-0 top-0 h-px bg-cyan-300 shadow-[0_0_12px_rgba(34,211,238,0.58)]"
              style={{ width: `${loadingProgress}%` }}
            />
            <div
              className="absolute top-1/2 h-[3px] w-[3px] -translate-y-1/2 rounded-full bg-cyan-200 shadow-[0_0_14px_rgba(34,211,238,0.9)]"
              style={{ left: `calc(${loadingProgress}% - 1.5px)` }}
            />
          </div>

          <div className="mt-6 text-center text-xs font-space-mono tracking-[0.28em] text-cyan-300/80">
            {`${Math.round(loadingProgress).toString().padStart(2, "0")}%`}
          </div>
        </div>
      </div>
    )}

    <div className="absolute inset-0  bg-black" />

    <div className="relative w-[98%] h-[95%] md:w-[96%] md:h-[92%] min-[2200px]:w-[94%] min-[2200px]:h-[90%] min-[2800px]:w-[92%] min-[2800px]:h-[88%]">
<div className="absolute inset-[1.25%] border border-cyan-500/50 shadow-2xl shadow-sky-700 rounded-b-[40%] rounded-t-[15%]">

  <div className="absolute inset-0 overflow-hidden rounded-b-[40%] rounded-t-[15%]">

    <div className="absolute inset-0">
      <SpaceCanvas
        activePlanet={activePlanet}
        onPlanetSelect={setActivePlanet}
        onClearSelection={() => setActivePlanet(null)}
        onPlanetHover={setHoveredPlanet}
        hoveredPlanet={hoveredPlanet}
      />
    </div>

  </div>

  <HudOverlay planet={activePlanet} />

</div>
    </div>
        
    <div
      className={`absolute z-50 flex w-[90%] left-1/2 -translate-x-1/2 top-[16%] lg:top-[12%] flex-col items-center text-center transition-opacity duration-200 md:w-auto md:left-auto md:translate-x-0 md:top-[15%] md:right-[9%] min-[2200px]:top-[13%] min-[2200px]:right-[8%] min-[2800px]:top-[12%] min-[2800px]:right-[7%] md:items-end md:text-right ${
        activePlanet ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      <h1 className="text-3xl font-orbitron sm:text-4xl md:text-6xl min-[2200px]:text-7xl min-[2800px]:text-8xl font-bold text-cyan-300">
        GALACTIC TRAVELS
      </h1>

      <p className="mt-3 text-sm md:text-base min-[2200px]:text-xl min-[2800px]:text-2xl text-cyan-200/70 font-space-grotesk tracking-wide">
        Experience the universe like never before.
      </p>

      <div className="mt-4 md:mt-6 min-[2200px]:mt-8 min-[2800px]:mt-10 flex flex-row-reverse md:flex-row gap-3 md:gap-4 min-[2200px]:gap-5 min-[2800px]:gap-6 justify-center items-center">
          <button
        onClick={handleToggleMute}
        onMouseEnter={playHoverSfx}
        aria-label={muted ? "Unmute sound" : "Mute sound"}
        className="
           h-9 w-9 md:h-10 md:w-10 min-[2200px]:h-12 min-[2200px]:w-12 min-[2800px]:h-14 min-[2800px]:w-14
          inline-flex items-center justify-center
          text-cyan-200
          rounded-full
          transition-all duration-300
          hover:bg-cyan-300 hover:text-black
        "
      >
        {muted ? <HiSpeakerXMark className="text-lg" /> : <HiSpeakerWave className="text-lg" />}
        </button>
          <button
        onClick={handleBook}
        onMouseEnter={playHoverSfx}
        className="
           px-4 py-2.5 md:px-6 md:py-3 min-[2200px]:px-8 min-[2200px]:py-4 min-[2800px]:px-10 min-[2800px]:py-5 w-fit
          border-2 cursor-pointer font-semibold border-cyan-400
          text-cyan-300
          rounded-full text-xs md:text-sm min-[2200px]:text-base min-[2800px]:text-lg tracking-widest
          font-sora 
          transition-all duration-300
          hover:bg-cyan-400
          hover:text-black
        "
      >
        BOOK MISSION
      </button>
      </div>
    

    
    </div>

    {/* Planet Controls */}
    <PlanetControls
      planets={planets}
      active={activePlanet}
      setActive={setActivePlanet}
    />

  </div>
);
};

export default Hero;



