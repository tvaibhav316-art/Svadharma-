
import { ExamInfo, Course } from './types';

export const POPULAR_EXAMS: ExamInfo[] = [
  // --- NATIONAL LEVEL - ENGINEERING & SCIENCE ---
  {
    id: 'jee-main',
    name: 'JEE Main',
    category: 'Engineering',
    scope: 'India',
    stream: 'PCM',
    description: 'Gateway for admission to NITs, IIITs, and other Centrally Funded Technical Institutions.',
    eligibility: '12th Pass with Physics, Chemistry, and Mathematics (PCM)',
    website: 'https://jeemain.nta.nic.in/',
    previousPapersUrl: 'https://jeemain.nta.nic.in/archive/'
  },
  {
    id: 'jee-adv',
    name: 'JEE Advanced',
    category: 'Engineering',
    scope: 'India',
    stream: 'PCM',
    description: 'The exclusive entrance for the prestigious Indian Institutes of Technology (IITs).',
    eligibility: 'Top 2.5 Lakh qualifiers of JEE Main (PCM)',
    website: 'https://jeeadv.ac.in/',
    previousPapersUrl: 'https://jeeadv.ac.in/archive.html'
  },
  {
    id: 'cuet-ug',
    name: 'CUET UG',
    category: 'Arts',
    scope: 'India',
    stream: 'Any',
    description: 'Common University Entrance Test for admission to all Central Universities in India (DU, JNU, BHU, etc.) for every UG course.',
    eligibility: '12th Pass (Any Stream)',
    website: 'https://cuet.samarth.ac.in/',
    previousPapersUrl: 'https://nta.ac.in/Downloads'
  },
  {
    id: 'viteee',
    name: 'VITEEE',
    category: 'Engineering',
    scope: 'India',
    stream: 'PCM',
    description: 'Entrance for VIT Vellore and its campuses (Chennai, AP, Bhopal).',
    eligibility: '12th Pass with PCM (min 60% aggregate)',
    website: 'https://viteee.vit.ac.in/',
    previousPapersUrl: 'https://vit.ac.in/admissions/undergraduate/viteee/faq'
  },
  {
    id: 'met',
    name: 'Manipal (MET)',
    category: 'Engineering',
    scope: 'India',
    stream: 'PCM',
    description: 'Manipal Academy of Higher Education entrance for Engineering and other courses.',
    eligibility: '12th Pass with PCM',
    website: 'https://manipal.edu/met.html',
    previousPapersUrl: 'https://manipal.edu/mu/admission/indian-students/sample-test-papers.html'
  },
  {
    id: 'christ-et',
    name: 'Christ Univ Entrance (CUET)',
    category: 'Management',
    scope: 'India',
    stream: 'Any',
    description: 'Selection process for BBA, B.Com, and other programs at Christ University (Bengaluru, Delhi-NCR, Pune).',
    eligibility: '12th Pass (Any Stream)',
    website: 'https://christuniversity.in/',
    previousPapersUrl: 'https://christuniversity.in/admissions/undergraduate/selection-process'
  },
  {
    id: 'symbiosis-set',
    name: 'Symbiosis SET',
    category: 'Management',
    scope: 'India',
    stream: 'Any',
    description: 'Entrance test for Symbiosis International University undergraduate programs like BBA, BCA, and Media.',
    eligibility: '12th Pass (Any Stream)',
    website: 'https://www.set-test.org/',
    previousPapersUrl: 'https://www.set-test.org/sample-questions.html'
  },
  {
    id: 'npat',
    name: 'NMIMS (NPAT)',
    category: 'Management',
    scope: 'India',
    stream: 'Any',
    description: 'Entrance for various undergraduate programs at NMIMS (Commerce, Economics, Liberal Arts).',
    eligibility: '12th Pass (Any Stream)',
    website: 'https://nmimsnpat.in/',
    previousPapersUrl: 'https://nmimsnpat.in/sample-papers.php'
  },
  {
    id: 'ipu-cet',
    name: 'IPU CET',
    category: 'Other',
    scope: 'India',
    stream: 'Any',
    description: 'Indraprastha University Common Entrance Test for various professional programs in Delhi.',
    eligibility: '12th Pass (Stream varies by course)',
    website: 'https://ipu.ac.in/',
    previousPapersUrl: 'http://www.ipu.ac.in/cet2024scheme.php'
  },
  {
    id: 'iat',
    name: 'IISER Aptitude Test (IAT)',
    category: 'Other',
    scope: 'India',
    stream: 'Science',
    description: 'Pathway for students passionate about research and pure sciences (IISERs, IISc).',
    eligibility: '12th Pass with Science (PCM/PCB/PCMB)',
    website: 'https://iiseradmission.in/',
    previousPapersUrl: 'https://iiseradmission.in/examination/question-papers.html'
  },
  {
    id: 'uceed',
    name: 'UCEED',
    category: 'Design',
    scope: 'India',
    stream: 'Any',
    description: 'Entrance for Bachelor of Design (B.Des) programs at top IITs.',
    eligibility: '12th Pass (Any Stream)',
    website: 'https://www.uceed.iitb.ac.in/',
    previousPapersUrl: 'https://www.uceed.iitb.ac.in/downloads.html'
  },
  {
    id: 'neet',
    name: 'NEET UG',
    category: 'Medical',
    scope: 'India',
    stream: 'PCB',
    description: 'The single mandatory entrance exam for all medical and dental seats (MBBS/BDS) in India.',
    eligibility: '12th Pass with Physics, Chemistry, and Biology (PCB)',
    website: 'https://neet.nta.nic.in/',
    previousPapersUrl: 'https://nta.ac.in/Downloads'
  },
  {
    id: 'clat',
    name: 'CLAT',
    category: 'Law',
    scope: 'India',
    stream: 'Any',
    description: 'The primary entrance for the National Law Universities (NLUs).',
    eligibility: '12th Pass (Any Stream) with 45% marks',
    website: 'https://consortiumofnlus.ac.in/',
    previousPapersUrl: 'https://consortiumofnlus.ac.in/clat-2024/question-papers.html'
  },
  {
    id: 'bitsat',
    name: 'BITSAT',
    category: 'Engineering',
    scope: 'India',
    stream: 'PCM',
    description: 'Computer-based test for admission to the integrated degree programs of BITS Pilani campuses.',
    eligibility: '12th Pass with PCM (min 75% aggregate in PCM)',
    website: 'https://www.bitsadmission.com/',
    previousPapersUrl: 'https://www.bitsadmission.com/bitsatmain.aspx'
  },
  {
    id: 'sat',
    name: 'SAT (Digital)',
    category: 'International',
    scope: 'Global',
    stream: 'Any',
    description: 'Globally recognized test for undergraduate admissions in USA, Canada, UK, and India.',
    eligibility: 'Typically taken in 11th or 12th grade.',
    website: 'https://satsuite.collegeboard.org/',
    previousPapersUrl: 'https://satsuite.collegeboard.org/digital/practice'
  },
  {
    id: 'ipmat',
    name: 'IPMAT (Indore)',
    category: 'Management',
    scope: 'India',
    stream: 'Any',
    description: 'Gateway to the elite 5-Year Integrated Program in Management at IIM Indore.',
    eligibility: '12th Pass (Any Stream)',
    website: 'https://www.iimidr.ac.in/',
    previousPapersUrl: 'https://www.iimidr.ac.in/academic-programmes/five-year-integrated-programme-in-management-ipm/ipm-admissions-details/previous-year-question-papers/'
  },
  {
    id: 'mht-cet',
    name: 'MHT-CET',
    category: 'Engineering',
    scope: 'India',
    stream: 'Science',
    description: 'State-level gateway for students in Maharashtra for Engineering, Pharmacy, and Agri.',
    eligibility: '12th Pass with PCM or PCB',
    website: 'https://cetcell.mahacet.org/',
    previousPapersUrl: 'https://cetcell.mahacet.org/MHT-CET-2024/'
  },
  {
    id: 'nda',
    name: 'NDA & NA',
    category: 'Other',
    scope: 'India',
    stream: 'Science',
    description: 'Pathway for officers in the Indian Army, Navy, or Air Force.',
    eligibility: '12th Pass (PCM required for Navy/Air Force)',
    website: 'https://upsc.gov.in/',
    previousPapersUrl: 'https://upsc.gov.in/examinations/previous-question-papers'
  }
];

