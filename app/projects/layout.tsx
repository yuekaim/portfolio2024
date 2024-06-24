'use client'

import React from "react";
import { useState, useEffect, Suspense } from "react";
import { Project, CategoryProp } from "../ts/interfaces";
import { client } from "@/utils/sanity/client";
import { motion, AnimatePresence } from "framer-motion";
import Laptop from "../components/laptop";
import Link from "next/link";
import { div } from "three/examples/jsm/nodes/Nodes";
import Categories from "../components/navigation/categories";
import { useCategories } from "../components/CategoriesContext";

interface RootLayoutProps {
    children: React.ReactNode;
}

export const PageContext = React.createContext('');

const Projects: React.FC<RootLayoutProps> = ({ children }) => { 
// const Projects: React.FC = () => {
  const [posts, setPosts] = useState<Project[]>([]);
  const [categories, setCategories] = useState<CategoryProp[]>([]);
  const [expandedPostId, setExpandedPostId] = useState<string | null>(null);
  const { selectedCategories } = useCategories();
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
    <div className="fixed overflow-hidden top-0 right-0 z-50">
      <Categories />
    </div>
    <div className="project-list container md:w-1/3 border-t-2 border-black sm:px-0 z-10">
      <ul>
      {posts.map((post) => {
            const isVisible = selectedCategories?.length > 0 && post.categories?.some(category => selectedCategories.includes(category._ref));
            return (
              <motion.li className={`project p-0 m-0`}
                key={post._id}
                initial={{ opacity: 0, height: 0}}
                animate={{ opacity: isVisible? 1 : 0, height: isVisible? 'auto' : 0 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                style={{overflow: 'hidden'}}
              >
                <div className="project-info flex py-[2rem]" onClick={() => handleExpand(post._id)}>
                  <h2 className="text-[1rem]">{post.title}</h2>
                  <ul className="flex grow ml-3">
                    {post.categories?.map((category) => (
                      <li key={category._ref} style={{ color: getCategoryColor(category._ref) }}>
                        <div className="circle" style={{ backgroundColor: getCategoryColor(category._ref) }}></div>
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
                      style={{
                        transform: `rotate(${expandedPostId === post._id ? 45 : 0}deg)`, 
                        transformOrigin: 'center',
                        transitionDuration: '0.5s',
                      }}
                    />
                  </svg>
                </div>
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
                    <div className="mb-5 text-[2rem]" onClick={() => { setExpandedPostId(null); }}>
                      <Link href={'/projects/'+post.slug.current}>
                        view more
                      </Link>
                    </div>
                    <Suspense fallback={null}>
                      <motion.div 
                        className="laptop-canvas w-full sm:top-0 h-[30svh] sm:h-0 mx-0 px-0 right-0 over sm:invisible"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.5, ease: 'easeOut' }}
                      >
                        <Laptop postId={expandedPostId} />
                      </motion.div>
                      {/* <motion.div 
                        className="fixed laptop-canvas w-full sm:w-[60vw] sm:h-full sm:top-0 h-[50vh] mx-0 px-0 right-0 over invisible sm:visible z-[50]"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.5, ease: 'easeOut' }}
                      >
                        <Laptop postId={expandedPostId} />
                      </motion.div> */}
                    </Suspense>
                  </motion.div>
                )}
                </AnimatePresence>
              </motion.li>
            );
          })}
      </ul>
    </div>
    <AnimatePresence>
    {expandedPostId && (
      <Suspense fallback={null}>
        <motion.div 
            className="fixed laptop-canvas w-full sm:w-[60vw] sm:h-full sm:top-0 h-[50vh] mx-0 px-0 right-0 invisible sm:visible z-[60]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
        >
              <Laptop postId={expandedPostId} />
        </motion.div>
      </Suspense>
    )}
    </AnimatePresence>
    <AnimatePresence>
    <motion.div className="children-wrapper sm:w-2/3 h-[100vh] fixed top-0 right-0 overflow-scroll sm:z-50 z-[80]"
    initial={{ height: 0 }}
    animate={{ height: 'auto' }}
    exit={{ height: 0 }}
    transition={{ duration: 0.5, ease: 'easeOut' }}>
      {children}
    </motion.div>
    </AnimatePresence> 
  </>
  );
};

export default Projects;