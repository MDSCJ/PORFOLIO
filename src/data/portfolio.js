// Single source of truth for site content (sourced from Chamath_Jayasinghe_CV.pdf).
// Edit this file to update the portfolio; the UI reads everything from here.

export const profile = {
  name: 'Chamath Jayasinghe',
  fullName: 'M. D. S. Chamath Jayasinghe',
  role: 'CSE Undergraduate · University of Moratuwa',
  tagline: 'Building robust backend architectures, training computer vision models, and experimenting with hardware logic.',
  bio: [
    'Computer Science & Engineering undergraduate at the University of Moratuwa. My technical experience is a mix of logic and creativity — I build full-stack platforms as a hobby and train YOLO models for computer vision tasks in conservation projects.',
    "I love late-night hackathons and turning ideas into reality. I'm currently learning full-stack development, distributed systems and machine learning, aiming to become a well-rounded engineer across these areas.",
  ],
  // From the GitHub profile README.
  focus: ['Computer Vision', 'Backend Engineering', 'Hardware Logic'],
}

// Skill groups from the GitHub profile README. Groups with many items auto-scroll (see ui/Skills.jsx).
export const skills = [
  {
    group: 'Languages',
    items: ['C', 'C++', 'Java', 'Python', 'JavaScript', 'TypeScript', 'HTML5', 'CSS3', 'SQL', 'VHDL', 'Assembly (RISC-V)'],
  },
  { group: 'Computer Vision & AI', items: ['YOLO', 'EfficientNet', 'PyTorch', 'OpenCV', 'KNN'] },
  {
    group: 'Frontend, Backend & DB',
    items: ['React', 'Spring Boot', 'Django', 'Node.js', 'Express.js', 'MySQL', 'TiDB'],
  },
  {
    group: 'Hardware, OS & Tools',
    items: ['Linux (Kubuntu)', 'Git', 'GitHub', 'Docker', 'VS Code', 'Xilinx Vivado', 'Pintos', 'Basys 3 FPGA', 'Ripes'],
  },
  { group: 'Design & Prototyping', items: ['Adobe Photoshop', 'Canva', 'ComfyUI'] },
]

export const projects = [
  {
    title: 'Shark Species Identification',
    year: '2024 – 2025',
    tags: ['Python', 'YOLO v8 / v11', 'Computer Vision'],
    summary:
      'Object detection models trained on 32,000 annotated underwater shark images, covering the full ML pipeline. Presented at Sharks International 2026.',
    link: 'https://github.com/mdscj/Shark_key',
  },
  {
    title: 'Snip Me',
    year: '2024',
    tags: ['Spring Boot', 'MySQL', 'Maven'],
    summary:
      'Full-stack salon booking platform: user registration, service listings, appointment scheduling and booking management on an MVC backend.',
    link: 'https://github.com/mdscj/SNIP_ME',
  },
  {
    title: 'VHDL FPGA Processor',
    year: '2024',
    tags: ['VHDL', 'Basys 3', 'Digital Logic'],
    summary:
      'A 4-bit nano processor built from scratch with fetch/decode/execute stages, an arithmetic unit and ripple-carry adders, synthesized and tested on a Basys 3 board.',
    link: 'https://github.com/mdscj/Nano_Processor',
  },
  {
    title: 'ResQlink',
    year: '2024',
    tags: ['Java', 'Spring Boot', 'MongoDB'],
    summary:
      'Flood rescue management system built with the STARC team, with a companion tool that collects data from people in flooded areas to coordinate food and supplies.',
    link: 'https://github.com/mdscj/ResQlink',
  },
  {
    title: 'Team Seraffins',
    year: '2024',
    tags: ['Spring Boot', 'MongoDB', 'Aiven'],
    summary:
      'Website for SERAFFINS, a shark-protection research organisation (seraffins.com) — hosting the site and maintaining its Aiven database for accounts.',
    link: 'https://seraffins.com',
  },
]

export const publications = [
  {
    title: 'A Deep Convolutional Neural Network Approach for Automated Shark Species Identification',
    venue: 'Sharks International 2026 · Conference Paper A-0532',
    link: 'https://si2026.org/programme/full-programme-schedule',
  },
  {
    title:
      'Spatially Explicit Habitat Prediction for Apex Predators: Integrating Multi-Stage Movement Ecology with NASA Oceanographic Data in a 3D GIS Framework',
    venue: 'Sharks International 2026 · Conference Paper A-0535',
    link: 'https://si2026.org/programme/full-programme-schedule',
  },
]

export const achievements = [
  'Global Nominee — NASA Space Apps Challenge 2025',
  'Galactic Impact Award — NASA Space Apps Challenge 2025 (Colombo)',
  'Participant — Sri Lanka IoT (SLIoT) Hackathon',
  'NVIDIA DLI Certification — Machine Learning',
  'NVQ Level 4 — Graphic Design',
  'Member — SEDS Moratuwa',
]

export const education = [
  { title: 'B.Sc. Engineering — Computer Science & Engineering', institution: 'University of Moratuwa', note: 'In progress' },
  { title: 'G.C.E. Advanced Level', institution: 'MR/Rahula College', note: 'A grades across subjects' },
  { title: 'G.C.E. Ordinary Level', institution: 'MR/Mahinda Rajapaksa College', note: "8 A's and a B" },
].map((e) => ({ ...e, detail: `${e.institution} · ${e.note}` }))

export const contact = {
  email: 'm.d.s.chamath@gmail.com',
  github: 'https://github.com/mdscj',
  linkedin: 'https://www.linkedin.com/in/mdscj',
  telegram: 'https://t.me/ChamathJayasingha',
}

// Section order drives both the nav and the 3D scroll keyframes (see canvas/ScrollRig.jsx).
export const sections = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'skills', label: 'Skills' },
  { id: 'work', label: 'Work' },
  { id: 'research', label: 'Research' },
  { id: 'contact', label: 'Contact' },
]
