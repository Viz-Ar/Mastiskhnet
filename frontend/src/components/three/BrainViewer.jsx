import { Canvas } from "@react-three/fiber";
import {
  OrbitControls,
  Environment,
  Float,
  Sparkles,
} from "@react-three/drei";
import { Suspense } from "react";

import BrainModel from "./BrainModel";

export default function BrainViewer() {
  return (
    <div
      className="
      relative
      h-[500px]
      w-[500px]
      overflow-hidden
      rounded-full
      bg-gradient-to-br
      from-slate-950
      via-blue-900
      to-cyan-500
      shadow-[0_0_120px_rgba(34,211,238,0.45)]
      "
    >
      {/* Outer Glow */}
      <div
        className="
        absolute
        inset-0
        rounded-full
        bg-cyan-400/20
        blur-3xl
        "
      />

      <Canvas
        dpr={[1, 2]}
        shadows
        camera={{
          position: [2, 0, 5],
          fov: 35,
        }}
      >
        <Suspense fallback={null}>
          {/* Ambient */}
          <ambientLight intensity={2} />

          {/* Main Light */}
          <directionalLight
            position={[5, 5, 5]}
            intensity={4}
            castShadow
          />

          {/* Fill Light */}
          <pointLight
            position={[-4, 2, 3]}
            intensity={2}
            color="#22d3ee"
          />

          {/* Rim Light */}
          <pointLight
            position={[3, -3, -3]}
            intensity={1.5}
            color="#60a5fa"
          />

          {/* Floating Model */}
          <Float
            speed={1.8}
            rotationIntensity={0.15}
            floatIntensity={0.3}
          >
            <BrainModel />
          </Float>

          {/* Sparkles */}
          <Sparkles
            count={120}
            scale={6}
            size={2}
            speed={0.5}
          />

          <Environment preset="city" />

          <OrbitControls
            autoRotate
            autoRotateSpeed={0.8}
            enablePan={false}
            enableZoom={false}
            minPolarAngle={Math.PI / 2.2}
            maxPolarAngle={Math.PI / 1.8}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}