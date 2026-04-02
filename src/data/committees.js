const COMMON_ROLES = [
  'Attend all meetings, workshops, and activities regularly to stay engaged and contribute effectively.',
  'Provide learning resources, mentorship, and discussions that help members grow technically and professionally.',
  'Encourage collaboration and create an environment where ideas are shared, and innovation thrives.',
];

const goalDesc = (text) => text;

export const committees = [
  {
    slug: 'ai',
    name: 'Artificial Intelligence',
    category: 'technical',
    icon: 'fa-brain',
    image: '/images/cbe2600245fb49ed48316b7bd1773a43229f645c.png',
    tagline: "Guiding machines to learn so they don't guide us (yet).",
    shortDesc:
      'We create intelligent systems that learn and make decisions, exploring machine learning, neural networks, and AI-driven solutions.',
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
      {
        title: 'Educational Sessions',
        desc: 'Conducting interactive sessions on AI concepts, tools, and real-world applications to help members strengthen their technical skills.',
      },
      {
        title: 'Competitive Challenges',
        desc: 'Competing in AI-focused hackathons and challenges to apply knowledge and develop innovative solutions under pressure.',
      },
      {
        title: 'Workshops & Training',
        desc: 'Hands-on workshops covering machine learning frameworks, data science tools, and AI development practices.',
      },
    ],
    board: [
      {
        name: 'Firstname Lastname',
        role: 'Artificial Intelligence Head',
        bio: 'A professional AI Engineer. Has completed advanced training programs with BUE, Zewail City, ITI, and NTI, and developed strong expertise in ML, DL, CV, NLP, Optimization and GenAI. With active participation & teaching in numerous AI-related sessions and events, has strengthened both technical, presentation and leadership skills. Combining a solid academic foundation with practical experience, continues to drive innovation and deliver impactful AI solutions.',
        photo: null,
        github: '#',
        linkedin: '#',
        email: '#',
      },
      {
        name: 'Firstname Lastname',
        role: 'Artificial Intelligence Vice Head',
        bio: 'A professional AI Engineer. Has completed advanced training programs with BUE, Zewail City, ITI, and NTI, and developed strong expertise in ML, DL, CV, NLP, Optimization and GenAI. With active participation & teaching in numerous AI-related sessions and events, has strengthened both technical, presentation and leadership skills. Combining a solid academic foundation with practical experience, continues to drive innovation and deliver impactful AI solutions.',
        photo: null,
        github: '#',
        linkedin: '#',
        email: '#',
      },
    ],
    members: [
      { name: 'Firstname Lastname', stars: 4, bio: 'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Rerum necessitatibus iusto amet.', photo: null, github: '#', linkedin: '#', email: '#' },
      { name: 'Firstname Lastname', stars: 4, bio: 'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Rerum necessitatibus iusto amet.', photo: null, github: '#', linkedin: '#', email: '#' },
      { name: 'Firstname Lastname', stars: 4, bio: 'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Rerum necessitatibus iusto amet.', photo: null, github: '#', linkedin: '#', email: '#' },
    ],
  },
  {
    slug: 'cybersecurity',
    name: 'Cybersecurity',
    category: 'technical',
    icon: 'fa-shield-halved',
    image: '/images/cyber.png',
    tagline: 'Defending the digital world, one vulnerability at a time.',
    shortDesc:
      'We focus on protecting systems and data through encryption, ethical hacking, and network security, hosting workshops and simulations.',
    goals: [
      { title: 'Explore Security Concepts', desc: 'Introduce members to the core principles of cybersecurity and their impact on protecting digital infrastructure.' },
      { title: 'Build Defensive Skills', desc: 'Equip members with practical knowledge to identify, analyze, and mitigate security threats effectively.' },
      { title: 'Promote Ethical Hacking', desc: 'Foster a responsible security mindset through hands-on CTF competitions and ethical hacking exercises.' },
      { title: 'Advance Technical Expertise', desc: 'Deepen members\' understanding of cryptography, network security, and digital forensics through targeted training.' },
      { title: 'Connect Theory to Practice', desc: 'Bridge academic security concepts with real-world scenarios via simulations and industry tools.' },
      { title: 'Empower Growth', desc: 'Develop members\' professional skills and readiness for careers in cybersecurity and information assurance.' },
    ],
    roles: COMMON_ROLES,
    activities: [
      {
        title: 'Educational Sessions',
        desc: 'Conducting interactive sessions on cybersecurity concepts, tools, and real-world applications to help members strengthen their technical skills.',
      },
      {
        title: 'CTF Competitions',
        desc: 'Participating in Capture the Flag competitions to develop offensive and defensive security skills in a hands-on environment.',
      },
      {
        title: 'Workshops & Training',
        desc: 'Practical workshops on penetration testing, network defense, cryptography, and security tools used in the industry.',
      },
    ],
    board: [
      { name: 'Firstname Lastname', role: 'Cybersecurity Head', bio: 'A passionate cybersecurity professional with expertise in ethical hacking, network security, and digital forensics. Has led multiple security awareness campaigns and CTF competitions within IEEE MUST SB, fostering a culture of security-first thinking among members.', photo: null, github: '#', linkedin: '#', email: '#' },
      { name: 'Firstname Lastname', role: 'Cybersecurity Vice Head', bio: 'A dedicated security researcher with hands-on experience in penetration testing and vulnerability assessment. Actively contributes to training sessions and helps coordinate the committee\'s technical workshops and competitions.', photo: null, github: '#', linkedin: '#', email: '#' },
    ],
    members: [
      { name: 'Firstname Lastname', stars: 4, bio: 'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Rerum necessitatibus iusto amet.', photo: null, github: '#', linkedin: '#', email: '#' },
      { name: 'Firstname Lastname', stars: 4, bio: 'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Rerum necessitatibus iusto amet.', photo: null, github: '#', linkedin: '#', email: '#' },
      { name: 'Firstname Lastname', stars: 4, bio: 'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Rerum necessitatibus iusto amet.', photo: null, github: '#', linkedin: '#', email: '#' },
    ],
  },
  {
    slug: 'embedded',
    name: 'Embedded Systems',
    category: 'technical',
    icon: 'fa-microchip',
    image: '/images/embedded.png',
    tagline: 'Where hardware meets software to power the real world.',
    shortDesc:
      'We develop smart systems for devices like robots and IoT, combining hardware and software using micro-controllers and sensors.',
    goals: [
      { title: 'Explore Embedded Concepts', desc: 'Introduce members to the fundamentals of embedded systems and their role in modern technology.' },
      { title: 'Build Hardware Skills', desc: 'Equip members with hands-on experience in circuit design, microcontrollers, and hardware-software integration.' },
      { title: 'Promote Innovation', desc: 'Inspire creative solutions through IoT projects, robotics challenges, and embedded system prototypes.' },
      { title: 'Advance Technical Expertise', desc: 'Deepen members\' understanding of RTOS, firmware development, and sensor integration through targeted training.' },
      { title: 'Connect Theory to Practice', desc: 'Bridge classroom concepts with real deployments via hardware projects and industry-standard tools.' },
      { title: 'Empower Growth', desc: 'Develop members\' professional skills and career readiness in the embedded systems and IoT field.' },
    ],
    roles: COMMON_ROLES,
    activities: [
      {
        title: 'Educational Sessions',
        desc: 'Conducting interactive sessions on embedded systems concepts, microcontrollers, and real-world applications to help members strengthen their skills.',
      },
      {
        title: 'Hardware Projects',
        desc: 'Building real-world embedded projects including robotics, IoT devices, and automation systems using Arduino, STM32, and Raspberry Pi.',
      },
      {
        title: 'Workshops & Training',
        desc: 'Hands-on workshops covering circuit design, firmware development, sensor integration, and embedded Linux programming.',
      },
    ],
    board: [
      { name: 'Firstname Lastname', role: 'Embedded Systems Head', bio: 'An experienced embedded systems engineer with deep knowledge of microcontrollers, RTOS, and IoT development. Has mentored dozens of members through hardware projects and represented the committee in multiple national competitions.', photo: null, github: '#', linkedin: '#', email: '#' },
      { name: 'Firstname Lastname', role: 'Embedded Systems Vice Head', bio: 'A skilled hardware developer specializing in PCB design and firmware development. Plays a key role in organizing the committee\'s workshops and guiding members through technical challenges.', photo: null, github: '#', linkedin: '#', email: '#' },
    ],
    members: [
      { name: 'Firstname Lastname', stars: 4, bio: 'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Rerum necessitatibus iusto amet.', photo: null, github: '#', linkedin: '#', email: '#' },
      { name: 'Firstname Lastname', stars: 4, bio: 'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Rerum necessitatibus iusto amet.', photo: null, github: '#', linkedin: '#', email: '#' },
      { name: 'Firstname Lastname', stars: 4, bio: 'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Rerum necessitatibus iusto amet.', photo: null, github: '#', linkedin: '#', email: '#' },
    ],
  },
  {
    slug: 'web',
    name: 'Web Development',
    category: 'technical',
    icon: 'fa-globe',
    image: '/images/web.png',
    tagline: 'Building the web, one component at a time.',
    shortDesc:
      'We design and build user-friendly websites and web applications, focusing on coding, design, and interactive features.',
    goals: [
      { title: 'Explore Web Technologies', desc: 'Introduce members to modern web frameworks, tools, and best practices in frontend and backend development.' },
      { title: 'Build Development Skills', desc: 'Equip members with practical coding experience through structured projects and collaborative development sessions.' },
      { title: 'Promote UI/UX Design', desc: 'Foster a design-first mindset by exploring user experience principles and interface design fundamentals.' },
      { title: 'Advance Technical Expertise', desc: 'Deepen members\' proficiency in JavaScript, React, Node.js, and deployment workflows.' },
      { title: 'Connect Theory to Practice', desc: 'Bridge academic concepts with real deployments through end-to-end web application projects.' },
      { title: 'Empower Growth', desc: 'Develop members\' professional portfolios and career readiness in the web development industry.' },
    ],
    roles: COMMON_ROLES,
    activities: [
      {
        title: 'Educational Sessions',
        desc: 'Conducting interactive sessions on web technologies, frameworks, and real-world applications to help members strengthen their development skills.',
      },
      {
        title: 'Project Building',
        desc: 'Collaborating on real web projects from concept to deployment, covering both frontend and backend development practices.',
      },
      {
        title: 'Workshops & Training',
        desc: 'Hands-on workshops covering HTML/CSS, JavaScript frameworks, REST APIs, databases, and modern deployment workflows.',
      },
    ],
    board: [
      { name: 'Firstname Lastname', role: 'Web Development Head', bio: 'A full-stack developer with expertise in React, Node.js, and cloud deployment. Has led the development of multiple IEEE MUST SB digital platforms and actively mentors members in modern web development practices.', photo: null, github: '#', linkedin: '#', email: '#' },
      { name: 'Firstname Lastname', role: 'Web Development Vice Head', bio: 'A frontend specialist with a strong eye for UI/UX design. Contributes to the committee\'s technical workshops and guides members in building polished, responsive web applications.', photo: null, github: '#', linkedin: '#', email: '#' },
    ],
    members: [
      { name: 'Firstname Lastname', stars: 4, bio: 'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Rerum necessitatibus iusto amet.', photo: null, github: '#', linkedin: '#', email: '#' },
      { name: 'Firstname Lastname', stars: 4, bio: 'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Rerum necessitatibus iusto amet.', photo: null, github: '#', linkedin: '#', email: '#' },
      { name: 'Firstname Lastname', stars: 4, bio: 'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Rerum necessitatibus iusto amet.', photo: null, github: '#', linkedin: '#', email: '#' },
    ],
  },
  {
    slug: 'multimedia',
    name: 'Multimedia',
    category: 'non-technical',
    icon: 'fa-photo-film',
    image: null,
    tagline: 'Telling stories through pixels, frames, and designs.',
    shortDesc:
      'We handle visual storytelling for IEEE MUST SB through photography, videography, graphic design, and creative content production.',
    goals: [
      { title: 'Explore Creative Tools', desc: 'Introduce members to industry-standard software and workflows used in photography, videography, and design.' },
      { title: 'Build Visual Skills', desc: 'Equip members with practical skills in composition, color theory, editing, and visual communication.' },
      { title: 'Promote Storytelling', desc: 'Foster compelling narratives through photo essays, video documentaries, and motion graphics.' },
      { title: 'Advance Design Expertise', desc: 'Deepen members\' mastery of Adobe Creative Suite and other professional design tools.' },
      { title: 'Connect Creativity to Projects', desc: 'Apply creative skills to real IEEE MUST SB events, campaigns, and digital content needs.' },
      { title: 'Empower Growth', desc: 'Develop members\' creative portfolios and professional readiness in multimedia and design careers.' },
    ],
    roles: COMMON_ROLES,
    activities: [
      { title: 'Creative Sessions', desc: 'Conducting sessions on photography, video editing, motion graphics, and graphic design to develop members\' creative skills.' },
      { title: 'Event Coverage', desc: 'Documenting IEEE MUST SB events through professional photography and videography, producing highlight reels and recap content.' },
      { title: 'Workshops & Training', desc: 'Hands-on workshops using industry tools like Adobe Photoshop, Premiere Pro, After Effects, and Illustrator.' },
    ],
    board: [
      { name: 'Firstname Lastname', role: 'Multimedia Head', bio: 'A creative professional with expertise in visual media production. Has overseen the visual identity of IEEE MUST SB across dozens of events, building a strong portfolio of photos, videos, and design work.', photo: null, github: '#', linkedin: '#', email: '#' },
      { name: 'Firstname Lastname', role: 'Multimedia Vice Head', bio: 'A skilled graphic designer and video editor who brings creative visions to life. Actively supports the team in producing high-quality visual content for all branch activities.', photo: null, github: '#', linkedin: '#', email: '#' },
    ],
    members: [
      { name: 'Firstname Lastname', stars: 4, bio: 'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Rerum necessitatibus iusto amet.', photo: null, github: '#', linkedin: '#', email: '#' },
      { name: 'Firstname Lastname', stars: 4, bio: 'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Rerum necessitatibus iusto amet.', photo: null, github: '#', linkedin: '#', email: '#' },
      { name: 'Firstname Lastname', stars: 4, bio: 'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Rerum necessitatibus iusto amet.', photo: null, github: '#', linkedin: '#', email: '#' },
    ],
  },
  {
    slug: 'hr',
    name: 'Human Resources',
    category: 'non-technical',
    icon: 'fa-people-group',
    image: null,
    tagline: 'Building the team that builds the branch.',
    shortDesc:
      'We manage recruitment, onboarding, and member well-being, ensuring the branch attracts the right talent and fosters a positive culture.',
    goals: [
      { title: 'Explore Organizational Skills', desc: 'Introduce members to the principles of HR management and their role in building thriving organizations.' },
      { title: 'Build Team Culture', desc: 'Foster an inclusive, positive environment where every member feels valued, supported, and motivated.' },
      { title: 'Promote Talent Development', desc: 'Identify and nurture individual strengths through structured development programs and mentoring.' },
      { title: 'Advance Leadership Expertise', desc: 'Deepen members\' understanding of leadership, conflict resolution, and organizational behavior.' },
      { title: 'Connect People to Opportunities', desc: 'Bridge members\' skills and aspirations with meaningful roles and growth paths within the branch.' },
      { title: 'Empower Growth', desc: 'Develop members\' professional skills and career readiness in human resources and organizational management.' },
    ],
    roles: COMMON_ROLES,
    activities: [
      { title: 'Recruitment Drives', desc: 'Organizing and managing the branch recruitment process, from application screening to interviews and selection.' },
      { title: 'Team Building', desc: 'Planning team-building activities and social events that strengthen relationships and boost morale across all committees.' },
      { title: 'Workshops & Training', desc: 'Hosting workshops on professional skills, communication, leadership development, and organizational culture.' },
    ],
    board: [
      { name: 'Firstname Lastname', role: 'Human Resources Head', bio: 'An organizational leader with a talent for identifying potential and building strong teams. Has overseen multiple recruitment cycles, bringing in hundreds of passionate members to IEEE MUST SB.', photo: null, github: '#', linkedin: '#', email: '#' },
      { name: 'Firstname Lastname', role: 'Human Resources Vice Head', bio: 'A people-focused professional dedicated to member engagement and well-being. Plays a key role in onboarding new members and ensuring a welcoming, inclusive environment within the branch.', photo: null, github: '#', linkedin: '#', email: '#' },
    ],
    members: [
      { name: 'Firstname Lastname', stars: 4, bio: 'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Rerum necessitatibus iusto amet.', photo: null, github: '#', linkedin: '#', email: '#' },
      { name: 'Firstname Lastname', stars: 4, bio: 'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Rerum necessitatibus iusto amet.', photo: null, github: '#', linkedin: '#', email: '#' },
      { name: 'Firstname Lastname', stars: 4, bio: 'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Rerum necessitatibus iusto amet.', photo: null, github: '#', linkedin: '#', email: '#' },
    ],
  },
  {
    slug: 'marketing',
    name: 'Marketing',
    category: 'non-technical',
    icon: 'fa-bullhorn',
    image: null,
    tagline: 'Turning ideas into impact through strategy and creativity.',
    shortDesc:
      'We drive awareness and engagement for IEEE MUST SB through digital campaigns, social media strategy, and creative brand storytelling.',
    goals: [
      { title: 'Explore Marketing Channels', desc: 'Introduce members to digital and traditional marketing channels and how they amplify the branch\'s reach.' },
      { title: 'Build Campaign Skills', desc: 'Equip members with the tools to plan, execute, and measure effective marketing campaigns.' },
      { title: 'Promote Brand Storytelling', desc: 'Foster authentic brand narratives that resonate with the IEEE MUST SB community and beyond.' },
      { title: 'Advance Digital Expertise', desc: 'Deepen members\' proficiency in social media management, analytics, SEO, and content strategy.' },
      { title: 'Connect Strategy to Execution', desc: 'Bridge marketing theory with real campaigns for branch events, recruitment, and initiatives.' },
      { title: 'Empower Growth', desc: 'Develop members\' professional skills and career readiness in marketing and digital communications.' },
    ],
    roles: COMMON_ROLES,
    activities: [
      { title: 'Campaign Planning', desc: 'Developing and executing marketing campaigns for events, recruitment, and branch initiatives across digital and physical channels.' },
      { title: 'Social Media Management', desc: 'Creating and scheduling content across IEEE MUST SB\'s social media platforms to grow reach and community engagement.' },
      { title: 'Workshops & Training', desc: 'Hosting sessions on digital marketing, content strategy, analytics, branding, and copywriting fundamentals.' },
    ],
    board: [
      { name: 'Firstname Lastname', role: 'Marketing Head', bio: 'A strategic marketer with a strong background in digital campaigns and brand development. Has grown IEEE MUST SB\'s online presence significantly through data-driven marketing initiatives.', photo: null, github: '#', linkedin: '#', email: '#' },
      { name: 'Firstname Lastname', role: 'Marketing Vice Head', bio: 'A creative content strategist skilled in social media management and copywriting. Actively contributes to building the branch\'s voice and engagement across all platforms.', photo: null, github: '#', linkedin: '#', email: '#' },
    ],
    members: [
      { name: 'Firstname Lastname', stars: 4, bio: 'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Rerum necessitatibus iusto amet.', photo: null, github: '#', linkedin: '#', email: '#' },
      { name: 'Firstname Lastname', stars: 4, bio: 'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Rerum necessitatibus iusto amet.', photo: null, github: '#', linkedin: '#', email: '#' },
      { name: 'Firstname Lastname', stars: 4, bio: 'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Rerum necessitatibus iusto amet.', photo: null, github: '#', linkedin: '#', email: '#' },
    ],
  },
  {
    slug: 'pr',
    name: 'Public Relations',
    category: 'non-technical',
    icon: 'fa-handshake',
    image: null,
    tagline: "Connecting the branch to the world, one relationship at a time.",
    shortDesc:
      'We build and maintain IEEE MUST SB\'s external relationships, managing partnerships, outreach, and the branch\'s public image.',
    goals: [
      { title: 'Explore Public Relations', desc: 'Introduce members to the principles of PR and their role in shaping public perception and building trust.' },
      { title: 'Build Communication Skills', desc: 'Equip members with professional communication, public speaking, and negotiation capabilities.' },
      { title: 'Promote Networking', desc: 'Foster meaningful professional connections with companies, universities, and industry partners.' },
      { title: 'Advance Professional Presence', desc: 'Deepen members\' understanding of media relations, event outreach, and stakeholder management.' },
      { title: 'Connect Branch to Community', desc: 'Bridge IEEE MUST SB with the broader engineering and technology community through partnerships and outreach.' },
      { title: 'Empower Growth', desc: 'Develop members\' professional skills and career readiness in communications, PR, and relationship management.' },
    ],
    roles: COMMON_ROLES,
    activities: [
      { title: 'Partnership Development', desc: 'Identifying and establishing relationships with companies, universities, and organizations to create opportunities for IEEE MUST SB members.' },
      { title: 'Event Outreach', desc: 'Coordinating external communications for branch events, managing invitations, sponsorships, and media presence.' },
      { title: 'Workshops & Training', desc: 'Sessions on public speaking, professional networking, negotiation, and relationship management skills.' },
    ],
    board: [
      { name: 'Firstname Lastname', role: 'Public Relations Head', bio: 'A skilled communicator with a wide professional network. Has established key partnerships for IEEE MUST SB and represented the branch at regional and national IEEE events.', photo: null, github: '#', linkedin: '#', email: '#' },
      { name: 'Firstname Lastname', role: 'Public Relations Vice Head', bio: 'An outgoing professional focused on community engagement and stakeholder relations. Helps coordinate the committee\'s outreach efforts and supports the branch\'s external communications.', photo: null, github: '#', linkedin: '#', email: '#' },
    ],
    members: [
      { name: 'Firstname Lastname', stars: 4, bio: 'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Rerum necessitatibus iusto amet.', photo: null, github: '#', linkedin: '#', email: '#' },
      { name: 'Firstname Lastname', stars: 4, bio: 'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Rerum necessitatibus iusto amet.', photo: null, github: '#', linkedin: '#', email: '#' },
      { name: 'Firstname Lastname', stars: 4, bio: 'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Rerum necessitatibus iusto amet.', photo: null, github: '#', linkedin: '#', email: '#' },
    ],
  },
];

export const getCommitteeBySlug = (slug) => committees.find((c) => c.slug === slug);
export const getTechnical = () => committees.filter((c) => c.category === 'technical');
export const getNonTechnical = () => committees.filter((c) => c.category === 'non-technical');
