"use client"
import React, { useRef, useEffect, useState } from 'react';
import { useTheme } from '@/contexts/ThemeContext';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  hue: number;
  connectionDistance: number;
}

const ParticleBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { isDark } = useTheme();
  const [particles, setParticles] = useState<Particle[]>([]);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  const particleCount = 80;
  const connectionDistance = 120;
  const mouseInfluence = 100;

  useEffect(() => {
    const handleResize = () => {
      if (canvasRef.current) {
        const { clientWidth, clientHeight } = canvasRef.current.parentElement!;
        setDimensions({ width: clientWidth, height: clientHeight });
        canvasRef.current.width = clientWidth;
        canvasRef.current.height = clientHeight;
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const initParticles = () => {
      const newParticles: Particle[] = [];
      for (let i = 0; i < particleCount; i++) {
        newParticles.push({
          x: Math.random() * dimensions.width,
          y: Math.random() * dimensions.height,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          size: Math.random() * 2 + 1,
          opacity: Math.random() * 0.5 + 0.2,
          hue: isDark ? Math.random() * 60 + 200 : Math.random() * 60 + 220, // Blue spectrum
          connectionDistance: connectionDistance + Math.random() * 50
        });
      }
      setParticles(newParticles);
    };

    if (dimensions.width && dimensions.height) {
      initParticles();
    }
  }, [dimensions, isDark]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvasRef.current?.getBoundingClientRect();
      if (rect) {
        setMousePosition({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top
        });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    let animationFrame: number;

    const animate = () => {
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext('2d');
      if (!canvas || !ctx) return;

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Update particles
      const updatedParticles = particles.map(particle => {
        let newX = particle.x + particle.vx;
        let newY = particle.y + particle.vy;
        let newVx = particle.vx;
        let newVy = particle.vy;

        // Mouse interaction
        const dx = mousePosition.x - newX;
        const dy = mousePosition.y - newY;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < mouseInfluence) {
          const force = (mouseInfluence - distance) / mouseInfluence;
          newVx += (dx / distance) * force * 0.02;
          newVy += (dy / distance) * force * 0.02;
        }

        // Boundary collision
        if (newX <= 0 || newX >= canvas.width) {
          newVx *= -0.9;
          newX = Math.max(0, Math.min(canvas.width, newX));
        }
        if (newY <= 0 || newY >= canvas.height) {
          newVy *= -0.9;
          newY = Math.max(0, Math.min(canvas.height, newY));
        }

        // Apply friction
        newVx *= 0.99;
        newVy *= 0.99;

        return { ...particle, x: newX, y: newY, vx: newVx, vy: newVy };
      });

      setParticles(updatedParticles);

      // Draw connections
      ctx.strokeStyle = isDark 
        ? 'rgba(88, 166, 255, 0.1)' 
        : 'rgba(102, 126, 234, 0.08)';
      ctx.lineWidth = 1;

      for (let i = 0; i < updatedParticles.length; i++) {
        for (let j = i + 1; j < updatedParticles.length; j++) {
          const dx = updatedParticles[i].x - updatedParticles[j].x;
          const dy = updatedParticles[i].y - updatedParticles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < updatedParticles[i].connectionDistance) {
            const opacity = (1 - distance / updatedParticles[i].connectionDistance) * 0.5;
            ctx.globalAlpha = opacity;
            ctx.beginPath();
            ctx.moveTo(updatedParticles[i].x, updatedParticles[i].y);
            ctx.lineTo(updatedParticles[j].x, updatedParticles[j].y);
            ctx.stroke();
          }
        }
      }

      // Draw particles
      updatedParticles.forEach(particle => {
        const gradient = ctx.createRadialGradient(
          particle.x, particle.y, 0,
          particle.x, particle.y, particle.size
        );
        
        const color = isDark 
          ? `hsl(${particle.hue}, 70%, 60%)` 
          : `hsl(${particle.hue}, 60%, 50%)`;
        
        gradient.addColorStop(0, color);
        gradient.addColorStop(1, 'transparent');

        ctx.globalAlpha = particle.opacity;
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();

        // Add glow effect
        ctx.globalAlpha = particle.opacity * 0.3;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size * 2, 0, Math.PI * 2);
        ctx.fill();
      });

      ctx.globalAlpha = 1;
      animationFrame = requestAnimationFrame(animate);
    };

    if (particles.length > 0) {
      animate();
    }

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [particles, mousePosition, isDark]);

  return (
    <div className="fixed inset-0 -z-10 particles">
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        style={{ 
          background: isDark 
            ? 'radial-gradient(circle at 50% 50%, rgba(13, 17, 23, 0.9) 0%, rgba(13, 17, 23, 1) 100%)'
            : 'radial-gradient(circle at 50% 50%, rgba(250, 251, 252, 0.9) 0%, rgba(250, 251, 252, 1) 100%)'
        }}
      />
      
      {/* Additional cosmic overlay for dark mode */}
      {isDark && (
        <div 
          className="absolute inset-0 opacity-30"
          style={{
            background: `
              radial-gradient(circle at 20% 80%, rgba(88, 166, 255, 0.1) 0%, transparent 50%),
              radial-gradient(circle at 80% 20%, rgba(188, 140, 255, 0.1) 0%, transparent 50%),
              radial-gradient(circle at 40% 40%, rgba(102, 126, 234, 0.05) 0%, transparent 50%)
            `
          }}
        />
      )}
    </div>
  );
};

export default ParticleBackground; 