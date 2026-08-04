export type NavItem = {
  targetId: 'top' | 'work' | 'experience'
  label: string
  shortLabel: string
}

export type ContactLinkType = 'email' | 'github' | 'linkedin' | 'resume'

type BaseContactLink = {
  href: string
  label: string
  type: ContactLinkType
}

export type ContactLink =
  | (BaseContactLink & {
      download: true
      type: 'resume'
    })
  | (BaseContactLink & {
      download?: false
      type: Exclude<ContactLinkType, 'resume'>
    })

export type ProjectVisualType = 'interface' | 'panel' | 'wave'

export type ProjectStatus = 'archived' | 'incoming' | 'live' | 'released'

export type Project = {
  className: `pc-${number}`
  featured?: boolean
  icon?: string
  id: string
  image?: {
    alt: string
    height: number
    objectPosition?: string
    src: string
    width: number
  }
  links?: {
    caseStudy?: string
    demo?: string
    github?: string
    store?: string
  }
  linkLabels?: Partial<Record<keyof NonNullable<Project['links']>, string>>
  role: string
  status: ProjectStatus
  details?: string
  summary: string
  tags: string[]
  title: string
  version?: string
  visual: ProjectVisualType
}

export type SymbolName = 'clover' | 'star'

export type TimelineItem = {
  bullets: string[]
  company: string
  date: string
  icon: SymbolName
  isCurrent?: boolean
  role: string
  summary: string
  tags: string[]
}

export const navItems = [
  { targetId: 'top', label: 'Profile', shortLabel: 'Profile' },
  { targetId: 'work', label: 'Explorations', shortLabel: 'Work' },
  { targetId: 'experience', label: 'Trajectory', shortLabel: 'Experience' },
] satisfies NavItem[]

export const contactLinks = [
  {
    download: true,
    href: '/resume.pdf',
    label: 'Resume',
    type: 'resume',
  },
  {
    href: 'mailto:hyunwoojames@gmail.com',
    label: 'Email',
    type: 'email',
  },
  {
    href: 'https://www.linkedin.com/in/hyunwoo312/',
    label: 'LinkedIn',
    type: 'linkedin',
  },
  {
    href: 'https://github.com/hyunwoo312',
    label: 'GitHub',
    type: 'github',
  },
] satisfies ContactLink[]

export function getContactLink(type: ContactLinkType): ContactLink {
  const link = contactLinks.find((item) => item.type === type)

  if (!link) {
    throw new Error(`Missing contact link: ${type}`)
  }

  return link
}

