import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { articlePath, t, type Lang } from '../i18n';
import { getArticles } from './articles';

/** RSS feed of the articles in one language (SP-106). */
export async function articlesFeed(context: APIContext, lang: Lang) {
  const ui = t(lang);
  const articles = (await getArticles(lang)).filter((a) => !a.data.draft);
  return rss({
    title: ui.rssTitle,
    description: ui.articlesDescription,
    site: context.site!,
    items: articles.map((a) => ({
      title: a.data.title,
      description: a.data.description,
      pubDate: a.data.date,
      link: articlePath(a.id, lang),
      categories: a.data.tags,
    })),
    customData: `<language>${ui.htmlLang}</language>`,
    trailingSlash: false,
  });
}
