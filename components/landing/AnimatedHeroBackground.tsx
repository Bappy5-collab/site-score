'use client';

import { useEffect, useRef } from 'react';
import { Box } from '@mui/material';
import { motion } from 'framer-motion';
import SearchIcon from '@mui/icons-material/Search';
import SpeedIcon from '@mui/icons-material/Speed';
import CodeIcon from '@mui/icons-material/Code';
import SecurityIcon from '@mui/icons-material/Security';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';

// Floating AI / website-themed icons that drift gently behind the hero content.
const FLOATING = [
  { Icon: SearchIcon, top: '20%', left: '7%', delay: 0, duration: 7, hideXs: false },
  { Icon: SpeedIcon, top: '64%', left: '11%', delay: 1.2, duration: 8, hideXs: true },
  { Icon: CodeIcon, top: '26%', left: '87%', delay: 0.6, duration: 7.5, hideXs: false },
  { Icon: SecurityIcon, top: '70%', left: '84%', delay: 1.8, duration: 9, hideXs: true },
  { Icon: TrendingUpIcon, top: '46%', left: '80%', delay: 2.4, duration: 8.5, hideXs: true },
  { Icon: AutoAwesomeIcon, top: '13%', left: '68%', delay: 0.9, duration: 7, hideXs: false },
];

export default function AnimatedHeroBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Particle "neural network" — nodes drift and connect when close.
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const DPR = Math.min(window.devicePixelRatio || 1, 2);
    let w = 0;
    let h = 0;
    let raf = 0;

    interface P {
      x: number;
      y: number;
      vx: number;
      vy: number;
    }
    let particles: P[] = [];

    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      w = parent.clientWidth;
      h = parent.clientHeight;
      canvas.width = w * DPR;
      canvas.height = h * DPR;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
      const count = Math.max(24, Math.min(72, Math.floor((w * h) / 17000)));
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
      }));
    };

    resize();
    window.addEventListener('resize', resize);

    const LINK_DIST = 140;

    const render = () => {
      ctx.clearRect(0, 0, w, h);

      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;
      }

      // connecting lines
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const a = particles[i];
          const b = particles[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.hypot(dx, dy);
          if (dist < LINK_DIST) {
            const alpha = (1 - dist / LINK_DIST) * 0.5;
            ctx.strokeStyle = `rgba(249, 115, 22, ${alpha})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      // nodes
      for (const p of particles) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, 1.7, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(196, 181, 253, 0.85)';
        ctx.fill();
      }

      raf = requestAnimationFrame(render);
    };

    if (reduceMotion) {
      render(); // draw one static frame
      cancelAnimationFrame(raf);
    } else {
      render();
    }

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <Box sx={{ position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none', overflow: 'hidden' }}>
      {/* Particle network */}
      <Box
        component="canvas"
        ref={canvasRef}
        sx={{ position: 'absolute', inset: 0, opacity: 0.55 }}
      />

      {/* Subtle moving grid overlay */}
      <Box
        component={motion.div}
        animate={{ backgroundPositionY: ['0px', '44px'] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
        sx={{
          position: 'absolute',
          inset: 0,
          backgroundImage:
            'linear-gradient(rgba(249, 115, 22,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(249, 115, 22,0.06) 1px, transparent 1px)',
          backgroundSize: '44px 44px',
          maskImage: 'radial-gradient(ellipse 70% 60% at 50% 40%, #000 30%, transparent 75%)',
          WebkitMaskImage: 'radial-gradient(ellipse 70% 60% at 50% 40%, #000 30%, transparent 75%)',
        }}
      />

      {/* Floating themed icons */}
      {FLOATING.map(({ Icon, top, left, delay, duration, hideXs }, i) => (
        <Box
          key={i}
          component={motion.div}
          initial={{ opacity: 0 }}
          animate={{ opacity: [0.25, 0.7, 0.25], y: [0, -20, 0] }}
          transition={{ duration, delay, repeat: Infinity, ease: 'easeInOut' }}
          sx={{
            position: 'absolute',
            top,
            left,
            display: hideXs ? { xs: 'none', md: 'flex' } : 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 50,
            height: 50,
            borderRadius: '15px',
            background: 'rgba(249, 115, 22, 0.1)',
            border: '1px solid rgba(249, 115, 22, 0.25)',
            backdropFilter: 'blur(8px)',
            boxShadow: '0 8px 24px rgba(249, 115, 22, 0.15)',
          }}
        >
          <Icon sx={{ color: '#FB923C', fontSize: '1.4rem' }} />
        </Box>
      ))}
    </Box>
  );
}
