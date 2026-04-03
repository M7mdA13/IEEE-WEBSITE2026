/**
 * Seed script — populates MongoDB with the current static data from src/data/
 * Run once: node backend/scripts/seed.js
 *
 * WARNING: This drops and repopulates Committee, Member, Event, Page,
 * RecruitmentStatus, and creates one default admin User.
 */

require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const Committee = require('../models/Committee');
const Member = require('../models/Member');
const Event = require('../models/Event');
const Page = require('../models/Page');
const RecruitmentStatus = require('../models/RecruitmentStatus');
const User = require('../models/User');

// ── Static data (mirrors src/data/committees.js) ─────────────────────────────

const COMMON_ROLES = [
  'Attend all meetings, workshops, and activities regularly to stay engaged and contribute effectively.',
  'Provide learning resources, mentorship, and discussions that help members grow technically and professionally.',
  'Encourage collaboration and create an environment where ideas are shared, and innovation thrives.',
];

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
    roles: COMMON_ROLES,
    activities: [
      { title: 'Educational Sessions', desc: 'Conducting interactive sessions on AI concepts, tools, and real-world applications.' },
      { title: 'Competitive Challenges', desc: 'Competing in AI-focused hackathons and challenges to apply knowledge and develop innovative solutions.' },
      { title: 'Workshops & Training', desc: 'Hands-on workshops covering machine learning frameworks, data science tools, and AI development practices.' },
    ],
    order: 1,
    board: [
      { name: 'Firstname Lastname', roleType: 'head', role: 'Artificial Intelligence Head', bio: 'A professional AI Engineer with expertise in ML, DL, CV, NLP, Optimization and GenAI.', stars: null },
      { name: 'Firstname Lastname', roleType: 'vice_head', role: 'Artificial Intelligence Vice Head', bio: 'A professional AI Engineer with expertise in ML, DL, CV, NLP, Optimization and GenAI.', stars: null },
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
    roles: COMMON_ROLES,
    activities: [
      { title: 'Educational Sessions', desc: 'Interactive sessions on cybersecurity concepts, tools, and real-world applications.' },
      { title: 'CTF Competitions', desc: 'Capture the Flag competitions to develop offensive and defensive security skills.' },
      { title: 'Workshops & Training', desc: 'Practical workshops on penetration testing, network defense, and cryptography.' },
    ],
    order: 2,
    board: [
      { name: 'Firstname Lastname', roleType: 'head', role: 'Cybersecurity Head', bio: 'A passionate cybersecurity professional with expertise in ethical hacking and network security.', stars: null },
      { name: 'Firstname Lastname', roleType: 'vice_head', role: 'Cybersecurity Vice Head', bio: 'A dedicated security researcher with hands-on experience in penetration testing.', stars: null },
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
    roles: COMMON_ROLES,
    activities: [
      { title: 'Educational Sessions', desc: 'Interactive sessions on embedded systems concepts and microcontrollers.' },
      { title: 'Hardware Projects', desc: 'Building real-world projects including robotics and IoT devices using Arduino, STM32, and Raspberry Pi.' },
      { title: 'Workshops & Training', desc: 'Hands-on workshops covering circuit design and firmware development.' },
    ],
    order: 3,
    board: [
      { name: 'Firstname Lastname', roleType: 'head', role: 'Embedded Systems Head', bio: 'An experienced embedded systems engineer with deep knowledge of microcontrollers and IoT.', stars: null },
      { name: 'Firstname Lastname', roleType: 'vice_head', role: 'Embedded Systems Vice Head', bio: 'A skilled hardware developer specializing in PCB design and firmware development.', stars: null },
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
    roles: COMMON_ROLES,
    activities: [
      { title: 'Educational Sessions', desc: 'Interactive sessions on web technologies, frameworks, and real-world applications.' },
      { title: 'Project Building', desc: 'Collaborating on real web projects from concept to deployment.' },
      { title: 'Workshops & Training', desc: 'Hands-on workshops covering HTML/CSS, JavaScript, REST APIs, and databases.' },
    ],
    order: 4,
    board: [
      { name: 'Firstname Lastname', roleType: 'head', role: 'Web Development Head', bio: 'A full-stack developer with expertise in React, Node.js, and cloud deployment.', stars: null },
      { name: 'Firstname Lastname', roleType: 'vice_head', role: 'Web Development Vice Head', bio: 'A frontend specialist with a strong eye for UI/UX design.', stars: null },
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
    roles: COMMON_ROLES,
    activities: [
      { title: 'Creative Sessions', desc: 'Sessions on photography, video editing, motion graphics, and graphic design.' },
      { title: 'Event Coverage', desc: 'Documenting IEEE MUST SB events through professional photography and videography.' },
      { title: 'Workshops & Training', desc: 'Hands-on workshops using Adobe Photoshop, Premiere Pro, After Effects, and Illustrator.' },
    ],
    order: 5,
    board: [
      { name: 'Firstname Lastname', roleType: 'head', role: 'Multimedia Head', bio: 'A creative professional with expertise in visual media production.', stars: null },
      { name: 'Firstname Lastname', roleType: 'vice_head', role: 'Multimedia Vice Head', bio: 'A skilled graphic designer and video editor.', stars: null },
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
    roles: COMMON_ROLES,
    activities: [
      { title: 'Recruitment Drives', desc: 'Organizing and managing the branch recruitment process end-to-end.' },
      { title: 'Team Building', desc: 'Planning team-building activities and social events across all committees.' },
      { title: 'Workshops & Training', desc: 'Hosting workshops on professional skills, communication, and leadership.' },
    ],
    order: 6,
    board: [
      { name: 'Firstname Lastname', roleType: 'head', role: 'Human Resources Head', bio: 'An organizational leader with a talent for identifying potential and building strong teams.', stars: null },
      { name: 'Firstname Lastname', roleType: 'vice_head', role: 'Human Resources Vice Head', bio: 'A people-focused professional dedicated to member engagement and well-being.', stars: null },
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
    roles: COMMON_ROLES,
    activities: [
      { title: 'Campaign Planning', desc: 'Developing and executing marketing campaigns for events and recruitment.' },
      { title: 'Social Media Management', desc: "Creating and scheduling content across IEEE MUST SB's social platforms." },
      { title: 'Workshops & Training', desc: 'Sessions on digital marketing, content strategy, analytics, and branding.' },
    ],
    order: 7,
    board: [
      { name: 'Firstname Lastname', roleType: 'head', role: 'Marketing Head', bio: "A strategic marketer with a strong background in digital campaigns and brand development.", stars: null },
      { name: 'Firstname Lastname', roleType: 'vice_head', role: 'Marketing Vice Head', bio: 'A creative content strategist skilled in social media management and copywriting.', stars: null },
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
    roles: COMMON_ROLES,
    activities: [
      { title: 'Partnership Development', desc: 'Establishing relationships with companies, universities, and organizations.' },
      { title: 'Event Outreach', desc: 'Coordinating external communications for branch events and sponsorships.' },
      { title: 'Workshops & Training', desc: 'Sessions on public speaking, networking, and relationship management.' },
    ],
    order: 8,
    board: [
      { name: 'Firstname Lastname', roleType: 'head', role: 'Public Relations Head', bio: 'A skilled communicator with a wide professional network.', stars: null },
      { name: 'Firstname Lastname', roleType: 'vice_head', role: 'Public Relations Vice Head', bio: 'An outgoing professional focused on community engagement and stakeholder relations.', stars: null },
    ],
    members: [
      { name: 'Firstname Lastname', roleType: 'featured', role: 'PR Specialist', bio: 'Lorem ipsum dolor sit amet.', stars: 4 },
      { name: 'Firstname Lastname', roleType: 'featured', role: 'PR Specialist', bio: 'Lorem ipsum dolor sit amet.', stars: 4 },
      { name: 'Firstname Lastname', roleType: 'featured', role: 'PR Specialist', bio: 'Lorem ipsum dolor sit amet.', stars: 4 },
    ],
  },
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
    Page.deleteMany({}),
    RecruitmentStatus.deleteMany({}),
  ]);
  console.log('Cleared existing data');

  // Seed committees and their members
  for (const data of committees) {
    const { board, members: featuredMembers, ...committeeData } = data;

    const committee = await Committee.create(committeeData);

    const allMembers = [...board, ...featuredMembers].map((m, i) => ({
      name: m.name,
      committee: committee._id,
      roleType: m.roleType,
      role: m.role,
      bio: m.bio,
      stars: m.stars || undefined,
      order: i,
      isActive: true,
    }));

    await Member.insertMany(allMembers);
    console.log(`  Seeded: ${committee.name} (${allMembers.length} members)`);
  }

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
