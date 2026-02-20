import { useEffect, useMemo, useRef, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";
import { useLoader } from "@react-three/fiber";
import { playClickSfx, playHoverSfx } from "../../utils/sfx";

// function useLoadedTexture(url, { srgb = false, maxSize = 2048 } = {}) {
//   const [texture, setTexture] = useState(null);
//   const [failed, setFailed] = useState(false);

//   useEffect(() => {
//     if (!url) {
//       setTexture(null);
//       setFailed(false);
//       return;
//     }

//     setFailed(false);

//     const loader = new THREE.TextureLoader();
//     let disposed = false;

//     loader.load(
//       url,
//       (loadedTexture) => {
//         if (disposed) return;
//         const image = loadedTexture.image; // This is raw Html element
//         let finalTexture = loadedTexture; 

//         if (image?.width && image?.height) {
//           const largestSide = Math.max(image.width, image.height);
//           if (largestSide > maxSize) {
//             const scale = maxSize / largestSide;
//             const targetWidth = Math.max(1, Math.floor(image.width * scale));
//             const targetHeight = Math.max(1, Math.floor(image.height * scale));
//             const canvas = document.createElement("canvas");
//             canvas.width = targetWidth;
//             canvas.height = targetHeight;
//             const ctx = canvas.getContext("2d");
//             if (ctx) {
//               ctx.drawImage(image, 0, 0, targetWidth, targetHeight); // scales the image to new dimentions
//               finalTexture = new THREE.CanvasTexture(canvas); // convert to canvas texture
//             }
//           }
//         }

//         if (srgb) finalTexture.colorSpace = THREE.SRGBColorSpace;
//         finalTexture.anisotropy = 2;
//         finalTexture.generateMipmaps = false; // we can disable it anytime bcoz we already scaled it ( it stores downgraded versions in memory)
//         finalTexture.minFilter = THREE.LinearFilter;
//         finalTexture.magFilter = THREE.LinearFilter;
//         finalTexture.needsUpdate = true;
//         setTexture(finalTexture);
//         setFailed(false);
//       },
//       undefined,
//       () => {
//         console.warn(`Texture not found: ${url}`);
//         if (!disposed) {
//           setTexture(null);
//           setFailed(true);
//         }
//       }
//     );

//     return () => {
//       disposed = true;
//     };
//   }, [url, srgb, maxSize]);

//   return { texture, failed };
// }

export default function Planet({
  id,
  size,
  color, // this is the fallback color
  roughness,
  metalness,
  textureMap,
  atmosphereMap,
  ringAlphaMap,
  orbitRadius,
  orbitSpeed,
  initialAngle,
  name,
  isActive,
  isHovered,
  onSelect,
  onHover,
}) {
  const { camera } = useThree();
  const meshRef = useRef();  // bcox Refs allow direct manipulation without rerender.
  const spinRef = useRef();
  const calloutAnchorRef = useRef();
  const orbitTarget = useMemo(() => new THREE.Vector3(), []);
  const desiredTarget = useMemo(() => new THREE.Vector3(), []);
  const worldFocusTarget = useMemo(() => new THREE.Vector3(), []);
  const scaleTarget = useMemo(() => new THREE.Vector3(1, 1, 1), []);
  const cameraForward = useMemo(() => new THREE.Vector3(), []);
  const cameraDown = useMemo(() => new THREE.Vector3(), []);
  const planetWorldPos = useMemo(() => new THREE.Vector3(), []);
  const cameraLocal = useMemo(() => new THREE.Vector3(), []);
  const orbitAngle = useRef(initialAngle ?? 0);
  const hoverActive = useRef(false);
  const surfaceTexture = textureMap
  ? useLoader(THREE.TextureLoader, textureMap)
  : null;

const cloudTexture = atmosphereMap
  ? useLoader(THREE.TextureLoader, atmosphereMap)
  : null;

const saturnRingAlpha = ringAlphaMap
  ? useLoader(THREE.TextureLoader, ringAlphaMap)
  : null;
  const calloutStyle = useMemo(() => {
    const orbitFactor = Math.max(0, Math.min(1, (12 - orbitRadius) / 10));
    const stem = 56 + orbitFactor * 24 + ((id.charCodeAt(0) % 3) * 5);
    const arm = 112 + orbitFactor * 64 + ((id.charCodeAt(id.length - 1) % 4) * 8);
    const angle = 30 + ((id.length % 3) * 6);
    const angleRad = (angle * Math.PI) / 180;
    const elbowX = Math.cos(angleRad) * stem;
    const elbowY = Math.sin(angleRad) * stem;

    return {
      stem,
      arm,
      angle,
      elbowX,
      elbowY,
      boxLeft: elbowX + arm - 10,
      boxBottom: elbowY - 14,
      width: elbowX + arm + 170,
      height: elbowY + 46,
    };
  }, [orbitRadius, id]);

  useEffect(() => {
  if (surfaceTexture) {
    surfaceTexture.colorSpace = THREE.SRGBColorSpace;
    surfaceTexture.anisotropy = 8;
  }
  if (cloudTexture) {
    cloudTexture.colorSpace = THREE.SRGBColorSpace;
    cloudTexture.anisotropy = 8;
  }
  if (saturnRingAlpha) {
    saturnRingAlpha.anisotropy = 8;
  }
}, [surfaceTexture, cloudTexture, saturnRingAlpha]);

  useEffect(() => {
    if (!meshRef.current) return;
    orbitTarget.set(
      Math.cos(orbitAngle.current) * orbitRadius,
      0,
      Math.sin(orbitAngle.current) * orbitRadius
    );
    meshRef.current.position.copy(orbitTarget);
  }, [orbitRadius, orbitTarget]);

  useFrame((_, delta) => {
    
    if (!meshRef.current) return;

    if (spinRef.current) {
      spinRef.current.rotation.y += delta * (isActive ? 0.45 : 0.25);
    }

    if (!isActive) {
      orbitAngle.current += delta * orbitSpeed;
    }

    orbitTarget.set(
      Math.cos(orbitAngle.current) * orbitRadius,
      0,
      Math.sin(orbitAngle.current) * orbitRadius
    );

    if (isActive) {
      camera.getWorldDirection(cameraForward);
      cameraDown.copy(camera.up).multiplyScalar(-6.5);
      worldFocusTarget
        .copy(camera.position)
        .addScaledVector(cameraForward, 3.1)      // caluclates camera position
        .add(cameraDown);
      desiredTarget.copy(worldFocusTarget);
      meshRef.current.parent.worldToLocal(desiredTarget);
      meshRef.current.position.lerp(desiredTarget, Math.min(1, delta * 2.1)); // moves our planet to that positon smoothly using lerp
    } else {
      meshRef.current.position.copy(orbitTarget);
    }

    const targetScale = isActive ? 6 / size : 1;  
    scaleTarget.setScalar(targetScale);
    meshRef.current.scale.lerp(scaleTarget, Math.min(1, delta * 2.4));

    if (calloutAnchorRef.current) {
      meshRef.current.getWorldPosition(planetWorldPos);
      cameraLocal.copy(camera.position);
      meshRef.current.worldToLocal(cameraLocal);
      cameraLocal.normalize().multiplyScalar(size * 1.03);
      calloutAnchorRef.current.position.copy(cameraLocal);
    }
  });

  return (
     <group
      ref={meshRef}
      onClick={(event) => {
        event.stopPropagation();
        playClickSfx();
        onSelect(id);
      }}
      onPointerOver={(event) => {
        event.stopPropagation();
        if (!hoverActive.current) {
          playHoverSfx();
          hoverActive.current = true;
        }
        onHover?.(id);
      }}
      onPointerOut={(event) => {
        event.stopPropagation();
        hoverActive.current = false;
        onHover?.(null);
      }}
    >
      <group ref={spinRef}>
        <mesh>
          <sphereGeometry args={[size, 64, 64]} />
          <meshStandardMaterial
            map={surfaceTexture ?? null}
            color={color}
            roughness={roughness}
            metalness={metalness}
            emissive={isActive ? color : "#000000"}
            emissiveIntensity={isActive ? 0.08 : 0}
          />
        </mesh>

        {isActive && (
          <pointLight
            position={[0, 0, 0]}
            intensity={7.2}
            distance={10}
            decay={2}
            color={color}
          />
        )}

        {cloudTexture && (
          <mesh>
            <sphereGeometry args={[size * 1.02, 64, 64]} />
            <meshStandardMaterial
              map={cloudTexture}
              transparent
              opacity={0.5}
              depthWrite={false}
              color="#ffffff"
              roughness={0.9}
              metalness={0}
            />
          </mesh>
        )}

        {saturnRingAlpha && (
          <mesh rotation={[Math.PI / 2.7, 0, 0]}>
            <ringGeometry args={[size * 1.35, size * 2.3, 180]} />
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
      </group>

      {isHovered && !isActive && (
        <group ref={calloutAnchorRef}>
          <Html
            position={[0, 0, 0]}
            transform={false}
            style={{ pointerEvents: "none" }}
          >
            <div
              className="relative"
              style={{
                width: `${calloutStyle.width}px`,
                height: `${calloutStyle.height}px`,
                transform: "translateY(-100%)",
              }}
            >
              <div className="absolute left-[-2px] bottom-[-2px] h-1 w-1 rounded-full bg-cyan-200 shadow-[0_0_10px_rgba(34,211,238,0.95)]" />
              <div
                className="absolute left-0 bottom-0 h-px origin-left bg-cyan-300/95 shadow-[0_0_10px_rgba(34,211,238,0.55)]"
                style={{
                  width: `${calloutStyle.stem}px`,
                  transform: `rotate(-${calloutStyle.angle}deg)`,
                }}
              />
              <div
                className="absolute h-px bg-cyan-300/95 shadow-[0_0_10px_rgba(34,211,238,0.55)]"
                style={{
                  left: `${calloutStyle.elbowX}px`,
                  bottom: `${calloutStyle.elbowY}px`,
                  width: `${calloutStyle.arm}px`,
                }}
              />

              <div
                className="absolute rounded-md border border-cyan-300/70 bg-black/70 px-3 py-1.5 shadow-[0_0_14px_rgba(34,211,238,0.22)]"
                style={{
                  left: `${calloutStyle.boxLeft}px`,
                  bottom: `${calloutStyle.boxBottom}px`,
                }}
              >
                <p className="whitespace-nowrap font-space-mono text-[10px] tracking-[0.24em] text-cyan-200">
                  {name.toUpperCase()}
                </p>
              </div>
            </div>
          </Html>
        </group>
      )}
    </group>
  );
}
