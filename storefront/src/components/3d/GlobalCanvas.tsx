"use client";

import { Canvas } from "@react-three/fiber";
import { Preload } from "@react-three/drei";
import StarField from "./StarField";
import { CosmicParticles } from "./CosmicParticles";

export default function GlobalCanvas({ children }: { children?: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-[-1] pointer-events-none">
      <Canvas
        camera={{ position: [0, 0, 10], fov: 45 }}
        style={{ width: "100vw", height: "100vh" }}
        gl={{ antialias: true, alpha: false }}
        dpr={[1, 1.5]}
      >
        {/* Deep space background */}
        <color attach="background" args={["#030303"]} />
        
        {/* Ambient + directional lights */}
        <ambientLight intensity={0.15} />
        <directionalLight position={[10, 15, 10]} intensity={1.8} color="#ffffff" castShadow />
        <pointLight position={[-10, -10, -5]} intensity={0.4} color="#a1b5d1" />
        
        {/* Scene elements */}
        <StarField count={3000} />
        <CosmicParticles count={1500} />
        
        {children}
        
        <Preload all />
      </Canvas>
    </div>
  );
}
