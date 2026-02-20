import { Link, useParams } from "react-router-dom";
import { Canvas, useFrame, useThree, useLoader } from "@react-three/fiber";

import { Stars } from "@react-three/drei";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { planets } from "../data/planets";
import { playClickSfx, playHoverSfx } from "../utils/sfx";
import CrosshairCursor from "./ui/CrosshairCursor";

// function useLoadedTexture(url, { srgb = false } = {}) {
//   const [texture, setTexture] = useState(null);

//   useEffect(() => {
//     if (!url) {
//       setTexture(null);
//       return;
//     }

//     const loader = new THREE.TextureLoader();
//     let isDisposed = false;

//     loader.load(
//       url,
//       (loadedTexture) => {
//         if (isDisposed) return;
//         if (srgb) loadedTexture.colorSpace = THREE.SRGBColorSpace;
//         loadedTexture.wrapS = THREE.ClampToEdgeWrapping;
//         loadedTexture.wrapT = THREE.ClampToEdgeWrapping;
//         loadedTexture.generateMipmaps = true;
//         loadedTexture.minFilter = THREE.LinearMipmapLinearFilter;
//         loadedTexture.magFilter = THREE.LinearFilter;
//         loadedTexture.needsUpdate = true;
//         setTexture(loadedTexture);
//       },
//       undefined,
//       () => {
//         if (!isDisposed) {
//           setTexture(null);
//         }
//       }
//     );

//     return () => {
//       isDisposed = true;
//     };
//   }, [url, srgb]);

//   return { texture };
// }

function PlanetPreview({ planet }) {
  const { gl } = useThree();
  const planetRef = useRef();
  const cloudRef = useRef();
  const hasRings = Boolean(planet?.ringAlphaMap);
  const baseRadius = hasRings ? 1.04 : 1.14;
 const surfaceTexture = useLoader(
  THREE.TextureLoader,
  planet?.textureMap
);

const cloudTexture = planet?.atmosphereMap
  ? useLoader(THREE.TextureLoader, planet.atmosphereMap)
  : null;

const saturnRingAlpha = planet?.ringAlphaMap
  ? useLoader(THREE.TextureLoader, planet.ringAlphaMap)
  : null;
  const fallbackColor = planet?.color ?? "#6ea7ff";

  useFrame((_, delta) => {
    if (planetRef.current) planetRef.current.rotation.y += delta * 0.24;
    if (cloudRef.current) cloudRef.current.rotation.y += delta * 0.16;
  });

  useEffect(() => {
    if (surfaceTexture) surfaceTexture.anisotropy = gl.capabilities.getMaxAnisotropy();
    if (cloudTexture) cloudTexture.anisotropy = gl.capabilities.getMaxAnisotropy();
    if (saturnRingAlpha) saturnRingAlpha.anisotropy = gl.capabilities.getMaxAnisotropy();
  }, [surfaceTexture, cloudTexture, saturnRingAlpha, gl]);

  return (
    <>
      <ambientLight intensity={0.36} color="#d6e6ff" />
      <directionalLight intensity={1.1} position={[4.5, 3.4, 5.2]} color="#fff4da" />
      <pointLight intensity={0.58} position={[-3.8, -1.2, 2.6]} color="#59dcff" />

      <mesh ref={planetRef}>
        <sphereGeometry args={[baseRadius, 96, 96]} />
        <meshStandardMaterial
          map={surfaceTexture ?? null}
          color={surfaceTexture ? "#ffffff" : fallbackColor}
          roughness={planet?.roughness ?? 0.7}
          metalness={planet?.metalness ?? 0.1}
        />
      </mesh>

      {cloudTexture && (
        <mesh ref={cloudRef}>
          <sphereGeometry args={[baseRadius * 1.02, 96, 96]} />
          <meshStandardMaterial
            map={cloudTexture}
            transparent
            opacity={0.5}
            depthWrite={false}
            roughness={0.9}
            metalness={0}
            color="#ffffff"
          />
        </mesh>
      )}

      {saturnRingAlpha && (
        <mesh rotation={[Math.PI / 2.7, 0, 0]}>
          <ringGeometry args={[baseRadius * 1.4, baseRadius * 2.45, 180]} />
          <meshStandardMaterial
            color="#d9c695"
            alphaMap={saturnRingAlpha}
            transparent
            opacity={0.95}
            side={THREE.DoubleSide}
            depthWrite={false}
            roughness={0.85}
            metalness={0.02}
          />
        </mesh>
      )}
    </>
  );
}

