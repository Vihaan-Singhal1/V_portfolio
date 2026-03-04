export type Accent = 'neon' | 'cyan' | 'purple' | 'pink' | 'yellow' | 'red';

export const accentHex: Record<Accent, string> = {
  neon: '#00ffaa',
  cyan: '#00c8ff',
  purple: '#b44aff',
  pink: '#ff3a8c',
  yellow: '#f0ff3c',
  red: '#ff3a3a'
};

export const navigationLinks = [
  { id: 'home', label: '/home' },
  { id: 'education', label: '/education' },
  { id: 'projects', label: '/projects' },
  { id: 'experience', label: '/experience' },
  { id: 'tech-stack', label: '/tech-stack' },
  { id: 'contact', label: '/contact' }
] as const;

export const heroContent = {
  status: 'SYSTEM STATUS: ONLINE',
  firstName: 'VIHAAN',
  lastName: 'SINGHAL',
  roles: [
    'Full-Stack Developer',
    'AI & ML Researcher',
    'Hackathon Winner',
    'Problem Solver',
    'CS & Business @ McMaster'
  ],
  scrambleTarget: 'Applied AI + full-stack systems, built for the real world.',
  bio:
    'Developer and applied AI builder focused on machine learning, secure systems, and end-to-end product engineering. I build across AI research, full-stack web applications, cross-platform mobile experiences, and post-quantum cryptography experiments.',
  cta: [
    {
      label: 'View Projects',
      href: '#projects',
      accent: 'neon' as Accent,
      filled: true
    },
    {
      label: 'Get In Touch',
      href: '#contact',
      accent: 'cyan' as Accent,
      filled: false
    }
  ]
};

export const socialLinks = [
  {
    label: 'LinkedIn',
    href: 'https://linkedin.com/in/vihaansinghal-21baa6379',
    icon: 'linkedin' as const
  },
  {
    label: 'GitHub',
    href: 'https://github.com/Vihaan-Singhal1',
    icon: 'github' as const
  },
  {
    label: 'Devpost',
    href: 'https://devpost.com/Vihaan-Singhal1',
    icon: 'devpost' as const
  },
  {
    label: 'Email',
    href: 'mailto:thevihaansinghal@gmail.com',
    icon: 'mail' as const
  }
];

export const marqueeItems = {
  hero: [
    'CS & BUSINESS @ MCMASTER',
    'FULL-STACK DEVELOPER',
    'AI RESEARCHER',
    'HACKATHON WINNER',
    'POST-QUANTUM CRYPTO',
    'REAL-TIME SYSTEMS',
    'SHIP FAST LEARN FASTER'
  ],
  skills: [
    'REACT',
    'TYPESCRIPT',
    'NODE.JS',
    'PYTHON',
    'YOLO',
    'FLASK',
    'OpenCV',
    'LWE CRYPTO',
    'LEAFLET',
    'ONNX'
  ],
  philosophy: [
    'DO NOT JUST LEARN - BUILD',
    'EVERY PROJECT IS A SYSTEM',
    "SHIP IT OR IT DOESN'T EXIST",
    'COMPLEXITY IS THE ENEMY',
    'MAKE IT WORK THEN MAKE IT FAST'
  ]
};

export const stats = [
  { value: 6, suffix: '+', label: 'Projects Built', accent: 'neon' as Accent },
  { value: 2, suffix: '', label: 'Hackathon Wins', accent: 'cyan' as Accent },
  { value: 8, suffix: '+', label: 'Awards and Honors', accent: 'neon' as Accent },
  { value: 6, suffix: '+', label: 'Years Coding', accent: 'cyan' as Accent }
];

export const terminalLines = [
  { prompt: true, text: 'whoami' },
  { prompt: false, text: 'Vihaan Singhal - CS and Business @ McMaster University' },
  { prompt: true, text: 'cat interests.txt' },
  { prompt: false, text: 'Applied AI/ML - Post-Quantum Cryptography - Real-Time Systems' },
  { prompt: true, text: 'ls ./skills' },
  { prompt: false, text: 'react/  node.js/  python/  typescript/  yolo/  flask/  leaflet/' },
  { prompt: true, text: 'echo $STATUS' },
  { prompt: false, text: 'Building things that matter. Focused on high-impact engineering.' },
  { prompt: true, text: 'cat philosophy.md' },
  {
    prompt: false,
    text: '"Ship fast, learn faster. Every project is a chance to solve real problems."'
  }
];

