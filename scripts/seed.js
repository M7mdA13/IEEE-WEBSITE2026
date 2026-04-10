/**
 * Seed script — populates MongoDB with the current static data from src/data/
 * Run once: node backend/scripts/seed.js
 *
 * WARNING: This drops and repopulates Committee, Member, Event, ExCom, Partner,
 * Page, RecruitmentStatus, and creates one default admin User.
 */

require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const Committee = require('../models/Committee');
const Member = require('../models/Member');
const Event = require('../models/Event');
const ExCom = require('../models/ExCom');
const Partner = require('../models/Partner');
const Page = require('../models/Page');
const RecruitmentStatus = require('../models/RecruitmentStatus');
const User = require('../models/User');

// ── Static data (mirrors src/data/committees.js) ─────────────────────────────

const committees = [
  {
    slug: 'ai', name: 'Artificial Intelligence', category: 'technical',
    icon: 'fa-brain', image: '/images/cbe2600245fb49ed48316b7bd1773a43229f645c.png',
    tagline: "Guiding machines to learn so they don't guide us (yet).",
    shortDesc: 'We create intelligent systems that learn and make decisions, exploring machine learning, neural networks, and AI-driven solutions.',
    goals: [
      { title: 'Explore AI Concepts', desc: 'Introduce members to the foundations of Artificial Intelligence and its role in shaping the future of technology.' },
      { title: 'Encourage Collaboration', desc: 'Introduce members to the foundations of Artificial Intelligence and its role in shaping the future of technology.' },
      { title: 'Promote Creativity', desc: 'Introduce members to the foundations of Artificial Intelligence and its role in shaping the future of technology.' },
      { title: 'Advance AI Knowledge', desc: 'Introduce members to the foundations of Artificial Intelligence and its role in shaping the future of technology.' },
      { title: 'Connect Theory to Practice', desc: 'Introduce members to the foundations of Artificial Intelligence and its role in shaping the future of technology.' },
      { title: 'Empower Growth', desc: 'Introduce members to the foundations of Artificial Intelligence and its role in shaping the future of technology.' },
    ],
    activities: [
      { title: 'Educational Sessions', desc: 'Conducting interactive sessions on AI concepts, tools, and real-world applications.' },
      { title: 'Competitive Challenges', desc: 'Competing in AI-focused hackathons and challenges to apply knowledge and develop innovative solutions.' },
      { title: 'Workshops & Training', desc: 'Hands-on workshops covering machine learning frameworks, data science tools, and AI development practices.' },
    ],
    order: 1,
    board: [
      { name: 'Firstname Lastname', roleType: 'head', role: 'Artificial Intelligence Head', bio: 'A professional AI Engineer with expertise in ML, DL, CV, NLP, Optimization and GenAI.' },
      { name: 'Firstname Lastname', roleType: 'vice_head', role: 'Artificial Intelligence Vice Head', bio: 'A professional AI Engineer with expertise in ML, DL, CV, NLP, Optimization and GenAI.' },
    ],
    members: [
      { name: 'Firstname Lastname', roleType: 'featured', role: 'AI Researcher', bio: 'Lorem ipsum dolor sit amet.', stars: 4 },
      { name: 'Firstname Lastname', roleType: 'featured', role: 'AI Researcher', bio: 'Lorem ipsum dolor sit amet.', stars: 4 },
      { name: 'Firstname Lastname', roleType: 'featured', role: 'AI Researcher', bio: 'Lorem ipsum dolor sit amet.', stars: 4 },
    ],
  },
  {
    slug: 'cybersecurity', name: 'Cybersecurity', category: 'technical',
    icon: 'fa-shield-halved', image: '/images/cyber.png',
    tagline: 'Defending the digital world, one vulnerability at a time.',
    shortDesc: 'We focus on protecting systems and data through encryption, ethical hacking, and network security.',
    goals: [
      { title: 'Explore Security Concepts', desc: 'Introduce members to the core principles of cybersecurity.' },
      { title: 'Build Defensive Skills', desc: 'Equip members with practical knowledge to identify and mitigate threats.' },
      { title: 'Promote Ethical Hacking', desc: 'Foster a responsible security mindset through CTF competitions.' },
      { title: 'Advance Technical Expertise', desc: 'Deepen understanding of cryptography and network security.' },
      { title: 'Connect Theory to Practice', desc: 'Bridge academic concepts with real-world scenarios.' },
      { title: 'Empower Growth', desc: 'Develop professional skills for cybersecurity careers.' },
    ],
    activities: [
      { title: 'Educational Sessions', desc: 'Interactive sessions on cybersecurity concepts, tools, and real-world applications.' },
      { title: 'CTF Competitions', desc: 'Capture the Flag competitions to develop offensive and defensive security skills.' },
      { title: 'Workshops & Training', desc: 'Practical workshops on penetration testing, network defense, and cryptography.' },
    ],
    order: 2,
    board: [
      { name: 'Firstname Lastname', roleType: 'head', role: 'Cybersecurity Head', bio: 'A passionate cybersecurity professional with expertise in ethical hacking and network security.' },
      { name: 'Firstname Lastname', roleType: 'vice_head', role: 'Cybersecurity Vice Head', bio: 'A dedicated security researcher with hands-on experience in penetration testing.' },
    ],
    members: [
      { name: 'Firstname Lastname', roleType: 'featured', role: 'CTF Player', bio: 'Lorem ipsum dolor sit amet.', stars: 4 },
      { name: 'Firstname Lastname', roleType: 'featured', role: 'CTF Player', bio: 'Lorem ipsum dolor sit amet.', stars: 4 },
      { name: 'Firstname Lastname', roleType: 'featured', role: 'CTF Player', bio: 'Lorem ipsum dolor sit amet.', stars: 4 },
    ],
  },
  {
    slug: 'embedded', name: 'Embedded Systems', category: 'technical',
    icon: 'fa-microchip', image: '/images/embedded.png',
    tagline: 'Where hardware meets software to power the real world.',
    shortDesc: 'We develop smart systems for devices like robots and IoT, combining hardware and software.',
    goals: [
      { title: 'Explore Embedded Concepts', desc: 'Introduce members to the fundamentals of embedded systems.' },
      { title: 'Build Hardware Skills', desc: 'Equip members with hands-on experience in circuit design and microcontrollers.' },
      { title: 'Promote Innovation', desc: 'Inspire creative solutions through IoT projects and robotics.' },
      { title: 'Advance Technical Expertise', desc: 'Deepen understanding of RTOS and firmware development.' },
      { title: 'Connect Theory to Practice', desc: 'Bridge classroom concepts with real hardware deployments.' },
      { title: 'Empower Growth', desc: 'Develop career readiness in embedded systems and IoT.' },
    ],
    activities: [
      { title: 'Educational Sessions', desc: 'Interactive sessions on embedded systems concepts and microcontrollers.' },
      { title: 'Hardware Projects', desc: 'Building real-world projects including robotics and IoT devices using Arduino, STM32, and Raspberry Pi.' },
      { title: 'Workshops & Training', desc: 'Hands-on workshops covering circuit design and firmware development.' },
    ],
    order: 3,
    board: [
      { name: 'Firstname Lastname', roleType: 'head', role: 'Embedded Systems Head', bio: 'An experienced embedded systems engineer with deep knowledge of microcontrollers and IoT.' },
      { name: 'Firstname Lastname', roleType: 'vice_head', role: 'Embedded Systems Vice Head', bio: 'A skilled hardware developer specializing in PCB design and firmware development.' },
    ],
    members: [
      { name: 'Firstname Lastname', roleType: 'featured', role: 'Hardware Developer', bio: 'Lorem ipsum dolor sit amet.', stars: 4 },
      { name: 'Firstname Lastname', roleType: 'featured', role: 'Hardware Developer', bio: 'Lorem ipsum dolor sit amet.', stars: 4 },
      { name: 'Firstname Lastname', roleType: 'featured', role: 'Hardware Developer', bio: 'Lorem ipsum dolor sit amet.', stars: 4 },
    ],
  },
  {
    slug: 'web', name: 'Web Development', category: 'technical',
    icon: 'fa-globe', image: '/images/web.png',
    tagline: 'Building the web, one component at a time.',
    shortDesc: 'We design and build user-friendly websites and web applications, focusing on coding, design, and interactive features.',
    goals: [
      { title: 'Explore Web Technologies', desc: 'Introduce members to modern web frameworks and best practices.' },
      { title: 'Build Development Skills', desc: 'Equip members with practical coding experience through structured projects.' },
      { title: 'Promote UI/UX Design', desc: 'Foster a design-first mindset exploring user experience principles.' },
      { title: 'Advance Technical Expertise', desc: "Deepen members' proficiency in JavaScript, React, and Node.js." },
      { title: 'Connect Theory to Practice', desc: 'Bridge academic concepts with real end-to-end web application projects.' },
      { title: 'Empower Growth', desc: 'Develop professional portfolios and career readiness in web development.' },
    ],
    activities: [
      { title: 'Educational Sessions', desc: 'Interactive sessions on web technologies, frameworks, and real-world applications.' },
      { title: 'Project Building', desc: 'Collaborating on real web projects from concept to deployment.' },
      { title: 'Workshops & Training', desc: 'Hands-on workshops covering HTML/CSS, JavaScript, REST APIs, and databases.' },
    ],
    order: 4,
    board: [
      { name: 'Firstname Lastname', roleType: 'head', role: 'Web Development Head', bio: 'A full-stack developer with expertise in React, Node.js, and cloud deployment.' },
      { name: 'Firstname Lastname', roleType: 'vice_head', role: 'Web Development Vice Head', bio: 'A frontend specialist with a strong eye for UI/UX design.' },
    ],
    members: [
      { name: 'Firstname Lastname', roleType: 'featured', role: 'Frontend Developer', bio: 'Lorem ipsum dolor sit amet.', stars: 4 },
      { name: 'Firstname Lastname', roleType: 'featured', role: 'Frontend Developer', bio: 'Lorem ipsum dolor sit amet.', stars: 4 },
      { name: 'Firstname Lastname', roleType: 'featured', role: 'Frontend Developer', bio: 'Lorem ipsum dolor sit amet.', stars: 4 },
    ],
  },
  {
    slug: 'multimedia', name: 'Multimedia', category: 'non-technical',
    icon: 'fa-photo-film', image: null,
    tagline: 'Telling stories through pixels, frames, and designs.',
    shortDesc: 'We handle visual storytelling for IEEE MUST SB through photography, videography, graphic design, and creative content production.',
    goals: [
      { title: 'Explore Creative Tools', desc: 'Introduce members to industry-standard software in photography and design.' },
      { title: 'Build Visual Skills', desc: 'Equip members with practical skills in composition and editing.' },
      { title: 'Promote Storytelling', desc: 'Foster compelling narratives through photo essays and video documentaries.' },
      { title: 'Advance Design Expertise', desc: "Deepen members' mastery of Adobe Creative Suite." },
      { title: 'Connect Creativity to Projects', desc: 'Apply creative skills to real IEEE MUST SB events and campaigns.' },
      { title: 'Empower Growth', desc: 'Develop creative portfolios and professional readiness in multimedia.' },
    ],
    activities: [
      { title: 'Creative Sessions', desc: 'Sessions on photography, video editing, motion graphics, and graphic design.' },
      { title: 'Event Coverage', desc: 'Documenting IEEE MUST SB events through professional photography and videography.' },
      { title: 'Workshops & Training', desc: 'Hands-on workshops using Adobe Photoshop, Premiere Pro, After Effects, and Illustrator.' },
    ],
    order: 5,
    board: [
      { name: 'Firstname Lastname', roleType: 'head', role: 'Multimedia Head', bio: 'A creative professional with expertise in visual media production.' },
      { name: 'Firstname Lastname', roleType: 'vice_head', role: 'Multimedia Vice Head', bio: 'A skilled graphic designer and video editor.' },
    ],
    members: [
      { name: 'Firstname Lastname', roleType: 'featured', role: 'Photographer', bio: 'Lorem ipsum dolor sit amet.', stars: 4 },
      { name: 'Firstname Lastname', roleType: 'featured', role: 'Video Editor', bio: 'Lorem ipsum dolor sit amet.', stars: 4 },
      { name: 'Firstname Lastname', roleType: 'featured', role: 'Graphic Designer', bio: 'Lorem ipsum dolor sit amet.', stars: 4 },
    ],
  },
  {
    slug: 'hr', name: 'Human Resources', category: 'non-technical',
    icon: 'fa-people-group', image: null,
    tagline: 'Building the team that builds the branch.',
    shortDesc: 'We manage recruitment, onboarding, and member well-being, ensuring the branch attracts the right talent.',
    goals: [
      { title: 'Explore Organizational Skills', desc: 'Introduce members to the principles of HR management.' },
      { title: 'Build Team Culture', desc: 'Foster an inclusive environment where every member feels valued.' },
      { title: 'Promote Talent Development', desc: 'Identify and nurture individual strengths through development programs.' },
      { title: 'Advance Leadership Expertise', desc: 'Deepen understanding of leadership and conflict resolution.' },
      { title: 'Connect People to Opportunities', desc: "Bridge members' skills with meaningful roles within the branch." },
      { title: 'Empower Growth', desc: 'Develop career readiness in HR and organizational management.' },
    ],
    activities: [
      { title: 'Recruitment Drives', desc: 'Organizing and managing the branch recruitment process end-to-end.' },
      { title: 'Team Building', desc: 'Planning team-building activities and social events across all committees.' },
      { title: 'Workshops & Training', desc: 'Hosting workshops on professional skills, communication, and leadership.' },
    ],
    order: 6,
    board: [
      { name: 'Firstname Lastname', roleType: 'head', role: 'Human Resources Head', bio: 'An organizational leader with a talent for identifying potential and building strong teams.' },
      { name: 'Firstname Lastname', roleType: 'vice_head', role: 'Human Resources Vice Head', bio: 'A people-focused professional dedicated to member engagement and well-being.' },
    ],
    members: [
      { name: 'Firstname Lastname', roleType: 'featured', role: 'HR Coordinator', bio: 'Lorem ipsum dolor sit amet.', stars: 4 },
      { name: 'Firstname Lastname', roleType: 'featured', role: 'HR Coordinator', bio: 'Lorem ipsum dolor sit amet.', stars: 4 },
      { name: 'Firstname Lastname', roleType: 'featured', role: 'HR Coordinator', bio: 'Lorem ipsum dolor sit amet.', stars: 4 },
    ],
  },
  {
    slug: 'marketing', name: 'Marketing', category: 'non-technical',
    icon: 'fa-bullhorn', image: null,
    tagline: 'Turning ideas into impact through strategy and creativity.',
    shortDesc: "We drive awareness and engagement for IEEE MUST SB through digital campaigns, social media strategy, and creative brand storytelling.",
    goals: [
      { title: 'Explore Marketing Channels', desc: "Introduce members to digital and traditional marketing channels." },
      { title: 'Build Campaign Skills', desc: 'Equip members with tools to plan and execute effective marketing campaigns.' },
      { title: 'Promote Brand Storytelling', desc: "Foster authentic brand narratives that resonate with the community." },
      { title: 'Advance Digital Expertise', desc: "Deepen members' proficiency in social media, analytics, and SEO." },
      { title: 'Connect Strategy to Execution', desc: 'Bridge marketing theory with real campaigns for branch initiatives.' },
      { title: 'Empower Growth', desc: 'Develop career readiness in marketing and digital communications.' },
    ],
    activities: [
      { title: 'Campaign Planning', desc: 'Developing and executing marketing campaigns for events and recruitment.' },
      { title: 'Social Media Management', desc: "Creating and scheduling content across IEEE MUST SB's social platforms." },
      { title: 'Workshops & Training', desc: 'Sessions on digital marketing, content strategy, analytics, and branding.' },
    ],
    order: 7,
    board: [
      { name: 'Firstname Lastname', roleType: 'head', role: 'Marketing Head', bio: "A strategic marketer with a strong background in digital campaigns and brand development." },
      { name: 'Firstname Lastname', roleType: 'vice_head', role: 'Marketing Vice Head', bio: 'A creative content strategist skilled in social media management and copywriting.' },
    ],
    members: [
      { name: 'Firstname Lastname', roleType: 'featured', role: 'Content Creator', bio: 'Lorem ipsum dolor sit amet.', stars: 4 },
      { name: 'Firstname Lastname', roleType: 'featured', role: 'Content Creator', bio: 'Lorem ipsum dolor sit amet.', stars: 4 },
      { name: 'Firstname Lastname', roleType: 'featured', role: 'Content Creator', bio: 'Lorem ipsum dolor sit amet.', stars: 4 },
    ],
  },
  {
    slug: 'pr', name: 'Public Relations', category: 'non-technical',
    icon: 'fa-handshake', image: null,
    tagline: 'Connecting the branch to the world, one relationship at a time.',
    shortDesc: "We build and maintain IEEE MUST SB's external relationships, managing partnerships, outreach, and the branch's public image.",
    goals: [
      { title: 'Explore Public Relations', desc: 'Introduce members to PR principles and their role in building trust.' },
      { title: 'Build Communication Skills', desc: 'Equip members with professional communication and negotiation capabilities.' },
      { title: 'Promote Networking', desc: 'Foster meaningful connections with companies and industry partners.' },
      { title: 'Advance Professional Presence', desc: 'Deepen understanding of media relations and stakeholder management.' },
      { title: 'Connect Branch to Community', desc: 'Bridge IEEE MUST SB with the broader engineering community.' },
      { title: 'Empower Growth', desc: 'Develop career readiness in communications and relationship management.' },
    ],
    activities: [
      { title: 'Partnership Development', desc: 'Establishing relationships with companies, universities, and organizations.' },
      { title: 'Event Outreach', desc: 'Coordinating external communications for branch events and sponsorships.' },
      { title: 'Workshops & Training', desc: 'Sessions on public speaking, networking, and relationship management.' },
    ],
    order: 8,
    board: [
      { name: 'Firstname Lastname', roleType: 'head', role: 'Public Relations Head', bio: 'A skilled communicator with a wide professional network.' },
      { name: 'Firstname Lastname', roleType: 'vice_head', role: 'Public Relations Vice Head', bio: 'An outgoing professional focused on community engagement and stakeholder relations.' },
    ],
    members: [
      { name: 'Firstname Lastname', roleType: 'featured', role: 'PR Specialist', bio: 'Lorem ipsum dolor sit amet.', stars: 4 },
      { name: 'Firstname Lastname', roleType: 'featured', role: 'PR Specialist', bio: 'Lorem ipsum dolor sit amet.', stars: 4 },
      { name: 'Firstname Lastname', roleType: 'featured', role: 'PR Specialist', bio: 'Lorem ipsum dolor sit amet.', stars: 4 },
    ],
  },
];

