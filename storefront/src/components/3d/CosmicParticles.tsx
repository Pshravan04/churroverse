'use client';

import { useRef, useEffect, useState } from 'react';
import { Points, PointMaterial, BufferGeometry, BufferAttribute } from '@react-three/fiber';
import { createShaderMaterial } from '@/lib/utils';

export function CosmicParticles({ count = 3000 }) {
  const [particlePositions] = useState(() => {
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count * 3; i += 3) {
      const angle = Math.random() * Math.PI * 2;
      const radius = Math.random() * 200;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;
      const z = Math.random() * 100 - 50;

      positions[i] = x;
      positions[i + 1] = y;
      positions[i + 2] = z;
    }
    return [positions];
  });

  const pointsRef = useRef();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Handle mouse movement for magnetic effect
  useEffect(() => {
    const handleMouseMove = (event) => {
      setMousePosition({
        x: (event.clientX / window.innerWidth - 0.5) * 2,
        y: -(event.clientY / window.innerHeight - 0.5) * 2,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    if (pointsRef.current) {
      const geometry = pointsRef.current.geometry;
      geometry.attributes.position.needsUpdate = true;
    }
  }, [mousePosition]);

  return (
    <Points ref={pointsRef} position={particlePositions}>
      <BufferGeometry>
        <BufferAttribute
          itemSize={3}
          array={particlePositions[0]}
          typed="Float32BufferAttribute"
        />
      </BufferGeometry>
      <PointMaterial
        size={0.12}
        sizeAttenuation={true}
        color="#ea580c"
        transparent={true}
        opacity={0.7}
        depthWrite={false}
        blending="additive"
        vertexColors={true}
      />
      {createShaderMaterial({
        name: 'particle-glow',
        uniforms: {
          time: { value: 0 },
          mousePosition: { value: mousePosition },
        },
        vertexShader: `...`, // Simplified for brevity
        fragmentShader: `...`, // Simplified for brevity
      })}
    </Points>
  );
}

function createShaderMaterial(config: any) {
  const material = new PointsMaterial({ ...config });
  material.onBeforeCompile = (shader) => {
    // Custom shader modifications would go here
    return shader;
  };
  return material;
}