export const sectionHeadings = {
  education: {
    tag: 'education_&_honors',
    title: 'Education & Honors',
    accent: 'cyan' as Accent
  },
  projects: {
    tag: 'featured_builds',
    title: 'Major Projects',
    accent: 'cyan' as Accent
  },
  experience: {
    tag: 'experience_log',
    title: 'Professional History',
    accent: 'neon' as Accent
  },
  stack: {
    tag: 'skill_inventory',
    title: 'Tech Stack',
    accent: 'neon' as Accent
  },
  contact: {
    tag: 'init_connection',
    title: "Let's Build Together",
    accent: 'neon' as Accent
  }
};

export const university = {
  school: 'McMaster University',
  degree: 'BSc - Computer Science (Co-op), Minor in Business',
  period: 'August 2025 - April 2029',
  location: 'Hamilton, Ontario, Canada',
  honor: "Global Dean's Excellence Award Recipient (95%+ average, 4-Year Scholarship)"
};

export const awards = [
  {
    title: "Global Dean's Excellence Award",
    issuer: 'McMaster Engineering',
    date: 'Aug 2025',
    detail: 'Entering students with 95%+ high school average and a 4-year scholarship.',
    accent: 'neon' as Accent,
    icon: 'trophy' as const
  }
];

export const coursework = [
  'Data Structures and Algorithms',
  'Software Development',
  'Discrete Mathematics',
  'Linear Algebra',
  'Calculus',
  'Computer Architecture',
  'Software Testing',
  'Computational Theory',
  'Software Security',
  'Mathematical Models'
];

export type ProjectStatus = 'shipped' | 'active' | 'completed';

export type ProjectLink = {
  label: 'Live Demo' | 'GitHub';
  href: string;
};

export type Project = {
  id: string;
  number: string;
  image: string;
  title: string;
  subtitle: string;
  category: string;
  status: ProjectStatus;
  date: string;
  accent: Accent;
  description: string;
  tech: string[];
  links: ProjectLink[];
};

