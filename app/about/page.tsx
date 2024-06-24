'use client'

import React, { useEffect, useState } from 'react';
import { client } from '@/utils/sanity/client';
import { About as AboutType, Project } from '@/app/ts/interfaces';
import { motion, AnimatePresence } from 'framer-motion';
import MatterCanvas from '../components/DropShapes/page';
import PortableTextComponent from '../components/PortableText';
import imageUrlBuilder from '@sanity/image-url';
import Image from 'next/image';

const builder = imageUrlBuilder(client);

function urlFor(source: any) {
  return builder.image(source);
}

const About: React.FC = () => {
  const [about, setAbout] = useState<AboutType | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAbout = async () => {
      try {
        const query = `*[_type == "about"][0]`;    
        const fetchedAbout = await client.fetch<AboutType>(query);
        setAbout(fetchedAbout);
      } catch (err) {
        console.error('Failed to fetch about:', err);
        setError('Failed to fetch about');
      } finally {
        setLoading(false);
      }
    };

    fetchAbout();
  }, []);

  if (loading) {
    return <p></p>;
  }

  if (error) {
    return <p>{error}</p>;
  }
  
  return (
    <AnimatePresence>
      <div className='flex'>
        <motion.div
          initial={{ height: 0 }}
          animate={{ height: 'auto' }}
          exit={{ height: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          style={{ overflow: 'hidden' }}
          className='about mx-4 px-[30px] sm:w-[50vw] sm:text-[1rem] text-2xl'
        >
        {about && (
          <>
            <PortableTextComponent value={about.about}/>
            {/* {about.about.map((block) => (
              <p key={block._key}
              className='container px-4 sm:w-1/2'
              >{block.children[0].text}</p>
            ))} */}
          </>
        )}
        </motion.div>
      </div>
      <MatterCanvas />
    </AnimatePresence>
  );
};

export default About;