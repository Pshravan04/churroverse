"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Sphere, MeshDistortMaterial } from "@react-three/drei";
import * as THREE from "three";

export default function PlaceholderChurroPlanet({
  position = [0, 0, 0],
  scale = 1,
}: {
  position?: [number, number, number];
  scale?: number;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const atmosphereRef = useRef<THREE.Mesh>(null);
  const ring1Ref = useRef<THREE.Mesh>(null);
  const ring2Ref = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.15;
      // Gentle bob
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.4) * 0.15;
    }
    if (atmosphereRef.current) {
      atmosphereRef.current.rotation.y += delta * 0.05;
    }
    if (ring1Ref.current) {
      ring1Ref.current.rotation.z += delta * 0.08;
    }
    if (ring2Ref.current) {
      ring2Ref.current.rotation.z -= delta * 0.05;
    }
  });

  return (
    <group position={position} scale={scale}>
      {/* Atmospheric glow shell */}
      <mesh ref={atmosphereRef}>
        <sphereGeometry args={[2.35, 32, 32]} />
        <meshStandardMaterial
          color="#ff6b35"
          transparent
          opacity={0.08}
          side={THREE.BackSide}
        />
      </mesh>

      {/* The planet itself */}
      <Sphere ref={meshRef} args={[2, 64, 64]}>
        <MeshDistortMaterial
          color="#c8752a"
          attach="material"
          distort={0.25}
          speed={1.2}
          roughness={0.7}
          metalness={0.3}
          emissive="#7a3800"
          emissiveIntensity={0.15}
        />
      </Sphere>

      {/* Golden equatorial ring */}
      <mesh
        ref={ring1Ref}
        rotation={[Math.PI / 2.2, 0.2, 0]}
      >
        <torusGeometry args={[3.2, 0.07, 16, 120]} />
        <meshStandardMaterial
          color="#fcd34d"
          emissive="#f59e0b"
          emissiveIntensity={0.8}
          roughness={0.2}
          metalness={0.6}
        />
      </mesh>

      {/* Thin outer ring */}
      <mesh
        ref={ring2Ref}
        rotation={[Math.PI / 2.5, Math.PI / 5, 0.1]}
      >
        <torusGeometry args={[4.2, 0.025, 16, 120]} />
        <meshStandardMaterial
          color="#ffffff"
          emissive="#ffffff"
          emissiveIntensity={0.3}
          transparent
          opacity={0.4}
        />
      </mesh>

      {/* Point light on the planet for dramatic shading */}
      <pointLight position={[-4, 4, 4]} intensity={2} color="#ffe0a0" />
    </group>
  );
}
