
import React, { useState, useMemo, useEffect } from 'react';
import { POPULAR_EXAMS, TOP_COURSES } from './constants';
import { View, ExamInfo, SavedRoadmap, Course } from './types';
import ExamCard from './components/ExamCard';
import AICounselor from './components/AICounselor';
import { searchLatestExams } from './services/geminiService';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('home');
  const [examSearch, setExamSearch] = useState('');
  const [selectedStream, setSelectedStream] = useState<string>('All');
  const [aiSearchResults, setAiSearchResults] = useState<{ text: string; links: any[] } | null>(null);
  const [isSearchingAi, setIsSearchingAi] = useState(false);
  const [savedRoadmaps, setSavedRoadmaps] = useState<SavedRoadmap[]>([]);
  const [selectedRoadmap, setSelectedRoadmap] = useState<SavedRoadmap | null>(null);
  const [selectedExamDetail, setSelectedExamDetail] = useState<ExamInfo | null>(null);

  // Course Filter States
  const [courseSearch, setCourseSearch] = useState('');
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [selectedCareers, setSelectedCareers] = useState<string[]>([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // IIT Section Search State
  const [iitSearch, setIitSearch] = useState('');

  const streams = ['All', 'PCM', 'PCB', 'Science', 'Commerce', 'Humanities', 'Any'];

  // Derived filter options for courses
  const allSkills = useMemo(() => Array.from(new Set(TOP_COURSES.flatMap(c => c.requiredSkills))).sort(), []);
  const allCareers = useMemo(() => Array.from(new Set(TOP_COURSES.flatMap(c => c.careerOptions))).sort(), []);

  // Load saved roadmaps
  useEffect(() => {
    const raw = localStorage.getItem('svadharma_plans');
    if (raw) {
      setSavedRoadmaps(JSON.parse(raw));
    }
  }, []);

  // Scroll to top on view change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentView]);

  const refreshSavedRoadmaps = () => {
    const raw = localStorage.getItem('svadharma_plans');
    if (raw) {
      setSavedRoadmaps(JSON.parse(raw));
    }
  };

  const deleteRoadmap = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const filtered = savedRoadmaps.filter(r => r.id !== id);
    setSavedRoadmaps(filtered);
    localStorage.setItem('svadharma_plans', JSON.stringify(filtered));
  };

  const handleDeepInfo = async (exam: ExamInfo) => {
    setSelectedExamDetail(exam);
    setCurrentView('exam-detail');
    setIsSearchingAi(true);
    setAiSearchResults(null);
    const results = await searchLatestExams(`${exam.name} ${exam.category} undergraduate entrance exam 2026-2027 important dates syllabus application form fee structure and preparation strategy`);
    setAiSearchResults(results);
    setIsSearchingAi(false);
  };

  const filteredExams = useMemo(() => {
    let results = POPULAR_EXAMS;
    
    // Filter by stream
    if (selectedStream !== 'All') {
      if (selectedStream === 'Science') {
        results = results.filter(e => ['PCM', 'PCB', 'Science', 'Any'].includes(e.stream));
      } else {
        results = results.filter(e => e.stream === selectedStream || e.stream === 'Any');
      }
    }

    // Filter by search text
    if (examSearch.trim()) {
      results = results.filter(e => 
        e.name.toLowerCase().includes(examSearch.toLowerCase()) || 
        e.category.toLowerCase().includes(examSearch.toLowerCase()) ||
        e.eligibility.toLowerCase().includes(examSearch.toLowerCase()) ||
        e.description.toLowerCase().includes(examSearch.toLowerCase())
      );
    }
    
    return results;
  }, [examSearch, selectedStream]);

  const filteredCourses = useMemo(() => {
    let results = TOP_COURSES;

    if (courseSearch.trim()) {
      const search = courseSearch.toLowerCase();
      results = results.filter(c => 
        c.title.toLowerCase().includes(search) || 
        c.overview.toLowerCase().includes(search)
      );
    }

    if (selectedSkills.length > 0) {
      results = results.filter(c => 
        selectedSkills.every(skill => c.requiredSkills.includes(skill))
      );
    }

    if (selectedCareers.length > 0) {
      results = results.filter(c => 
        selectedCareers.every(career => c.careerOptions.includes(career))
      );
    }

    return results;
  }, [courseSearch, selectedSkills, selectedCareers]);

  const toggleFilter = (list: string[], setList: React.Dispatch<React.SetStateAction<string[]>>, item: string) => {
    if (list.includes(item)) {
      setList(list.filter(i => i !== item));
    } else {
      setList([...list, item]);
    }
  };

  const scrollToId = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 100; // Account for sticky nav
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  const activeFilterCount = selectedSkills.length + selectedCareers.length;

  const renderHome = () => (
    <div className="space-y-20">
      {/* Hero Section */}
      <section className="relative pt-24 pb-20 overflow-hidden bg-white">
        <div className="container mx-auto px-6 text-center">
          <div className="inline-block mb-6 px-4 py-1.5 bg-blue-50 text-blue-600 rounded-full text-xs font-black tracking-widest animate-pulse border border-blue-100">
            NAVIGATE YOUR FUTURE
          </div>
          <h1 className="text-6xl md:text-8xl font-black text-slate-900 mb-8 tracking-tighter leading-[0.9]">
            Your Path Beyond <br />
            <span className="gradient-text">12th Standard</span>
          </h1>
          <p className="text-xl text-slate-500 max-w-2xl mx-auto mb-12 leading-relaxed font-medium">
            Plan for the 2026-2027 cycle. From National giants like JEE & NEET to State CETs and niche entrances like JIPMAT & IAT. 
            Find your Svadharma — your true calling.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-6">
            <button 
              onClick={() => setCurrentView('ai-counselor')}
              className="bg-blue-600 hover:bg-blue-700 text-white font-black py-5 px-12 rounded-2xl shadow-2xl shadow-blue-200 transition-all flex items-center justify-center transform hover:-translate-y-1 active:scale-95"
            >
              <i className="fa-solid fa-wand-sparkles mr-3"></i>
              Try AI Counselor
            </button>
            <button 
              onClick={() => setCurrentView('exams')}
              className="bg-slate-50 border border-slate-200 text-slate-900 font-black py-5 px-12 rounded-2xl hover:bg-white hover:border-blue-500 transition-all shadow-sm active:scale-95"
            >
              Explore {POPULAR_EXAMS.length}+ Exams
            </button>
          </div>
        </div>
      </section>

      {/* Saved Roadmaps Section */}
      {savedRoadmaps.length > 0 && (
        <section className="container mx-auto px-6">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-4xl font-black text-slate-900 mb-3 tracking-tight">Your Saved Plans</h2>
              <p className="text-slate-500 font-medium">Pick up where you left off with your AI roadmaps.</p>
            </div>
            <button 
              onClick={() => setCurrentView('ai-counselor')}
              className="text-blue-600 font-black text-xs uppercase tracking-widest hover:underline"
            >
              Create New <i className="fa-solid fa-plus ml-2"></i>
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {savedRoadmaps.map(roadmap => (
              <div 
                key={roadmap.id}
                onClick={() => {
                  setSelectedRoadmap(roadmap);
                  setCurrentView('roadmap-detail');
                }}
                className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl hover:border-blue-200 transition-all cursor-pointer group relative"
              >
                <button 
                  onClick={(e) => deleteRoadmap(roadmap.id, e)}
                  className="absolute top-6 right-6 w-8 h-8 rounded-full bg-slate-50 text-slate-400 flex items-center justify-center hover:bg-red-50 hover:text-red-500 transition-all opacity-0 group-hover:opacity-100"
                >
                  <i className="fa-solid fa-trash-can text-xs"></i>
                </button>
                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-blue-600 group-hover:text-white transition-all">
                  <i className="fa-solid fa-map"></i>
                </div>
                <h3 className="text-xl font-black text-slate-900 mb-2 truncate pr-6">{roadmap.title}</h3>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mb-4">{roadmap.date}</p>
                <div className="flex items-center text-blue-600 text-xs font-black uppercase tracking-widest">
                  View Roadmap <i className="fa-solid fa-arrow-right ml-2 group-hover:translate-x-1 transition-transform"></i>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Featured Exams Section */}
      <section className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12">
          <div>
            <h2 className="text-4xl font-black text-slate-900 mb-3 tracking-tight">Major Entrance Exams</h2>
            <p className="text-slate-500 font-medium">NTA, UPSC, IIMs, IISERs, and State Boards — all in one place.</p>
          </div>
          <button 
            onClick={() => setCurrentView('exams')}
            className="mt-6 md:mt-0 bg-slate-900 text-white text-xs font-black px-6 py-3 rounded-xl hover:bg-blue-600 transition-all"
          >
            EXPLORE FULL DATABASE <i className="fa-solid fa-arrow-right ml-2"></i>
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[POPULAR_EXAMS[0], POPULAR_EXAMS[3], POPULAR_EXAMS[4]].map(exam => (
            <ExamCard key={exam.id} exam={exam} onDeepInfo={handleDeepInfo} />
          ))}
        </div>
      </section>

      {/* Value Proposition */}
      <section className="bg-slate-900 py-32 rounded-[4rem] mx-6">
        <div className="container mx-auto px-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-20 text-center">
            <div className="space-y-6">
              <div className="w-20 h-20 bg-blue-500 rounded-[2rem] flex items-center justify-center mx-auto mb-8 rotate-6 shadow-2xl shadow-blue-900">
                <i className="fa-solid fa-earth-asia text-3xl text-white"></i>
              </div>
              <h3 className="text-white text-2xl font-black">All State CETs</h3>
              <p className="text-slate-400 text-sm leading-relaxed font-medium">Integrated database of MH-CET, KCET, WBJEE, TNEA, and other state-level professional entrances.</p>
            </div>
            <div className="space-y-6">
              <div className="w-20 h-20 bg-purple-500 rounded-[2rem] flex items-center justify-center mx-auto mb-8 -rotate-6 shadow-2xl shadow-purple-900">
                <i className="fa-solid fa-brain text-3xl text-white"></i>
              </div>
              <h3 className="text-white text-2xl font-black">AI Roadmap</h3>
              <p className="text-slate-400 text-sm leading-relaxed font-medium">Personalized career guidance generated by advanced Gemini models tailored to your specific stream.</p>
            </div>
            <div className="space-y-6">
              <div className="w-20 h-20 bg-emerald-500 rounded-[2rem] flex items-center justify-center mx-auto mb-8 rotate-12 shadow-2xl shadow-emerald-900">
                <i className="fa-solid fa-university text-3xl text-white"></i>
              </div>
              <h3 className="text-white text-2xl font-black">Central Universites</h3>
              <p className="text-slate-400 text-sm leading-relaxed font-medium">Complete details for CUET, JMI, and other central institutes for every undergraduate course.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );

  const renderRoadmapDetail = () => {
    if (!selectedRoadmap) return null;
    return (
      <div className="container mx-auto px-6 py-16">
        <button 
          onClick={() => setCurrentView('home')}
          className="mb-10 flex items-center text-slate-500 font-black text-xs uppercase tracking-widest hover:text-blue-600 transition-colors"
        >
          <i className="fa-solid fa-arrow-left mr-2"></i> Back to Saved Plans
        </button>
        
        <div className="bg-white rounded-[3rem] shadow-2xl shadow-slate-200 overflow-hidden border border-slate-100">
          <div className="p-12 bg-slate-900 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/20 blur-[100px] rounded-full -mr-32 -mt-32"></div>
            <div className="relative z-10">
              <span className="bg-blue-600 text-[10px] font-black px-4 py-1.5 rounded-full mb-6 inline-block uppercase tracking-widest">Persisted Career Plan</span>
              <h2 className="text-4xl md:text-5xl font-black mb-4 tracking-tighter">{selectedRoadmap.title}</h2>
              <p className="text-slate-400 text-lg font-medium">Saved on {selectedRoadmap.date}</p>
            </div>
          </div>
          
          <div className="p-12">
            <div className="prose prose-slate max-w-none text-slate-700 font-medium">
              <div className="bg-blue-50/50 rounded-[2rem] p-10 border border-blue-100/50 mb-12 shadow-inner">
                 <div className="whitespace-pre-wrap leading-relaxed text-lg" style={{ wordBreak: 'break-word' }}>
                   {selectedRoadmap.response.text}
                 </div>
              </div>
            </div>

            {selectedRoadmap.response.links.length > 0 && (
              <div className="space-y-6 pt-12 border-t border-slate-100">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center text-white">
                    <i className="fa-brands fa-google text-xs"></i>
                  </div>
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Verified Sources & Portals</h4>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {selectedRoadmap.response.links.map((link, idx) => (
                    <a 
                      key={idx} 
                      href={link.uri} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center bg-white border border-slate-100 hover:border-blue-600 p-4 rounded-2xl text-slate-700 hover:text-blue-600 transition-all group shadow-sm"
                    >
                      <i className="fa-solid fa-link mr-4 text-slate-300 group-hover:text-blue-600 transition-colors"></i>
                      <div className="flex-1 overflow-hidden">
                        <p className="text-xs font-black truncate">{link.title || 'Official Source'}</p>
                        <p className="text-[9px] text-slate-400 truncate font-medium">{link.uri}</p>
                      </div>
                      <i className="fa-solid fa-chevron-right ml-4 text-[10px] opacity-0 group-hover:opacity-100 transition-all"></i>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderExamDetail = () => {
    if (!selectedExamDetail) return null;
    return (
      <div className="container mx-auto px-6 py-16">
        <button 
          onClick={() => setCurrentView('exams')}
          className="mb-10 flex items-center text-slate-500 font-black text-xs uppercase tracking-widest hover:text-blue-600 transition-colors"
        >
          <i className="fa-solid fa-arrow-left mr-2"></i> Back to Exam Explorer
        </button>
        
        <div className="bg-white rounded-[3rem] shadow-2xl shadow-slate-200 overflow-hidden border border-slate-100">
          <div className="p-12 bg-slate-900 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/20 blur-[100px] rounded-full -mr-32 -mt-32"></div>
            <div className="relative z-10">
              <div className="flex flex-wrap items-center gap-4 mb-6">
                <span className="bg-blue-600 text-white text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest">Deep Information AI</span>
                <span className="text-blue-400 text-xs font-black uppercase tracking-widest">{selectedExamDetail.category}</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-black mb-4 tracking-tighter">{selectedExamDetail.name}</h2>
              <p className="text-slate-400 text-lg font-medium leading-relaxed max-w-3xl">
                Research-grade insights powered by Gemini AI for the 2026-2027 academic session.
              </p>
            </div>
          </div>
          
          <div className="p-12">
            {isSearchingAi ? (
              <div className="py-24 text-center">
                <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-8"></div>
                <h3 className="text-xl font-black text-slate-900 mb-2">Analyzing Latest Data...</h3>
                <p className="text-slate-400 font-medium">We're searching the web for latest 2026-27 dates and details for {selectedExamDetail.name}.</p>
              </div>
            ) : aiSearchResults ? (
              <div className="animate-in fade-in slide-in-from-bottom-6">
                <div className="prose prose-slate max-w-none text-slate-700 font-medium">
                  <div className="bg-blue-50/50 rounded-[2rem] p-10 border border-blue-100/50 mb-12 shadow-inner">
                     <div className="whitespace-pre-wrap leading-relaxed text-lg" style={{ wordBreak: 'break-word' }}>
                       {aiSearchResults.text}
                     </div>
                  </div>
                </div>

                {aiSearchResults.links.length > 0 && (
                  <div className="space-y-6 pt-12 border-t border-slate-100">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center text-white">
                        <i className="fa-brands fa-google text-xs"></i>
                      </div>
                      <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Deep Research Sources</h4>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {aiSearchResults.links.map((link, idx) => (
                        <a 
                          key={idx} 
                          href={link.uri} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center bg-white border border-slate-100 hover:border-blue-600 p-4 rounded-2xl text-slate-700 hover:text-blue-600 transition-all group shadow-sm"
                        >
                          <i className="fa-solid fa-link mr-4 text-slate-300 group-hover:text-blue-600 transition-colors"></i>
                          <div className="flex-1 overflow-hidden">
                            <p className="text-xs font-black truncate">{link.title || 'Source Detail'}</p>
                            <p className="text-[9px] text-slate-400 truncate font-medium">{link.uri}</p>
                          </div>
                          <i className="fa-solid fa-chevron-right ml-4 text-[10px] opacity-0 group-hover:opacity-100 transition-all"></i>
                        </a>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="mt-12 flex justify-center">
                  <a 
                    href={selectedExamDetail.website} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-12 py-5 bg-slate-900 text-white rounded-[2rem] font-black text-xs uppercase tracking-[0.2em] hover:bg-blue-600 transition-all shadow-2xl shadow-slate-200"
                  >
                    Go to Official Exam Portal <i className="fa-solid fa-arrow-right ml-3"></i>
                  </a>
                </div>
              </div>
            ) : (
              <div className="py-24 text-center">
                <i className="fa-solid fa-circle-exclamation text-4xl text-red-500 mb-6"></i>
                <h3 className="text-xl font-black text-slate-900 mb-2">Something went wrong</h3>
                <p className="text-slate-400 font-medium">We couldn't retrieve deep information at this moment. Please try again or check the official portal.</p>
                <button 
                  onClick={() => handleDeepInfo(selectedExamDetail)}
                  className="mt-8 text-blue-600 font-black uppercase tracking-widest text-xs hover:underline"
                >
                  Retry Search <i className="fa-solid fa-rotate-right ml-2"></i>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderIIT = () => {
    const topColleges = [
      { name: 'IIT Madras', rank: '1', programs: 'CSE, Electrical, Ocean Engineering', link: 'https://www.iitm.ac.in/' },
      { name: 'IIT Delhi', rank: '2', programs: 'Math & Computing, CSE, Textile Tech', link: 'https://home.iitd.ac.in/' },
      { name: 'IIT Bombay', rank: '3', programs: 'CSE, Aerospace, Electrical Engineering', link: 'https://www.iitb.ac.in/' },
      { name: 'IIT Kanpur', rank: '4', programs: 'Aerospace, Materials Science, CSE', link: 'https://www.iitk.ac.in/' },
      { name: 'IIT Kharagpur', rank: '5', programs: 'Agri & Food Engineering, Mining, Ocean Eng', link: 'http://www.iitkgp.ac.in/' },
    ];

    const iitItems = [
      { id: 'top-engineering-colleges', name: 'Top IITs', text: 'Top Engineering Colleges Ranking NIRF' },
      { id: 'jee-advanced-section', name: 'JEE Advanced', text: 'Engineering, B.Tech, B.S., Dual Degree, B.Arch, PCM' },
      { id: 'iat-section', name: 'Science & Research', text: 'Research, Medical Sciences, Engineering, Data Science, AI, Science, PCM, PCB, PCMB' },
      { id: 'uceed-section', name: 'Design', text: 'Design, Creative, B.Des, Any Stream' },
      { id: 'ncet-section', name: 'Education', text: 'Teacher Education, B.Sc. B.Ed, Science' }
    ];

    const isVisible = (itemName: string, itemText: string) => {
      const search = iitSearch.toLowerCase();
      return !search || itemName.toLowerCase().includes(search) || itemText.toLowerCase().includes(search);
    };

    const visibleItems = iitItems.filter(item => isVisible(item.name, item.text));

    return (
      <div className="container mx-auto px-6 py-16">
        {/* Prominent Search Header */}
        <div className="mb-20 text-center">
          <h2 className="text-5xl font-black text-slate-900 mb-6 tracking-tight">Gateways to <span className="text-blue-600">IIT</span></h2>
          <p className="text-xl text-slate-500 font-medium max-w-3xl mx-auto mb-10 leading-relaxed">
            Discover elite programs for the <span className="text-slate-900 font-bold">2026-2027</span> cycle in Design, Science, Research, and Education.
          </p>
          
          <div className="max-w-2xl mx-auto relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-[2rem] blur opacity-15 group-hover:opacity-30 transition-all"></div>
            <div className="relative">
              <i className="fa-solid fa-magnifying-glass absolute left-8 top-1/2 -translate-y-1/2 text-slate-400 text-xl"></i>
              <input 
                type="text" 
                placeholder="Search specific IIT programs for 2026 intake..." 
                className="w-full pl-20 pr-16 py-7 bg-white border-2 border-slate-100 rounded-[2rem] focus:border-blue-600 focus:outline-none transition-all font-bold text-slate-800 text-lg shadow-2xl shadow-blue-900/5"
                value={iitSearch}
                onChange={(e) => setIitSearch(e.target.value)}
              />
              {iitSearch && (
                <button 
                  onClick={() => setIitSearch('')}
                  className="absolute right-8 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-600 transition-colors"
                >
                  <i className="fa-solid fa-circle-xmark text-xl"></i>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Sticky Nav for Sections */}
        <div className="sticky top-[84px] z-40 mb-12 py-4 bg-slate-50/90 backdrop-blur-md border-y border-slate-200">
          <div className="flex flex-wrap justify-center md:justify-start gap-4">
            <button 
              onClick={() => scrollToId('iit-timeline')}
              className="px-5 py-2 rounded-full bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest shadow-lg hover:bg-blue-600 transition-all"
            >
              2026-27 Timeline
            </button>
            {visibleItems.map(item => (
              <button 
                key={item.id}
                onClick={() => scrollToId(item.id)}
                className="px-5 py-2 rounded-full bg-white border border-slate-200 text-[10px] font-black uppercase tracking-widest text-slate-600 hover:border-blue-600 hover:text-blue-600 transition-all shadow-sm"
              >
                {item.name}
              </button>
            ))}
          </div>
        </div>

        {/* Top Engineering Colleges Section */}
        {isVisible('Top IITs', 'Top Engineering Colleges Ranking NIRF') && (
          <section id="top-engineering-colleges" className="mb-24 scroll-mt-32">
            <div className="flex items-center space-x-4 mb-10 justify-center md:justify-start">
               <div className="w-12 h-1 bg-blue-600 rounded-full"></div>
               <h3 className="text-3xl font-black text-slate-900 tracking-tight">Top Engineering Colleges (NIRF Ranking)</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
              {topColleges.map((college) => (
                <div key={college.name} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:border-blue-200 transition-all flex flex-col group">
                  <div className="flex justify-between items-start mb-4">
                    <span className="text-[9px] font-black bg-blue-50 text-blue-600 px-3 py-1 rounded-full uppercase tracking-widest">NIRF #{college.rank}</span>
                    <i className="fa-solid fa-university text-slate-100 text-2xl group-hover:text-blue-50 transition-colors"></i>
                  </div>
                  <h4 className="text-lg font-black text-slate-900 mb-2">{college.name}</h4>
                  <p className="text-xs text-slate-500 font-medium mb-6 leading-relaxed flex-grow">Key: {college.programs}</p>
                  <a 
                    href={college.link} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-[9px] font-black text-blue-600 uppercase tracking-widest flex items-center hover:underline"
                  >
                    Admission Page <i className="fa-solid fa-arrow-up-right-from-square ml-2 text-[8px]"></i>
                  </a>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Visual Timeline Section - Updated for 2026 cycle */}
        <section id="iit-timeline" className="mb-24 scroll-mt-32">
          <div className="bg-white rounded-[3rem] p-12 border border-slate-100 shadow-xl shadow-slate-100 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-bl-full opacity-50"></div>
            <div className="relative z-10">
              <h3 className="text-3xl font-black text-slate-900 mb-2">2026-2027 Admission Cycle</h3>
              <p className="text-slate-500 font-medium mb-12">Critical expected milestones for the upcoming session.</p>
              
              <div className="relative space-y-12 before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-blue-600 before:via-purple-500 before:to-emerald-500">
                {/* Milestone 1: UCEED */}
                {isVisible('UCEED', 'Design Creative B.Des') && (
                  <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-slate-900 text-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-20">
                      <i className="fa-solid fa-pen-nib text-xs"></i>
                    </div>
                    <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-6 rounded-2xl bg-slate-50 border border-slate-100 hover:border-orange-300 transition-all">
                      <div className="flex items-center justify-between space-x-2 mb-1">
                        <div className="font-black text-slate-900">UCEED 2026 Registration</div>
                        <time className="font-black text-orange-600 text-[10px] uppercase tracking-widest">Oct - Nov 2025</time>
                      </div>
                      <div className="text-slate-500 text-xs font-medium">Application portal expected to open for IIT Design courses.</div>
                      <div className="mt-4">
                        <a href="https://www.uceed.iitb.ac.in/" target="_blank" className="inline-flex items-center text-xs font-black text-orange-600 hover:underline">
                          Official Site <i className="fa-solid fa-arrow-right ml-2"></i>
                        </a>
                      </div>
                    </div>
                  </div>
                )}

                {/* Milestone 2: JEE Main 1 */}
                {isVisible('JEE Main', 'Engineering PCM Screening') && (
                  <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-slate-900 text-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-20">
                      <i className="fa-solid fa-atom text-xs"></i>
                    </div>
                    <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-6 rounded-2xl bg-slate-50 border border-slate-100 hover:border-blue-300 transition-all">
                      <div className="flex items-center justify-between space-x-2 mb-1">
                        <div className="font-black text-slate-900">JEE Main (Attempt 1)</div>
                        <time className="font-black text-blue-600 text-[10px] uppercase tracking-widest">Jan 2026</time>
                      </div>
                      <div className="text-slate-500 text-xs font-medium">Expected screening round for the 2026-27 Engineering session.</div>
                      <div className="mt-4">
                        <a href="https://jeemain.nta.nic.in/" target="_blank" className="inline-flex items-center text-xs font-black text-blue-600 hover:underline">
                          NTA Portal <i className="fa-solid fa-arrow-right ml-2"></i>
                        </a>
                      </div>
                    </div>
                  </div>
                )}

                {/* Milestone 3: IAT / NCET */}
                {(isVisible('IAT', 'Research IISER') || isVisible('NCET', 'ITEP Teaching')) && (
                  <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-slate-900 text-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-20">
                      <i className="fa-solid fa-flask text-xs"></i>
                    </div>
                    <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-6 rounded-2xl bg-slate-50 border border-slate-100 hover:border-purple-300 transition-all">
                      <div className="flex items-center justify-between space-x-2 mb-1">
                        <div className="font-black text-slate-900">IAT & NCET 2026 Forms</div>
                        <time className="font-black text-purple-600 text-[10px] uppercase tracking-widest">Mar - Apr 2026</time>
                      </div>
                      <div className="text-slate-500 text-xs font-medium">Applications for Research and Teaching pathways at IITs.</div>
                      <div className="mt-4 flex gap-4">
                        <button onClick={() => scrollToId('iat-section')} className="text-xs font-black text-purple-600 hover:underline">
                          View Research Details
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Milestone 4: JEE Advanced */}
                {isVisible('JEE Advanced', 'Engineering IIT Exam') && (
                  <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-blue-600 text-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-20">
                      <i className="fa-solid fa-trophy text-xs"></i>
                    </div>
                    <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-6 rounded-2xl bg-blue-50 border border-blue-100 hover:border-blue-400 transition-all shadow-inner">
                      <div className="flex items-center justify-between space-x-2 mb-1">
                        <div className="font-black text-blue-900">JEE Advanced 2026</div>
                        <time className="font-black text-blue-700 text-[10px] uppercase tracking-widest">May 2026</time>
                      </div>
                      <div className="text-blue-900/70 text-xs font-medium">Final intake exam for all IIT undergraduate Engineering programs.</div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-20">
          <div className="col-span-full border-b border-slate-200 pb-4 mb-4">
             <h3 className="text-2xl font-black text-slate-900 flex items-center">
               <i className="fa-solid fa-gear mr-3 text-blue-600"></i> Engineering Pathways (2026-27)
             </h3>
          </div>

          {/* JEE ADVANCED */}
          {isVisible('JEE Advanced', 'Engineering B.Tech B.S. Dual Degree B.Arch PCM') && (
            <div id="jee-advanced-section" className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-xl shadow-slate-100 hover:border-blue-200 transition-all group scroll-mt-32">
              <div className="flex items-center mb-8">
                <div className="w-16 h-16 bg-blue-600 text-white rounded-[1.5rem] flex items-center justify-center mr-6 group-hover:rotate-6 transition-transform">
                  <i className="fa-solid fa-atom text-3xl"></i>
                </div>
                <div>
                  <h3 className="text-3xl font-black text-slate-900">JEE Advanced</h3>
                  <p className="text-blue-600 text-xs font-black uppercase tracking-widest">Top Engineering Entry</p>
                </div>
              </div>
              <div className="space-y-6">
                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                  <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Target Programs</h4>
                  <p className="text-slate-700 font-bold">B.Tech, B.S., Dual Degree (B.Tech + M.Tech), B.Arch</p>
                </div>
                <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100">
                  <h4 className="text-xs font-black text-blue-700 uppercase tracking-widest mb-2">Eligibility</h4>
                  <p className="text-blue-900 font-bold leading-snug">Must be in top 2.5 Lakh qualifiers of JEE Main. 12th Pass with PCM is mandatory.</p>
                </div>
                <button 
                  onClick={() => handleDeepInfo(POPULAR_EXAMS.find(e => e.id === 'jee-adv')!)}
                  className="block w-full text-center bg-slate-900 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-600 transition-colors"
                >
                  2026-27 Deep Info <i className="fa-solid fa-robot ml-2"></i>
                </button>
              </div>
            </div>
          )}

          <div className="col-span-full border-b border-slate-200 pb-4 mb-4 mt-12">
             <h3 className="text-2xl font-black text-slate-900 flex items-center">
               <i className="fa-solid fa-flask mr-3 text-purple-600"></i> Science & Research Pathways (2026-27)
             </h3>
          </div>

          {/* IAT (IISER Aptitude Test) */}
          {isVisible('IAT (IISER Test)', 'Research Medical Sciences Engineering Data Science AI Science PCM PCB PCMB') && (
            <div id="iat-section" className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-xl shadow-slate-100 hover:border-purple-200 transition-all group scroll-mt-32">
              <div className="flex items-center mb-8">
                <div className="w-16 h-16 bg-purple-600 text-white rounded-[1.5rem] flex items-center justify-center mr-6 group-hover:rotate-6 transition-transform">
                  <i className="fa-solid fa-vial-circle-check text-3xl"></i>
                </div>
                <div>
                  <h3 className="text-3xl font-black text-slate-900">IISER IAT Pathways</h3>
                  <p className="text-purple-600 text-xs font-black uppercase tracking-widest">The Research Gateway</p>
                </div>
              </div>
              <div className="space-y-6">
                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                  <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">IIT Specific BS Courses</h4>
                  <ul className="text-slate-700 font-bold space-y-2">
                    <li className="flex items-start">
                      <i className="fa-solid fa-circle-check text-purple-500 mr-2 mt-1 text-[10px]"></i>
                      <span>IIT Madras: BS in Medical Sciences & Engineering</span>
                    </li>
                    <li className="flex items-start">
                      <i className="fa-solid fa-circle-check text-purple-500 mr-2 mt-1 text-[10px]"></i>
                      <span>IIT Guwahati: BS in Data Science & AI</span>
                    </li>
                  </ul>
                </div>
                <div className="bg-purple-50 p-6 rounded-2xl border border-purple-100">
                  <h4 className="text-xs font-black text-purple-700 uppercase tracking-widest mb-2">Eligibility (Crucial)</h4>
                  <p className="text-purple-900 font-bold leading-snug">Open to PCMB/PCM/PCB students. Ideal for research-driven careers.</p>
                </div>
                <button 
                  onClick={() => handleDeepInfo(POPULAR_EXAMS.find(e => e.id === 'iat')!)}
                  className="block w-full text-center bg-slate-900 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-purple-600 transition-colors"
                >
                  2026-27 Deep Info <i className="fa-solid fa-robot ml-2"></i>
                </button>
              </div>
            </div>
          )}

          <div className="col-span-full border-b border-slate-200 pb-4 mb-4 mt-12">
             <h3 className="text-2xl font-black text-slate-900 flex items-center">
               <i className="fa-solid fa-palette mr-3 text-orange-600"></i> Design Pathways (2026-27)
             </h3>
          </div>

          {/* UCEED */}
          {isVisible('UCEED', 'Design Creative B.Des Any Stream') && (
            <div id="uceed-section" className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-xl shadow-slate-100 hover:border-orange-200 transition-all group scroll-mt-32">
              <div className="flex items-center mb-8">
                <div className="w-16 h-16 bg-orange-500 text-white rounded-[1.5rem] flex items-center justify-center mr-6 group-hover:rotate-6 transition-transform">
                  <i className="fa-solid fa-pen-nib text-3xl"></i>
                </div>
                <div>
                  <h3 className="text-3xl font-black text-slate-900">UCEED</h3>
                  <p className="text-orange-600 text-xs font-black uppercase tracking-widest">Creative Design Entry</p>
                </div>
              </div>
              <div className="space-y-6">
                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                  <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">IIT Programs offering B.Des</h4>
                  <ul className="text-slate-700 font-bold space-y-2 text-sm">
                    <li className="flex items-center text-blue-600">
                      <i className="fa-solid fa-star mr-3 text-orange-500"></i> IIT HYDERABAD (Explicit B.Des Program)
                    </li>
                    <li className="flex items-center">
                      <i className="fa-solid fa-circle-check mr-3 text-slate-300"></i> IIT BOMBAY, DELHI, GUWAHATI, KANPUR, ROORKEE
                    </li>
                  </ul>
                </div>
                <button 
                  onClick={() => handleDeepInfo(POPULAR_EXAMS.find(e => e.id === 'uceed')!)}
                  className="block w-full text-center bg-slate-900 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-orange-600 transition-colors"
                >
                  2026-27 Deep Info <i className="fa-solid fa-robot ml-2"></i>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderCourses = () => (
    <div className="container mx-auto px-6 py-16">
      <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
        <div>
          <h2 className="text-5xl font-black text-slate-900 mb-6 tracking-tight">Degree Explorer</h2>
          <p className="text-xl text-slate-500 font-medium">Planning your specialization for the 2026 intake.</p>
        </div>
        <div className="flex gap-4">
          {activeFilterCount > 0 && (
            <button 
              onClick={() => { setSelectedSkills([]); setSelectedCareers([]); }}
              className="flex items-center px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest bg-red-50 text-red-600 border border-red-100 hover:bg-red-600 hover:text-white transition-all shadow-lg shadow-red-100"
            >
              <i className="fa-solid fa-trash-can mr-2"></i> Reset Filters
            </button>
          )}
          <button 
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className={`flex items-center px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all relative ${
              isFilterOpen || activeFilterCount > 0 
              ? 'bg-blue-600 text-white shadow-xl shadow-blue-200' 
              : 'bg-slate-900 text-white'
            }`}
          >
            <i className="fa-solid fa-filter mr-2"></i> 
            {isFilterOpen ? 'Hide Filters' : 'Refine Results'}
            {activeFilterCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] w-6 h-6 flex items-center justify-center rounded-full border-2 border-white shadow-lg">
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {filteredCourses.map(course => (
          <div key={course.id} className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 p-10 hover:border-blue-200 hover:shadow-2xl transition-all group flex flex-col">
            <div className="flex items-center mb-8">
              <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mr-6 group-hover:bg-blue-600 group-hover:text-white transition-all transform group-hover:rotate-6">
                <i className="fa-solid fa-graduation-cap text-2xl"></i>
              </div>
              <div>
                <h3 className="text-3xl font-black text-slate-900">{course.title}</h3>
                <span className="text-xs font-black text-blue-600 uppercase tracking-[0.2em]">{course.duration} COURSE</span>
              </div>
            </div>
            
            <p className="text-slate-500 mb-10 leading-relaxed font-medium italic border-l-4 border-blue-500 pl-6">
              "{course.overview}"
            </p>

            <div className="space-y-10 flex-grow">
              <div className="bg-blue-50/50 rounded-2xl p-6 border border-blue-100/50 shadow-inner">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center">
                  <i className="fa-solid fa-rocket mr-3 text-blue-500"></i> Future Scope & Demand
                </h4>
                <p className="text-xs text-slate-700 font-medium leading-relaxed">
                  {course.futureScope}
                </p>
              </div>

              <div>
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center">
                  <i className="fa-solid fa-briefcase mr-3 text-blue-500"></i> Career Opportunities
                </h4>
                <div className="flex flex-wrap gap-2">
                  {course.careerOptions.map((opt, i) => (
                    <span key={i} className={`text-[10px] font-black px-4 py-2 rounded-xl border transition-all ${
                      selectedCareers.includes(opt) 
                      ? 'bg-blue-600 border-blue-600 text-white shadow-md' 
                      : 'bg-slate-50 text-slate-800 border-slate-100 group-hover:bg-blue-50 group-hover:border-blue-100'
                    }`}>
                      {opt}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderExams = () => (
    <div className="container mx-auto px-6 py-16">
      <div className="mb-16">
        <h2 className="text-5xl font-black text-slate-900 mb-6 tracking-tight">Exam Explorer</h2>
        <p className="text-xl text-slate-500 font-medium">Browse {POPULAR_EXAMS.length} major entrances for the <span className="text-slate-900 font-bold">2026-27</span> academic cycle.</p>
      </div>

      <div className="space-y-8 mb-12">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <i className="fa-solid fa-magnifying-glass absolute left-6 top-1/2 -translate-y-1/2 text-slate-400"></i>
            <input 
              type="text" 
              placeholder="Search by exam name for 2026 cycle (e.g. CUET, Christ, NPAT)..." 
              className="w-full pl-14 pr-6 py-5 bg-white border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all font-medium text-slate-800"
              value={examSearch}
              onChange={(e) => {
                setExamSearch(e.target.value);
                setAiSearchResults(null);
              }}
            />
          </div>
          <button 
            onClick={async () => {
              if (!examSearch.trim()) return;
              setIsSearchingAi(true);
              const results = await searchLatestExams(`${examSearch} undergraduate entrance exam 2026-2027 confirmed dates and notification`);
              setAiSearchResults(results);
              setIsSearchingAi(false);
            }}
            disabled={isSearchingAi || !examSearch}
            className="bg-slate-900 hover:bg-blue-600 text-white font-black py-5 px-10 rounded-2xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-w-[200px]"
          >
            {isSearchingAi ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <>
                <i className="fa-solid fa-robot mr-2"></i>
                Deep Search AI (2026)
              </>
            )}
          </button>
        </div>
      </div>

      {aiSearchResults ? (
        <div className="bg-white rounded-[3rem] border border-blue-100 p-12 mb-16 shadow-2xl shadow-blue-50 animate-in fade-in slide-in-from-bottom-6">
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center">
              <span className="bg-blue-600 text-white text-[10px] font-black px-4 py-1.5 rounded-full mr-4 tracking-widest">REAL-TIME DATA (2026-27)</span>
              <h3 className="text-2xl font-black text-slate-900">Findings for "{examSearch}"</h3>
            </div>
            <button onClick={() => setAiSearchResults(null)} className="text-slate-400 hover:text-slate-900"><i className="fa-solid fa-circle-xmark text-xl"></i></button>
          </div>
          <div className="prose prose-slate max-w-none mb-10 text-slate-600 whitespace-pre-wrap leading-relaxed font-medium">
            {aiSearchResults.text}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredExams.map(exam => (
            <ExamCard key={exam.id} exam={exam} onDeepInfo={handleDeepInfo} />
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <nav className="glass sticky top-0 z-50 border-b border-slate-100 px-6 py-5">
        <div className="container mx-auto flex justify-between items-center">
          <div 
            onClick={() => setCurrentView('home')} 
            className="flex items-center cursor-pointer group"
          >
            <div className="bg-blue-600 text-white w-12 h-12 rounded-[1rem] flex items-center justify-center mr-4 group-hover:scale-110 group-hover:rotate-6 transition-all shadow-lg shadow-blue-200">
              <i className="fa-solid fa-compass text-lg"></i>
            </div>
            <span className="text-3xl font-black text-slate-900 tracking-tighter">Svad<span className="text-blue-600">harma</span></span>
          </div>
          
          <div className="hidden md:flex items-center space-x-10">
            <button onClick={() => setCurrentView('home')} className={`text-xs font-black uppercase tracking-widest transition-colors ${currentView === 'home' ? 'text-blue-600' : 'text-slate-400 hover:text-slate-900'}`}>Home</button>
            <button onClick={() => setCurrentView('iit')} className={`text-xs font-black uppercase tracking-widest transition-colors ${currentView === 'iit' ? 'text-blue-600' : 'text-slate-400 hover:text-slate-900'} flex items-center`}>
              <i className="fa-solid fa-graduation-cap mr-2"></i> IIT 2026
            </button>
            <button onClick={() => setCurrentView('exams')} className={`text-xs font-black uppercase tracking-widest transition-colors ${currentView === 'exams' ? 'text-blue-600' : 'text-slate-400 hover:text-slate-900'}`}>Exams</button>
            <button onClick={() => setCurrentView('courses')} className={`text-xs font-black uppercase tracking-widest transition-colors ${currentView === 'courses' ? 'text-blue-600' : 'text-slate-400 hover:text-slate-900'}`}>Courses</button>
            <button 
              onClick={() => setCurrentView('ai-counselor')} 
              className="bg-blue-600 text-white text-xs font-black px-8 py-3 rounded-xl hover:bg-slate-900 transition-all shadow-xl shadow-blue-100 uppercase tracking-widest"
            >
              AI Roadmap 2026-27
            </button>
          </div>
        </div>
      </nav>

      <main className="flex-1">
        {currentView === 'home' && renderHome()}
        {currentView === 'iit' && renderIIT()}
        {currentView === 'exams' && renderExams()}
        {currentView === 'courses' && renderCourses()}
        {currentView === 'ai-counselor' && <AICounselor onRoadmapSaved={refreshSavedRoadmaps} />}
        {currentView === 'roadmap-detail' && renderRoadmapDetail()}
        {currentView === 'exam-detail' && renderExamDetail()}
      </main>

      <footer className="bg-white border-t border-slate-100 pt-24 pb-12">
        <div className="container mx-auto px-6">
          <div className="border-t border-slate-50 pt-12 text-center">
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.3em]">© 2026 Svadharma. Career clarity for the 2026-2027 cycle.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