// ── Events ────────────────────────────────────────────────────────────────────

const events = [
  {
    title: 'IEEE MUST Tech Summit 2025',
    description: 'Our flagship annual tech summit bringing together students, professionals, and industry leaders for a full day of talks, workshops, and networking. Topics this year span AI, cybersecurity, embedded systems, and the future of engineering education.',
    date: new Date('2025-05-15T09:00:00'),
    location: 'MUST University Main Auditorium, Giza',
    image: null,
    status: 'upcoming',
    registrationLink: '#',
    agendaLink: null,
    recapLink: null,
    attendanceCount: null,
  },
  {
    title: 'AI Workshop: Hands-On Machine Learning',
    description: 'A two-day intensive workshop covering the fundamentals of machine learning with Python and scikit-learn. Participants built and evaluated their first models by the end of day two.',
    date: new Date('2024-11-20T10:00:00'),
    location: 'IEEE MUST Lab Room 204',
    image: null,
    status: 'completed',
    registrationLink: null,
    agendaLink: null,
    recapLink: '#',
    attendanceCount: 47,
  },
  {
    title: 'Cybersecurity CTF Challenge',
    description: 'An eight-hour Capture the Flag competition designed for beginners and intermediate players alike. Teams of three competed across web exploitation, cryptography, reverse engineering, and OSINT categories.',
    date: new Date('2024-10-05T14:00:00'),
    location: 'MUST University Computer Lab B',
    image: null,
    status: 'completed',
    registrationLink: null,
    agendaLink: null,
    recapLink: '#',
    attendanceCount: 62,
  },
  {
    title: 'Web Dev Bootcamp: React & Node.js',
    description: 'A three-session bootcamp walking participants through building a full-stack web application from scratch. Covered React component architecture, REST API design, and MongoDB integration.',
    date: new Date('2024-08-12T11:00:00'),
    location: 'Online — Zoom',
    image: null,
    status: 'completed',
    registrationLink: null,
    agendaLink: null,
    recapLink: '#',
    attendanceCount: 83,
  },
  {
    title: 'IEEE MUST Recruitment Drive 2024',
    description: 'The official annual recruitment event for IEEE MUST Student Branch. New students learned about each committee, met current members, and submitted applications for the 2024–2025 academic year.',
    date: new Date('2024-09-25T12:00:00'),
    location: 'MUST University Engineering Faculty Hall',
    image: null,
    status: 'completed',
    registrationLink: null,
    agendaLink: null,
    recapLink: null,
    attendanceCount: 130,
  },
];

