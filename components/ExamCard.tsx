
import React from 'react';
import { ExamInfo } from '../types';

interface ExamCardProps {
  exam: ExamInfo;
  onDeepInfo: (exam: ExamInfo) => void;
}

const ExamCard: React.FC<ExamCardProps> = ({ exam, onDeepInfo }) => {
  const getStreamColor = (stream: string) => {
    switch (stream) {
      case 'PCM': return 'bg-orange-50 text-orange-700 border-orange-100';
      case 'PCB': return 'bg-emerald-50 text-emerald-700 border-emerald-100';
      case 'Science': return 'bg-blue-50 text-blue-700 border-blue-100';
      case 'Any': return 'bg-slate-100 text-slate-700 border-slate-200';
      default: return 'bg-slate-50 text-slate-600 border-slate-100';
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 hover:shadow-2xl hover:-translate-y-1 transition-all duration-500 group flex flex-col h-full">
      <div className="flex justify-between items-start mb-6">
        <span className={`text-[9px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest ${
          exam.scope === 'India' ? 'bg-blue-600 text-white' : 'bg-purple-600 text-white'
        }`}>
          {exam.scope}
        </span>
        <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">{exam.category}</span>
      </div>
      
      <h3 className="text-2xl font-black text-slate-900 mb-4 group-hover:text-blue-600 transition-colors leading-tight tracking-tight">
        {exam.name}
      </h3>
      
      <div className="mb-8 flex-grow">
        <h4 className="text-[9px] font-black text-blue-600 uppercase tracking-widest mb-3 flex items-center">
          <i className="fa-solid fa-bullseye mr-2"></i> Purpose & Goal
        </h4>
        <p className="text-sm text-slate-500 leading-relaxed font-medium">
          {exam.description}
        </p>
      </div>
      
      <div className="space-y-6 pt-6 border-t border-slate-50">
        <div>
          <h4 className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center">
            <i className="fa-solid fa-graduation-cap mr-2"></i> Eligibility
          </h4>
          <div className="flex flex-col gap-3">
            <span className={`text-[10px] font-black px-3 py-1.5 rounded-lg border w-fit ${getStreamColor(exam.stream)}`}>
              {exam.stream === 'Any' ? 'ALL STREAMS ELIGIBLE' : `${exam.stream} STREAM`}
            </span>
            <p className="text-xs text-slate-600 font-bold leading-snug">
              {exam.eligibility}
            </p>
          </div>
        </div>
      </div>
      
      <div className="mt-8 space-y-3">
        <button 
          onClick={() => onDeepInfo(exam)}
          className="w-full text-center py-4 px-4 bg-slate-900 text-white text-[10px] font-black rounded-xl hover:bg-blue-600 transition-all shadow-xl shadow-slate-200 hover:shadow-blue-100 uppercase tracking-[0.2em]"
        >
          Deep Information <i className="fa-solid fa-robot ml-2 text-[8px]"></i>
        </button>
        
        <div className="grid grid-cols-2 gap-3">
          <a 
            href={exam.previousPapersUrl || `https://www.google.com/search?q=${encodeURIComponent(exam.name + " previous year question papers pdf download")}`} 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center justify-center py-4 px-2 bg-blue-50 text-blue-700 text-[9px] font-black rounded-xl hover:bg-blue-600 hover:text-white transition-all uppercase tracking-[0.1em] text-center"
          >
            <i className="fa-solid fa-file-pdf mr-2"></i> Previous Papers
          </a>
          <a 
            href={exam.website} 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center justify-center py-4 px-2 bg-slate-100 text-slate-800 text-[9px] font-black rounded-xl hover:bg-slate-200 transition-all uppercase tracking-[0.1em] text-center"
          >
            Official Portal
          </a>
        </div>
      </div>
    </div>
  );
};

export default ExamCard;
