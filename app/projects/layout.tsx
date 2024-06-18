'use client'

import React from "react";
import { useState, useEffect, Suspense } from "react";
import { Project, CategoryProp } from "../ts/interfaces";
import { client } from "@/utils/sanity/client";
import { motion, AnimatePresence } from "framer-motion";
import Laptop from "../components/laptop";
import Link from "next/link";
import { div } from "three/examples/jsm/nodes/Nodes";

interface RootLayoutProps {
    children: React.ReactNode;
}

export const PageContext = React.createContext('');

const Projects: React.FC<RootLayoutProps> = ({ children }) => { 
// const Projects: React.FC = () => {
  const [posts, setPosts] = useState<Project[]>([]);
  const [categories, setCategories] = useState<CategoryProp[]>([]);
  const [expandedPostId, setExpandedPostId] = useState<string | null>(null);
  const [showing, setShowing] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const postQuery = `*[_type == "project"]`;
        const categoryQuery = `*[_type == "category"]`;
        const fetchedPosts = await client.fetch<Project[]>(postQuery);
        const fetchedCategories = await client.fetch<CategoryProp[]>(categoryQuery);
        setPosts(fetchedPosts);
        setCategories(fetchedCategories);
      } catch (err) {
        console.error('Failed to fetch posts:', err);
        setError('Failed to fetch posts');
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const handleExpand = (postId: string) => {
    setExpandedPostId(expandedPostId === postId ? null : postId);
    // setShowing(false);
  };

  const getCategoryTitle = (categoryId: string) => {
    const category = categories.find((cat) => cat._id === categoryId);
    return category ? category.title : '';
  };

  const getCategoryColor = (categoryId: string) => {
    const category = categories.find((cat) => cat._id === categoryId);
    return category ? category.color.hex : '';
  };

  if (loading) {
    return <p></p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <>
    <div className="project-list container md:w-1/3 md:border-t-2 border-black sm:px-0 z-40">
      <ul>
        {posts.map((post) => (
          <motion.li className="project p-0 m-0"
          key={post._id}
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          >
            <div className="project-info flex py-[2rem]" onClick={() => handleExpand(post._id)}>
              <h2 className="text-[1rem]">{post.title}</h2>
              <ul className="flex grow ml-3">
              {post.categories?.map((categoryId) => (
                  <li key={categoryId._id} style={{ color: getCategoryColor(categoryId._ref) }}>
                    <div className="circle" style={{ backgroundColor: getCategoryColor(categoryId._ref) }}></div>
                    {/* {getCategoryTitle(categoryId._ref)} */}
                  </li>
                ))}
              </ul>
              {/* Plus sign icon */}
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                <path
                  d="M12 2v20m-10-10h20"
                  stroke="currentColor"
                  strokeWidth="2"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{transform: `rotate(${(expandedPostId === post._id)?45:0}deg)`, 
                  transformOrigin: 'center',
                  transitionDuration: '0.5',
                }}
                />
              </svg>
              </div>
            {/* Show blurb if expanded */}
            <AnimatePresence>
            {expandedPostId === post._id && (
              <motion.div
                initial={{ height: 0, opacity: 1 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 1 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                style={{ overflow: 'hidden' }}
              >
                <p className="pb-[2rem]">{post.description}</p>
                <div className="mb-5 text-[2rem]" onClick={() => {setShowing(true); setExpandedPostId(null);}}>
                  <Link href={'/projects/'+post.slug.current}>
                  view more
                  </Link>
                  {/* view more */}
                </div>
                {/* <PageContext.Provider value={expandedPostId}>
                    {children}
                </PageContext.Provider> */}
                <Suspense fallback={null}>
                <motion.div 
                    className="laptop-canvas w-full sm:top-0 h-[30vh] sm:h-0 mx-0 px-0 right-0 over sm:invisible"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                >
                  <Laptop postId={expandedPostId}/>
                </motion.div>
                <motion.div 
                    className="fixed laptop-canvas w-full sm:w-[60vw] sm:h-full sm:top-0 h-[50vh] mx-0 px-0 right-0 over invisible sm:visible z-10"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                >
                  <Laptop postId={expandedPostId} />
                </motion.div>
              </Suspense>
              
              </motion.div>
            )}
            </AnimatePresence>
          </motion.li>
        ))}
      </ul>
      <Suspense fallback={null}>
        {/* <motion.div 
            className="fixed laptop-canvas w-full sm:w-[60vw] sm:h-full sm:top-0 h-[50vh] mx-0 px-0 right-0 over invisible sm:visible"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          <Laptop postId='{expandedPostId}' />
        </motion.div> */}
      </Suspense>
    </div>
    <div className="children-wrapper sm:w-2/3 h-[100vh] fixed top-0 right-0 overflow-scroll">
      {children}
    </div>
  </>
  );
};

export default Projects;