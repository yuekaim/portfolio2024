'use client'

import About from "./about/page";
// import Projects from "./projects/page";
import Laptop from "./components/laptop";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useEffect, useState } from "react";
import { client } from "@/utils/sanity/client";
import { About as AboutType, CategoryProp, Project } from "./ts/interfaces";
import imageUrlBuilder from '@sanity/image-url';
import MatterCanvas from "./components/DropShapes/page";

const builder = imageUrlBuilder(client);

function urlFor(source: any) {
  return builder.image(source);
}
export default function Home() {
  const [about, setAbout] = useState<AboutType | null>(null);
  const [posts, setPosts] = useState<Project[]>([]);
  const [catogories, setCategories] = useState<CategoryProp[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAbout = async () => {
      try {
        const query = `*[_type == "about"][0]`;
        const postQuery = `*[_type == "project"]`;
        const catQuery = `*[_type == "category"]`;
        const fetchedCat = await client.fetch<CategoryProp[]>(catQuery);
        const fetchedPosts = await client.fetch<Project[]>(postQuery);
        const fetchedAbout = await client.fetch<AboutType>(query);
        setAbout(fetchedAbout);
        setPosts(fetchedPosts);
        setCategories(fetchedCat);
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

  const getHighlight = (HighlightID: string) => {
    const highlight = posts.find((post) => post._id === HighlightID);
    return highlight;
  };

  const getCategory = (catID: string) => {
    const category = catogories.find((cat) => cat._id === catID);
    return category;
  };

  return (
    <AnimatePresence>
      <div className='flex'>
        <motion.div className="highlights">
          {about?.highlights && (
            about.highlights.map((hl) => {
            const highlight = getHighlight(hl._ref);
            return (
              <a href={`projects/${highlight?.slug?.current}`} key={highlight?._ref}>
                <div className="highlight">
                  <Image 
                  src={urlFor(highlight?.images[0].asset._ref).url()}
                  alt={highlight?.images[0].caption? highlight?.images[0].caption : ""}
                  width={300}
                  height={300}/>
                  <div className="highlight-info w-[100%]">
                    <div className="highlight-title">{highlight?.title.toUpperCase()}</div>
                      {highlight?.categories && highlight.categories.map((cat) => {
                        return (
                          <div className="highlight-cat" key={cat._ref}>{getCategory(cat._ref)?.title}</div>
                        )
                      })}
                    </div>  
                  </div>
              </a>
            )})
          )}
        </motion.div>
      </div>
      <MatterCanvas />
      <motion.div className="w-[100vw] h-[100vh] fixed top-0 flex justify-center items-center pointer-events-none"
        initial={{ opacity: 0}}
        animate={{ opacity: 1}}
        exit={{ opacity: 0}}
        transition={{ duration: 1, ease: 'easeOut' }}
        style={{overflow: 'hidden'}}>
          <Image
          src='/logoold.PNG'
          alt="logo for homepage"
          width={2000}
          height={2000}
          objectFit="cover"
          />
        </motion.div>
    </AnimatePresence>
)}