export const projects: Project[] = [
  {
    id: 'vs-portfolio',
    number: '01',
    image: '/assets/projects/vs-portfolio/vs-portfolio.png',
    title: 'VS Portfolio',
    subtitle: 'Interactive personal website',
    category: 'WEB EXPERIENCE / PERSONAL BRAND',
    status: 'active',
    date: 'Mar 2026',
    accent: 'cyan',
    tech: ['React', 'TypeScript', 'Vite', 'TailwindCSS', 'motion/react'],
    description:
      'Designed and engineered this portfolio with high-readability content architecture, motion-driven section reveals, spotlight cards, and optimized visual effects for performance.',
    links: [
      { label: 'Live Demo', href: 'https://github.com/Vihaan-Singhal1' },
      { label: 'GitHub', href: 'https://github.com/Vihaan-Singhal1' }
    ]
  },
  {
    id: 'lifesaver',
    number: '02',
    image: '/assets/projects/lifesaver/lifesaver.jpeg',
    title: 'LifeSaver',
    subtitle: 'Real-Time Emergency Incident Triage Platform',
    category: 'FULL-STACK / GEOSPATIAL',
    status: 'shipped',
    date: 'Jan 2025',
    accent: 'neon',
    tech: ['React', 'TypeScript', 'Node.js', 'Express', 'Leaflet', 'Geohash'],
    description:
      "Built at McMaster's MEC Hackathon in under 24 hours. Real-time geospatial triage with weighted incident scoring, clustered map views, and geohash-based nearby report detection.",
    links: [
      { label: 'Live Demo', href: 'https://github.com/Vihaan-Singhal1/LifeSaver_Final' },
      { label: 'GitHub', href: 'https://github.com/Vihaan-Singhal1/LifeSaver_Final' }
    ]
  },
  {
    id: 'quantamail',
    number: '03',
    image: '/assets/projects/quantamail/quantamail.jpeg',
    title: 'QuantaMail',
    subtitle: 'Post-Quantum Encrypted Email System',
    category: 'POST-QUANTUM CRYPTOGRAPHY',
    status: 'completed',
    date: 'Jan 2023',
    accent: 'cyan',
    tech: ['Python', 'Flask', 'LWE', 'OAuth 2.0', 'SQLite', 'bcrypt'],
    description:
      'Custom LWE-based encryption pipeline with key generation, encoding, encryption, and deterministic decryption. Flask app integrates secure auth plus Gmail OAuth and SMTP delivery.',
    links: [
      { label: 'Live Demo', href: 'https://github.com/Vihaan-Singhal1/QuantaMail' },
      { label: 'GitHub', href: 'https://github.com/Vihaan-Singhal1/QuantaMail' }
    ]
  },
  {
    id: 'sanctuary',
    number: '04',
    image: '/assets/projects/sanctuary/sanctuary.jpeg',
    title: 'Sanctuary',
    subtitle: 'Local AI Companion',
    category: 'LOCAL AI / PRIVACY',
    status: 'active',
    date: 'Jan 2022',
    accent: 'neon',
    tech: ['React.js', 'Vite', 'Ollama', 'Kokoro TTS', 'Web Speech API'],
    description:
      'Privacy-first local AI companion with on-device LLM inference through Ollama. Includes voice input/output and persistent local session memory with zero external telemetry.',
    links: [
      { label: 'Live Demo', href: 'https://github.com/Vihaan-Singhal1/Sanctuary-app' },
      { label: 'GitHub', href: 'https://github.com/Vihaan-Singhal1/Sanctuary-app' }
    ]
  },
  {
    id: 'safesight-ai',
    number: '05',
    image: '/assets/projects/safesight-ai/Safesight.jpeg',
    title: 'SafeSight AI',
    subtitle: 'Real-Time Safety Intelligence System',
    category: 'COMPUTER VISION',
    status: 'active',
    date: 'Mar 2021',
    accent: 'cyan',
    tech: ['YOLOv8', 'OpenCV', 'PyQt6', 'ONNX Runtime', 'MobileNetV2'],
    description:
      'Desktop safety intelligence app for person detection, mask compliance, and distancing alerts. Uses threaded PyQt6 processing with YOLOv8 ONNX and calibrated homography distance estimation.',
    links: [
      { label: 'Live Demo', href: 'https://github.com/Vihaan-Singhal1/safesight-AI' },
      { label: 'GitHub', href: 'https://github.com/Vihaan-Singhal1/safesight-AI' }
    ]
  },
  {
    id: 'cms',
    number: '06',
    image: '/assets/projects/cms/cms.png',
    title: 'Clinic Management System (CMS)',
    subtitle: 'Desktop clinic workflow manager',
    category: 'DESKTOP APPLICATION',
    status: 'completed',
    date: 'Dec 2019',
    accent: 'neon',
    tech: ['Python', 'Tkinter', 'MySQL', 'py2app'],
    description:
      'Full-screen desktop system for clinic intake and prescriptions. Includes secure login, record search, linked patient-prescription storage, and macOS packaging with py2app.',
    links: [
      {
        label: 'Live Demo',
        href: 'https://github.com/Vihaan-Singhal1/Clinic-Management-System-CMS-'
      },
      {
        label: 'GitHub',
        href: 'https://github.com/Vihaan-Singhal1/Clinic-Management-System-CMS-'
      }
    ]
  }
];

export type SkillTelemetry = {
  level: number;
  usedIn: string[];
};

