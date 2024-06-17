'use client'

import React from "react";
import { useState, useEffect, Suspense } from "react";
import { Project, CategoryProp } from "../ts/interfaces";
import { client } from "@/utils/sanity/client";
import { motion, AnimatePresence } from "framer-motion";
import Laptop from "../components/laptop";
import Link from "next/link";

const Projects: React.FC = () => {
  const [posts, setPosts] = useState<Project[]>([]);
  const [categories, setCategories] = useState<CategoryProp[]>([]);
  const [expandedPostId, setExpandedPostId] = useState<string | null>(null);
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
    <div className="project-list container px-4 sm:w-1/2">
      <ul>
        {posts.map((post) => (
          <motion.li className="project"
          key={post._id}
          onClick={() => handleExpand(post._id)}
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          >
            <div className="project-info flex pb-[2rem]">
              <h2 className="text-[2rem]">{post.title}</h2>
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
                <div className="mb-5 text-[2rem]">
                  <Link href={post.slug.current}>
                  ⮫ view more
                  </Link>
                </div>
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
              </Suspense>
              </motion.div>
            )}
            </AnimatePresence>
          </motion.li>
        ))}
      </ul>
      <Suspense fallback={null}>
        <motion.div 
            className="fixed laptop-canvas w-full sm:w-[60vw] sm:h-full sm:top-0 h-[50vh] mx-0 px-0 right-0 over invisible sm:visible"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          <Laptop postId={expandedPostId} />
        </motion.div>
      </Suspense>
    </div>
  );
};

export default Projects;