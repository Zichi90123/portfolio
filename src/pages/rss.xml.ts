import type { APIRoute } from 'astro';
import { articlesFeed } from '../lib/rss';

export const GET: APIRoute = (context) => articlesFeed(context, 'it');