export const skillTelemetry: Record<string, SkillTelemetry> = {
  TypeScript: { level: 92, usedIn: ['VS Portfolio', 'LifeSaver'] },
  Python: { level: 93, usedIn: ['QuantaMail', 'SafeSight AI', 'Clinic Management System (CMS)'] },
  JavaScript: { level: 90, usedIn: ['VS Portfolio', 'LifeSaver', 'Sanctuary'] },
  SQL: { level: 84, usedIn: ['QuantaMail', 'Clinic Management System (CMS)'] },
  React: { level: 95, usedIn: ['VS Portfolio', 'LifeSaver', 'Sanctuary'] },
  TailwindCSS: { level: 94, usedIn: ['VS Portfolio'] },
  Vite: { level: 91, usedIn: ['VS Portfolio', 'Sanctuary'] },
  'Web Speech API': { level: 79, usedIn: ['Sanctuary'] },
  'Node.js': { level: 90, usedIn: ['LifeSaver', 'VS Portfolio'] },
  'Express.js': { level: 89, usedIn: ['LifeSaver'] },
  Flask: { level: 88, usedIn: ['QuantaMail'] },
  'OAuth 2.0': { level: 83, usedIn: ['QuantaMail'] },
  Postman: { level: 88, usedIn: ['LifeSaver', 'QuantaMail'] },
  YOLOv8: { level: 90, usedIn: ['SafeSight AI'] },
  OpenCV: { level: 90, usedIn: ['SafeSight AI'] },
  'ONNX Runtime': { level: 86, usedIn: ['SafeSight AI'] },
  NumPy: { level: 88, usedIn: ['SafeSight AI'] },
  Pandas: { level: 86, usedIn: ['SafeSight AI'] },
  Jupyter: { level: 86, usedIn: ['SafeSight AI'] },
  MobileNetV2: { level: 80, usedIn: ['SafeSight AI'] },
  Ollama: { level: 81, usedIn: ['Sanctuary'] },
  MySQL: { level: 84, usedIn: ['Clinic Management System (CMS)'] },
  SQLite: { level: 78, usedIn: ['QuantaMail'] },
  Vercel: { level: 83, usedIn: ['VS Portfolio'] },
  Git: { level: 93, usedIn: ['VS Portfolio', 'LifeSaver', 'QuantaMail', 'Sanctuary', 'SafeSight AI', 'Clinic Management System (CMS)'] },
  Linux: { level: 82, usedIn: ['SafeSight AI', 'QuantaMail'] },
  'LWE Implementation': { level: 85, usedIn: ['QuantaMail'] },
  'CRYSTALS-Kyber Family': { level: 79, usedIn: ['QuantaMail'] },
  bcrypt: { level: 80, usedIn: ['QuantaMail'] },
  Leaflet: { level: 87, usedIn: ['LifeSaver'] },
  Geohash: { level: 84, usedIn: ['LifeSaver'] },
  PyQt6: { level: 84, usedIn: ['SafeSight AI'] },
  Tkinter: { level: 82, usedIn: ['Clinic Management System (CMS)'] },
  py2app: { level: 70, usedIn: ['Clinic Management System (CMS)'] }
};

export type TechStackGroup = {
  title: string;
  accent: Accent;
  skills: string[];
};

export const techStackGroups: TechStackGroup[] = [
  {
    title: 'Core Languages',
    accent: 'neon',
    skills: ['TypeScript', 'Python', 'JavaScript', 'SQL']
  },
  {
    title: 'Frontend & Product',
    accent: 'cyan',
    skills: ['React', 'Vite', 'TailwindCSS', 'Web Speech API']
  },
  {
    title: 'Backend & APIs',
    accent: 'neon',
    skills: ['Node.js', 'Express.js', 'Flask', 'OAuth 2.0', 'Postman']
  },
  {
    title: 'AI / ML & Vision',
    accent: 'cyan',
    skills: ['YOLOv8', 'OpenCV', 'ONNX Runtime', 'NumPy', 'Pandas', 'Jupyter', 'MobileNetV2', 'Ollama']
  },
  {
    title: 'Data & Infra',
    accent: 'neon',
    skills: ['MySQL', 'SQLite', 'Vercel', 'Git', 'Linux']
  },
  {
    title: 'Cryptography',
    accent: 'cyan',
    skills: ['LWE Implementation', 'CRYSTALS-Kyber Family', 'bcrypt']
  },
  {
    title: 'Spatial & Desktop Systems',
    accent: 'neon',
    skills: ['Leaflet', 'Geohash', 'PyQt6', 'Tkinter', 'py2app']
  }
];

