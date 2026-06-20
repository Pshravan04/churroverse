'use client';

import { Canvas } from '@react-three/fiber';
import ChurroLoader from './ChurroLoader';

export default function LoadingCanvas({
  progress,
  onDone,
}: {
  progress: number;
  onDone: () => void;
}) {
  return (
    <Canvas
      camera={{ position: [0, 0, 4.5], fov: 40, near: 0.1, far: 20 }}
      gl={{ antialias: true, alpha: true }}
      dpr={[1, 1.5]}
      style={{ width: '100%', height: '100%' }}
    >
      <ChurroLoader
        progress={progress}
        onBreakStart={() => {}}
        onDone={onDone}
      />
    </Canvas>
  );
}
