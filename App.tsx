import React, { useState, useEffect, useRef } from 'react';
import { 
  AppState, 
  ChatMessage, 
  MessageType, 
  FullRecommendation 
} from './types';
import { INITIAL_QUESTIONS, MOCK_POLICIES } from './constants';
import { getNextQuestion, getPolicyRecommendations } from './services/geminiService';
import Header from './components/Header';
import PolicyCard from './components/PolicyCard';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.LANDING);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [recommendations, setRecommendations] = useState<FullRecommendation[]>([]);
  
  // Refs for scrolling
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const startAssessment = () => {
    setAppState(AppState.ASSESSMENT);
    setMessages([
      {
        id: 'init',
        type: MessageType.AI,
        content: INITIAL_QUESTIONS[0]
      },
      {
        id: 'init_2',
        type: MessageType.AI,
        content: INITIAL_QUESTIONS[1],
        options: ['Myself', 'My Family (Wife & Kids)', 'Parents', 'Everyone']
      }
    ]);
  };

  const resetApp = () => {
    setAppState(AppState.LANDING);
    setMessages([]);
    setRecommendations([]);
    setInput('');
  };

  const handleSendMessage = async (text: string) => {
    if (!text.trim()) return;

    // Add user message
    const newUserMsg: ChatMessage = {
      id: Date.now().toString(),
      type: MessageType.USER,
      content: text
    };
    
    setMessages(prev => [...prev, newUserMsg]);
    setInput('');
    setIsLoading(true);

    try {
      // Create conversation history for AI
      const history = messages.concat(newUserMsg).map(m => ({
        role: m.type === MessageType.USER ? 'user' : 'model',
        text: m.content
      }));

      // Get next step from Gemini
      const aiResponse = await getNextQuestion(history);

      if (aiResponse.isComplete) {
        // We have enough info, move to analysis
        setAppState(AppState.ANALYSIS);
        
        // Compile full conversation for analysis
        const fullConversation = history.map(h => `${h.role}: ${h.text}`).join('\n');
        
        const recs = await getPolicyRecommendations(fullConversation);
        
        // Merge analysis with policy data
        const fullRecs: FullRecommendation[] = recs.map(r => {
          const policy = MOCK_POLICIES.find(p => p.id === r.policyId);
          if (!policy) return null;
          return { policy, analysis: r };
        }).filter((r): r is FullRecommendation => r !== null)
        .sort((a, b) => b.analysis.matchScore - a.analysis.matchScore);

        setRecommendations(fullRecs);
        setAppState(AppState.RESULTS);
      } else {
        // Continue questions
        const newAiMsg: ChatMessage = {
          id: (Date.now() + 1).toString(),
          type: MessageType.AI,
          content: aiResponse.text,
          options: aiResponse.options
        };
        setMessages(prev => [...prev, newAiMsg]);
      }
    } catch (error) {
      console.error("Error in chat loop", error);
      const errorMsg: ChatMessage = {
        id: 'error',
        type: MessageType.SYSTEM,
        content: "I'm having trouble connecting to the server. Please try again."
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  // Render Landing Page
  if (appState === AppState.LANDING) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50">
        <Header appState={appState} resetApp={resetApp} />
        
        <main className="flex-1 flex flex-col items-center justify-center p-6 text-center">
          <div className="max-w-3xl space-y-8 animate-fadeIn">
            <div className="inline-block p-4 rounded-full bg-blue-100 text-blue-600 mb-4">
               <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
              </svg>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 tracking-tight">
              Health Insurance, <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-teal-500">Simplified by AI.</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
              Confusion with Room Rent Limits? Waiting Periods? Co-pay? <br/>
              BimaSathi analyzes your family needs against top Indian policies to find your perfect match.
            </p>
            <button 
              onClick={startAssessment}
              className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-lg transition-all shadow-lg hover:shadow-blue-500/30 transform hover:-translate-y-1"
            >
              Find My Policy
            </button>
            <p className="text-sm text-gray-400 mt-8">
              Simulates data from top aggregators like HDFC, Star, Niva Bupa & more.
            </p>
          </div>
        </main>
      </div>
    );
  }

  // Render Analysis Loading Screen
  if (appState === AppState.ANALYSIS) {
    return (
      <div className="min-h-screen bg-white">
        <Header appState={appState} resetApp={resetApp} />
        <div className="flex flex-col items-center justify-center h-[80vh]">
          <div className="relative w-24 h-24 mb-8">
            <div className="absolute top-0 left-0 w-full h-full border-4 border-blue-200 rounded-full animate-ping"></div>
            <div className="absolute top-0 left-0 w-full h-full border-4 border-t-blue-600 rounded-full animate-spin"></div>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Analyzing your profile...</h2>
          <p className="text-gray-500">Checking Room Rent limits...</p>
          <p className="text-gray-500 delay-75">Comparing Waiting Periods...</p>
          <p className="text-gray-500 delay-150">Calculating optimal coverage...</p>
        </div>
      </div>
    );
  }

  // Render Results Page
  if (appState === AppState.RESULTS) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Header appState={appState} resetApp={resetApp} />
        <main className="max-w-4xl mx-auto p-4 md:p-8">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Recommended for you</h2>
            <p className="text-gray-600">Based on our conversation, these plans offer the best coverage for your specific needs.</p>
          </div>
          
          <div>
            {recommendations.map((rec, index) => (
              <PolicyCard key={rec.policy.id} data={rec} rank={index + 1} />
            ))}
          </div>

          <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-sm text-yellow-800 flex gap-3">
             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 shrink-0">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
            </svg>
            <p>Disclaimer: BimaSathi is an AI advisor. Insurance premiums and features are subject to change by the insurer. Please read the policy wording document carefully before purchasing.</p>
          </div>
        </main>
      </div>
    );
  }

  // Render Assessment (Chat)
  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <Header appState={appState} resetApp={resetApp} />
      
      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-4 pb-32">
        <div className="max-w-2xl mx-auto space-y-4">
          {messages.map((msg) => (
            <div 
              key={msg.id} 
              className={`flex ${msg.type === MessageType.USER ? 'justify-end' : 'justify-start'}`}
            >
              <div 
                className={`max-w-[80%] p-4 rounded-2xl shadow-sm text-sm md:text-base ${
                  msg.type === MessageType.USER 
                    ? 'bg-blue-600 text-white rounded-br-none' 
                    : 'bg-white text-gray-800 border border-gray-100 rounded-bl-none'
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
               <div className="bg-white p-4 rounded-2xl rounded-bl-none border border-gray-100 flex gap-2 items-center">
                 <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                 <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-75"></div>
                 <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-150"></div>
               </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 p-4">
        <div className="max-w-2xl mx-auto">
          {/* Quick Options */}
          {messages.length > 0 && messages[messages.length - 1].type === MessageType.AI && messages[messages.length - 1].options && (
            <div className="flex gap-2 mb-4 overflow-x-auto scrollbar-hide">
              {messages[messages.length - 1].options!.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => handleSendMessage(opt)}
                  disabled={isLoading}
                  className="whitespace-nowrap px-4 py-2 bg-blue-50 text-blue-700 text-sm font-medium rounded-full hover:bg-blue-100 transition-colors border border-blue-100"
                >
                  {opt}
                </button>
              ))}
            </div>
          )}

          {/* Text Input */}
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage(input)}
              placeholder="Type your answer here..."
              className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={isLoading}
            />
            <button
              onClick={() => handleSendMessage(input)}
              disabled={isLoading || !input.trim()}
              className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;