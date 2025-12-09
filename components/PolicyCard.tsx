import React, { useState } from 'react';
import { FullRecommendation } from '../types';

interface PolicyCardProps {
  data: FullRecommendation;
  rank: number;
}

const PolicyCard: React.FC<PolicyCardProps> = ({ data, rank }) => {
  const [expanded, setExpanded] = useState(false);
  const { policy, analysis } = data;

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600 bg-green-50';
    if (score >= 75) return 'text-blue-600 bg-blue-50';
    return 'text-yellow-600 bg-yellow-50';
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden mb-6 transition-all hover:shadow-xl">
      {/* Header Section */}
      <div className="p-5 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-4">
          <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center font-bold text-xl text-gray-400">
             {/* Fallback logo logic */}
             {policy.insurerName.charAt(0)}
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">{policy.policyName}</h3>
            <p className="text-sm text-gray-500">{policy.insurerName}</p>
          </div>
        </div>
        
        <div className={`px-4 py-2 rounded-lg font-bold text-sm ${getScoreColor(analysis.matchScore)} flex items-center gap-2`}>
          <span>{analysis.matchScore}% Match</span>
          {rank === 1 && (
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
          )}
        </div>
      </div>

      {/* Quick Specs */}
      <div className="grid grid-cols-3 gap-2 p-4 bg-gray-50 text-center text-sm">
        <div>
          <p className="text-gray-500 text-xs uppercase tracking-wide">Cover</p>
          <p className="font-semibold text-gray-900">{policy.sumInsured}</p>
        </div>
        <div>
          <p className="text-gray-500 text-xs uppercase tracking-wide">Premium/m</p>
          <p className="font-semibold text-gray-900">₹{policy.premium}</p>
        </div>
        <div>
          <p className="text-gray-500 text-xs uppercase tracking-wide">Waiting Period</p>
          <p className="font-semibold text-gray-900">{policy.pedWaitingPeriod}</p>
        </div>
      </div>

      {/* AI Analysis */}
      <div className="p-5">
        <div className="mb-4">
          <h4 className="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-blue-600">
              <path fillRule="evenodd" d="M9 4.5a.75.75 0 01.721.544l.813 2.846a3.75 3.75 0 002.576 2.576l2.846.813a.75.75 0 010 1.442l-2.846.813a3.75 3.75 0 00-2.576 2.576l-.813 2.846a.75.75 0 01-1.442 0l-.813-2.846a3.75 3.75 0 00-2.576-2.576l-2.846-.813a.75.75 0 010-1.442l2.846-.813a3.75 3.75 0 002.576-2.576l.813-2.846A.75.75 0 019 4.5zM6.97 11.03a.75.75 0 111.06 1.06l-2.25 2.25a.75.75 0 11-1.06-1.06l2.25-2.25zm9.75 9.75a.75.75 0 11-1.06-1.06l2.25-2.25a.75.75 0 111.06 1.06l-2.25 2.25z" clipRule="evenodd" />
            </svg>
            Why this fits you
          </h4>
          <p className="text-sm text-gray-600 leading-relaxed">{analysis.reasoning}</p>
        </div>

        <button 
          onClick={() => setExpanded(!expanded)}
          className="w-full py-2 text-sm text-blue-600 font-medium hover:bg-blue-50 rounded transition-colors flex items-center justify-center gap-1"
        >
          {expanded ? 'Show Less' : 'View Details & Benefits'}
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={`w-4 h-4 transition-transform ${expanded ? 'rotate-180' : ''}`}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
          </svg>
        </button>

        {expanded && (
          <div className="mt-4 pt-4 border-t border-gray-100 grid md:grid-cols-2 gap-6 animate-fadeIn">
            <div>
              <h5 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Key Features</h5>
              <ul className="space-y-2">
                {policy.features.map((f, i) => (
                  <li key={i} className="text-sm text-gray-700 flex items-start gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 text-green-500 mt-0.5 shrink-0">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                    {f}
                  </li>
                ))}
                <li className="text-sm text-gray-700 flex items-start gap-2">
                   <span className="font-semibold text-gray-900 w-24">Room Rent:</span> {policy.roomRentLimit}
                </li>
                <li className="text-sm text-gray-700 flex items-start gap-2">
                   <span className="font-semibold text-gray-900 w-24">Co-Pay:</span> {policy.copay}
                </li>
              </ul>
            </div>
            
            <div>
               <h5 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Analysis</h5>
               <div className="space-y-3">
                 <div>
                   <p className="text-xs font-semibold text-green-700 mb-1">Pros</p>
                   <ul className="list-disc list-inside text-xs text-gray-600">
                     {analysis.pros.map((p, idx) => <li key={idx}>{p}</li>)}
                   </ul>
                 </div>
                 <div>
                   <p className="text-xs font-semibold text-red-700 mb-1">Cons</p>
                   <ul className="list-disc list-inside text-xs text-gray-600">
                     {analysis.cons.map((c, idx) => <li key={idx}>{c}</li>)}
                   </ul>
                 </div>
               </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PolicyCard;