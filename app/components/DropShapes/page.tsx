'use client'

import React, { useEffect, useRef } from 'react';
import { Engine, Render, Runner, Bodies, Composite, World, Body } from 'matter-js';

const MatterCanvas: React.FC = () => {
  const sceneRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<Engine | null>(null);
  const renderRef = useRef<Render | null>(null);

  useEffect(() => {
    if (!sceneRef.current) return;

    const engine = Engine.create();
    const render = Render.create({
      element: sceneRef.current,
      engine: engine,
      options: {
        width: window.innerWidth,
        height: window.innerHeight,
        wireframes: false,
        background: 'transparent',
      },
    });
    engine.gravity.y = 0;

    const runner = Runner.create();
    Runner.run(runner, engine);
    Render.run(render);

    // Walls
    const ground = Bodies.rectangle(window.innerWidth / 2, window.innerHeight + 25, window.innerWidth, 50, { isStatic: true });
    Composite.add(engine.world, [ground]);

    // Store engine and render to refs
    engineRef.current = engine;
    renderRef.current = render;

    const handleClick = (event: MouseEvent) => {
      if (!engineRef.current) return;

      const vectors = [
        { x: 1, y: 1 },
        { x: 1.5, y: 0 },
        { x: 1.2, y: 0 },
        { x: 2, y: -1 },
        { x: 0.8, y: 1 },
      ];

      const randomVector = vectors[Math.floor(Math.random() * vectors.length)];

      // Example SVG eyeball URL
      const svgUrl = '/eyeball.svg';

      // Create an image object to preload the SVG
      const img = new Image();
      img.src = svgUrl;

      // Add event listener to ensure the image is loaded
      img.onload = () => {
        const body = Bodies.circle(event.clientX, event.clientY, 40, {
          render: {
            sprite: {
              texture: svgUrl,
              xScale: 40 / 344, // Adjust the scale as needed
              yScale: 40 / 344  // Adjust the scale as needed
            }
          }
        });

        const rotation = Math.floor(Math.random() * 180);
        Body.rotate(body, rotation);
        Body.applyForce(body, { x: body.position.x, y: body.position.y }, { x: randomVector.x * 0.01, y: -0.01 });
        if (engineRef.current) {
          Composite.add(engineRef.current.world, [body]);
        }
      };

      // Handle image load error
      img.onerror = () => {
        console.error('Error loading SVG image');
      };
    };

    window.addEventListener('click', handleClick);

    // Clean up on component unmount
    return () => {
      Render.stop(render);
      Runner.stop(runner);
      World.clear(engine.world, false);
      Engine.clear(engine);
      render.canvas.remove();
      render.textures = {};
      window.removeEventListener('click', handleClick);
    };
  }, []);

  return <div className="invisible sm:visible mattercanvas fixed top-0 left-0" ref={sceneRef} style={{ pointerEvents: 'none', width: '100%', height: '100vh' }} />;
};

export default MatterCanvas;
