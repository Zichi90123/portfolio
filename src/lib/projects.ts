import { getCollection, type CollectionEntry } from 'astro:content';
import type { Lang } from '../i18n';

type Entry = CollectionEntry<'projects'>;
type Translation = CollectionEntry<'projectsEn'>;

/**
 * A project in one language: metadata from the Italian file, title, summary and body from the
 * translation when there is one (`translated: false` = Italian text shown on an English page).
 */
export interface Project {
  id: string;
  data: Entry['data'];
  entry: Entry | Translation; // what to render for the body
  translated: boolean;
}

/** Published projects (drafts only in dev), sorted by `order` then title. */
export async function getProjects(lang: Lang = 'it'): Promise<Project[]> {
  const all = await getCollection('projects', ({ data }) => import.meta.env.DEV || !data.draft);
  const translations = lang === 'en' ? await getCollection('projectsEn') : [];
  return all
    .map((entry): Project => {
      const tr = translations.find((t) => t.id === entry.id);
      if (lang === 'it' || !tr) return { id: entry.id, data: entry.data, entry, translated: lang === 'it' };
      return {
        id: entry.id,
        data: {
          ...entry.data,
          title: tr.data.title ?? entry.data.title,
          summary: tr.data.summary,
          links: { ...entry.data.links, demo: tr.data.demo ?? entry.data.links.demo },
        },
        entry: tr,
        translated: true,
      };
    })
    .sort((a, b) => a.data.order - b.data.order || a.data.title.localeCompare(b.data.title));
}
