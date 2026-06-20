'use client';

import { useRef, useMemo, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { createChurroGeometries } from '@/lib/churro-geometry';

type Phase = 'enter' | 'float' | 'break' | 'fall' | 'done';

export default function ChurroLoader({
  progress,
  onBreakStart,
  onDone,
}: {
  progress: number;
  onBreakStart: () => void;
  onDone: () => void;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const leftRef = useRef<THREE.Group>(null);
  const rightRef = useRef<THREE.Group>(null);
  const glowRef = useRef<THREE.PointLight>(null);
  const phaseRef = useRef<Phase>('enter');
  const breakStartRef = useRef(0);
  const fallStartRef = useRef(0);
  const flashIntensity = useRef(0);
  const [phase, setPhase] = useState<Phase>('enter');

  const geoms = useMemo(() => createChurroGeometries(), []);

  // Break particles
  const particleCount = 40;
  const particlePositions = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;
      const r = 0.1 + Math.random() * 0.3;
      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi);
    }
    return pos;
  }, []);

  const particleVelocities = useMemo(() => {
    return Array.from({ length: particleCount }, () => {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;
      const speed = 2 + Math.random() * 4;
      return new THREE.Vector3(
        Math.sin(phi) * Math.cos(theta) * speed,
        Math.sin(phi) * Math.sin(theta) * speed + 1,
        Math.cos(phi) * speed,
      );
    });
  }, []);

  const particlesRef = useRef<THREE.Points>(null);

  useFrame((state, delta) => {
    const elapsed = state.clock.elapsedTime;
    const currentPhase = phaseRef.current;

    if (currentPhase === 'enter') {
      const enterT = Math.min(progress / 65, 1);
      const eased = 1 - Math.pow(1 - enterT, 3);
      const y = 8 * (1 - eased);
      if (groupRef.current) {
        groupRef.current.position.y = y;
        groupRef.current.rotation.x += delta * 0.4 * eased;
        groupRef.current.rotation.y += delta * 0.7 * eased;
        groupRef.current.rotation.z += delta * 0.15 * eased;
      }
      if (enterT >= 1 && phaseRef.current === 'enter') {
        phaseRef.current = 'float';
        setPhase('float');
      }
    }

    if (currentPhase === 'float') {
      if (groupRef.current) {
        groupRef.current.position.y = Math.sin(elapsed * 0.8) * 0.08;
        groupRef.current.rotation.y += delta * 0.35;
      }
      if (progress >= 100 && phaseRef.current === 'float') {
        phaseRef.current = 'break';
        breakStartRef.current = elapsed;
        onBreakStart();
        setPhase('break');
      }
    }

    if (currentPhase === 'break') {
      const breakT = Math.min((elapsed - breakStartRef.current) / 0.9, 1);
      const eased = 1 - Math.pow(1 - breakT, 2);
      const offset = eased * 2.8;

      if (leftRef.current) leftRef.current.position.x = -offset;
      if (rightRef.current) rightRef.current.position.x = offset;

      if (groupRef.current) {
        groupRef.current.rotation.y += delta * 0.15;
      }

      // Flash glow at break
      flashIntensity.current = breakT < 0.2 ? 3 * (1 - breakT / 0.2) : 0;
      if (glowRef.current) {
        glowRef.current.intensity = flashIntensity.current;
      }

      // Animate break particles
      if (particlesRef.current) {
        const pos = particlesRef.current.geometry.attributes.position.array as Float32Array;
        for (let i = 0; i < particleCount; i++) {
          const v = particleVelocities[i];
          pos[i * 3] += v.x * delta;
          pos[i * 3 + 1] += (v.y - 2) * delta;
          pos[i * 3 + 2] += v.z * delta;
          v.x *= 0.98;
          v.y *= 0.98;
          v.z *= 0.98;
        }
        particlesRef.current.geometry.attributes.position.needsUpdate = true;
      }

      if (breakT >= 1 && phaseRef.current === 'break') {
        phaseRef.current = 'fall';
        fallStartRef.current = elapsed;
        setPhase('fall');
      }
    }

    if (currentPhase === 'fall') {
      const fallT = Math.min((elapsed - fallStartRef.current) / 1.0, 1);

      if (leftRef.current) {
        leftRef.current.position.y -= delta * 4;
        leftRef.current.rotation.x += delta * 1.5;
        leftRef.current.rotation.z += delta * 0.8;
      }
      if (rightRef.current) {
        rightRef.current.position.y -= delta * 4;
        rightRef.current.rotation.x -= delta * 1.2;
        rightRef.current.rotation.z += delta * 0.6;
      }

      // Particles continue falling
      if (particlesRef.current) {
        const pos = particlesRef.current.geometry.attributes.position.array as Float32Array;
        for (let i = 0; i < particleCount; i++) {
          const v = particleVelocities[i];
          pos[i * 3] += v.x * delta;
          pos[i * 3 + 1] += (v.y - 3) * delta;
          pos[i * 3 + 2] += v.z * delta;
        }
        particlesRef.current.geometry.attributes.position.needsUpdate = true;
      }

      if (fallT >= 1 && phaseRef.current === 'fall') {
        phaseRef.current = 'done';
        setPhase('done');
        onDone();
      }
    }
  });

  return (
    <group ref={groupRef}>
      {/* Glow flash at break */}
      <pointLight ref={glowRef} position={[0, 0, 0]} color="#ff8c00" distance={6} intensity={0} />

      {/* Left half */}
      <group ref={leftRef}>
        <mesh geometry={geoms.leftBody} castShadow>
          <meshStandardMaterial
            color="#c8803a"
            roughness={0.85}
            metalness={0.05}
            emissive="#7a3a00"
            emissiveIntensity={0.1}
          />
        </mesh>
      </group>

      {/* Right half */}
      <group ref={rightRef}>
        <mesh geometry={geoms.rightBody} castShadow>
          <meshStandardMaterial
            color="#c8803a"
            roughness={0.85}
            metalness={0.05}
            emissive="#7a3a00"
            emissiveIntensity={0.1}
          />
        </mesh>
        <mesh geometry={geoms.dip} castShadow>
          <meshStandardMaterial
            color="#3a1508"
            roughness={0.4}
            metalness={0.15}
            emissive="#1a0800"
            emissiveIntensity={0.15}
          />
        </mesh>
      </group>

      {/* Break particles */}
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[particlePositions, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.06}
          color="#ff8c00"
          transparent
          opacity={0.9}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>

      {/* Lighting */}
      <ambientLight intensity={0.3} />
      <directionalLight position={[3, 4, 3]} intensity={1.2} color="#ffe4b0" />
      <pointLight position={[-3, 2, 2]} intensity={0.6} color="#ff8c00" />
      <pointLight position={[0, -3, -3]} intensity={0.3} color="#ff6b35" />
    </group>
  );
}