// ── ExCom ─────────────────────────────────────────────────────────────────────

const excom = [
  {
    name: 'Mahmoud Alsonbaty',
    role: 'Chairman',
    department: 'Executive Committee',
    bio: 'Leading IEEE MUST Student Branch with a focus on technical excellence, community growth, and impactful student initiatives.',
    photo: '/images/alsonbaty copy.png',
    email: 'chairman@ieeemust.com',
    linkedin: '#',
    github: '#',
    order: 1,
    isActive: true,
  },
  {
    name: 'Shahd Abdelaziz',
    role: 'Vice Chair',
    department: 'Executive Committee',
    bio: 'Supporting branch operations and ensuring collaboration across all committees to deliver memorable experiences for every member.',
    photo: '/images/shahd copy.png',
    email: 'vicechair@ieeemust.com',
    linkedin: '#',
    github: '#',
    order: 2,
    isActive: true,
  },
  {
    name: 'Mostafa Samir',
    role: 'Treasurer',
    department: 'Executive Committee',
    bio: 'Managing the branch budget, sponsorships, and financial planning to keep IEEE MUST running smoothly throughout the year.',
    photo: '/images/moustafa copy.png',
    email: 'treasurer@ieeemust.com',
    linkedin: '#',
    github: '#',
    order: 3,
    isActive: true,
  },
  {
    name: 'Karima Ayman',
    role: 'Secretary',
    department: 'Executive Committee',
    bio: 'Keeping the branch organized — managing meeting minutes, internal communications, and official documentation for all activities.',
    photo: '/images/karima copy.png',
    email: 'secretary@ieeemust.com',
    linkedin: '#',
    github: '#',
    order: 4,
    isActive: true,
  },
  {
    name: 'Mennatallah Mostafa',
    role: 'Webmaster',
    department: 'Executive Committee',
    bio: 'Building and maintaining the IEEE MUST digital presence — from the website you are reading right now to internal tools and platforms.',
    photo: '/images/Mennatallah copy.png',
    email: 'webmaster@ieeemust.com',
    linkedin: '#',
    github: '#',
    order: 5,
    isActive: true,
  },
];

