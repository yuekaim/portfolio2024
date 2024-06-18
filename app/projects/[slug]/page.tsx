import { client } from '@/utils/sanity/client';
import { Project } from '@/app/ts/interfaces';
import { notFound } from 'next/navigation';
import React from 'react';
import ProjectImages from '@/app/components/ProjectImages';
import MatterCanvas from '@/app/components/DropShapes/page';

export async function generateStaticParams() {
  const query = `*[_type == "project"]{ "slug": slug.current }`;
  const projects = await client.fetch<{ slug: string }[]>(query);

  return projects.map((project) => ({
    slug: project.slug,
  }));
}

async function fetchProject(slug: string): Promise<Project | null> {
  const query = `*[_type == "project" && slug.current == $slug][0]`;
  return client.fetch<Project | null>(query, { slug });
}

export default async function ProjectPage({ params }: { params: { slug: string } }) {
  const project = await fetchProject(params.slug);

  if (!project) {
    notFound();
  }

  return (
    <div className="project-container">
      {/* <div>test</div> */}
      {/* <div className='fixed bottom-0 w-full z-10'>
        <h1 className="text-3xl font-bold border-t-2 border-black px-10 py-5 sm:w-[50vw] fixed bottom-0 w-full z-10">{project.title}</h1>
        <ul className="flex grow ml-3">
          {project.categories?.map((categoryId) => (
            <li key={categoryId._id} style={{ color: categoryId.color.hex }}>
              <div className="circle" style={{ backgroundColor: categoryId.color.hex }}></div>
              {getCategoryTitle(categoryId._ref)}
            </li>
          ))}
        </ul>
      </div> */}
      <p className="p-10 sm:w-[40vw]">{project.description}</p>
      <ProjectImages images={project.images} title={project.title}/>
      {/* {project.url && (
        <a href={project.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
          Visit Project
        </a>
      )} */}

    <MatterCanvas />
    </div>
  );
}
