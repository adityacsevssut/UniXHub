
import React, { useEffect, useRef } from 'react';

const Background3D = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    // Settings
    let width = canvas.offsetWidth;
    let height = canvas.offsetHeight;
    let cx = width / 2;
    let cy = height / 2;

    const resize = () => {
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
      cx = width / 2;
      cy = height / 2;
    };
    window.addEventListener('resize', resize);
    resize();

    // 3D Engine
    const shapes = [];
    const numShapes = 10;

    class Shape3D {
      constructor() {
        this.init();
      }

      init() {
        // Spawn in a "donut" area to avoid center text
        const minRadius = Math.min(width, height) * 0.35; // Exclusion zone
        const maxRadius = Math.max(width, height) * 0.8;
        const angle = Math.random() * Math.PI * 2;
        const radius = minRadius + Math.random() * (maxRadius - minRadius);

        this.x = Math.cos(angle) * radius;
        this.y = Math.sin(angle) * radius;
        this.z = Math.random() * 800 + 200; // Depth

        this.size = Math.random() * 40 + 20;
        this.type = Math.random() > 0.5 ? 'cube' : 'tetra';

        // Rotation
        this.rx = Math.random() * Math.PI * 2;
        this.ry = Math.random() * Math.PI * 2;

        // Velocity - ensure they don't rush to center immediately
        // Tangential-ish velocity looks nice
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = (Math.random() - 0.5) * 0.5;
        this.vz = (Math.random() - 0.5) * 1;
        this.vrx = (Math.random() - 0.5) * 0.02;
        this.vry = (Math.random() - 0.5) * 0.02;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;
        this.z += this.vz;
        this.rx += this.vrx;
        this.ry += this.vry;

        // Repel from center if too close
        const dist = Math.sqrt(this.x * this.x + this.y * this.y);
        const safeDist = Math.min(width, height) * 0.3;

        if (dist < safeDist) {
          // Push away
          const angle = Math.atan2(this.y, this.x);
          this.x = Math.cos(angle) * safeDist;
          this.y = Math.sin(angle) * safeDist;
        }

        // Reset / Wrap
        if (this.z < 100 || this.z > 1000) this.vz *= -1;
        if (Math.abs(this.x) > width) this.vx *= -1;
        if (Math.abs(this.y) > height) this.vy *= -1;
      }

      project(x, y, z) {
        const perspective = 600 / (600 + z);
        return {
          x: cx + x * perspective,
          y: cy + y * perspective,
          p: perspective
        };
      }

      rotate(x, y, z) {
        // Rotate Y
        let x1 = x * Math.cos(this.ry) - z * Math.sin(this.ry);
        let z1 = z * Math.cos(this.ry) + x * Math.sin(this.ry);

        // Rotate X
        let y1 = y * Math.cos(this.rx) - z1 * Math.sin(this.rx);
        let z2 = z1 * Math.cos(this.rx) + y * Math.sin(this.rx);

        return { x: x1, y: y1, z: z2 };
      }

      draw(ctx) {
        ctx.strokeStyle = `rgba(139, 92, 246, ${Math.min(0.3, 300 / this.z)})`; // Fade based on depth
        ctx.lineWidth = 1.5;
        ctx.beginPath();

        const vertices = this.type === 'cube' ? [
          { x: -1, y: -1, z: -1 }, { x: 1, y: -1, z: -1 }, { x: 1, y: 1, z: -1 }, { x: -1, y: 1, z: -1 }, // Front face
          { x: -1, y: -1, z: 1 }, { x: 1, y: -1, z: 1 }, { x: 1, y: 1, z: 1 }, { x: -1, y: 1, z: 1 }   // Back face
        ] : [
          // Tetrahedron
          { x: 1, y: 1, z: 1 }, { x: -1, y: -1, z: 1 }, { x: -1, y: 1, z: -1 }, { x: 1, y: -1, z: -1 }
        ];

        // Scale vertices
        const p = vertices.map(v => {
          const r = this.rotate(v.x * this.size, v.y * this.size, v.z * this.size);
          return this.project(this.x + r.x, this.y + r.y, this.z + r.z);
        });

        // Connect logic (Cube)
        if (this.type === 'cube') {
          const edges = [
            [0, 1], [1, 2], [2, 3], [3, 0], // Front
            [4, 5], [5, 6], [6, 7], [7, 4], // Back
            [0, 4], [1, 5], [2, 6], [3, 7]  // Sides
          ];
          edges.forEach(e => {
            ctx.moveTo(p[e[0]].x, p[e[0]].y);
            ctx.lineTo(p[e[1]].x, p[e[1]].y);
          });
        } else {
          // Tetrahedron fully connected
          for (let i = 0; i < p.length; i++) {
            for (let j = i + 1; j < p.length; j++) {
              ctx.moveTo(p[i].x, p[i].y);
              ctx.lineTo(p[j].x, p[j].y);
            }
          }
        }

        ctx.stroke();
      }
    }

    for (let i = 0; i < numShapes; i++) {
      shapes.push(new Shape3D());
    }

    let frameId;
    const render = () => {
      ctx.clearRect(0, 0, width, height);
      shapes.forEach(shape => {
        shape.update();
        shape.draw(ctx);
      });
      frameId = requestAnimationFrame(render);
    };
    render();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(frameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 0
      }}
    />
  );
};

export default Background3D;
