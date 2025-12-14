import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, ArrowUp } from 'lucide-react';

interface InputAreaProps {
  onSendMessage: (text: string) => void;
  isLoading: boolean;
}

const InputArea: React.FC<InputAreaProps> = ({ onSendMessage, isLoading }) => {
  const [input, setInput] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 160)}px`;
    }
  }, [input]);

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isLoading) return;
    onSendMessage(input);
    setInput('');
    if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <div className={`
        relative flex flex-col bg-white rounded-2xl border transition-all duration-300 ease-out
        ${isFocused 
            ? 'shadow-xl shadow-indigo-500/10 border-indigo-400 ring-4 ring-indigo-50/50' 
            : 'shadow-lg border-slate-200'
        }
      `}>
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder="Describe the AI persona or task you need..."
          className="w-full bg-transparent border-none focus:ring-0 resize-none max-h-40 min-h-[56px] py-4 px-4 pr-12 text-slate-800 placeholder:text-slate-400 text-base leading-relaxed rounded-2xl"
          rows={1}
          disabled={isLoading}
        />
        
        <div className="absolute bottom-2 right-2">
            <button
            onClick={() => handleSubmit()}
            disabled={!input.trim() || isLoading}
            className={`
                flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-300
                ${input.trim() && !isLoading
                ? 'bg-gradient-to-tr from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-200 hover:shadow-indigo-300 hover:scale-105 active:scale-95'
                : 'bg-slate-100 text-slate-300 cursor-not-allowed'
                }
            `}
            >
            {isLoading ? (
                <div className="w-4 h-4 border-2 border-white/50 border-t-white rounded-full animate-spin" />
            ) : (
                <ArrowUp size={20} strokeWidth={2.5} />
            )}
            </button>
        </div>
      </div>
      
      <div className="text-center mt-3 opacity-60 hover:opacity-100 transition-opacity">
         <p className="text-[10px] md:text-xs text-slate-400 flex items-center justify-center gap-1.5 font-medium">
            <Sparkles size={12} className="text-indigo-400" /> 
            <span>AI can make mistakes. Please review generated prompts.</span>
         </p>
      </div>
    </div>
  );
};

export default InputArea;