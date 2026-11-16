// "Chi sono" / "About" content in both languages (SP-105, SP-108).
// Personal data from the CV (phone, address, date of birth, photo) is deliberately left out,
// and clients are described by sector, not by name.
import type { Lang } from '../i18n';

interface Job {
  period: string;
  role: string;
  company: string;
  intro: string;
  projects?: { name: string; period: string; text: string }[];
}

interface About {
  title: string;
  description: string;
  intro: [string, string]; // the second paragraph ends with a link to the projects
  projectsLink: string;
  headings: { path: string; teaching: string; skills: string; education: string; contacts: string };
  experience: Job[];
  teaching: string;
  skills: { area: string; items: string }[];
  education: string[];
  contacts: { code: string; linkedin: string; email: string; cv: string };
}

export const ABOUT: Record<Lang, About> = {
  it: {
    title: 'Chi sono',
    description: 'Andrea Zichittella, senior full stack engineer a Torino: percorso, progetti e competenze.',
    intro: [
      'Sono Andrea, senior full stack engineer a Torino. Dal 2017 progetto e sviluppo piattaforme web e mobile, dal frontend ai microservizi fino al rilascio, e da diversi anni guido piccoli team.',
      'Fuori dal lavoro costruisco progetti completi da solo: parto da un documento dei requisiti, scelgo uno stack che costi quasi zero e arrivo a un’app online con test, CI e monitoraggio. Sono quelli che trovi in',
    ],
    projectsLink: 'Progetti',
    headings: {
      path: 'Percorso',
      teaching: 'Insegnamento',
      skills: 'Competenze',
      education: 'Formazione',
      contacts: 'Contatti',
    },
    experience: [
      {
        period: '2020 – oggi',
        role: 'Principal software engineer',
        company: 'Itauros, Torino',
        intro:
          'Guido un team di 5 sviluppatori: raccolta dei requisiti con clienti e stakeholder, architettura, code review e cerimonie Agile. I progetti principali:',
        projects: [
          {
            name: 'Portale di firma digitale · software house italiana',
            period: '2022 – oggi',
            text: 'Ho avviato e guidato la riscrittura dei due frontend React (console per firmatari e certificati, app di firma per l’utente finale) su microservizi Spring Boot: firma grafometrica e biometrica, OTP, firma qualificata CAdES, notifiche in tempo reale. Oltre 100.000 firme al mese.',
          },
          {
            name: 'Ferie e riposi del personale ferroviario · gruppo del trasporto ferroviario',
            period: '2026 – oggi',
            text: 'Un motore di simulazione in Python che genera i riposi del mese rispettando vincoli come il personale minimo per sede; due microservizi Go in architettura esagonale su Kubernetes, con OpenTelemetry; una PWA in React 19 con accesso tramite Azure AD.',
          },
          {
            name: 'Piattaforma e-commerce · gruppo italiano del retail',
            period: '2026 – oggi',
            text: 'Backend Java e Spring Boot: migrazione da AWS SDK v1 a v2 per S3 e SES, un nuovo dominio “Food Service”, rilasci su Kubernetes (GKE).',
          },
          {
            name: 'Portale di provisioning · grande banca italiana',
            period: '2019 – 2022',
            text: 'Technical lead di un portale self-service in Angular e Spring Boot per creare VM, microservizi e storage, orchestrato con Jenkins: tempi di attesa passati da giorni a minuti.',
          },
          {
            name: 'App fedeltà · marchio internazionale del food & beverage',
            period: '2020 – 2022',
            text: 'Refactoring e nuove funzioni di un’app React Native usata in 6 paesi, con backend serverless su Azure Functions e infrastruttura in Terraform. Valutazione sugli store da 3,2 a 4,5.',
          },
        ],
      },
      {
        period: '2018 – 2020',
        role: 'Full stack developer',
        company: 'e.MAGINE, Torino',
        intro:
          'Coordinavo 5 sviluppatori. Tra i progetti, un sistema di assistenza remota per tecnici sul campo: audio e video in tempo reale con WebRTC, app desktop in Electron e pannello Angular per gli esperti.',
      },
      {
        period: '2015 – 2018',
        role: 'Primi lavori',
        company: 'DM Packaging Group, Erasmus Torino',
        intro: 'Applicazioni web interne per un’azienda di packaging e il sito di un’associazione.',
      },
    ],
    teaching:
      'Dal 2025 sono docente alla Fondazione ITS ICT: corsi su Node.js (event loop, ecosistema npm, scalabilità del backend) e sui database NoSQL, con esercitazioni su casi reali e revisioni dell’architettura dei progetti degli studenti.',
    skills: [
      { area: 'Frontend', items: 'React, React Native, Angular, Next.js, TypeScript, Tailwind CSS' },
      { area: 'Backend', items: 'Node.js (NestJS, Express), Java e Spring Boot, Go, Python' },
      { area: 'Dati', items: 'PostgreSQL, MongoDB, Redis, MySQL, Firestore, Cosmos DB' },
      {
        area: 'Cloud e DevOps',
        items:
          'AWS (Lambda, S3, EventBridge), Azure (Functions, AD), Kubernetes e Helm, Terraform, Docker, Jenkins, GitHub Actions, OpenTelemetry',
      },
      { area: 'In più', items: 'WebRTC, firma digitale, PWA e notifiche push, microservizi ed eventi' },
    ],
    education: [
      'Laurea magistrale in Informatica · Politecnico di Torino',
      'Laurea triennale in Informatica · Università di Parma',
      'Google Project Management (Coursera, 2021)',
      'Inglese: livello C1',
    ],
    contacts: {
      code: 'Il codice dei progetti è su',
      linkedin: 'Mi trovi anche su',
      email: 'Per scrivermi:',
      cv: 'Il CV completo è in',
    },
  },
  en: {
    title: 'About',
    description: 'Andrea Zichittella, senior full stack engineer in Turin: career, projects and skills.',
    intro: [
      'I’m Andrea, a senior full stack engineer based in Turin, Italy. Since 2017 I have been designing and building web and mobile platforms, from the frontend to the microservices and all the way to release, and for several years I have been leading small teams.',
      'Outside work I build complete projects on my own: I start from a requirements document, pick a stack that costs next to nothing and end up with an app online, with tests, CI and monitoring. You’ll find them in',
    ],
    projectsLink: 'Projects',
    headings: {
      path: 'Career',
      teaching: 'Teaching',
      skills: 'Skills',
      education: 'Education',
      contacts: 'Contact',
    },
    experience: [
      {
        period: '2020 – present',
        role: 'Principal software engineer',
        company: 'Itauros, Turin',
        intro:
          'I lead a team of 5 developers: gathering requirements with clients and stakeholders, architecture, code reviews and Agile ceremonies. Main projects:',
        projects: [
          {
            name: 'Digital signature portal · Italian software company',
            period: '2022 – present',
            text: 'I started and led the rewrite of the two React frontends (a console for signatories and certificates, and the end-user signing app) on Spring Boot microservices: handwritten and biometric signatures, OTP, CAdES qualified signatures, real-time notifications. Over 100,000 signatures a month.',
          },
          {
            name: 'Leave and rest days for railway staff · railway transport group',
            period: '2026 – present',
            text: 'A Python simulation engine that generates the monthly rest days within constraints such as minimum staffing per site; two Go microservices with a hexagonal architecture on Kubernetes, with OpenTelemetry; a React 19 PWA with Azure AD sign-in.',
          },
          {
            name: 'E-commerce platform · Italian retail group',
            period: '2026 – present',
            text: 'Java and Spring Boot backend: migration from AWS SDK v1 to v2 for S3 and SES, a new “Food Service” domain, releases on Kubernetes (GKE).',
          },
          {
            name: 'Provisioning portal · major Italian bank',
            period: '2019 – 2022',
            text: 'Technical lead of a self-service portal in Angular and Spring Boot to create VMs, microservices and storage, orchestrated with Jenkins: waiting times went from days to minutes.',
          },
          {
            name: 'Loyalty app · international food & beverage brand',
            period: '2020 – 2022',
            text: 'Refactoring and new features for a React Native app used in 6 countries, with a serverless backend on Azure Functions and infrastructure in Terraform. Store rating from 3.2 to 4.5.',
          },
        ],
      },
      {
        period: '2018 – 2020',
        role: 'Full stack developer',
        company: 'e.MAGINE, Turin',
        intro:
          'I coordinated 5 developers. Among the projects, a remote assistance system for field technicians: real-time audio and video with WebRTC, an Electron desktop app and an Angular dashboard for the experts.',
      },
      {
        period: '2015 – 2018',
        role: 'Early work',
        company: 'DM Packaging Group, Erasmus Torino',
        intro: 'Internal web applications for a packaging company and the website of an association.',
      },
    ],
    teaching:
      'Since 2025 I have been teaching at the ITS ICT Foundation: courses on Node.js (event loop, npm ecosystem, backend scalability) and on NoSQL databases, with hands-on exercises on real cases and architecture reviews of the students’ projects.',
    skills: [
      { area: 'Frontend', items: 'React, React Native, Angular, Next.js, TypeScript, Tailwind CSS' },
      { area: 'Backend', items: 'Node.js (NestJS, Express), Java and Spring Boot, Go, Python' },
      { area: 'Data', items: 'PostgreSQL, MongoDB, Redis, MySQL, Firestore, Cosmos DB' },
      {
        area: 'Cloud and DevOps',
        items:
          'AWS (Lambda, S3, EventBridge), Azure (Functions, AD), Kubernetes and Helm, Terraform, Docker, Jenkins, GitHub Actions, OpenTelemetry',
      },
      { area: 'Also', items: 'WebRTC, digital signatures, PWA and push notifications, microservices and events' },
    ],
    education: [
      'Master’s degree in Computer Science · Politecnico di Torino',
      'Bachelor’s degree in Computer Science · University of Parma',
      'Google Project Management (Coursera, 2021)',
      'Italian: native · English: C1',
    ],
    contacts: {
      code: 'The code of my projects is on',
      linkedin: 'You can also find me on',
      email: 'To reach me:',
      cv: 'My full CV is available as a',
    },
  },
};
