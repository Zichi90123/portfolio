// Italian is the main language (no prefix); English lives under /en (SP-108).
export const LANGS = ['it', 'en'] as const;
export type Lang = (typeof LANGS)[number];

export const ROUTES = {
  home: { it: '/', en: '/en' },
  projects: { it: '/progetti', en: '/en/projects' },
  about: { it: '/chi-sono', en: '/en/about' },
} as const satisfies Record<string, Record<Lang, string>>;

export const projectPath = (id: string, lang: Lang) => `${ROUTES.projects[lang]}/${id}`;

export const UI = {
  it: {
    htmlLang: 'it',
    ogLocale: 'it_IT',
    skip: 'Vai al contenuto',
    navLabel: 'Principale',
    nav: { home: 'Home', projects: 'Progetti', about: 'Chi sono' },
    switchTo: 'English',
    switchShort: 'EN',
    switchLabel: 'Read this page in English',
    themeLabel: 'Cambia tema chiaro/scuro',
    tagline:
      'Senior full stack engineer a Torino. Dal 2017 costruisco piattaforme web e mobile per banche, software house e grandi aziende; qui trovi i progetti che porto avanti da solo, dall’idea al rilascio.',
    description:
      'Andrea Zichittella, senior full stack engineer a Torino: progetti web e mobile con le scelte tecniche dietro ognuno.',
    portfolio: 'Portfolio',
    seeProjects: 'Vedi i progetti',
    writeMe: 'Scrivimi',
    cvPdf: 'CV (PDF)',
    featured: 'In evidenza',
    noProjects: 'Le prime schede dei progetti sono in preparazione.',
    projectsTitle: 'Progetti',
    projectsDescription: 'Tutti i progetti, con le tecnologie usate e le scelte tecniche.',
    filtersLabel: 'Filtra i progetti',
    category: 'Categoria',
    technology: 'Tecnologia',
    all: 'Tutte',
    noResults: 'Nessun progetto con questi filtri.',
    techLabel: 'Tecnologie',
    inDevelopment: 'In sviluppo',
    draft: 'Bozza',
    tryDemo: 'Prova la demo',
    code: 'Codice',
    article: 'Articolo',
    download: 'Scarica',
    screenshotsOf: 'Schermate di',
    italianOnly: '',
    categories: { web: 'Web', mobile: 'Mobile', giochi: 'Giochi', strumenti: 'Strumenti' },
    ogKickerProjects: 'andreazichittella.com · Progetti',
  },
  en: {
    htmlLang: 'en',
    ogLocale: 'en_US',
    skip: 'Skip to content',
    navLabel: 'Main',
    nav: { home: 'Home', projects: 'Projects', about: 'About' },
    switchTo: 'Italiano',
    switchShort: 'IT',
    switchLabel: 'Leggi questa pagina in italiano',
    themeLabel: 'Toggle light/dark theme',
    tagline:
      'Senior full stack engineer in Turin, Italy. Since 2017 I have been building web and mobile platforms for banks, software companies and large enterprises; here are the projects I build on my own, from idea to release.',
    description:
      'Andrea Zichittella, senior full stack engineer in Turin: web and mobile projects with the technical choices behind each one.',
    portfolio: 'Portfolio',
    seeProjects: 'See the projects',
    writeMe: 'Email me',
    cvPdf: 'CV (PDF)',
    featured: 'Featured',
    noProjects: 'The first project pages are on their way.',
    projectsTitle: 'Projects',
    projectsDescription: 'All projects, with the technologies used and the technical choices.',
    filtersLabel: 'Filter the projects',
    category: 'Category',
    technology: 'Technology',
    all: 'All',
    noResults: 'No projects match these filters.',
    techLabel: 'Technologies',
    inDevelopment: 'In development',
    draft: 'Draft',
    tryDemo: 'Try the demo',
    code: 'Code',
    article: 'Article',
    download: 'Download',
    screenshotsOf: 'Screenshots of',
    italianOnly: 'This page is not translated yet: the text below is in Italian.',
    categories: { web: 'Web', mobile: 'Mobile', giochi: 'Games', strumenti: 'Tools' },
    ogKickerProjects: 'andreazichittella.com · Projects',
  },
} as const;

export const t = (lang: Lang) => UI[lang];
