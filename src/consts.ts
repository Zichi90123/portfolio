// Site-wide data.

export const SITE = {
  name: "Andrea Zichittella",
  tagline:
    "Senior full stack engineer a Torino. Dal 2017 costruisco piattaforme web e mobile per aziende come Intesa Sanpaolo e TeamSystem; qui trovi i progetti che porto avanti da solo, dall’idea al rilascio.",
  description:
    "Andrea Zichittella, senior full stack engineer a Torino: progetti web e mobile con le scelte tecniche dietro ognuno.",
  lang: "it",
} as const;

export const LINKS = {
  github: "https://github.com/Zichi90123",
  // TODO: LinkedIn profile URL and contact email (not published until Andrea decides).
  linkedin: null as string | null,
  email: null as string | null,
  // SP-105: the PDF goes in public/cv.pdf.
  cv: null as string | null,
} as const;

export const NAV = [
  { href: "/", label: "Home" },
  { href: "/progetti", label: "Progetti" },
  { href: "/chi-sono", label: "Chi sono" },
] as const;

export const CATEGORIES = {
  web: "Web",
  mobile: "Mobile",
  giochi: "Giochi",
  strumenti: "Strumenti",
} as const;

export type Category = keyof typeof CATEGORIES;
