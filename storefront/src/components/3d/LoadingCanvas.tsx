'use client';

import { Canvas } from '@react-three/fiber';
import { Environment } from '@react-three/drei';
import { EffectComposer, Bloom, DepthOfField, ChromaticAberration } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';
import ChurroLoader, { LoaderPhase } from './ChurroLoader';

export default function LoadingCanvas({
  progress,
  onPhaseChange,
}: {
  progress: number;
  onPhaseChange: (phase: LoaderPhase) => void;
}) {
  return (
    <Canvas
      camera={{ position: [0, 0, 4.5], fov: 40, near: 0.1, far: 20 }}
      gl={{ antialias: true, alpha: true }}
      dpr={[1, 2]}
      style={{ width: '100%', height: '100%' }}
    >
      <Environment preset="studio" />
      
      <ChurroLoader
        progress={progress}
        onPhaseChange={onPhaseChange}
      />

      <EffectComposer disableNormalPass>
        <DepthOfField focusDistance={0} focalLength={0.02} bokehScale={2} height={480} />
        <Bloom 
          luminanceThreshold={0.5} 
          luminanceSmoothing={0.9} 
          height={300} 
          intensity={1.2} 
          blendFunction={BlendFunction.ADD} 
        />
        <ChromaticAberration 
          blendFunction={BlendFunction.NORMAL} 
          offset={[0.002, 0.002] as unknown as import("three").Vector2} 
        />
      </EffectComposer>
    </Canvas>
  );
}
