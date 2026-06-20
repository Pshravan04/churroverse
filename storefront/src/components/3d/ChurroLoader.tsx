'use client';

import { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { createChurroGeometries } from '@/lib/churro-geometry';

const RIDGES = 8;
const S = RIDGES * 2;
const GRAIN_COUNT = 600;
const CHURRO_LENGTH = 2.8;
const OUTER_R = 0.45;
const INNER_R = 0.26;

type Phase = 'enter' | 'float' | 'break' | 'fall' | 'done';

/* ── Realistic Bump Map for Fried Dough ── */
function makeDoughBumpTexture(): THREE.CanvasTexture {
  if (typeof document === 'undefined') return new THREE.CanvasTexture(document.createElement('canvas'));
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;
  const imgData = ctx.createImageData(512, 512);
  for (let i = 0; i < imgData.data.length; i += 4) {
    // fine grain noise
    const val = 128 + (Math.random() - 0.5) * 120;
    imgData.data[i] = val;
    imgData.data[i+1] = val;
    imgData.data[i+2] = val;
    imgData.data[i+3] = 255;
  }
  ctx.putImageData(imgData, 0, 0);
  const t = new THREE.CanvasTexture(canvas);
  t.wrapS = THREE.RepeatWrapping;
  t.wrapT = THREE.RepeatWrapping;
  t.repeat.set(6, 2);
  return t;
}

/* ── Realistic Sugar Crystals ── */
function makeSugarTexture(): THREE.CanvasTexture {
  if (typeof document === 'undefined') return new THREE.CanvasTexture(document.createElement('canvas'));
  const canvas = document.createElement('canvas');
  canvas.width = 32;
  canvas.height = 32;
  const ctx = canvas.getContext('2d')!;
  const gradient = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
  gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
  gradient.addColorStop(0.3, 'rgba(255, 248, 230, 0.9)');
  gradient.addColorStop(0.7, 'rgba(255, 248, 230, 0.4)');
  gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 32, 32);
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
    const isRidge = Math.random() > 0.4;
    const r = isRidge ? OUTER_R : INNER_R;
    const scale = 0.95 + Math.random() * 0.1;
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
    return g;
  }, [positions]);

  return (
    <points geometry={geo}>
      <pointsMaterial
        map={texture}
        size={0.035}
        sizeAttenuation
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        opacity={0.8}
        color="#ffffff"
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
  const bumpTexture = useMemo(() => makeDoughBumpTexture(), []);
  const leftGrainPos = useMemo(() => generateGrainPositions('left', CHURRO_LENGTH / 2), []);
  const rightGrainPos = useMemo(() => generateGrainPositions('right', CHURRO_LENGTH / 2), []);

  const particleCount = 80;
  const particlePositions = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;
      const r = 0.05 + Math.random() * 0.2;
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
      const speed = 3 + Math.random() * 6;
      return new THREE.Vector3(
        Math.sin(phi) * Math.cos(theta) * speed,
        Math.sin(phi) * Math.sin(theta) * speed + 2.5,
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
        groupRef.current.position.y = Math.sin(elapsed * 1.5) * 0.1;
        groupRef.current.rotation.y += delta * 0.5;
        groupRef.current.rotation.z = Math.sin(elapsed * 0.8) * 0.05;
      }
      if (progress >= 100 && phaseRef.current === 'float') {
        phaseRef.current = 'break';
        breakStartRef.current = elapsed;
        onBreakStart();
      }
    }

    if (currentPhase === 'break') {
      const breakT = Math.min((elapsed - breakStartRef.current) / 0.8, 1);
      const eased = 1 - Math.pow(1 - breakT, 2);
      const offset = eased * 2.8;

      if (leftRef.current) {
        leftRef.current.position.x = -offset;
        leftRef.current.rotation.y -= delta * 0.2;
      }
      if (rightRef.current) {
        rightRef.current.position.x = offset;
        rightRef.current.rotation.y += delta * 0.2;
      }

      if (groupRef.current) {
        groupRef.current.rotation.y += delta * 0.15;
      }

      if (glowRef.current) {
        const flash = breakT < 0.2 ? 6 * (1 - breakT / 0.2) : 0;
        glowRef.current.intensity = flash;
      }

      if (particlesRef.current) {
        const pos = particlesRef.current.geometry.attributes.position.array as Float32Array;
        for (let i = 0; i < particleCount; i++) {
          const v = particleVelocities[i];
          pos[i * 3] += v.x * delta;
          pos[i * 3 + 1] += (v.y - 2.5) * delta;
          pos[i * 3 + 2] += v.z * delta;
          v.x *= 0.96;
          v.y *= 0.96;
          v.z *= 0.96;
        }
        particlesRef.current.geometry.attributes.position.needsUpdate = true;
      }

      if (breakT >= 1 && phaseRef.current === 'break') {
        phaseRef.current = 'fall';
        fallStartRef.current = elapsed;
      }
    }

    if (currentPhase === 'fall') {
      const fallSpeed = delta * 5.5;
      if (leftRef.current) {
        leftRef.current.position.y -= fallSpeed;
        leftRef.current.rotation.x += delta * 2;
        leftRef.current.rotation.z += delta * 1.2;
      }
      if (rightRef.current) {
        rightRef.current.position.y -= fallSpeed;
        rightRef.current.rotation.x -= delta * 1.8;
        rightRef.current.rotation.z += delta * 1;
      }

      if (particlesRef.current) {
        const pos = particlesRef.current.geometry.attributes.position.array as Float32Array;
        for (let i = 0; i < particleCount; i++) {
          const v = particleVelocities[i];
          pos[i * 3] += v.x * delta;
          pos[i * 3 + 1] += (v.y - 4) * delta;
          pos[i * 3 + 2] += v.z * delta;
        }
        particlesRef.current.geometry.attributes.position.needsUpdate = true;
      }

      const fallT = Math.min((elapsed - fallStartRef.current) / 0.8, 1);
      if (fallT >= 1 && phaseRef.current === 'fall') {
        phaseRef.current = 'done';
        onDone();
      }
    }
  });

  return (
    <group ref={groupRef}>
      <pointLight ref={glowRef} position={[0, 0, 0]} color="#fbbf24" distance={8} intensity={0} />

      {/* Realistic Lighting for the physical materials */}
      <ambientLight intensity={0.3} color="#fff" />
      <directionalLight position={[5, 5, 5]} intensity={2.5} color="#fff5e6" castShadow />
      <directionalLight position={[-5, -2, -5]} intensity={0.8} color="#ffedd5" />
      <pointLight position={[0, 3, 2]} intensity={1.5} color="#ffedd5" />

      {/* Left half */}
      <group ref={leftRef}>
        <mesh geometry={geoms.leftBody} castShadow receiveShadow>
          <meshPhysicalMaterial
            vertexColors
            roughness={0.7}
            metalness={0.05}
            clearcoat={0.15}
            clearcoatRoughness={0.8}
            bumpMap={bumpTexture}
            bumpScale={0.012}
          />
        </mesh>
        <GrainPoints positions={leftGrainPos} texture={sugarTexture} />
      </group>

      {/* Right half */}
      <group ref={rightRef}>
        <mesh geometry={geoms.rightBody} castShadow receiveShadow>
          <meshPhysicalMaterial
            vertexColors
            roughness={0.7}
            metalness={0.05}
            clearcoat={0.15}
            clearcoatRoughness={0.8}
            bumpMap={bumpTexture}
            bumpScale={0.012}
          />
        </mesh>
        <mesh geometry={geoms.dip} castShadow receiveShadow>
          <meshPhysicalMaterial
            color="#3d1f00"
            roughness={0.15}
            metalness={0.1}
            clearcoat={1.0}
            clearcoatRoughness={0.1}
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
          size={0.1}
          color="#f59e0b"
          transparent
          opacity={0.9}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          map={sugarTexture}
        />
      </points>
    </group>
  );
}
