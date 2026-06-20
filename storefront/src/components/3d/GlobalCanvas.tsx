"use client";

import { Canvas } from "@react-three/fiber";
import { Preload } from "@react-three/drei";
import PlaceholderChurroPlanet from "./PlaceholderChurroPlanet";
import StarField from "./StarField";
import UFOFleet from "./UFOFleet";
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
        <color attach="background" args={["#020010"]} />
        
        {/* Ambient + directional lights */}
        <ambientLight intensity={0.3} />
        <directionalLight position={[10, 10, 5]} intensity={1.5} color="#ffe8c0" />
        <pointLight position={[-5, -5, -5]} intensity={0.5} color="#ff6b35" />
        
        {/* Scene elements */}
        <StarField count={3000} />
        <CosmicParticles count={2000} />
        <PlaceholderChurroPlanet position={[2.5, -0.5, -5]} scale={1.5} />
        <UFOFleet />
        
        {children}
        
        <Preload all />
      </Canvas>
    </div>
  );
}
