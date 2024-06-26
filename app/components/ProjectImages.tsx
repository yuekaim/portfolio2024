"use client"

import React, { useEffect, useRef } from 'react';
import Image from 'next/image';
import { Project } from '../ts/interfaces';
import { motion, AnimatePresence } from 'framer-motion';
import imageUrlBuilder from '@sanity/image-url';
import { client } from '@/utils/sanity/client';
import { useState } from 'react';

const builder = imageUrlBuilder(client);

export function urlFor(source: any) {
  return builder.image(source);
}

interface ProjectImagesProps {
  images: Project['images'];
  title: string;
}

const ProjectImages: React.FC<ProjectImagesProps> = ({ images, title }) => {
  const [lightboxOpen, setLightboxOpen] = useState<boolean>(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const openLightbox = (imageUrl: string) => {
    setSelectedImage(imageUrl);
    setLightboxOpen(true);
  };

  const closeLightbox = () => {
    setSelectedImage(null);
    setLightboxOpen(false);
  };

  return (
    <AnimatePresence>
        <div
            className={'imagesWrapper overflow-scroll'}
            >
            <motion.div className="h-full" 
            initial={{ y: 1000 }}
            animate={{ y: 0 }}
            exit={{ y: 1000 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}>
                {images && images.length > 0 && (
                images.map((image, index) => {
                  // console.log('Image Asset:', image.asset);
                  // console.log('urlFor(image.asset).url(): ', urlFor(image.asset).url());
                  return(
                  <div key={'div'+index} onClick={() => openLightbox(urlFor(image.asset).url())} className="image-container">
                    <Image
                    key={index}
                    src={urlFor(image.asset).url()}
                    alt={image.altText || title}
                    width={800} // Provide a default width
                    height={450} // Provide a default height
                    loading="lazy"
                    className=" rounded-3xl m-8"
                    />
                    <p className='pl-10'>{image.caption}</p>
                  </div>
                )
              })
            )}
            </motion.div>
        </div>   
        {lightboxOpen && (
        <motion.div
          className="fixed top-0 left-0 w-full h-full flex justify-center items-center z-80 bg-[#ffffffaa] z-100"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          onClick={closeLightbox}
        >
          <div className="relative w-[80%] h-full">
            <Image
              src={selectedImage || ''}
              alt={title}
              layout="fill"
              objectFit="contain"
              loading="eager"
              className='drop-shadow-md'
            />
          </div>
        </motion.div>
      )}   
    </AnimatePresence>
  );
};

export default ProjectImages;
