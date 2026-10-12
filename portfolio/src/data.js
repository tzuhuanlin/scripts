// ✏️  Edit this file to make the portfolio yours.
// Everything shown in the 3D scene and the simple view comes from here.

export const profile = {
  name: 'Your Name',
  role: 'Software Engineer',
  tagline: 'I build things for the web — and sometimes in 3D.',
  location: 'Somewhere on Earth',
  about: [
    "I'm a developer who enjoys turning ideas into fast, delightful software.",
    'Lately I have been working on developer tooling, automation scripts, and interactive graphics.',
    'When I am away from the keyboard you will find me reading, hiking, or brewing too much coffee.',
  ],
}

// Each skill becomes a book on the shelf. `color` is the book spine.
export const skills = [
  { name: 'JavaScript', color: '#f7df1e' },
  { name: 'TypeScript', color: '#3178c6' },
  { name: 'React', color: '#61dafb' },
  { name: 'Three.js', color: '#e8e8e8' },
  { name: 'Node.js', color: '#5fa04e' },
  { name: 'Python', color: '#3776ab' },
  { name: 'Go', color: '#00add8' },
  { name: 'SQL', color: '#e38c00' },
  { name: 'GLSL', color: '#5586a4' },
  { name: 'Docker', color: '#2496ed' },
  { name: 'AWS', color: '#ff9900' },
  { name: 'Bash', color: '#4eaa25' },
  { name: 'Git', color: '#f05032' },
  { name: 'Figma', color: '#a259ff' },
]

// Projects are shown on the monitor once the camera zooms in.
export const projects = [
  {
    title: 'scripts',
    year: '2026',
    description:
      'A grab-bag of small, sharp utilities — including a drop-in dark mode toggle — that remove friction from everyday work.',
    tech: ['JavaScript', 'Bash'],
    link: 'https://github.com/tzuhuanlin/scripts',
  },
  {
    title: '3D Portfolio',
    year: '2026',
    description:
      'This site. A procedurally built desk scene with a scroll-driven camera, live day/night window, and an interactive monitor.',
    tech: ['React Three Fiber', 'drei', 'GLSL'],
    link: 'https://github.com/tzuhuanlin/scripts/tree/main/portfolio',
  },
  {
    title: 'Project Three',
    year: '2025',
    description: 'Describe what you built, the problem it solved, and the impact it had. Numbers are great here.',
    tech: ['TypeScript', 'Node.js', 'Postgres'],
    link: '#',
  },
  {
    title: 'Project Four',
    year: '2024',
    description: 'Another highlight. Keep each description to two sentences so it fits nicely on the screen.',
    tech: ['Python', 'AWS'],
    link: '#',
  },
]

export const contact = {
  email: 'hello@example.com',
  links: [
    { label: 'GitHub', href: 'https://github.com/tzuhuanlin' },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/' },
  ],
}
