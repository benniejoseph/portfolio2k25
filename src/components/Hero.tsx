"use client"
import React from 'react';
import { motion } from 'framer-motion';
import CanvasWrapper from './CanvasWrapper';
import YourModel from './models/YourModel';

const Hero = () => {
  return (
    <div className="flex flex-col lg:flex-row items-center justify-between min-h-[calc(100vh-80px)]">
      <motion.div 
        className="lg:w-1/2 text-center lg:text-left"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
          Hi, I&apos;m <span className="gradient-text">Bennie Joseph</span>
        </h1>
        {/* <h2 className="text-2xl md:text-3xl text-primary mb-6">Salesforce Senior Consultant</h2> */}
        <p className="text-lg md:text-xl text-darkText mb-8 max-w-2xl mx-auto lg:mx-0">
          Specializing in Integrating Salesforce with Generative, Conversational and Agentic AI, React and Next.js Applications, and enterprise-scale development.
          Transforming complex business challenges into elegant solutions.
        </p>
        <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
          <a href="#contact" className="modern-button">
            Get in Touch
          </a>
          <a href="#projects" className="modern-button">
            View Projects
          </a>
        </div>
      </motion.div>

      <motion.div 
        className="lg:w-1/2 h-[300px] md:h-[400px] lg:h-[500px] w-full mt-8 lg:mt-0"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="w-full h-full flex justify-end">
          <div className="w-[400px] h-full">
            <CanvasWrapper>
              {/* Add Lights */}
              <ambientLight intensity={0.8} />
              <directionalLight 
                position={[5, 5, 5]} 
                intensity={1} 
                castShadow 
                shadow-mapSize={[1024, 1024]}
              />
              <pointLight position={[-5, 5, -5]} intensity={0.5} />
              <pointLight position={[0, -5, 0]} intensity={0.3} color="#64ffda" />
              
              {/* Your 3D Model */}
              <YourModel 
                scale={0.8} 
                position={[0, -1.5, -1]} 
                rotation={[0, Math.PI / 4, 0]} // Slight rotation for better view
              />
            </CanvasWrapper>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Hero;