"use client"
import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Preload, Loader } from '@react-three/drei';

interface CanvasWrapperProps {
  children: React.ReactNode;
}

const CanvasWrapper = ({ children }: CanvasWrapperProps) => {
  return (
    <>
      <Canvas
        // frameloop="demand" // Uncomment if you only want rendering on demand/changes
        shadows // Enable shadows
        camera={{ position: [20, 3, 5], fov: 25 }} // Adjust camera position and field of view
        gl={{ preserveDrawingBuffer: true }} // Needed if you want to screenshot canvas
        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: -1 }} // Position canvas behind content
      >
        <Suspense fallback={null}> {/* Fallback while models/assets load */}
          {/* Optional: OrbitControls for debugging/interaction */}
          {/* <OrbitControls enableZoom={false} maxPolarAngle={Math.PI / 2} minPolarAngle={Math.PI / 2} /> */}

          {children} {/* Render the 3D scene elements passed as children */}

          <Preload all /> {/* Preload assets */}
        </Suspense>
      </Canvas>
      <Loader /> {/* Shows a loading progress indicator */}
    </>
  );
};

export default CanvasWrapper;