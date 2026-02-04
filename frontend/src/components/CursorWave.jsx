
import React, { useEffect, useRef } from 'react';

const CursorWave = () => {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width = canvas.offsetWidth;
    let height = canvas.offsetHeight;

    // Resize handling
    const resize = () => {
      if (canvas) {
        width = canvas.width = canvas.offsetWidth;
        height = canvas.height = canvas.offsetHeight;
      }
    };
    window.addEventListener('resize', resize);
    resize();

    // Wave/Trail State
    let points = [];
    const maxPoints = 50; // Length of tail
    const friction = 0.5;

    // Track mouse
    const mouse = { x: 0, y: 0, active: false };

    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // Check if inside canvas visible area
      if (x >= 0 && x <= width && y >= 0 && y <= height) {
        mouse.x = x;
        mouse.y = y;
        mouse.active = true;
      } else {
        mouse.active = false;
      }
    };

    // Add global listener to capture moves even over other elements
    window.addEventListener('mousemove', handleMouseMove);

    // Animation Loop
    let animationFrameId;
    const render = () => {
      // Clear canvas with trace effect or full clear
      ctx.clearRect(0, 0, width, height);

      // Add new point if active, otherwise effectively stop adding (or add last point to decay?)
      // To make it disjointed when mouse leaves, we might need separate paths.
      // For simplicity: just add point if active.
      if (mouse.active) {
        points.push({ x: mouse.x, y: mouse.y, age: 0 });
      }

      // Age points
      points.forEach(p => p.age += 1);
      // Remove old points
      points = points.filter(p => p.age < maxPoints);

      if (points.length > 1) {
        ctx.beginPath();
        // Move to first point
        ctx.moveTo(points[0].x, points[0].y);

        // Draw smooth curve through points
        for (let i = 1; i < points.length - 1; i++) {
          const p1 = points[i];
          const p2 = points[i + 1];
          const xc = (p1.x + p2.x) / 2;
          const yc = (p1.y + p2.y) / 2;
          ctx.quadraticCurveTo(p1.x, p1.y, xc, yc);
        }
        // Connect to last point
        if (points.length > 2) {
          const last = points[points.length - 1];
          ctx.lineTo(last.x, last.y);
        }

        // Style
        // Create gradient
        const gradient = ctx.createLinearGradient(
          points[0].x, points[0].y,
          points[points.length - 1].x, points[points.length - 1].y
        );
        gradient.addColorStop(0, 'rgba(139, 92, 246, 0)'); // Faded tail
        gradient.addColorStop(1, 'rgba(139, 92, 246, 0.8)'); // Bright head

        ctx.strokeStyle = gradient;
        ctx.lineWidth = 4;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        // Add purple shadow/glow
        ctx.shadowBlur = 10;
        ctx.shadowColor = 'rgba(139, 92, 246, 0.5)';

        ctx.stroke();
        ctx.shadowBlur = 0; // Reset
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div ref={containerRef} style={{
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      pointerEvents: 'none',
      zIndex: 0,
      overflow: 'hidden'
    }}>
      <canvas ref={canvasRef} style={{ width: '100%', height: '100%' }} />
    </div>
  );
};

export default CursorWave;