export const projects = [
  {
    id: 'lux',
    title: 'Lux',
    summary:
      'A local-first new tab dashboard extension with a drag-and-drop widget grid, glassmorphism theming, and optional account widgets.',
    details:
      'A new tab dashboard for Chrome and Brave that replaces the default page with a grid of widgets you arrange, drag, and resize — each on its own Glass or Solid surface. Ships Tasks, Quick Access, Notes, Image, Weather, Calendar (Google & Outlook), Spotify, GitHub, and AniList widgets under a light and dark glassmorphism theme. Local-first: dashboard data stays in the browser with no Lux account and no telemetry, and account widgets connect over OAuth only when you opt in.',
    role: 'Local-first new tab dashboard',
    version: 'v1.0.0',
    status: 'live',
    tags: ['TypeScript', 'React 19', 'Chrome Extension'],
    className: 'pc-1',
    featured: true,
    icon: '/projects/lux-icon.png',
    links: {
      github: 'https://github.com/hyunwoo312/lux',
      store: 'https://chromewebstore.google.com/detail/lux/kmfabjnibncbooljgbkinkfddapmfcna',
    },
    linkLabels: {
      store: 'Chrome Web Store',
    },
    image: {
      alt: 'Lux new tab dashboard with a custom wallpaper — glassmorphism widgets including a photo, a now-playing card, quick access shortcuts, tasks, a clock, and a calendar — over an illustrated sunset cityscape.',
      height: 1439,
      objectPosition: 'center top',
      src: '/projects/lux-hero.png',
      width: 2560,
    },
    visual: 'interface',
  },
  {
    id: 'steam-launcher',
    title: 'Steam Launcher',
    summary:
      'A Flow Launcher plugin that turns Steam into a keyboard-first command center.',
    details:
      'Built for fast game and account workflows without opening the full Steam UI. Steam Launcher supports fuzzy library search, store fallback, friend status, shared multiplayer lookup, account switching, profile stats, and maintenance actions like verify or uninstall from one command surface.',
    role: 'Keyboard-first Steam workflows',
    version: 'v1.1.0',
    status: 'released',
    tags: ['C#', 'Flow Launcher', 'Steam API'],
    className: 'pc-2',
    featured: true,
    icon: '/projects/steam-launcher-icon.png',
    links: {
      github: 'https://github.com/hyunwoo312/steam-launcher',
      store:
        'https://www.flowlauncher.com/plugins/steam-launcher-8E3F7A21-9B2C-4D5E-A1F8-3C2B7D9E5A4B/',
    },
    linkLabels: {
      store: 'Plugin Store',
    },
    image: {
      alt: 'Steam Launcher Flow Launcher results showing installed Steam games and library metadata.',
      height: 417,
      objectPosition: 'center center',
      src: '/projects/steam-launcher-library.png',
      width: 780,
    },
    visual: 'wave',
  },
  {
    id: 'mira',
    title: 'Mira',
    summary:
      'A Chrome extension that keeps applicant profiles local and fills repetitive ATS forms in one click.',
    details:
      'Built for job seekers tired of retyping the same answers across Ashby, Greenhouse, Lever, Workday, and iCIMS. Mira combines page scanning, local profile storage, document handling, application history, and an in-browser ML classifier to handle messy form fields without servers, accounts, telemetry, or API keys.',
    role: 'Job application automation',
    version: 'v0.3.1',
    status: 'live',
    tags: ['TypeScript', 'Chrome Extension', 'ONNX'],
    className: 'pc-3',
    featured: true,
    icon: '/projects/mira-icon.png',
    links: {
      github: 'https://github.com/hyunwoo312/mira',
      store: 'https://chromewebstore.google.com/detail/mira/nmanfejonnmcnldcpbjhcglbbhdglbpa',
    },
    linkLabels: {
      store: 'Chrome Web Store',
    },
    image: {
      alt: 'Mira browser extension filling a job application form with a side panel and floating progress overlay.',
      height: 800,
      objectPosition: 'center top',
      src: '/projects/mira-hero.png',
      width: 1280,
    },
    visual: 'interface',
  },
  {
    id: 'riot-launcher',
    title: 'Riot Launcher',
    summary:
      'A Flow Launcher plugin for switching saved Riot accounts and launching Riot games from the keyboard.',
    role: 'Plugin engineering',
    status: 'released',
    tags: ['C#', 'WPF', 'Flow Launcher'],
    className: 'pc-4',
    links: {
      github: 'https://github.com/hyunwoo312/riot-launcher',
    },
    visual: 'interface',
  },
  {
    id: 'hyunwkme-3d-archive',
    title: '3D Portfolio Archive',
    summary:
      'The archived 3D portfolio: a handcrafted Blender room with interactive objects and bookshelf project discovery.',
    role: 'Creative frontend',
    status: 'archived',
    tags: ['TypeScript', 'Three.js', 'GSAP'],
    className: 'pc-5',
    links: {
      demo: 'https://3d-archive.hyunwk.me',
      github: 'https://github.com/hyunwoo312/hyunwkme-3d-archive',
    },
    visual: 'wave',
  },
  {
    id: 'more-builds-incoming',
    title: 'Something Odd Is Cooking',
    summary:
      'A small lab slot for the next tool, experiment, or half-serious idea that survives long enough to ship.',
    role: 'Upcoming work',
    status: 'incoming',
    tags: ['In Progress'],
    className: 'pc-6',
    visual: 'panel',
  },
] satisfies Project[]

export const timeline = [
  {
    date: 'AUG 2023 - PRESENT',
    role: 'Independent Software Engineer',
    company: 'Open to work',
    icon: 'clover',
    isCurrent: true,
    summary:
      'Building useful, strange, and polished software across web, developer tools, and automation-heavy workflows.',
    bullets: [
      'Prototyping independent products and interface experiments.',
      'Writing production-minded code across fullstack and systems contexts.',
      'Exploring AI-assisted workflows without losing engineering rigor.',
    ],
    tags: ['TypeScript', 'React', 'Python', 'C#'],
  },
  {
    date: 'JUN 2022 - AUG 2023',
    role: 'Software Development Engineer I',
    company: 'Amazon Web Services / Amazon Connect',
    icon: 'star',
    summary:
      'Built and operated backend features for Amazon Connect, with emphasis on API performance, service connectivity, and release automation.',
    bullets: [
      'Improved SearchCases API performance for customer-facing workflows.',
      'Implemented PrivateLink connectivity across service boundaries.',
      'Automated SDK/release workflows and supported CloudWatch-backed production operations.',
    ],
    tags: ['Java', 'TypeScript', 'AWS'],
  },
] satisfies TimelineItem[]
