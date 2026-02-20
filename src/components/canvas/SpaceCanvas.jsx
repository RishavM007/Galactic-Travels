import { Canvas } from "@react-three/fiber";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import { Suspense } from "react";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import SolarSystem from "./SolarSystem";
import StarsBackground from "./StarsBackground";

export default function SpaceCanvas({ activePlanet, onPlanetSelect, onClearSelection, onPlanetHover, hoveredPlanet }) {

  // function CameraDrift({ activePlanet }) {
  // const ref = useRef();

  // useFrame((state) => {
  //   if (activePlanet) return;

  //   const t = state.clock.getElapsedTime();
  //   state.camera.position.x = Math.sin(t * 0.05) * 0.6;
  //   state.camera.position.y = 2.8 + Math.sin(t * 0.08) * 0.15;
  // });

  // return null;
  // }
  
  return (
    <Canvas
      shadows
      dpr={[1, 2]} // device pixel ratio
      camera={{ position: [0, 2.8, 15.5], fov: 50 }}
      gl={{ antialias: true, powerPreference: "high-performance" }}
      onCreated={({ gl }) => {
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = 1.15;
        gl.shadowMap.enabled = true;
        gl.shadowMap.type = THREE.PCFSoftShadowMap;
      }}
      style={{ width: "100%", height: "100%" }}
      onPointerMissed={() => {
        onPlanetHover?.(null);
        if (activePlanet) onClearSelection?.();
      }}
    >
      <fog attach="fog" args={["#02060f", 20, 54]} />
      {/* <CameraDrift activePlanet={activePlanet} /> */}
      <ambientLight intensity={0.15} color="#c9dbff" />
      <hemisphereLight
        intensity={0.32}
        skyColor="#9fc8ff"
        groundColor="#070c14"
      />
      <directionalLight
        position={[8, 5, 12]}
        intensity={0.22}
        color="#9ec7ff"
      />

      <Suspense fallback={null}>
        <StarsBackground />
        <SolarSystem
          activePlanet={activePlanet}
          onPlanetSelect={onPlanetSelect}
          onPlanetHover={onPlanetHover}
          hoveredPlanet={hoveredPlanet}
        />
      </Suspense>

      <OrbitControls
        target={[0, 0, -6]}
        enabled={!activePlanet}
        enableZoom={false}
        enablePan={false}
        rotateSpeed={0.38}
        minAzimuthAngle={-Math.PI / 3}
        maxAzimuthAngle={Math.PI / 3}
        minPolarAngle={Math.PI / 2 - Math.PI / 24}
        maxPolarAngle={Math.PI / 2 + Math.PI / 24}
        minDistance={21.5}
        maxDistance={21.5}
      />
    </Canvas>
  );
}
