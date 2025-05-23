import React, { useRef } from 'react';
import { useGLTF } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface YourModelProps {
  scale?: number;
  position?: [number, number, number];
  rotation?: [number, number, number];
}

// IMPORTANT: Replace 'public/models/scene.glb' with the actual path to your model
// You might need to adjust scale, position, rotation based on your model.

const YourModel = (props: YourModelProps) => {
  const group = useRef<THREE.Group>(null);
  // Make sure the path is relative to the 'public' folder for useGLTF
  const { scene } = useGLTF('/models/dog.glb');

  // Optional: Play an animation if the model has one
  // useEffect(() => {
  //   if (actions && actions['Take 001']) { // Replace 'Take 001' with your animation name
  //      actions['Take 001'].play();
  //   }
  // }, [actions]);

  // Optional: Add subtle rotation
  useFrame((state, delta) => {
    if (group.current) {
       group.current.rotation.y += delta * 0.1; // Adjust speed as needed
    }
  });


  return (
    <primitive
      ref={group}
      object={scene}
      scale={1.5} // Adjust scale
      position={[0, -1, 0]} // Adjust position
      rotation={[0, 0, 0]} // Adjust rotation
      {...props}
    />
  );
};

// Preload the model for faster loading
useGLTF.preload('/models/dog.glb');

export default YourModel;