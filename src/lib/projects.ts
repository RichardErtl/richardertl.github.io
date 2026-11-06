import { getCollection, type CollectionEntry } from 'astro:content';

export type Project = CollectionEntry<'projects'>;

export const projectStatusLabels: Record<Project['data']['status'], string> = {
  private: 'Private system',
  'open-source': 'Open source',
};

export const projectHref = (project: Project) => `/projects/${project.id}/`;

export async function getProjects(): Promise<Project[]> {
  const projects = await getCollection('projects');
  return projects.sort((a, b) => a.data.order - b.data.order);
}
