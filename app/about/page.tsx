'use client'

import React, { useEffect, useState } from 'react';
import { client } from '@/utils/sanity/client';
import { About as AboutType } from '@/app/ts/interfaces';
import { motion, AnimatePresence } from 'framer-motion';
import MatterCanvas from '../components/DropShapes/page';
import PortableTextComponent from '../components/PortableText';

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
      <motion.div
        initial={{ x: -500 }}
        animate={{ x: 0 }}
        exit={{ x: -500 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        style={{ overflow: 'hidden' }}
        className='about mx-4 px-[30px] sm:w-[50vw] sm:text-[2rem] text-2xl'
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
    <MatterCanvas />
    </AnimatePresence>
  );
};

export default About;