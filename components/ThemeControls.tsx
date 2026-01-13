import React, { useEffect, useState } from 'react';
import { Moon, Sun, Palette, Settings2, X } from 'lucide-react';

const COLORS = [
  { name: 'Indigo', value: '79 70 229', class: 'bg-indigo-600' },
  { name: 'Blue', value: '37 99 235', class: 'bg-blue-600' },
  { name: 'Emerald', value: '5 150 105', class: 'bg-emerald-600' },
  { name: 'Rose', value: '225 29 72', class: 'bg-rose-600' },
  { name: 'Amber', value: '217 119 6', class: 'bg-amber-600' },
  { name: 'Violet', value: '124 58 237', class: 'bg-violet-600' },
];

const ThemeControls = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [activeColor, setActiveColor] = useState(COLORS[0].value);

  // Initialize from LocalStorage
  useEffect(() => {
    // Check Dark Mode
    const savedTheme = localStorage.getItem('theme');
    const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && systemDark)) {
      setIsDark(true);
      document.documentElement.classList.add('dark');
    } else {
      setIsDark(false);
      document.documentElement.classList.remove('dark');
    }

    // Check Color
    const savedColor = localStorage.getItem('accentColor');
    if (savedColor) {
      setActiveColor(savedColor);
      document.documentElement.style.setProperty('--color-primary', savedColor);
    }
  }, []);

  const toggleDarkMode = () => {
    const newStatus = !isDark;
    setIsDark(newStatus);
    if (newStatus) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  const changeColor = (colorValue: string) => {
    setActiveColor(colorValue);
    document.documentElement.style.setProperty('--color-primary', colorValue);
    localStorage.setItem('accentColor', colorValue);
  };

  return (
    <>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-40 p-3 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-full shadow-lg border border-slate-200 dark:border-slate-700 hover:shadow-xl hover:text-primary transition-all"
        title="Giao diện"
      >
        <Settings2 size={24} />
      </button>

      {/* Settings Modal/Panel */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center pointer-events-none">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/20 dark:bg-black/50 backdrop-blur-sm pointer-events-auto"
            onClick={() => setIsOpen(false)}
          ></div>

          {/* Panel */}
          <div className="bg-white dark:bg-slate-800 w-full max-w-sm rounded-t-2xl sm:rounded-2xl shadow-2xl p-6 pointer-events-auto animate-fade-in-up border border-slate-200 dark:border-slate-700 m-4">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
                <Palette size={20} className="text-primary" />
                Tuỳ chỉnh giao diện
              </h3>
              <button 
                onClick={() => setIsOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X size={20} />
              </button>
            </div>

            {/* Mode Toggle */}
            <div className="mb-6">
              <label className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-3 block">Chế độ hiển thị</label>
              <div className="flex bg-slate-100 dark:bg-slate-700/50 p-1 rounded-lg">
                <button
                  onClick={() => !isDark && toggleDarkMode()} // Only toggle if not already matched
                  className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-md text-sm font-medium transition-all ${
                    !isDark 
                      ? 'bg-white text-primary shadow-sm' 
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-700'
                  }`}
                >
                  <Sun size={18} /> Sáng
                </button>
                <button
                  onClick={() => isDark && toggleDarkMode()}
                  className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-md text-sm font-medium transition-all ${
                    isDark 
                      ? 'bg-slate-700 text-primary shadow-sm' 
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-700'
                  }`}
                >
                  <Moon size={18} /> Tối
                </button>
              </div>
            </div>

            {/* Color Picker */}
            <div>
              <label className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-3 block">Màu chủ đạo</label>
              <div className="grid grid-cols-6 gap-2">
                {COLORS.map((color) => (
                  <button
                    key={color.value}
                    onClick={() => changeColor(color.value)}
                    className={`w-10 h-10 rounded-full ${color.class} flex items-center justify-center transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-slate-800 focus:ring-primary ${
                      activeColor === color.value ? 'ring-2 ring-offset-2 dark:ring-offset-slate-800 ring-slate-400 scale-110' : ''
                    }`}
                    title={color.name}
                  >
                    {activeColor === color.value && <Check size={16} className="text-white" />}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

// Internal check icon for color picker
const Check = ({ size, className }: { size: number, className?: string }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="3" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

export default ThemeControls;