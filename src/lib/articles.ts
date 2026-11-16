import { getCollection, type CollectionEntry } from 'astro:content';
import type { Lang } from '../i18n';

type Entry = CollectionEntry<'articles'>;
type Translation = CollectionEntry<'articlesEn'>;

/** An article in one language; `translated: false` = Italian text on an English page. */
export interface Article {
  id: string;
  data: Entry['data'];
  entry: Entry | Translation;
  translated: boolean;
  minutes: number;
}

/** Reading time at about 220 words a minute (code blocks included, rounded up). */
const readingMinutes = (body = '') => Math.max(1, Math.ceil(body.split(/\s+/).filter(Boolean).length / 220));

/** Published articles (drafts only in dev), newest first. */
export async function getArticles(lang: Lang = 'it'): Promise<Article[]> {
  const all = await getCollection('articles', ({ data }) => import.meta.env.DEV || !data.draft);
  const translations = lang === 'en' ? await getCollection('articlesEn') : [];
  return all
    .map((entry): Article => {
      const tr = translations.find((t) => t.id === entry.id);
      if (lang === 'it' || !tr) {
        return { id: entry.id, data: entry.data, entry, translated: lang === 'it', minutes: readingMinutes(entry.body) };
      }
      return {
        id: entry.id,
        data: { ...entry.data, title: tr.data.title, description: tr.data.description },
        entry: tr,
        translated: true,
        minutes: readingMinutes(tr.body),
      };
    })
    .sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
}

export const formatDate = (date: Date, locale: string) =>
  date.toLocaleDateString(locale, { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });
