import { planets } from "../../data/planets";
import Planet from "./Planter";
import { useRef } from "react";
import { useFrame, useLoader } from "@react-three/fiber";
import * as THREE from "three";
import sunTextureUrl from "../../assets/2k_sun.jpg";

export default function SolarSystem({ activePlanet, onPlanetSelect, onPlanetHover, hoveredPlanet }) {
  const groupRef = useRef(); //grouping the whole solarsystem as one
  const sunTexture = useLoader(THREE.TextureLoader, sunTextureUrl); // creating sun
  sunTexture.colorSpace = THREE.SRGBColorSpace;

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    const targetZ = activePlanet ? -9.2 : -6;
    groupRef.current.position.z = THREE.MathUtils.lerp(
      groupRef.current.position.z,
      targetZ,
      Math.min(1, delta * 2.8)
    );
  });

  return (
    <group ref={groupRef} position={[0, 0, -6]}>
      <mesh raycast={() => null}>
        <sphereGeometry args={[1.1, 64, 64]} />
        <meshStandardMaterial
          map={sunTexture}
          color="#ffbf5e"
          emissive="#ff8a00"
          emissiveIntensity={2.3}
          roughness={0.35}
          metalness={0.05}
        />
      </mesh>
      <pointLight position={[0, 0, 0]} intensity={180} distance={140} decay={2} color="#ffd38a" />

      {planets.map((planet) => (
        <mesh key={`${planet.id}-orbit`} rotation={[Math.PI / 2, 0, 0]} raycast={() => null}>
          <ringGeometry args={[planet.orbitRadius - 0.015, planet.orbitRadius + 0.015, 240]} />
         <meshBasicMaterial
  color="#fff"
  transparent
  opacity={0.7}
  side={THREE.DoubleSide}
  depthWrite={true}
/>
        </mesh>
      ))}

      {planets.map((planet) => (
        <Planet
          key={planet.id}
          {...planet}
          isActive={planet.id === activePlanet}
          isHovered={planet.id === hoveredPlanet}
          onSelect={onPlanetSelect}
          onHover={onPlanetHover}
        />
      ))}
    </group>
  );
}
