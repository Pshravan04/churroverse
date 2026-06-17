"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

// A small glowing UFO made from primitives
function UFO({ position, speed, radius }: { position: [number, number, number]; speed: number; radius: number }) {
  const groupRef = useRef<THREE.Group>(null);
  const timeOffset = Math.random() * Math.PI * 2;

  useFrame((state) => {
    if (groupRef.current) {
      const t = state.clock.elapsedTime * speed + timeOffset;
      groupRef.current.position.x = position[0] + Math.cos(t) * radius;
      groupRef.current.position.z = position[2] + Math.sin(t) * radius;
      groupRef.current.position.y = position[1] + Math.sin(t * 2) * 0.5;
      groupRef.current.rotation.y = t * 2;
    }
  });

  return (
    <group ref={groupRef} position={position}>
      {/* Body */}
      <mesh>
        <sphereGeometry args={[0.25, 16, 8]} />
        <meshStandardMaterial color="#b0c4de" metalness={0.8} roughness={0.2} />
      </mesh>
      {/* Disc */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.3, 0.08, 8, 24]} />
        <meshStandardMaterial color="#4fc3f7" emissive="#4fc3f7" emissiveIntensity={0.8} />
      </mesh>
      {/* Glow dome */}
      <mesh position={[0, 0.15, 0]}>
        <sphereGeometry args={[0.15, 12, 8]} />
        <meshStandardMaterial color="#7dd3fc" emissive="#7dd3fc" emissiveIntensity={1} transparent opacity={0.7} />
      </mesh>
    </group>
  );
}

export default function UFOFleet() {
  return (
    <>
      <UFO position={[5, 1, -3]} speed={0.4} radius={1.2} />
      <UFO position={[-4, 2, -2]} speed={0.3} radius={1.5} />
      <UFO position={[3, -1, -4]} speed={0.5} radius={0.8} />
    </>
  );
}
