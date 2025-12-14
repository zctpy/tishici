import React from 'react';
import { Message, Sender } from '../types';
import { Bot, User, Copy, Check, Terminal, Sparkles } from 'lucide-react';

interface ChatMessageProps {
  message: Message;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.sender === Sender.User;
  const isFinalOutput = message.isFinalOutput;
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(message.text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // If it's the final prompt output, we render it differently (like a code block or document)
  if (isFinalOutput) {
    return (
      <div className="w-full my-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="relative overflow-hidden rounded-xl border border-slate-200 bg-slate-900 shadow-2xl shadow-indigo-500/10">
            {/* Header for the code block */}
            <div className="flex items-center justify-between px-4 py-3 bg-slate-950 border-b border-slate-800">
                <div className="flex items-center gap-2 text-indigo-400">
                    <Terminal size={16} />
                    <span className="text-sm font-semibold tracking-wide uppercase">System Prompt Generated</span>
                </div>
                <button 
                  onClick={handleCopy}
                  className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-md transition-all duration-200 bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700"
                >
                  {copied ? <Check size={14} className="text-emerald-400"/> : <Copy size={14} />}
                  <span>{copied ? 'Copied' : 'Copy Prompt'}</span>
                </button>
            </div>
            
            {/* Content */}
            <div className="p-6 overflow-x-auto">
                <pre className="font-mono text-sm leading-relaxed text-slate-300 whitespace-pre-wrap">
                    {message.text}
                </pre>
            </div>
            
            {/* Footer decoration */}
            <div className="h-1 w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-80"></div>
        </div>
        <div className="mt-2 text-center">
            <p className="text-xs text-slate-400">You can copy this prompt into your application or AI studio.</p>
        </div>
      </div>
    );
  }

  // Standard chat message
  return (
    <div className={`flex w-full mb-6 ${isUser ? 'justify-end' : 'justify-start'} group`}>
      <div className={`flex max-w-[90%] md:max-w-[85%] lg:max-w-[75%] gap-4 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
        
        {/* Avatar */}
        <div className={`flex-shrink-0 w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center shadow-md border ${
          isUser 
            ? 'bg-indigo-600 border-indigo-500 text-white' 
            : 'bg-white border-slate-100 text-indigo-600'
        }`}>
          {isUser ? <User size={18} /> : <Bot size={20} />}
        </div>

        {/* Message Bubble */}
        <div className={`relative flex flex-col p-4 md:p-5 rounded-2xl shadow-sm text-sm md:text-base leading-7 ${
          isUser 
            ? 'bg-gradient-to-br from-indigo-600 to-violet-600 text-white rounded-tr-sm shadow-indigo-200' 
            : 'bg-white border border-slate-200/60 text-slate-700 rounded-tl-sm shadow-slate-200/50'
        }`}>
          
          <div className="whitespace-pre-wrap break-words">
            {message.text}
          </div>
          
          {/* Action buttons for Bot messages */}
          {!isUser && (
            <div className="flex justify-start mt-3 pt-3 border-t border-slate-100 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <button 
                  onClick={handleCopy}
                  className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-indigo-600 transition-colors"
                  title="Copy text"
                >
                  {copied ? <Check size={14} /> : <Copy size={14} />}
                  <span className="font-medium">{copied ? 'Copied' : 'Copy'}</span>
                </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;