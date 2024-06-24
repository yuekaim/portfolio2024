import { client } from '@/utils/sanity/client';
import { Project } from '@/app/ts/interfaces';
import { notFound } from 'next/navigation';
import React from 'react';
import ProjectImages from '@/app/components/ProjectImages';
import MatterCanvas from '@/app/components/DropShapes/page';
import PortableTextComponent from '@/app/components/PortableText';

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
    <div className="project-container pb-5 sm:pb-20 sm:mt-20 sm:border-t-2 sm:border-l-2 border-black overflow-scroll h-full">
      <a href="./"><div className='project-back visible sm:invisible w-full border-t-2 border-black px-10 py-4 fixed bottom-0 text-center'>back</div></a>
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
      <MatterCanvas />
      <p className="p-10 sm:w-[40vw]">{project.description}</p>
      
      {project.url && (
        <div className='px-10'>
        <a href={project.url} target="_blank" rel="noopener noreferrer" className="text-black underline">
          {project.url}
        </a>
        </div>
      )}

      {project.content && (
        <>
        <div className='container px-10 sm:w-[40vw] py-12'>
        {/* {project.content.map((block) => (
            <p key={block._key}
            >{block.children[0].text}</p>
          ))} */}
          <PortableTextComponent value={project.content}/>
        </div>
        </>
      )}

      <ProjectImages images={project.images} title={project.title}/>

    </div>
  );
}
