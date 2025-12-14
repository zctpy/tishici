import React, { useState, useEffect, useRef } from 'react';
import { initializeChat, sendMessageToGemini, resetSession } from './services/geminiService';
import { Message, Sender } from './types';
import ChatMessage from './components/ChatMessage';
import InputArea from './components/InputArea';
import { WELCOME_MESSAGE } from './constants';
import { Box, RefreshCcw, Sparkles } from 'lucide-react';

const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const startSession = async () => {
      try {
        await initializeChat();
        setMessages([
          {
            id: 'welcome',
            sender: Sender.Model,
            text: WELCOME_MESSAGE,
            timestamp: new Date(),
          },
        ]);
      } catch (error) {
        console.error("Initialization error:", error);
      } finally {
        setIsInitializing(false);
      }
    };
    startSession();
  }, []);

  const checkIfFinalOutput = (text: string): boolean => {
    // Heuristic: If it contains specific headers from the system prompt structure, it's likely the final output
    return text.includes("# Role Definition") && text.includes("# Task Specification") && text.includes("# Response Format");
  };

  const handleSendMessage = async (text: string) => {
    const newUserMessage: Message = {
      id: Date.now().toString(),
      sender: Sender.User,
      text: text,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, newUserMessage]);
    setIsLoading(true);

    try {
      const responseText = await sendMessageToGemini(text);
      
      const isFinal = checkIfFinalOutput(responseText);

      const newBotMessage: Message = {
        id: (Date.now() + 1).toString(),
        sender: Sender.Model,
        text: responseText,
        timestamp: new Date(),
        isFinalOutput: isFinal
      };

      setMessages((prev) => [...prev, newBotMessage]);
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        sender: Sender.Model,
        text: "I apologize, but I encountered an error communicating with the AI service. Please try again.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = async () => {
    setIsLoading(true);
    setMessages([]);
    resetSession();
    await initializeChat();
    setMessages([
      {
        id: Date.now().toString(),
        sender: Sender.Model,
        text: WELCOME_MESSAGE,
        timestamp: new Date(),
      },
    ]);
    setIsLoading(false);
  };

  return (
    <div className="flex flex-col h-screen bg-[#f8fafc] text-slate-900 font-sans selection:bg-indigo-100 selection:text-indigo-900 overflow-hidden">
      {/* Background Decor */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-100/50 blur-3xl opacity-60"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-violet-100/50 blur-3xl opacity-60"></div>
      </div>

      {/* Header */}
      <header className="flex-shrink-0 bg-white/80 backdrop-blur-md border-b border-slate-200/60 px-6 py-4 flex items-center justify-between z-10 sticky top-0">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-tr from-indigo-600 to-violet-600 p-2.5 rounded-xl text-white shadow-lg shadow-indigo-500/20">
            <Box size={20} />
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
              PromptForge
              <span className="px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-600 text-[10px] font-bold uppercase tracking-wider border border-indigo-100">
                Beta
              </span>
            </h1>
            <p className="text-xs text-slate-500 font-medium">Expert System Prompt Generator</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
            <button 
                onClick={handleReset}
                className="group flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all duration-200"
                title="Reset Session"
            >
                <RefreshCcw size={16} className="group-hover:rotate-180 transition-transform duration-500" />
                <span className="hidden sm:inline">New Session</span>
            </button>
        </div>
      </header>

      {/* Main Chat Area */}
      <main className="flex-1 overflow-y-auto px-4 py-6 scroll-smooth z-10">
        <div className="max-w-4xl mx-auto flex flex-col min-h-full">
          {isInitializing ? (
             <div className="flex flex-col items-center justify-center flex-1 text-slate-400 animate-in fade-in duration-700">
                <div className="relative mb-6">
                    <div className="absolute inset-0 bg-indigo-200 blur-xl rounded-full opacity-40 animate-pulse"></div>
                    <Box size={48} className="relative z-10 text-indigo-500/80" />
                </div>
                <p className="text-sm font-medium text-slate-500">Initializing Expert Persona...</p>
             </div>
          ) : (
            <>
              {messages.length === 0 && (
                <div className="flex-1 flex flex-col items-center justify-center text-center py-10 opacity-0 animate-in fade-in slide-in-from-bottom-4 duration-700 fill-mode-forwards">
                    <div className="w-16 h-16 bg-white rounded-2xl shadow-xl shadow-indigo-100 flex items-center justify-center mb-6 text-indigo-600">
                        <Sparkles size={32} />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-800 mb-2">Welcome to PromptForge</h2>
                    <p className="text-slate-500 max-w-md mx-auto leading-relaxed">
                        I'll help you craft the perfect System Prompt. Tell me what kind of AI assistant or task you have in mind.
                    </p>
                </div>
              )}
              
              <div className="space-y-6 pb-4">
                {messages.map((msg) => (
                    <ChatMessage key={msg.id} message={msg} />
                ))}
                
                {isLoading && (
                    <div className="flex justify-start w-full animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <div className="flex items-center gap-2 bg-white/70 backdrop-blur-sm border border-slate-200/60 px-5 py-4 rounded-2xl rounded-tl-sm shadow-sm">
                            <div className="flex gap-1.5">
                                <div className="w-2 h-2 bg-indigo-500/60 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                <div className="w-2 h-2 bg-indigo-500/60 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                <div className="w-2 h-2 bg-indigo-500/60 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                            </div>
                            <span className="text-xs text-slate-500 ml-2 font-medium">Designing prompt...</span>
                        </div>
                    </div>
                )}
              </div>
              
              <div ref={messagesEndRef} className="h-4" />
            </>
          )}
        </div>
      </main>

      {/* Input Area */}
      <footer className="flex-shrink-0 bg-white/60 backdrop-blur-xl border-t border-slate-200/60 z-20">
        <InputArea onSendMessage={handleSendMessage} isLoading={isLoading || isInitializing} />
      </footer>
    </div>
  );
};

export default App;