export default function Destination() {
  const { id } = useParams();
  const planet = planets.find((item) => item.id === id) || planets.find((item) => item.id === "earth");
  const hasRings = Boolean(planet?.ringAlphaMap);
  const previewCamera = hasRings
    ? { position: [0, 0.08, 6.2], fov: 44 }
    : { position: [0, 0.08, 4.95], fov: 44 };
  const extraMissionPoints = [
    ...(planet?.statsLeft ?? []).slice(0, 2).map((item) => `Live briefing: ${item.label} calibrated at ${item.value}.`),
    ...(planet?.statsRight ?? []).slice(0, 2).map((item) => `${item.label} protocol unlocked: ${item.value}.`),
  ];
  const itineraryPoints = [...planet.itinerary, ...extraMissionPoints];
  const quickFacts = [...(planet?.statsLeft ?? []), ...(planet?.statsRight ?? [])].slice(0, 3);

  return (
    <div className="min-h-screen overflow-hidden bg-[#05080f] text-slate-100">
      <CrosshairCursor />
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_20%_15%,rgba(34,211,238,0.16),transparent_40%),radial-gradient(circle_at_85%_85%,rgba(59,130,246,0.14),transparent_36%)]" />

      <div className="relative mx-auto flex min-h-screen w-[95%] max-w-[1380px] min-[2200px]:max-w-[2000px] min-[2800px]:max-w-[2500px] flex-col py-4 sm:py-6 min-[2200px]:py-8 min-[2800px]:py-10">
        <div className="mb-4 min-[2200px]:mb-6 min-[2800px]:mb-8 flex flex-col gap-3 rounded-2xl border border-cyan-300/20 bg-[#0a111d]/70 px-4 py-3 min-[2200px]:px-7 min-[2200px]:py-4 min-[2800px]:px-9 min-[2800px]:py-5 backdrop-blur sm:flex-row sm:items-center sm:justify-between sm:px-5">
          <div>
            <p className="font-space-mono text-[11px] min-[2200px]:text-[13px] min-[2800px]:text-[15px] tracking-[0.22em] text-cyan-300/70">DESTINATION SUITE / {planet.id.toUpperCase()}</p>
            <p className="font-orbitron text-lg min-[2200px]:text-2xl min-[2800px]:text-3xl text-cyan-200">{planet.name} Experience Deck</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="rounded-full border border-emerald-300/40 bg-emerald-500/10 px-3 py-1 min-[2200px]:px-4 min-[2200px]:py-1.5 min-[2800px]:px-5 min-[2800px]:py-2 font-space-mono text-[10px] min-[2200px]:text-xs min-[2800px]:text-sm tracking-[0.2em] text-emerald-200">
              SEATS OPEN
            </span>
            <Link
              to="/"
              onClick={playClickSfx}
              onMouseEnter={playHoverSfx}
              className="rounded-xl border border-cyan-300/50 px-4 py-2 min-[2200px]:px-6 min-[2200px]:py-3 min-[2800px]:px-7 min-[2800px]:py-3.5 font-sora text-sm min-[2200px]:text-base min-[2800px]:text-lg text-cyan-100 transition hover:bg-cyan-300 hover:text-slate-950"
            >
              Back Home
            </Link>
          </div>
        </div>

        <div className="grid items-stretch gap-4 min-[2200px]:gap-6 min-[2800px]:gap-8 lg:grid-cols-[minmax(320px,440px)_1fr] min-[2200px]:lg:grid-cols-[minmax(420px,620px)_1fr] min-[2800px]:lg:grid-cols-[minmax(520px,760px)_1fr]">
          <section className="relative h-full overflow-hidden rounded-3xl border border-cyan-300/25 bg-[#091224]/75 shadow-[0_26px_80px_rgba(0,0,0,0.45)] backdrop-blur">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_30%_15%,rgba(56,189,248,0.18),transparent_36%)]" />
            <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-cyan-300/80" />
            <div className="pointer-events-none absolute left-0 top-0 h-full w-px bg-cyan-300/40" />
            <div className="h-full min-h-[320px] w-full">
              <Canvas
                camera={previewCamera}
                gl={{ antialias: true }}
                onCreated={({ gl }) => {
                  gl.toneMapping = THREE.ACESFilmicToneMapping;
                  gl.toneMappingExposure = 1.15;
                }}
                style={{ width: "100%", height: "100%" }}
              >
                <Stars radius={42} depth={28} count={1100} factor={2.1} fade speed={0.32} />
                <PlanetPreview planet={planet} />
              </Canvas>
            </div>
            {/* <div className="pointer-events-none absolute bottom-4 left-4 rounded-md border border-cyan-300/30 bg-black/40 px-3 py-1.5 font-space-mono text-[10px] tracking-[0.2em] text-cyan-200/85">
              TEXTURE STREAM: LIVE
            </div> */}
            <div className="pointer-events-none absolute right-4 top-4 rounded-md border border-cyan-300/25 bg-black/40 px-2.5 py-1 min-[2200px]:px-4 min-[2200px]:py-2 min-[2800px]:px-5 min-[2800px]:py-2.5 font-space-mono text-[10px] min-[2200px]:text-xs min-[2800px]:text-sm tracking-[0.18em] text-cyan-200/80">
              ORBIT CAM
            </div>
          </section>

          <section className="grid h-full auto-rows-auto gap-4 min-[2200px]:gap-6 min-[2800px]:gap-8">
            <div className="rounded-3xl border border-cyan-300/20 bg-[#0a111d]/75 p-5 backdrop-blur sm:p-6 min-[2200px]:p-8 min-[2800px]:p-10">
              <p className="font-space-mono text-[10px] min-[2200px]:text-xs min-[2800px]:text-sm tracking-[0.24em] text-cyan-300/70">PLANET PROFILE</p>
              <h1 className="mt-2 font-orbitron text-3xl leading-tight text-cyan-300 sm:text-4xl md:text-5xl min-[2200px]:text-6xl min-[2800px]:text-7xl">{planet.name}</h1>
              <p className="mt-3 max-w-[78ch] font-space-grotesk text-base leading-relaxed text-slate-200/90 sm:text-lg min-[2200px]:text-2xl min-[2800px]:text-[2rem] min-[2800px]:leading-[1.45]">{planet.vacationBlurb}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {quickFacts.map((item) => (
                  <span
                    key={item.label}
                    className="rounded-full border border-cyan-300/30 bg-cyan-400/10 px-3 py-1 min-[2200px]:px-4 min-[2200px]:py-1.5 min-[2800px]:px-5 min-[2800px]:py-2 font-space-mono text-[10px] min-[2200px]:text-xs min-[2800px]:text-sm tracking-[0.16em] text-cyan-100/90"
                  >
                    {item.label}: {item.value}
                  </span>
                ))}
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3 items-stretch">
              <div className="h-full rounded-2xl border border-cyan-300/20 bg-[#0b1627]/85 p-5 min-[2200px]:p-5 min-[2800px]:p-6 shadow-[inset_0_1px_0_rgba(125,211,252,0.28)]">
                <p className="font-space-mono text-[11px] min-[2200px]:text-xs min-[2800px]:text-sm tracking-[0.22em] text-cyan-300/75">PRICE</p>
                <p className="mt-2 font-sora text-3xl min-[2200px]:text-4xl min-[2800px]:text-4xl font-semibold text-white">{planet.price}</p>
              </div>
              <div className="h-full rounded-2xl border border-cyan-300/20 bg-[#0b1627]/85 p-5 min-[2200px]:p-5 min-[2800px]:p-6 shadow-[inset_0_1px_0_rgba(125,211,252,0.28)]">
                <p className="font-space-mono text-[11px] min-[2200px]:text-xs min-[2800px]:text-sm tracking-[0.22em] text-cyan-300/75">TRAVEL TIME</p>
                <p className="mt-2 font-sora text-3xl min-[2200px]:text-4xl min-[2800px]:text-4xl font-semibold text-white">{planet.travelTime}</p>
              </div>
              <div className="h-full rounded-2xl border border-cyan-300/20 bg-[#0b1627]/85 p-5 min-[2200px]:p-5 min-[2800px]:p-6 shadow-[inset_0_1px_0_rgba(125,211,252,0.28)]">
                <p className="font-space-mono text-[11px] min-[2200px]:text-xs min-[2800px]:text-sm tracking-[0.22em] text-cyan-300/75">PACKAGE</p>
                <p className="mt-2 font-sora text-3xl min-[2200px]:text-4xl min-[2800px]:text-4xl font-semibold text-white">Elite</p>
              </div>
            </div>

            <div className="rounded-3xl border border-cyan-300/20 bg-[#0a111d]/75 p-5 backdrop-blur sm:p-6 min-[2200px]:p-8 min-[2800px]:p-10">
              <h2 className="font-orbitron text-xl min-[2200px]:text-3xl min-[2800px]:text-4xl text-cyan-200">Brief Itinerary</h2>
              <div className="relative mt-4 space-y-3.5">
                <div className="pointer-events-none absolute bottom-1 top-1 left-[13px] w-px bg-cyan-300/22" />
                {itineraryPoints.map((step, index) => (
                  <div key={`${planet.id}-point-${index}`} className="relative rounded-xl border border-cyan-300/15 bg-[#0b1627]/70 p-4 pl-10 min-[2200px]:p-5 min-[2200px]:pl-12 min-[2800px]:p-6 min-[2800px]:pl-14">
                    <span className="absolute left-2 top-4 inline-flex h-4 w-4 items-center justify-center rounded-full border border-cyan-300/60 bg-[#071524]">
                      <span className="h-1.5 w-1.5 rounded-full bg-cyan-300" />
                    </span>
                    <p className="font-space-grotesk text-slate-200/90 min-[2200px]:text-xl min-[2800px]:text-2xl">
                      <span className="mr-2 font-space-mono text-cyan-300 min-[2200px]:text-lg min-[2800px]:text-xl">{String(index + 1).padStart(2, "0")}</span>
                      {step}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={playClickSfx}
                onMouseEnter={playHoverSfx}
                className="inline-flex h-11 min-[2200px]:h-12 items-center justify-center rounded-xl bg-cyan-300 cursor-pointer px-6 min-[2200px]:px-8 min-[2800px]:px-9 font-sora text-sm min-[2200px]:text-base font-semibold text-slate-950 transition hover:bg-cyan-200 min-w-[180px] min-[2200px]:min-w-[240px] min-[2800px]:min-w-[280px]"
              >
                Confirm Booking
              </button>
              <button
                onClick={playClickSfx}
                onMouseEnter={playHoverSfx}
                className="inline-flex h-11 min-[2200px]:h-12 items-center justify-center rounded-xl border cursor-pointer border-cyan-300/55 px-6 min-[2200px]:px-8 min-[2800px]:px-9 font-sora text-sm min-[2200px]:text-base text-cyan-100 transition hover:bg-cyan-300 hover:text-slate-950 min-w-[220px] min-[2200px]:min-w-[300px] min-[2800px]:min-w-[360px]"
              >
                Call Us For Enquiry
              </button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