// ── Partners ──────────────────────────────────────────────────────────────────

const partners = [
  { name: 'Partner 1',  logo: '/images/partner 1.png',  category: 'Industry',  order: 1,  isActive: true, website: null },
  { name: 'Partner 2',  logo: '/images/partner 2.png',  category: 'Industry',  order: 2,  isActive: true, website: null },
  { name: 'Partner 3',  logo: '/images/partner 3.png',  category: 'Industry',  order: 3,  isActive: true, website: null },
  { name: 'Partner 4',  logo: '/images/partner 4.png',  category: 'Industry',  order: 4,  isActive: true, website: null },
  { name: 'Partner 5',  logo: '/images/partner 5.webp', category: 'Industry',  order: 5,  isActive: true, website: null },
  { name: 'Partner 6',  logo: '/images/partner 6.png',  category: 'Industry',  order: 6,  isActive: true, website: null },
  { name: 'Partner 7',  logo: '/images/partner 7.png',  category: 'Technology', order: 7, isActive: true, website: null },
  { name: 'Partner 8',  logo: '/images/partner 8.png',  category: 'Technology', order: 8, isActive: true, website: null },
  { name: 'Partner 9',  logo: '/images/partner 9.png',  category: 'Technology', order: 9, isActive: true, website: null },
  { name: 'Sponsor 1',  logo: '/images/logo1.png',      category: 'Sponsor',   order: 10, isActive: true, website: null },
  { name: 'Sponsor 2',  logo: '/images/logo2.png',      category: 'Sponsor',   order: 11, isActive: true, website: null },
  { name: 'Sponsor 3',  logo: '/images/logo3.png',      category: 'Sponsor',   order: 12, isActive: true, website: null },
  { name: 'Sponsor 4',  logo: '/images/logo4.png',      category: 'Sponsor',   order: 13, isActive: true, website: null },
  { name: 'Sponsor 5',  logo: '/images/logo5.png',      category: 'Sponsor',   order: 14, isActive: true, website: null },
];

