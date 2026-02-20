import { Stars } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";  // runs logic every animation frame
import { useMemo, useRef } from "react";
import * as THREE from "three";

// function ShootingStars() {
//   const starRefs = useRef([]);
//   const spawnCooldown = useRef(2.8 + Math.random() * 3.8);
//   const rays = useMemo(
//     () =>
//       Array.from({ length: 3 }, () => ({
//         active: false,
//         t: 0,
//         duration: 0.7,
//         start: new THREE.Vector3(),
//         end: new THREE.Vector3(),
//       })),
//     []
//   );

//   useFrame((_, delta) => {
//     spawnCooldown.current -= delta;

//     if (spawnCooldown.current <= 0) {
//       const next = rays.find((ray) => !ray.active);
//       if (next) {
//         const startX = THREE.MathUtils.randFloat(-22, 22);
//         const startY = THREE.MathUtils.randFloat(6, 16);
//         const startZ = THREE.MathUtils.randFloat(-14, -7);
//         const dx = THREE.MathUtils.randFloat(5.5, 9.5);
//         const dy = THREE.MathUtils.randFloat(3, 5.5);

//         next.active = true;
//         next.t = 0;
//         next.duration = THREE.MathUtils.randFloat(1.2, 1.9);
//         next.start.set(startX, startY, startZ);
//         next.end.set(startX - dx, startY - dy, startZ);
//       }

//       // Keep shooting stars occasional, not frequent.
//       spawnCooldown.current = THREE.MathUtils.randFloat(3.2, 8.5);
//     }

//     rays.forEach((ray, index) => {
//       const star = starRefs.current[index];
//       if (!star) return;

//       if (!ray.active) {
//         star.visible = false;
//         return;
//       }

//       ray.t += delta / ray.duration;
//       if (ray.t >= 1) {
//         ray.active = false;
//         star.visible = false;
//         return;
//       }

//       star.visible = true;
//       star.position.lerpVectors(ray.start, ray.end, ray.t);
//       star.scale.setScalar(0.85 - ray.t * 0.2);

//       // 2-layer glow: outer halo + bright inner core.
//       star.children[0].material.opacity = 0.55 * (1 - ray.t * 0.65);
//       star.children[1].material.opacity = 1 * (1 - ray.t * 0.75);
//     });
//   });

//   return (
//     <group>
//       {rays.map((_, index) => (
//         <group key={index} ref={(el) => (starRefs.current[index] = el)} visible={false}>
//           <mesh>
//             <sphereGeometry args={[0.1, 18, 18]} />
//             <meshBasicMaterial
//               color="#9feaff"
//               transparent
//               opacity={0.35}
//               blending={THREE.AdditiveBlending}
//               depthWrite={false}
//               toneMapped={false}
//             />
//           </mesh>
//           <mesh>
//             <sphereGeometry args={[0.08, 14, 14]} />
//             <meshBasicMaterial
//               color="#f2fbff"
//               transparent
//               opacity={1}
//               blending={THREE.AdditiveBlending}
//               depthWrite={false}
//               toneMapped={false}
//             />
//           </mesh>
//         </group>
//       ))}
//     </group>
//   );
// }

export default function StarsBackground() {
  return (
    <>
      <Stars
        radius={100}
        depth={50}
        count={5000}
        factor={4}
        saturation={0}
        fade
        speed={1}
      />
      {/* <ShootingStars /> */}
    </>
  );
}
