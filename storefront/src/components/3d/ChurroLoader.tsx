'use client';

import { useRef, useMemo, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { createChurroGeometries, generateSugarGrainPositions } from '@/lib/churro-geometry';

const CHURRO_LENGTH = 3.2;
const GRAIN_COUNT_PER_HALF = 800;

export type LoaderPhase = 'descend' | 'macro' | 'tremor' | 'snap' | 'portal' | 'done';

function SugarCrystals({ positions, scales }: { positions: Float32Array; scales: Float32Array }) {
  const count = scales.length;
  const meshRef = useRef<THREE.InstancedMesh>(null);
  
  // Use a tiny icosahedron as a sugar crystal
  const geo = useMemo(() => new THREE.IcosahedronGeometry(1, 0), []);
  
  useEffect(() => {
    if (!meshRef.current) return;
    const dummy = new THREE.Object3D();
    for (let i = 0; i < count; i++) {
      dummy.position.set(positions[i * 3], positions[i * 3 + 1], positions[i * 3 + 2]);
      const s = scales[i];
      dummy.scale.set(s, s, s);
      // Random rotation
      dummy.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
  }, [count, positions, scales]);

  return (
    <instancedMesh ref={meshRef} args={[geo, undefined, count]} castShadow receiveShadow>
      <meshStandardMaterial 
        color="#ffffff" 
        roughness={0.1} 
        metalness={0.1}
        envMapIntensity={2.5}
        transparent={true}
        opacity={0.9}
      />
    </instancedMesh>
  );
}

export default function ChurroLoader({
  progress,
  onPhaseChange,
}: {
  progress: number;
  onPhaseChange: (phase: LoaderPhase) => void;
}) {
  const { pointer, camera } = useThree();
  const groupRef = useRef<THREE.Group>(null);
  const leftRef = useRef<THREE.Group>(null);
  const rightRef = useRef<THREE.Group>(null);
  const portalLightRef = useRef<THREE.PointLight>(null);
  
  const phaseRef = useRef<LoaderPhase>('descend');
  const phaseStartTime = useRef(0);
  
  // Geometries
  const geoms = useMemo(() => createChurroGeometries(), []);
  const leftGrains = useMemo(() => generateSugarGrainPositions(CHURRO_LENGTH / 2, GRAIN_COUNT_PER_HALF, 'left'), []);
  const rightGrains = useMemo(() => generateSugarGrainPositions(CHURRO_LENGTH / 2, GRAIN_COUNT_PER_HALF, 'right'), []);

  // Physics Particles (Crumbs)
  const crumbCount = 150;
  const crumbsRef = useRef<THREE.InstancedMesh>(null);
  const crumbGeo = useMemo(() => new THREE.DodecahedronGeometry(0.04, 0), []);
  const crumbPhysics = useMemo(() => {
    return Array.from({ length: crumbCount }, () => ({
      pos: new THREE.Vector3((Math.random() - 0.5) * 0.4, (Math.random() - 0.5) * 0.4, (Math.random() - 0.5) * 0.4),
      vel: new THREE.Vector3((Math.random() - 0.5) * 8, Math.random() * 8 - 2, (Math.random() - 0.5) * 8),
      rot: new THREE.Vector3(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI),
      rotVel: new THREE.Vector3(Math.random() * 10, Math.random() * 10, Math.random() * 10),
      scale: 0.2 + Math.random() * 0.8
    }));
  }, [crumbCount]);

  // Noise texture for bump mapping
  const bumpMap = useMemo(() => {
    if (typeof document === 'undefined') return null;
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d')!;
    const imgData = ctx.createImageData(512, 512);
    for (let i = 0; i < imgData.data.length; i += 4) {
      const val = 100 + Math.random() * 155; // high frequency noise
      imgData.data[i] = val;
      imgData.data[i+1] = val;
      imgData.data[i+2] = val;
      imgData.data[i+3] = 255;
    }
    ctx.putImageData(imgData, 0, 0);
    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(4, 4);
    return tex;
  }, []);

  const material = useMemo(() => new THREE.MeshPhysicalMaterial({
    vertexColors: true,
    roughness: 0.65,
    metalness: 0.1,
    clearcoat: 0.3,
    clearcoatRoughness: 0.4,
    bumpMap: bumpMap,
    bumpScale: 0.02,
    envMapIntensity: 1.2
  }), [bumpMap]);

  useFrame((state, delta) => {
    const elapsed = state.clock.elapsedTime;
    const currentPhase = phaseRef.current;
    
    // Interactive subtle tilt based on mouse pointer
    if (groupRef.current && (currentPhase === 'descend' || currentPhase === 'macro' || currentPhase === 'tremor')) {
      const targetRotX = pointer.y * 0.15;
      const targetRotY = pointer.x * 0.15;
      groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, targetRotX, delta * 3);
      groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, targetRotY, delta * 3);
    }

    // --- STAGE 1 & 2: Descend ---
    if (currentPhase === 'descend') {
      const descendT = Math.min(progress / 30, 1);
      const ease = 1 - Math.pow(1 - descendT, 3);
      
      if (groupRef.current) {
        groupRef.current.position.y = 8 * (1 - ease);
        groupRef.current.rotation.z = THREE.MathUtils.lerp(groupRef.current.rotation.z, 0.1, delta);
      }
      
      // Update camera FOV slowly
      camera.position.z = THREE.MathUtils.lerp(camera.position.z, 6, delta * 2);

      if (descendT >= 1 && phaseRef.current === 'descend') {
        phaseRef.current = 'macro';
        phaseStartTime.current = elapsed;
        onPhaseChange('macro');
      }
    }

    // --- STAGE 3 & 4: Macro Close-up & Wait ---
    if (currentPhase === 'macro') {
      // Slow floaty rotation
      if (groupRef.current) {
        groupRef.current.position.y = Math.sin(elapsed * 2) * 0.05;
        groupRef.current.rotation.z = Math.sin(elapsed * 1.2) * 0.05 + 0.1;
      }
      
      // Zoom camera in for macro detail
      camera.position.z = THREE.MathUtils.lerp(camera.position.z, 3.5, delta * 1.5);

      if (progress >= 80 && phaseRef.current === 'macro') {
        phaseRef.current = 'tremor';
        phaseStartTime.current = elapsed;
        onPhaseChange('tremor');
      }
    }

    // --- STAGE 5: Tremor ---
    if (currentPhase === 'tremor') {
      const tremorElapsed = elapsed - phaseStartTime.current;
      const intensity = Math.min(tremorElapsed / 1.5, 1); // builds up over 1.5s
      
      if (groupRef.current) {
        groupRef.current.position.x = (Math.random() - 0.5) * 0.08 * intensity;
        groupRef.current.position.y = (Math.random() - 0.5) * 0.08 * intensity;
      }

      if (portalLightRef.current) {
        portalLightRef.current.intensity = intensity * 15; // Building glow inside
      }

      if (progress >= 100 && tremorElapsed > 1.5 && phaseRef.current === 'tremor') {
        phaseRef.current = 'snap';
        phaseStartTime.current = elapsed;
        onPhaseChange('snap');
      }
    }

    // --- STAGE 6: Snap & Physics Break ---
    if (currentPhase === 'snap') {
      const snapElapsed = elapsed - phaseStartTime.current;
      const t = Math.min(snapElapsed / 0.8, 1);
      const easeOutBack = (x: number) => {
        const c1 = 1.70158; const c3 = c1 + 1;
        return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2);
      };
      
      const offset = easeOutBack(t) * 1.5;

      if (leftRef.current) {
        leftRef.current.position.x = -offset;
        leftRef.current.rotation.y = -t * 0.5;
        leftRef.current.rotation.z = t * 0.2;
      }
      
      if (rightRef.current) {
        rightRef.current.position.x = offset;
        rightRef.current.rotation.y = t * 0.5;
        rightRef.current.rotation.z = -t * 0.2;
      }

      if (portalLightRef.current) {
        portalLightRef.current.intensity = 20 + Math.sin(elapsed * 20) * 5; // Pulsing
      }

      // Physics Crumbs
      if (crumbsRef.current && snapElapsed > 0.05) {
        const dummy = new THREE.Object3D();
        for (let i = 0; i < crumbCount; i++) {
          const p = crumbPhysics[i];
          p.vel.y -= 15 * delta; // Gravity
          p.pos.addScaledVector(p.vel, delta);
          p.rot.addScaledVector(p.rotVel, delta);
          
          dummy.position.copy(p.pos);
          dummy.rotation.setFromVector3(p.rot);
          const s = p.scale * Math.max(0, 1 - snapElapsed * 0.5); // Shrink over time
          dummy.scale.set(s, s, s);
          dummy.updateMatrix();
          crumbsRef.current.setMatrixAt(i, dummy.matrix);
        }
        crumbsRef.current.instanceMatrix.needsUpdate = true;
      }

      if (t >= 1 && phaseRef.current === 'snap') {
        phaseRef.current = 'portal';
        phaseStartTime.current = elapsed;
        onPhaseChange('portal');
      }
    }

    // --- STAGE 7 & 8: Portal Camera Fly-through ---
    if (currentPhase === 'portal') {
      const portalElapsed = elapsed - phaseStartTime.current;
      
      // Move halves further away rapidly
      if (leftRef.current) leftRef.current.position.x -= delta * 4;
      if (rightRef.current) rightRef.current.position.x += delta * 4;

      // Camera flies THROUGH the gap
      camera.position.z = THREE.MathUtils.lerp(camera.position.z, -5, delta * 3);

      if (portalLightRef.current) {
        portalLightRef.current.intensity = THREE.MathUtils.lerp(portalLightRef.current.intensity, 100, delta * 5);
      }

      if (portalElapsed > 1.2 && phaseRef.current === 'portal') {
        phaseRef.current = 'done';
        onPhaseChange('done');
      }
    }
  });

  return (
    <group ref={groupRef}>
      <pointLight ref={portalLightRef} position={[0, 0, 0]} color="#fbbf24" distance={15} intensity={0} />

      {/* Cinematic Lighting Setup */}
      <ambientLight intensity={0.4} color="#fff" />
      <directionalLight position={[5, 8, 5]} intensity={3.0} color="#fff5e6" castShadow shadow-bias={-0.001} />
      <directionalLight position={[-8, -2, -8]} intensity={1.5} color="#fb923c" /> {/* Warm Rim */}
      <pointLight position={[0, 4, 3]} intensity={2.0} color="#ffe4e1" />

      {/* Left half */}
      <group ref={leftRef}>
        <mesh geometry={geoms.leftBody} material={material} castShadow receiveShadow />
        <SugarCrystals positions={leftGrains.positions} scales={leftGrains.scales} />
      </group>

      {/* Right half */}
      <group ref={rightRef}>
        <mesh geometry={geoms.rightBody} material={material} castShadow receiveShadow />
        <SugarCrystals positions={rightGrains.positions} scales={rightGrains.scales} />
      </group>

      {/* Exploding Crumbs */}
      <instancedMesh ref={crumbsRef} args={[crumbGeo, material, crumbCount]} castShadow>
        <meshPhysicalMaterial 
          color="#8b4513"
          roughness={0.9} 
          bumpMap={bumpMap} 
          bumpScale={0.05} 
        />
      </instancedMesh>
    </group>
  );
}
