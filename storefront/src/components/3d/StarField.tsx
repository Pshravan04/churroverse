"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export default function StarField({ count = 3000 }: { count?: number }) {
  const meshRef = useRef<THREE.Points>(null);

  const [positions, colors] = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    
    for (let i = 0; i < count; i++) {
      // Spread stars in a large sphere
      positions[i * 3] = (Math.random() - 0.5) * 200;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 200;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 200;
      
      // Slightly warm star colors
      const warmth = Math.random();
      colors[i * 3] = 0.9 + warmth * 0.1;      // R
      colors[i * 3 + 1] = 0.9 + warmth * 0.05; // G
      colors[i * 3 + 2] = 1.0;                  // B
    }
    
    return [positions, colors];
  }, [count]);

  useFrame((state) => {
    if (meshRef.current) {
      // Gentle drift
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.0015;
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.0005;
    }
  });

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
        <bufferAttribute
          attach="attributes-color"
          args={[colors, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.15}
        vertexColors
        transparent
        opacity={0.85}
        sizeAttenuation
      />
    </points>
  );
}
