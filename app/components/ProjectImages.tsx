"use client";

import React, { useEffect, useRef } from 'react';
import Image from 'next/image';
import { Project } from '../ts/interfaces';
import { motion, AnimatePresence } from 'framer-motion';
import imageUrlBuilder from '@sanity/image-url';
import { client } from '@/utils/sanity/client';

const builder = imageUrlBuilder(client);

function urlFor(source: any) {
  return builder.image(source);
}

interface ProjectImagesProps {
  images: Project['images'];
  title: string;
}

const ProjectImages: React.FC<ProjectImagesProps> = ({ images, title }) => {
  return (
    <AnimatePresence>
        <div
            // className={'imagesWrapper sm:fixed sm:w-100 sm:h-[100vh] sm:right-0 sm:top-0 overflow-scroll sm:border-x-2 sm:border-y-0 border-y-2 border-black'}
            className={'imagesWrapper overflow-scroll'}
            // ref={wrapperRef}
            >
            <motion.div className="h-full" 
            initial={{ y: 1000 }}
            animate={{ y: 0 }}
            exit={{ y: 1000 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}>
                {images && images.length > 0 && (
                images.map((image, index) => (
                    <Image
                    key={index}
                    src={urlFor(image.asset).url()}
                    alt={image.altText || title}
                    width={800} // Provide a default width
                    height={450} // Provide a default height
                    loading="lazy"
                    className="border-2 border-black rounded-lg m-8"
                    />
                ))
                )}
            </motion.div>
        </div>
    </AnimatePresence>
  );
};

export default ProjectImages;
