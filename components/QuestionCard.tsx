import React, { useState } from 'react';
import { Question } from '../types';
import { Check, X, Circle, CheckCircle2 } from 'lucide-react';
import DragDropQuestion from './DragDropQuestion';

interface Props {
  question: Question;
  index: number;
  onCorrect: () => void;
}

const QuestionCard: React.FC<Props> = ({ question, index, onCorrect }) => {
  const [answered, setAnswered] = useState(false);
  const [selectedSingle, setSelectedSingle] = useState<number | null>(null);
  const [selectedMulti, setSelectedMulti] = useState<number[]>([]);
  const [selectedTF, setSelectedTF] = useState<{ [key: number]: boolean | null }>({});
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  const handleSingleSelect = (optIdx: number) => {
    if (answered) return;
    setSelectedSingle(optIdx);
    setAnswered(true);
    if (question.type === 'single') {
      const correct = optIdx === question.correct;
      setIsCorrect(correct);
      if (correct) onCorrect();
    }
  };

  const handleMultiToggle = (optIdx: number) => {
    if (answered) return;
    if (selectedMulti.includes(optIdx)) {
      setSelectedMulti(prev => prev.filter(i => i !== optIdx));
    } else {
      setSelectedMulti(prev => [...prev, optIdx]);
    }
  };

  const submitMulti = () => {
    if (question.type !== 'multi') return;
    setAnswered(true);
    
    // Check if selected matches correct exactly
    const correctSet = new Set(question.correct);
    const selectedSet = new Set(selectedMulti);
    
    let correct = true;
    if (correctSet.size !== selectedSet.size) correct = false;
    for (let s of selectedSet) if (!correctSet.has(s)) correct = false;

    setIsCorrect(correct);
    if (correct) onCorrect();
  };

  const handleTFToggle = (rowIdx: number, val: boolean) => {
    if (answered) return;
    setSelectedTF(prev => ({ ...prev, [rowIdx]: val }));
  };

  const submitTF = () => {
    if (question.type !== 'truefalse') return;
    
    // Validate all rows answered
    if (Object.keys(selectedTF).length < question.options.length) {
      alert("Vui lòng trả lời tất cả các ý");
      return;
    }

    setAnswered(true);
    let allCorrect = true;
    
    question.options.forEach((opt, idx) => {
      if (selectedTF[idx] !== opt.correct) allCorrect = false;
    });

    setIsCorrect(allCorrect);
    if (allCorrect) onCorrect();
  };

  const renderContent = () => {
    if (question.html) {
      return <div dangerouslySetInnerHTML={{ __html: question.q }} />;
    }
    return question.q;
  };

  return (
    <div className="bg-surface dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden mb-6 transition-all hover:shadow-md duration-300">
      <div className="p-5 border-b border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/30">
        <h3 className="text-slate-800 dark:text-slate-100 font-semibold text-lg flex gap-3">
          <span className="text-primary whitespace-nowrap">Câu {index + 1}:</span>
          <span className="font-medium text-slate-700 dark:text-slate-200 block">{renderContent()}</span>
        </h3>
      </div>
      
      <div className="p-5">
        {/* Single Choice */}
        {question.type === 'single' && (
          <div className="space-y-3">
            {question.options.map((opt, idx) => {
              let btnClass = "w-full text-left p-4 rounded-lg border-2 transition-all flex items-center justify-between group ";
              if (answered) {
                if (idx === question.correct) {
                  btnClass += "bg-green-50 dark:bg-green-900/30 border-success text-green-800 dark:text-green-300";
                } else if (idx === selectedSingle) {
                  btnClass += "bg-red-50 dark:bg-red-900/30 border-error text-red-800 dark:text-red-300";
                } else {
                  btnClass += "bg-slate-50 dark:bg-slate-800 border-slate-100 dark:border-slate-700 text-slate-400 dark:text-slate-500 opacity-60";
                }
              } else {
                btnClass += "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-600 hover:border-primary dark:hover:border-primary hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 cursor-pointer";
              }

              return (
                <button 
                  key={idx} 
                  onClick={() => handleSingleSelect(idx)}
                  disabled={answered}
                  className={btnClass}
                >
                  <span className="flex-1">{opt}</span>
                  {answered && idx === question.correct && <CheckCircle2 className="text-success ml-3" size={20} />}
                  {answered && idx === selectedSingle && idx !== question.correct && <X className="text-error ml-3" size={20} />}
                  {!answered && <Circle className="text-slate-300 dark:text-slate-500 group-hover:text-primary transition-colors ml-3" size={20} />}
                </button>
              );
            })}
          </div>
        )}

        {/* Multi Choice */}
        {question.type === 'multi' && (
          <div className="space-y-4">
            <div className="space-y-3">
              {question.options.map((opt, idx) => {
                const isSelected = selectedMulti.includes(idx);
                let divClass = "w-full p-4 rounded-lg border-2 transition-all flex items-start gap-3 cursor-pointer ";
                
                if (answered) {
                  const isActuallyCorrect = question.correct.includes(idx);
                   if (isActuallyCorrect) {
                    divClass += "bg-green-50 dark:bg-green-900/30 border-success text-green-800 dark:text-green-300";
                  } else if (isSelected && !isActuallyCorrect) {
                    divClass += "bg-red-50 dark:bg-red-900/30 border-error text-red-800 dark:text-red-300";
                  } else {
                    divClass += "bg-slate-50 dark:bg-slate-800 border-slate-100 dark:border-slate-700 text-slate-400 dark:text-slate-500 opacity-60";
                  }
                } else {
                  if (isSelected) divClass += "bg-indigo-50 dark:bg-primary/20 border-primary text-primary";
                  else divClass += "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200";
                }

                return (
                  <div key={idx} onClick={() => handleMultiToggle(idx)} className={divClass}>
                    <div className={`mt-0.5 w-5 h-5 rounded border flex items-center justify-center shrink-0 ${isSelected ? 'bg-primary border-primary' : 'bg-white dark:bg-slate-700 border-slate-300 dark:border-slate-500'}`}>
                      {isSelected && <Check size={14} className="text-white" />}
                    </div>
                    <span>{opt}</span>
                  </div>
                );
              })}
            </div>
            {!answered && (
              <button onClick={submitMulti} className="bg-primary text-white px-6 py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors shadow-sm">
                Trả lời
              </button>
            )}
          </div>
        )}

        {/* True False */}
        {question.type === 'truefalse' && (
          <div className="space-y-6">
            <div className="grid gap-4">
              {question.options.map((row, idx) => {
                const userVal = selectedTF[idx];
                const isRowCorrect = answered ? userVal === row.correct : null;
                
                return (
                  <div key={idx} className={`p-4 rounded-lg border bg-white dark:bg-slate-800 transition-colors ${answered ? (isRowCorrect ? 'border-success bg-green-50/30 dark:bg-green-900/20' : 'border-error bg-red-50/30 dark:bg-red-900/20') : 'border-slate-200 dark:border-slate-600'}`}>
                    <div className="mb-3 font-medium text-slate-800 dark:text-slate-200">{row.text}</div>
                    <div className="flex gap-4">
                      <button 
                        onClick={() => handleTFToggle(idx, true)}
                        disabled={answered}
                        className={`flex-1 py-2 px-3 rounded text-sm font-semibold border transition-all ${
                          userVal === true 
                            ? 'bg-primary border-primary text-white' 
                            : 'bg-white dark:bg-slate-700 border-slate-300 dark:border-slate-500 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-600'
                        } ${answered && row.correct === true ? '!bg-success !border-success !text-white' : ''}`}
                      >
                        Đúng
                      </button>
                      <button 
                        onClick={() => handleTFToggle(idx, false)}
                        disabled={answered}
                        className={`flex-1 py-2 px-3 rounded text-sm font-semibold border transition-all ${
                          userVal === false 
                            ? 'bg-primary border-primary text-white' 
                            : 'bg-white dark:bg-slate-700 border-slate-300 dark:border-slate-500 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-600'
                        } ${answered && row.correct === false ? '!bg-success !border-success !text-white' : ''}`}
                      >
                        Sai
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
            {!answered && (
              <button onClick={submitTF} className="bg-primary text-white px-6 py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors shadow-sm">
                Trả lời
              </button>
            )}
          </div>
        )}

        {/* Drag Drop */}
        {question.type === 'drag' && (
          <DragDropQuestion 
            question={question} 
            onCorrect={() => {
              setAnswered(true);
              setIsCorrect(true);
              onCorrect();
            }}
            isLocked={answered}
          />
        )}
      </div>

      {/* Feedback Footer */}
      {answered && isCorrect !== null && question.type !== 'drag' && (
        <div className={`px-5 py-3 flex items-center gap-2 font-medium ${
          isCorrect 
            ? 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300 animate-pop-in' 
            : 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300 animate-fade-in-up'
        }`}>
          {isCorrect ? <CheckCircle2 size={20} /> : <X size={20} />}
          {isCorrect ? "Chính xác!" : "Chưa chính xác. Hãy xem lại đáp án đúng."}
        </div>
      )}
    </div>
  );
};

export default QuestionCard;