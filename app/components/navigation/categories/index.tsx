import React, { use } from 'react'
import Link from 'next/link';
import { CategoryProp } from '@/app/ts/interfaces';
import { useState, useEffect } from 'react';
import { client } from '@/utils/sanity/client';

interface CategoriesProps {
    isOpen: boolean;
    toggle: () => void;
}

const Categories: React.FC<CategoriesProps> = ({ isOpen, toggle }) => {
    const [categories, setCategories] = useState<CategoryProp[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    var notice = '';

    useEffect(() => {
        const fetchCategories = async () => {
          try {
            const query = `*[_type == "category"]`;
            const fetchedCategories = await client.fetch(query);
            setCategories(fetchedCategories);
          } catch (err) {
            console.error('Failed to fetch categories:', err);
            setError('Failed to fetch categories');
          } finally {
            setLoading(false);
          }
        };
    
        fetchCategories();
    }, []);

    if (loading) {
        notice = "";
      }
    
      if (error) {
        notice = `${error}`;
      }

    return (
    // <div
    //     className='categories-container fixed overflow-hidden justify-right grid right-4 z-10'
    //     style={{
    //     opacity: isOpen ? '1' : '0',
    //     top: isOpen ? '0' : '-100%',
    //     }}
    // >
    //     <button className="absolute right-0 p-5" onClick={toggle}>
    //     {/* Close icon */}
    //     <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24">
    //         <path
    //         fill="currentColor"
    //         d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41Z"
    //         />
    //     </svg>
    //     </button>
    //     <p>{notice}</p>
    //     <ul className="sidebar-nav text-center leading-relaxed">
    //     {categories.map((category) => (
    //         <li key={category._id} className='flex'>
    //         <div className='circle mr-2' style={{backgroundColor: category.color.hex}}></div>
    //         <a href={category.slug?.current}>{category.title}</a>
    //         </li>
    //     ))}
    //     </ul>
    // </div>
    <div>
        <p>{notice}</p>
        <ul className="fixed overflow-hidden justify-right right-4 top-4 z-10">
        {categories.map((category) => (
            <li key={category._id} className='flex'>
            <div className='circle mr-2' style={{backgroundColor: category.color.hex}}></div>
            <div>{category.title}</div>
            </li>
        ))}
        </ul>
    </div>
    );
};

export default Categories;
