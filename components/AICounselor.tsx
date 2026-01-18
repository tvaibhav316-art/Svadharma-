
import React, { useState } from 'react';
import { getCareerRoadmap } from '../services/geminiService';
import { AICounselorResponse, SavedRoadmap } from '../types';

interface AICounselorProps {
  onRoadmapSaved?: () => void;
}

const AICounselor: React.FC<AICounselorProps> = ({ onRoadmapSaved }) => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AICounselorResponse | null>(null);
  const [saved, setSaved] = useState(false);

  const handleConsult = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    setSaved(false);
    const roadmap = await getCareerRoadmap(query);
    setResult(roadmap);
    setLoading(false);
  };

  const handleSave = () => {
    if (!result) return;
    
    const newSavedPlan: SavedRoadmap = {
      id: Date.now().toString(),
      title: query.charAt(0).toUpperCase() + query.slice(1),
      date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
      response: result
    };

    const existingPlansRaw = localStorage.getItem('svadharma_plans');
    const existingPlans: SavedRoadmap[] = existingPlansRaw ? JSON.parse(existingPlansRaw) : [];
    
    localStorage.setItem('svadharma_plans', JSON.stringify([newSavedPlan, ...existingPlans]));
    setSaved(true);
    if (onRoadmapSaved) onRoadmapSaved();
  };

  return (
    <div className="max-w-5xl mx-auto py-8 px-6">
      <div className="bg-white rounded-[3rem] shadow-2xl shadow-slate-200 overflow-hidden mb-8 border border-slate-100">
        <div className="p-12 bg-slate-900 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/20 blur-[100px] rounded-full -mr-32 -mt-32"></div>
          <div className="relative z-10">
            <div className="inline-flex items-center space-x-2 bg-blue-600 text-white text-[10px] font-black px-4 py-1.5 rounded-full mb-6 tracking-widest uppercase">
              <i className="fa-solid fa-bolt-lightning"></i>
              <span>AI-Powered Real-time Counseling</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black mb-4 tracking-tighter">Plan Your <span className="text-blue-500">2026-27 Path.</span></h2>
            <p className="text-slate-400 text-lg max-w-2xl font-medium leading-relaxed">
              Using live data from Google Search, our counselor provides accurate timelines, 
              exam dates, and career paths tailored to the upcoming 2026-2027 session.
            </p>
          </div>
        </div>
        
        <form onSubmit={handleConsult} className="p-12 border-b border-slate-50">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="relative flex-1">
              <i className="fa-solid fa-comment-dots absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 text-xl"></i>
              <input 
                type="text" 
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Ask anything: 'How to prepare for JEE 2026?' or 'Best courses for 2027 intake'..."
                className="w-full pl-16 pr-6 py-6 bg-slate-50 border border-slate-200 rounded-[2rem] focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:outline-none text-lg transition-all font-medium text-slate-800 shadow-inner"
              />
            </div>
            <button 
              type="submit"
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white font-black py-6 px-12 rounded-[2rem] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-w-[200px] shadow-xl shadow-blue-200 group"
            >
              {loading ? (
                <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <i className="fa-solid fa-wand-magic-sparkles mr-3 group-hover:rotate-12 transition-transform"></i>
                  Generate Roadmap
                </>
              )}
            </button>
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mr-2 self-center">Try:</span>
            <button onClick={() => setQuery("Becoming a Data Scientist in 2026")} type="button" className="text-xs font-bold bg-white border border-slate-200 text-slate-600 px-5 py-2.5 rounded-full hover:border-blue-600 hover:text-blue-600 transition-all">Data Science 2026</button>
            <button onClick={() => setQuery("Is medical a good choice for 2027?")} type="button" className="text-xs font-bold bg-white border border-slate-200 text-slate-600 px-5 py-2.5 rounded-full hover:border-blue-600 hover:text-blue-600 transition-all">MBBS Intake</button>
            <button onClick={() => setQuery("Global SAT roadmap for 2026 admissions")} type="button" className="text-xs font-bold bg-white border border-slate-200 text-slate-600 px-5 py-2.5 rounded-full hover:border-blue-600 hover:text-blue-600 transition-all">Global SAT 2026</button>
          </div>
        </form>

        {result && (
          <div className="p-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
            <div className="flex justify-between items-center mb-10">
               <h3 className="text-2xl font-black text-slate-900">Your Personalized 2026-27 Roadmap</h3>
               <button 
                 onClick={handleSave}
                 disabled={saved}
                 className={`flex items-center px-6 py-3 rounded-2xl text-xs font-black transition-all ${
                   saved 
                   ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' 
                   : 'bg-slate-900 text-white hover:bg-blue-600 shadow-lg'
                 }`}
               >
                 <i className={`fa-solid ${saved ? 'fa-circle-check' : 'fa-bookmark'} mr-2`}></i>
                 {saved ? 'Saved to My Plans' : 'Save to My Plans'}
               </button>
            </div>

            <div className="prose prose-slate max-w-none text-slate-700 font-medium">
              <div className="bg-blue-50/50 rounded-[2rem] p-10 border border-blue-100/50 mb-12 shadow-inner">
                 <div className="whitespace-pre-wrap leading-relaxed text-lg" style={{ wordBreak: 'break-word' }}>
                   {result.text}
                 </div>
              </div>
            </div>

            {result.links.length > 0 && (
              <div className="space-y-6 pt-12 border-t border-slate-100">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center text-white">
                    <i className="fa-brands fa-google text-xs"></i>
                  </div>
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Verified Sources & Portals</h4>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {result.links.map((link, idx) => (
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
        )}

        {!result && !loading && (
          <div className="p-32 text-center">
            <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-8">
              <i className="fa-solid fa-route text-4xl text-slate-200"></i>
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Ready to plan your 2026 chapter?</h3>
            <p className="text-slate-400 font-medium">Enter your interests above to generate a real-time roadmap for the 2026-27 session.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AICounselor;
