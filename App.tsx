import React, { useState } from 'react';
import { BookOpen, ChevronLeft, Award, HelpCircle } from 'lucide-react';
import { data } from './data';
import QuestionCard from './components/QuestionCard';
import ThemeControls from './components/ThemeControls';

function App() {
  const [activeTopicId, setActiveTopicId] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  
  const handleTopicSelect = (id: string) => {
    setActiveTopicId(id);
    setScore(0);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleExit = () => {
    setActiveTopicId(null);
    setScore(0);
  };

  const activeTopic = activeTopicId ? data[activeTopicId] : null;

  return (
    <div className="min-h-screen font-sans text-slate-900 dark:text-slate-100 bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
      <ThemeControls />
      
      {/* Header */}
      <header className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 sticky top-0 z-30 shadow-sm/50 backdrop-blur-md bg-white/80 dark:bg-slate-800/80 transition-colors duration-300">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-primary/10 dark:bg-primary/20 p-2 rounded-lg text-primary">
              <BookOpen size={24} />
            </div>
            <h1 className="font-bold text-lg hidden sm:block text-slate-800 dark:text-white">Triết Học Quiz Pro</h1>
          </div>
          
          {activeTopic && (
            <div className="flex items-center gap-4">
              <div className="bg-slate-100 dark:bg-slate-700 px-4 py-1.5 rounded-full flex items-center gap-2 font-semibold text-sm text-slate-700 dark:text-slate-200 transition-colors">
                <Award size={16} className="text-orange-500" />
                <span>{score} / {activeTopic.questions.length}</span>
              </div>
              <button 
                onClick={handleExit}
                className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full text-slate-500 dark:text-slate-400 transition-colors"
                title="Thoát"
              >
                <ChevronLeft size={24} />
              </button>
            </div>
          )}
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-4 sm:p-6 pb-20">
        {!activeTopic ? (
          // Topic Selection Screen
          <div className="space-y-8 animate-fade-in">
            <div className="text-center py-10">
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-3 transition-colors">Ngân Hàng Câu Hỏi Triết Học</h2>
              <p className="text-slate-500 dark:text-slate-400 text-lg transition-colors">Chọn chủ đề để bắt đầu kiểm tra kiến thức của bạn</p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {Object.entries(data).map(([id, topic]) => (
                <button
                  key={id}
                  onClick={() => handleTopicSelect(id)}
                  className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 hover:border-primary dark:hover:border-primary hover:shadow-md hover:-translate-y-1 transition-all text-left group duration-300"
                >
                  <div className="flex items-start gap-4">
                    <div className="bg-indigo-50 dark:bg-slate-700 text-primary p-3 rounded-lg group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                      <HelpCircle size={24} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-800 dark:text-slate-100 group-hover:text-primary transition-colors text-lg leading-snug mb-1">
                        {topic.name}
                      </h3>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        {topic.questions.length} câu hỏi
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        ) : (
          // Quiz Screen
          <div className="space-y-6 animate-fade-in-up">
            <div className="bg-gradient-to-r from-primary to-indigo-700 dark:to-indigo-900 rounded-2xl p-6 sm:p-8 text-white shadow-lg mb-8 transition-all duration-300">
              <h2 className="text-xl sm:text-2xl font-bold leading-tight">{activeTopic.name}</h2>
              <div className="mt-4 flex gap-4 text-white/80 text-sm font-medium">
                <span>• Trắc nghiệm & Tự luận</span>
                <span>• Phản hồi tức thì</span>
              </div>
            </div>

            <div className="space-y-8">
              {activeTopic.questions.map((q, idx) => (
                <QuestionCard 
                  key={idx} 
                  question={q} 
                  index={idx} 
                  onCorrect={() => setScore(prev => prev + 1)} 
                />
              ))}
            </div>

            <div className="flex justify-center pt-10 pb-6">
               <button 
                onClick={handleExit}
                className="flex items-center gap-2 px-6 py-3 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold rounded-full transition-colors"
               >
                 <ChevronLeft size={20} />
                 Quay lại danh sách chủ đề
               </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;