const DEFAULT_ADMIN_EMAIL = 'adham@ieeemust.com';
const DEFAULT_ADMIN_PASSWORD = 'mido2004'; // CHANGE THIS IMMEDIATELY AFTER FIRST LOGIN

// ── Seed ─────────────────────────────────────────────────────────────────────

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to MongoDB');

  // Clear collections
  await Promise.all([
    Committee.deleteMany({}),
    Member.deleteMany({}),
    Event.deleteMany({}),
    ExCom.deleteMany({}),
    Partner.deleteMany({}),
    Page.deleteMany({}),
    RecruitmentStatus.deleteMany({}),
  ]);
  console.log('Cleared existing data');

  // Seed committees and their members
  for (const data of committees) {
    const { board, ...committeeData } = data;

    const committee = await Committee.create(committeeData);

    const members = board.map((m, i) => ({
      name: m.name,
      committee: committee._id,
      roleType: m.roleType,
      role: m.role,
      bio: m.bio,
      order: i,
      isActive: true,
    }));

    await Member.insertMany(members);
    console.log(`  Seeded: ${committee.name} (${members.length} members)`);
  }

  // Seed events
  await Event.insertMany(events);
  console.log(`Seeded ${events.length} events (1 upcoming, ${events.length - 1} completed)`);

  // Seed ExCom
  await ExCom.insertMany(excom);
  console.log(`Seeded ${excom.length} ExCom members`);

  // Seed partners
  await Partner.insertMany(partners);
  console.log(`Seeded ${partners.length} partners`);

  // Seed default pages (CMS content)
  await Page.insertMany([
    { key: 'about_stats', label: 'About page statistics', value: { members: 200, events: 50, committees: 8, yearsActive: 5 } },
    { key: 'home_hero_subtitle', label: 'Home page hero subtitle', value: 'IEEE MUST Student Branch — Building the future of technology.' },
  ]);
  console.log('Seeded CMS pages');

  // Seed recruitment status
  await RecruitmentStatus.create({ isOpen: false, message: 'Recruitment is currently closed. Stay tuned for announcements.' });
  console.log('Seeded recruitment status');

  // Create default admin user (only if none exists)
  const existingAdmin = await User.findOne({ email: DEFAULT_ADMIN_EMAIL });
  if (!existingAdmin) {
    const passwordHash = await bcrypt.hash(DEFAULT_ADMIN_PASSWORD, 12);
    await User.create({ name: 'Admin', email: DEFAULT_ADMIN_EMAIL, passwordHash, role: 'superadmin' });
    console.log('\n Default admin created:');
    console.log(`   Email:    ${DEFAULT_ADMIN_EMAIL}`);
    console.log(`   Password: ${DEFAULT_ADMIN_PASSWORD}`);
    console.log('   Change this password immediately after first login!\n');
  } else {
    console.log('Admin user already exists — skipping');
  }

  await mongoose.disconnect();
  console.log('Seed complete.');
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