export const TOP_COURSES: Course[] = [
  {
    id: 'btech',
    title: 'B.Tech / B.E.',
    duration: '4 Years',
    overview: 'Engineering degree focusing on technical and analytical skills.',
    careerOptions: ['Software Engineer', 'Core Engineer', 'Systems Designer', 'Researcher'],
    requiredSkills: ['Mathematical Logic', 'Coding/Scripting', 'Problem Solving', 'Physics Knowledge'],
    internships: 'Compulsory 2-month summer internships after 2nd/3rd year in industry or research labs.',
    topRecruiters: ['Google', 'Microsoft', 'TCS', 'Larsen & Toubro', 'Tesla'],
    futureScope: 'Rapid growth in AI, Robotics, and Green Technology. With the global shift towards digitalization and semiconductor manufacturing, engineering graduates are in higher demand than ever for building sustainable infrastructure.'
  },
  {
    id: 'mbbs',
    title: 'MBBS',
    duration: '5.5 Years',
    overview: 'Clinical degree for aspiring medical practitioners.',
    careerOptions: ['Physician', 'Specialist Surgeon', 'Medical Officer'],
    requiredSkills: ['Biology Foundation', 'Patient Care', 'Diagnostic Ability', 'Endurance'],
    internships: 'Mandatory 1-year rotating internship in teaching hospitals attached to medical colleges.',
    topRecruiters: ['AIIMS', 'Apollo Hospitals', 'Fortis Healthcare', 'Indian Army Medical Corps'],
    futureScope: 'High demand due to an aging global population and advancements in personalized medicine. Integration with health-tech and AI diagnostics is creating new specialized roles in genomic medicine and telehealth.'
  },
  {
    id: 'ipm',
    title: 'Integrated IPM',
    duration: '5 Years',
    overview: 'Dual degree (BBA+MBA) directly after 12th from prestigious IIMs.',
    careerOptions: ['Management Consultant', 'Investment Banker', 'Product Manager'],
    requiredSkills: ['Business Communication', 'Analytical Thinking', 'Leadership', 'Data Interpretation'],
    internships: 'Multiple internships including social/NGO projects and high-profile corporate summer placements.',
    topRecruiters: ['McKinsey & Co', 'Goldman Sachs', 'Hindustan Unilever', 'Amazon'],
    futureScope: 'Critical demand in the startup ecosystem and multinational management. Modern business requires leaders who understand both data-driven decision making and sustainable ESG practices.'
  },
  {
    id: 'bs-ms',
    title: 'BS-MS Dual Degree',
    duration: '5 Years',
    overview: 'Research-oriented science program offered at IISERs and IISc.',
    careerOptions: ['Research Scientist', 'Data Analyst', 'Academician'],
    requiredSkills: ['Scientific Inquiry', 'Laboratory Ethics', 'Advanced Mathematics', 'Publication Writing'],
    internships: 'Extensive research internships at institutes like TIFR, BARC, or international universities.',
    topRecruiters: ['ISRO', 'NASA', 'Intel Research', 'Various Global PhD Programs'],
    futureScope: 'Explosive growth in quantum computing, climate science, and advanced materials. Governments are increasing funding for basic research to solve global challenges like energy storage and pandemic prevention.'
  }
];
