// Build-time Open Graph images: /og/<project id>.png for every published project,
// plus /og/default.png for the other pages.
import type { APIRoute } from 'astro';
import { SITE } from '../../consts';
import { getProjects } from '../../lib/projects';
import { renderOg, type OgInput } from '../../lib/og';

export async function getStaticPaths() {
  const projects = await getProjects();
  const pages: { params: { id: string }; props: OgInput }[] = projects.map((p) => ({
    params: { id: p.id },
    props: {
      title: p.data.title,
      description: p.data.summary,
      kicker: 'andreazichittella.com · Progetti',
      tags: p.data.tech,
      cover: p.data.cover,
    },
  }));
  pages.push({
    params: { id: 'default' },
    props: { title: SITE.name, description: SITE.tagline, kicker: 'andreazichittella.com' },
  });
  return pages;
}

export const GET: APIRoute = async ({ props }) => {
  const png = await renderOg(props as OgInput);
  return new Response(new Uint8Array(png), { headers: { 'Content-Type': 'image/png' } });
};
