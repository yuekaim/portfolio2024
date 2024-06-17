"use client";

import React, { useEffect, useRef } from 'react';
import Image from 'next/image';
import { Project } from '../ts/interfaces';
import { motion, AnimatePresence } from 'framer-motion';

interface ProjectImagesProps {
  images: Project['images'];
  title: string;
}

const ProjectImages: React.FC<ProjectImagesProps> = ({ images, title }) => {
    const wrapperRef = useRef<HTMLDivElement>(null);
    const sparklerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      const wrapper = wrapperRef.current;
      const sparkler = sparklerRef.current;

      let scrollPosition = 0;
      let targetPosition = 0;
      const scrollSpeed = 0.1;
  
      const clamp = (value: number, min: number, max: number) => {
        return Math.min(Math.max(value, min), max);
      };
  
      const smoothScroll = () => {
        if (!wrapper) return;

        // Interpolate the scroll position for a smooth effect
        scrollPosition += (targetPosition - scrollPosition) * scrollSpeed;
        wrapper.scrollTop = scrollPosition;

        const scrollTop = wrapper.scrollTop;
        const scrollHeight = wrapper.scrollHeight;
        const clientHeight = wrapper.clientHeight;

        // Calculate the scroll percentage and adjust the sparkler height
        const scrollPercent = scrollTop / (scrollHeight - clientHeight);
        if (sparkler) {
          sparkler.style.height = `${80 - scrollPercent * 60}%`;
        }

        requestAnimationFrame(smoothScroll);
      };
  
      const handleScroll = (event: WheelEvent) => {
        if (!wrapper || !sparkler) return;

        event.preventDefault();
        targetPosition += event.deltaY;
        targetPosition = clamp(targetPosition, 0, wrapper.scrollHeight - wrapper.clientHeight);
      };
  
      wrapper?.addEventListener('wheel', handleScroll, { passive: false });
      requestAnimationFrame(smoothScroll);
  
      return () => {
        wrapper?.removeEventListener('wheel', handleScroll);
      };
    }, []);

  return (
    <AnimatePresence>
        <div
            className={'imagesWrapper sm:fixed sm:w-[50vw] sm:h-[100vh] sm:right-0 sm:top-0 overflow-scroll sm:border-x-2 sm:border-y-0 border-y-2 border-black'}
            ref={wrapperRef}
            >
            <motion.div className="h-full" 
            initial={{ y: 1000 }}
            animate={{ y: 0 }}
            exit={{ y: -1000 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}>
                {images && images.length > 0 && (
                images.map((image, index) => (
                    <Image
                    key={index}
                    src={image.asset.url}
                    alt={image.altText || title}
                    width={800} // Provide a default width
                    height={450} // Provide a default height
                    loading="lazy"
                    className="sm:w-full border-b-2 border-black"
                    />
                ))
                )}
            </motion.div>
            <div id="sparkler" ref={sparklerRef} className=""></div>
            <div id="sparkler-stem"></div>
        </div>
    </AnimatePresence>
  );
};

export default ProjectImages;