export const experience = [
  {
    role: 'Data & Deployment Engineer',
    org: 'McMaster AI Society',
    logo: '/assets/logos/organizations/McmasterAI.jpeg',
    period: 'September 2025 - Present (7 months)',
    location: 'Hamilton, Ontario',
    description:
      'Design and manage dataset deployment pipelines for CNN-based deepfake detection systems.',
    details: [
      'Benchmark baseline architectures against GAN and diffusion-generated media to evaluate detection robustness.',
      'Develop structured workflows for dataset preprocessing, versioning, and reproducible experimentation.',
      'Collaborate with model researchers to optimize training efficiency and deployment readiness.'
    ],
    links: [
      {
        label: 'LinkedIn',
        href: 'https://linkedin.com/in/vihaansinghal-21baa6379'
      }
    ],
    accent: 'neon' as Accent
  },
  {
    role: 'Junior Researcher — Fusion Models & Baseline Integration',
    org: 'McMaster AI Society',
    logo: '/assets/logos/organizations/McmasterAI.jpeg',
    period: 'September 2025 - Present (7 months)',
    location: 'Hamilton, Ontario',
    description:
      'Research fusion model architectures and integration strategies to improve optimization and performance stability.',
    details: [
      'Evaluate CNN and transformer baselines with model blending strategies.',
      'Analyze trade-offs across accuracy, generalization, and inference efficiency.',
      'Contribute to experimental design, benchmarking, and research documentation for applied AI systems.'
    ],
    links: [
      {
        label: 'LinkedIn',
        href: 'https://linkedin.com/in/vihaansinghal-21baa6379'
      }
    ],
    accent: 'neon' as Accent
  },
  {
    role: 'International Representative',
    org: 'McMaster MIX Club',
    logo: '/assets/logos/organizations/MIX.jpeg',
    period: 'September 2025 - Present (7 months)',
    location: 'Hamilton, Ontario',
    description:
      'Support first-year international students transitioning into university life through outreach and community-building.',
    details: [
      'Help students solve academic and social adjustment challenges.',
      'Organize engagement initiatives that strengthen cross-cultural student community ties.'
    ],
    links: [
      {
        label: 'LinkedIn',
        href: 'https://linkedin.com/in/vihaansinghal-21baa6379'
      }
    ],
    accent: 'cyan' as Accent
  },
  {
    role: 'IBDP Teaching Assistant',
    org: 'StudyPlus Education ME',
    logo: '/assets/logos/organizations/studyplus_education_me_logo.jpeg',
    period: 'April 2025 - August 2025 (5 months)',
    location: 'Doha, Qatar',
    description:
      'Assisted International Baccalaureate Diploma Programme tutors for Computer Science and Math.',
    details: [
      'Guided students in algorithmic thinking, data structures, and foundational programming concepts.',
      'Built quizzes and exam-prep resources including concise guides and quick-reference sheets.',
      "Supported drafting and review preparation for IAs and EEs."
    ],
    links: [
      {
        label: 'LinkedIn',
        href: 'https://linkedin.com/in/vihaansinghal-21baa6379'
      }
    ],
    accent: 'neon' as Accent
  },
  {
    role: 'STEM Instructor',
    org: 'GoCode Academy',
    logo: '/assets/logos/organizations/gocode.jpeg',
    period: 'March 2022 - March 2023 (1 year 1 month)',
    location: 'Remote',
    description:
      'Delivered structured coding instruction using Scratch and introductory Python for primary and middle school students.',
    details: [
      'Designed a foundational Python curriculum for students transitioning from block-based programming.',
      'Taught robotics fundamentals with LEGO-based kits covering logic, sensors, and control systems.',
      'Led Raspberry Pi workshops to demonstrate practical hardware-software integration.',
      'Guided motion and sensor programming using Sphero BOLT robotics systems.',
      'Completed full instructor training certification prior to program delivery.'
    ],
    links: [
      {
        label: 'LinkedIn',
        href: 'https://linkedin.com/in/vihaansinghal-21baa6379'
      }
    ],
    accent: 'cyan' as Accent
  }
];

export const contact = {
  subtitle:
    'Always open to interesting projects, research collabs, and new opportunities. Drop a line.',
  cards: [
    {
      label: 'Email',
      value: 'thevihaansinghal@gmail.com',
      href: 'mailto:thevihaansinghal@gmail.com',
      accent: 'neon' as Accent
    },
    {
      label: 'LinkedIn',
      value: 'linkedin.com/in/vihaansinghal-21baa6379',
      href: 'https://linkedin.com/in/vihaansinghal-21baa6379',
      accent: 'cyan' as Accent
    },
    {
      label: 'GitHub',
      value: 'github.com/Vihaan-Singhal1',
      href: 'https://github.com/Vihaan-Singhal1',
      accent: 'cyan' as Accent
    },
    {
      label: 'Devpost',
      value: 'devpost.com/Vihaan-Singhal1',
      href: 'https://devpost.com/Vihaan-Singhal1',
      accent: 'cyan' as Accent
    }
  ],
  locationLine: 'Hamilton, Ontario, Canada - +1 647 464 5032'
};

export const footer = {
  left: '© 2026 Vihaan Singhal',
  rightPrefix: 'designed and built with',
  rightSuffix: 'and too much caffeine',
  profileName: 'Vihaan Singhal',
  profileSummary:
    'Applied AI and full-stack engineering focused on secure systems, usable interfaces, and production-ready implementation.',
  cta: [
    {
      label: 'Resume',
      href: 'https://linkedin.com/in/vihaansinghal-21baa6379'
    },
    {
      label: 'Contact',
      href: '#contact'
    }
  ]
};
