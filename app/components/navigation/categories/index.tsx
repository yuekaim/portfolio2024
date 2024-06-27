'use client'

import React, { use } from 'react'
import Link from 'next/link';
import { CategoryProp } from '@/app/ts/interfaces';
import { useState, useEffect, useContext } from 'react';
import { client } from '@/utils/sanity/client';
import { useCategories } from '@/app/components/CategoriesContext';
import { motion, AnimatePresence } from 'framer-motion';

const Categories: React.FC = ({}) => {
    const [isOpen, setIsOpen] = useState(true);
    const toggle = () => {
      setIsOpen(!isOpen);
    };

    const [categories, setCategories] = useState<CategoryProp[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const { selectedCategories, setSelectedCategories } = useCategories();
    var notice = '';

    useEffect(() => {
        const fetchCategories = async () => {
          try {
            const query = `*[_type == "category"]`;
            const fetchedCategories = await client.fetch<CategoryProp[]>(query);
            setCategories(fetchedCategories);
            setSelectedCategories(fetchedCategories.map(category => category._id));
          } catch (err) {
            console.error('Failed to fetch categories:', err);
            setError('Failed to fetch categories');
          } finally {
            setLoading(false);
          }
        };
    
        fetchCategories();
    }, []);
  
    const toggleCategory = (categoryId: string) => {
      setSelectedCategories(prevSelected =>
        prevSelected.includes(categoryId)
          ? prevSelected.filter(id => id !== categoryId)
          : [...prevSelected, categoryId]
      );
    };

    if (loading) {
        notice = "";
      }
    
      if (error) {
        notice = `${error}`;
      }

    return (
    <AnimatePresence>
    {/* <div className='categories-wrapper absolute sm:fixed overflow-hidden justify-right right-4 top-4 flex flex-row-reverse flex-wrap sm:w-100 w-100 justify-center z-[60]'> */}
    <div className='categories-wrapper absolute sm:fixed overflow-hidden right-4 bottom-4 flex align-bottom flex-col-reverse flex-wrap sm:w-100 w-100 justify-center z-[60]'>
        <div onClick={toggle} className='button w-20 h-20 rounded-full border-black border-2'
        style={{
          transitionDuration: '0.5s',
          transform: `${isOpen ? 'rotate(0deg)' : 'rotate(180deg)'}`, 
          transformOrigin: 'center'
        }}
          >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" className='mt-6 h-10 top-10'
        style={{
          transform: `scale(2)`, 
        }}>
          <path d="M15.293 3.293 6.586 12l8.707 8.707 1.414-1.414L9.414 12l7.293-7.293-1.414-1.414z"/>
        </svg>
        </div>
        <p>{notice}</p>
        <motion.div
        initial= {{ x: 200 }}
        animate = {{ x : isOpen? 0 : 200}}
        transition={{ duration: 0.3 }}
        style={{ overflow: 'hidden' }}
        className='w-full'>
          <ul>
            {categories.map((category) => (
              <li
              key={category._id}
              className={`px-2 my-2 mx-2 sm:mx-0 sm:px-4 w-full rounded-xl flex cursor-pointer ${selectedCategories.includes(category._id) ? 'selected' : ''}`}
              onClick={() => toggleCategory(category._id)}
              >
                <div className='circle mr-2' style={{backgroundColor: category.color.hex}}></div>
                <div>{category.title}</div>
              </li>
          ))}
          </ul>
        </motion.div>
        
    </div>
    </AnimatePresence>
    );
};

export default Categories;
