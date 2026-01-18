
export interface ExamInfo {
  id: string;
  name: string;
  category: 'Engineering' | 'Medical' | 'Management' | 'Law' | 'Design' | 'Arts' | 'International' | 'Other';
  scope: 'India' | 'Global';
  stream: 'PCM' | 'PCB' | 'Commerce' | 'Humanities' | 'Any' | 'Science';
  description: string;
  eligibility: string;
  website: string;
  previousPapersUrl?: string;
}

export interface Course {
  id: string;
  title: string;
  duration: string;
  overview: string;
  careerOptions: string[];
  requiredSkills: string[];
  internships: string;
  topRecruiters: string[];
  futureScope: string;
}

export interface AICounselorResponse {
  text: string;
  links: {
    uri: string;
    title?: string;
  }[];
}

export interface SavedRoadmap {
  id: string;
  title: string;
  date: string;
  response: AICounselorResponse;
}

export type View = 'home' | 'exams' | 'courses' | 'ai-counselor' | 'roadmap' | 'iit' | 'roadmap-detail' | 'exam-detail';
