'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { createChurroGeometries } from '@/lib/churro-geometry';

const RIDGES = 8;
const S = RIDGES * 2;
const GRAIN_COUNT = 400;
const CHURRO_LENGTH = 2.8;
const OUTER_R = 0.45;
const INNER_R = 0.26;

type Phase = 'enter' | 'float' | 'break' | 'fall' | 'done';

function makeSugarTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 24;
  canvas.height = 24;
  const ctx = canvas.getContext('2d')!;
  const gradient = ctx.createRadialGradient(12, 12, 0, 12, 12, 12);
  gradient.addColorStop(0, 'rgba(245,235,210,1)');
  gradient.addColorStop(0.25, 'rgba(245,235,210,0.85)');
  gradient.addColorStop(0.6, 'rgba(230,215,180,0.3)');
  gradient.addColorStop(1, 'rgba(230,215,180,0)');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 24, 24);
  const t = new THREE.CanvasTexture(canvas);
  t.needsUpdate = true;
  return t;
}

function generateGrainPositions(half: 'left' | 'right', halfLen: number): Float32Array {
  const pos = new Float32Array(GRAIN_COUNT * 3);
  const xStart = half === 'left' ? -halfLen : 0;
  const xEnd = half === 'left' ? 0 : halfLen;
  for (let i = 0; i < GRAIN_COUNT; i++) {
    const x = xStart + Math.random() * (xEnd - xStart);
    const angle = Math.random() * Math.PI * 2;
    const isRidge = Math.random() > 0.5;
    const r = isRidge ? OUTER_R : INNER_R;
    const scale = 0.97 + Math.random() * 0.08;
    pos[i * 3] = x;
    pos[i * 3 + 1] = Math.cos(angle) * r * scale;
    pos[i * 3 + 2] = Math.sin(angle) * r * scale;
  }
  return pos;
}

function GrainPoints({ positions, texture }: { positions: Float32Array; texture: THREE.CanvasTexture }) {
  const geo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    const randoms = new Float32Array(GRAIN_COUNT);
    for (let i = 0; i < GRAIN_COUNT; i++) randoms[i] = Math.random();
    g.setAttribute('aRandom', new THREE.Float32BufferAttribute(randoms, 1));
    return g;
  }, [positions]);

  return (
    <points geometry={geo}>
      <pointsMaterial
        map={texture}
        size={0.045}
        sizeAttenuation
        transparent
        depthWrite={false}
        blending={THREE.NormalBlending}
        opacity={0.9}
      />
    </points>
  );
}

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

  const geoms = useMemo(() => createChurroGeometries(), []);
  const sugarTexture = useMemo(() => makeSugarTexture(), []);
  const leftGrainPos = useMemo(() => generateGrainPositions('left', CHURRO_LENGTH / 2), []);
  const rightGrainPos = useMemo(() => generateGrainPositions('right', CHURRO_LENGTH / 2), []);

  const particleCount = 50;
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
      const speed = 2 + Math.random() * 5;
      return new THREE.Vector3(
        Math.sin(phi) * Math.cos(theta) * speed,
        Math.sin(phi) * Math.sin(theta) * speed + 2,
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

      if (glowRef.current) {
        const flash = breakT < 0.2 ? 3 * (1 - breakT / 0.2) : 0;
        glowRef.current.intensity = flash;
      }

      if (particlesRef.current) {
        const pos = particlesRef.current.geometry.attributes.position.array as Float32Array;
        for (let i = 0; i < particleCount; i++) {
          const v = particleVelocities[i];
          pos[i * 3] += v.x * delta;
          pos[i * 3 + 1] += (v.y - 2) * delta;
          pos[i * 3 + 2] += v.z * delta;
          v.x *= 0.97;
          v.y *= 0.97;
          v.z *= 0.97;
        }
        particlesRef.current.geometry.attributes.position.needsUpdate = true;
      }

      if (breakT >= 1 && phaseRef.current === 'break') {
        phaseRef.current = 'fall';
        fallStartRef.current = elapsed;
      }
    }

    if (currentPhase === 'fall') {
      const fallSpeed = delta * 4;
      if (leftRef.current) {
        leftRef.current.position.y -= fallSpeed;
        leftRef.current.rotation.x += delta * 1.5;
        leftRef.current.rotation.z += delta * 0.8;
      }
      if (rightRef.current) {
        rightRef.current.position.y -= fallSpeed;
        rightRef.current.rotation.x -= delta * 1.2;
        rightRef.current.rotation.z += delta * 0.6;
      }

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

      const fallT = Math.min((elapsed - fallStartRef.current) / 1.0, 1);
      if (fallT >= 1 && phaseRef.current === 'fall') {
        phaseRef.current = 'done';
        onDone();
      }
    }
  });

  return (
    <group ref={groupRef}>
      <pointLight ref={glowRef} position={[0, 0, 0]} color="#ff8c00" distance={6} intensity={0} />

      {/* Left half */}
      <group ref={leftRef}>
        <mesh geometry={geoms.leftBody} castShadow>
          <meshStandardMaterial
            vertexColors
            roughness={0.78}
            metalness={0.02}
          />
        </mesh>
        <GrainPoints positions={leftGrainPos} texture={sugarTexture} />
      </group>

      {/* Right half */}
      <group ref={rightRef}>
        <mesh geometry={geoms.rightBody} castShadow>
          <meshStandardMaterial
            vertexColors
            roughness={0.78}
            metalness={0.02}
          />
        </mesh>
        <mesh geometry={geoms.dip} castShadow>
          <meshStandardMaterial
            vertexColors
            roughness={0.3}
            metalness={0.15}
            envMapIntensity={0.5}
          />
        </mesh>
        <GrainPoints positions={rightGrainPos} texture={sugarTexture} />
      </group>

      {/* Break crumbs */}
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[particlePositions, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.07}
          color="#c8803a"
          transparent
          opacity={0.9}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>

      {/* Lighting */}
      <ambientLight intensity={0.2} />
      <directionalLight position={[4, 5, 3]} intensity={1.6} color="#ffe8b0" />
      <directionalLight position={[-3, 2, -4]} intensity={0.5} color="#ffc080" />
      <pointLight position={[-2, 1, 3]} intensity={0.6} color="#ff8c00" />
      <pointLight position={[2, -3, 2]} intensity={0.3} color="#804020" />
      <hemisphereLight args={['#ffe4b0', '#050015', 0.4]} />
    </group>
  );
}
