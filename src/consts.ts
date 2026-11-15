// Site-wide data. Texts marked BOZZA are placeholders to be rewritten by Andrea.

export const SITE = {
  name: 'Andrea Zichittella',
  // BOZZA: one sentence on who I am and what I am looking for (PRD: "capire in 10 secondi").
  tagline: 'Sviluppatore full stack. Costruisco side project completi, dal PRD al rilascio, a costo zero.',
  description:
    'Portfolio di Andrea Zichittella: progetti web, mobile e giochi, con le scelte tecniche dietro ognuno.',
  lang: 'it',
} as const;

export const LINKS = {
  github: 'https://github.com/Zichi90123',
  // TODO: LinkedIn profile URL and contact email (not published until Andrea decides).
  linkedin: null as string | null,
  email: null as string | null,
  // SP-105: the PDF goes in public/cv.pdf.
  cv: null as string | null,
} as const;

export const NAV = [
  { href: '/', label: 'Home' },
  { href: '/progetti', label: 'Progetti' },
  { href: '/chi-sono', label: 'Chi sono' },
] as const;

export const CATEGORIES = {
  web: 'Web',
  mobile: 'Mobile',
  giochi: 'Giochi',
  strumenti: 'Strumenti',
} as const;

export type Category = keyof typeof CATEGORIES;
