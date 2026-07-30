import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF, Center } from "@react-three/drei";

export default function BrainModel() {
  const ref = useRef();

  const { scene } = useGLTF(
    "/models/sketch_fabulous_and_the_crystal_skull.glb"
  );

  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.rotation.y += delta * 0.4;
    }
  });

  return (
    <Center>
      <primitive
        ref={ref}
        object={scene}
        scale={0.012}
      />
    </Center>
  );
}

useGLTF.preload("/models/sketch_fabulous_and_the_crystal_skull.glb");