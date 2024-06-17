import { client } from '@/utils/sanity/client';
import { Project } from '../ts/interfaces';
import { notFound } from 'next/navigation';
import React from 'react';
import ProjectImages from '../components/ProjectImages';
import MatterCanvas from '../components/DropShapes/page';

export async function generateStaticParams() {
  const query = `*[_type == "project"]{ "slug": slug.current }`;
  const projects = await client.fetch<{ slug: string }[]>(query);

  return projects.map((project) => ({
    slug: project.slug,
  }));
}

async function fetchProject(slug: string): Promise<Project | null> {
  const query = `*[_type == "project" && slug.current == $slug][0]{
    _id,
    title,
    description,
    url,
    categories[]->{title, _id, color},
    images[]{
      _type,
      asset->{
        _ref,
        url
      },
      altText
    }
  }`;

  return client.fetch<Project | null>(query, { slug });
}

export default async function ProjectPage({ params }: { params: { slug: string } }) {
  const project = await fetchProject(params.slug);

  if (!project) {
    notFound();
  }

  return (
    <div className="project-container">
      <div className='fixed bottom-0 w-full z-10'>
        <h1 className="text-3xl font-bold border-t-2 border-black px-10 py-5 sm:w-[50vw] fixed bottom-0 w-full z-10">{project.title}</h1>
        <ul className="flex grow ml-3">
          {project.categories?.map((categoryId) => (
            <li key={categoryId._id} style={{ color: categoryId.color.hex }}>
              <div className="circle" style={{ backgroundColor: categoryId.color.hex }}></div>
              {/* {getCategoryTitle(categoryId._ref)} */}
            </li>
          ))}
        </ul>
      </div>
      <ProjectImages images={project.images} title={project.title}/>
      <p className="p-10 sm:w-[40vw] mb-20">{project.description}</p>
      {project.url && (
        <a href={project.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
          Visit Project
        </a>
      )}

    <MatterCanvas />
    </div>
  );
}
