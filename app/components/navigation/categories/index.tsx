'use client'

import React, { use } from 'react'
import Link from 'next/link';
import { CategoryProp } from '@/app/ts/interfaces';
import { useState, useEffect, useContext } from 'react';
import { client } from '@/utils/sanity/client';
import { useCategories } from '@/app/components/CategoriesContext';

// interface CategoriesProps {
//     isOpen: boolean;
//     toggle: () => void;
// }

// export const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

const Categories: React.FC = ({}) => {
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
    <div>
        <p>{notice}</p>
        <ul className="categories-wrapper sm:fixed overflow-hidden justify-right right-4 top-4 z-50 flex flex-row flex-wrap sm:w-20 w-100">
        {categories.map((category) => (
          <li
          key={category._id}
          className={`px-2 my-2 mx-2 sm:mx-0 rounded-xl flex cursor-pointer ${selectedCategories.includes(category._id) ? 'selected' : ''}`}
          onClick={() => toggleCategory(category._id)}
          >
            <div className='circle mr-2' style={{backgroundColor: category.color.hex}}></div>
            <div>{category.title}</div>
          </li>
        ))}
        </ul>
    </div>
    );
};

export default Categories;
