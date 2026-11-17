// Site-wide data. Texts that change with the language live in src/i18n.ts.

export const SITE = {
  name: 'Andrea Zichittella',
} as const;

export const LINKS = {
  github: 'https://github.com/Zichi90123',
  linkedin: 'https://www.linkedin.com/in/andrea-zichittella-a52544149/' as string | null,
  email: 'andrea.zichittella@gmail.com' as string | null,
  // Cleaned copy of the CV (in English): no phone, home address or date of birth; clients anonymized.
  cv: '/cv.pdf' as string | null,
} as const;

// Category keys used in the project files; labels per language are in src/i18n.ts.
export const CATEGORIES = ['web', 'mobile', 'giochi', 'strumenti'] as const;
export type Category = (typeof CATEGORIES)[number];
