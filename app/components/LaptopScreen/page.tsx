// components/LaptopScreen/page.tsx
'use client';

import React from 'react';
import { Project } from '../../ts/interfaces';
import imageUrlBuilder from '@sanity/image-url';
import { client } from '@/utils/sanity/client';
import { motion } from 'framer-motion';
import Image from 'next/image';

interface LaptopScreenProps {
  post: Project | null; // Allow post to be null
}

const builder = imageUrlBuilder(client);

function urlFor(source: any) {
  return builder.image(source);
}

const LaptopScreen: React.FC<LaptopScreenProps> = ({ post }) => {
  if (!post) {
    return <div>No project data available.</div>;
  }

  if (post.url) {
    return <iframe src={post.url} className='w-full h-full'></iframe>;
  }

  const coverImage = post.images && post.images.length > 0 ? post.images[0] : null;

  return (
    <motion.div>
      {coverImage && (
        <Image
          src={urlFor(coverImage.asset).url()}
          alt={coverImage.altText || post.title}
          width={2004}
          height={1296}
          className="cover-image"
        />
      )}
    </motion.div>
  );
};

export default LaptopScreen;
