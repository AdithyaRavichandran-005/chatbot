
import React, { useState, useEffect, useRef } from 'react';
import { ChatSession, Role, Message } from '../types';
import { Send, Sparkles, Trash2, Copy, Check, Menu } from 'lucide-react';
import MarkdownRenderer from './MarkdownRenderer';

interface ChatWindowProps {
  session?: ChatSession;
  onSendMessage: (content: string) => void;
  isGenerating: boolean;
  streamingText: string;
  onClearChat: () => void;
  onToggleSidebar: () => void;
  sidebarOpen: boolean;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ 
  session, onSendMessage, isGenerating, streamingText, onClearChat, onToggleSidebar, sidebarOpen 
}) => {
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [session?.messages, streamingText]);

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isGenerating) return;
    onSendMessage(input);
    setInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  if (!session) return <div className="flex-1 flex items-center justify-center text-slate-500 italic">Select or create a chat to begin</div>;

  return (
    <div className="flex flex-col h-full w-full max-w-5xl mx-auto relative px-4 sm:px-6">
      <header className="py-4 border-b border-slate-800/50 flex items-center justify-between sticky top-0 bg-[#0b0d11]/80 backdrop-blur-md z-30">
        <div className="flex items-center gap-3">
          {!sidebarOpen && (
              <button onClick={onToggleSidebar} className="p-2 hover:bg-slate-800 rounded-md lg:hidden">
                <Menu className="w-5 h-5" />
              </button>
          )}
          <h1 className="text-lg font-semibold truncate max-w-[200px] sm:max-w-md">{session.title}</h1>
          <span className="px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 text-[10px] font-bold uppercase tracking-wider">
            Gemini 3 Flash
          </span>
        </div>
        <button 
          onClick={onClearChat}
          className="text-slate-500 hover:text-red-400 p-2 transition-colors flex items-center gap-2 text-xs"
          title="Clear Chat"
        >
          <Trash2 className="w-4 h-4" />
          <span className="hidden sm:inline">Clear Chat</span>
        </button>
      </header>

      <div className="flex-1 overflow-y-auto custom-scrollbar py-8 space-y-10">
        {session.messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-center space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="w-16 h-16 rounded-3xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-2">Welcome to Gemini Chat Pro</h2>
              <p className="text-slate-500 max-w-sm">
                How can I help you today? I can write code, analyze text, or just have a conversation.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-xl w-full">
              {['Write a Python script to scrape a website', 'Explain quantum computing in simple terms', 'Help me debug a React hook issue', 'Write a short story about a space faring cat'].map((prompt) => (
                <button 
                  key={prompt}
                  onClick={() => onSendMessage(prompt)}
                  className="p-4 text-left bg-[#17191e] hover:bg-[#1f2229] border border-slate-800 rounded-xl text-sm text-slate-300 transition-all hover:border-slate-600"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        )}

        {session.messages.map((msg) => (
          <MessageBubble key={msg.id} message={msg} />
        ))}

        {isGenerating && streamingText && (
          <MessageBubble 
            message={{ 
              id: 'streaming', 
              role: Role.BOT, 
              content: streamingText, 
              timestamp: Date.now() 
            }} 
            isStreaming={true}
          />
        )}
        
        {isGenerating && !streamingText && (
          <div className="flex gap-4 max-w-3xl mx-auto w-full group">
            <div className="w-8 h-8 rounded-full bg-indigo-600 flex-shrink-0 flex items-center justify-center animate-pulse">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div className="flex-1 space-y-2 pt-1">
               <div className="h-4 bg-[#17191e] rounded w-3/4 animate-pulse"></div>
               <div className="h-4 bg-[#17191e] rounded w-1/2 animate-pulse"></div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="pb-8 pt-4 sticky bottom-0 bg-gradient-to-t from-[#0b0d11] via-[#0b0d11] to-transparent">
        <form 
          onSubmit={handleSubmit}
          className="relative max-w-3xl mx-auto group shadow-2xl"
        >
          <textarea 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
            rows={1}
            className="w-full bg-[#17191e] border border-slate-800 rounded-2xl py-4 pl-4 pr-14 text-sm focus:ring-2 focus:ring-indigo-600 outline-none transition-all resize-none max-h-48 overflow-y-auto"
            style={{ height: input ? 'auto' : '56px' }}
          />
          <button 
            type="submit"
            disabled={!input.trim() || isGenerating}
            className={`absolute right-3 bottom-3 p-2 rounded-xl transition-all ${
              input.trim() && !isGenerating 
                ? 'bg-indigo-600 text-white hover:bg-indigo-500 shadow-lg shadow-indigo-500/20' 
                : 'bg-slate-800 text-slate-500 cursor-not-allowed'
            }`}
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
        <p className="text-center text-[10px] text-slate-600 mt-3">
          Gemini Chat Pro can make mistakes. Check important info.
        </p>
      </div>
    </div>
  );
};

const MessageBubble: React.FC<{ message: Message; isStreaming?: boolean }> = ({ message, isStreaming }) => {
  const [copied, setCopied] = useState(false);
  const isBot = message.role === Role.BOT;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`flex gap-4 max-w-4xl mx-auto w-full group animate-in fade-in slide-in-from-bottom-2 duration-300 ${isBot ? 'bg-transparent' : 'bg-transparent'}`}>
      <div className={`w-8 h-8 rounded-lg flex-shrink-0 flex items-center justify-center ${
        isBot ? 'bg-indigo-600 shadow-md shadow-indigo-500/20' : 'bg-slate-700'
      }`}>
        {isBot ? <Sparkles className="w-4 h-4 text-white" /> : <span className="text-[10px] font-bold">YOU</span>}
      </div>
      <div className="flex-1 min-w-0 pt-1">
        <div className="flex items-center justify-between mb-2">
           <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
             {isBot ? 'Gemini AI' : 'You'}
           </span>
           <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button 
                onClick={copyToClipboard}
                className="p-1 hover:bg-slate-800 rounded text-slate-500 transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
              <span className="text-[10px] text-slate-600">
                {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
           </div>
        </div>
        <div className={`prose prose-invert max-w-none text-slate-300 ${isStreaming ? 'border-r-2 border-indigo-500 animate-pulse' : ''}`}>
           <MarkdownRenderer content={message.content} />
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;
