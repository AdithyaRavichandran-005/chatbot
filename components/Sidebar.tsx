
import React, { useState } from 'react';
import { ChatSession, User } from '../types';
import { Plus, MessageSquare, Trash2, LogOut, PanelLeftClose, PanelLeft, Search } from 'lucide-react';

interface SidebarProps {
  sessions: ChatSession[];
  activeId: string | null;
  onSelect: (id: string) => void;
  onNewChat: () => void;
  onDelete: (id: string) => void;
  onLogout: () => void;
  user: User;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  sessions, activeId, onSelect, onNewChat, onDelete, onLogout, user, isOpen, setIsOpen 
}) => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredSessions = sessions.filter(s => 
    s.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!isOpen) {
      return (
          <div className="absolute top-4 left-4 z-50">
               <button 
                onClick={() => setIsOpen(true)}
                className="p-2 hover:bg-slate-800 rounded-md transition-colors"
               >
                 <PanelLeft className="w-5 h-5" />
               </button>
          </div>
      );
  }

  return (
    <div className="w-64 h-full bg-[#17191e] border-r border-slate-800 flex flex-col z-40 transition-all duration-300">
      <div className="p-4 flex items-center justify-between">
        <button 
          onClick={onNewChat}
          className="flex-1 mr-2 flex items-center gap-2 bg-[#252830] hover:bg-[#2d313c] border border-slate-700 rounded-lg p-2 transition-all text-sm font-medium"
        >
          <Plus className="w-4 h-4" />
          New Chat
        </button>
        <button 
          onClick={() => setIsOpen(false)}
          className="p-2 hover:bg-slate-800 rounded-md transition-colors"
        >
          <PanelLeftClose className="w-5 h-5" />
        </button>
      </div>

      <div className="px-4 mb-4">
        <div className="relative">
          <Search className="absolute left-2 top-2.5 w-4 h-4 text-slate-500" />
          <input 
            type="text"
            placeholder="Search chats..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#252830] border-none rounded-md py-2 pl-8 pr-4 text-xs focus:ring-1 focus:ring-slate-500 outline-none"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar px-2 space-y-1">
        {filteredSessions.map((session) => (
          <div 
            key={session.id}
            onClick={() => onSelect(session.id)}
            className={`group flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-all relative ${
              activeId === session.id ? 'bg-[#252830] text-white' : 'hover:bg-[#1f2229] text-slate-400'
            }`}
          >
            <MessageSquare className="w-4 h-4 flex-shrink-0" />
            <span className="text-sm truncate pr-6">{session.title}</span>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                onDelete(session.id);
              }}
              className="absolute right-2 opacity-0 group-hover:opacity-100 p-1 hover:text-red-400 transition-all"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
        {filteredSessions.length === 0 && (
          <div className="text-center py-10 text-slate-500 text-xs italic">
            No chats found
          </div>
        )}
      </div>

      <div className="p-4 border-t border-slate-800 mt-auto">
        <div className="flex items-center gap-3 mb-4 px-2">
          <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-xs font-bold uppercase">
            {user.username.charAt(0)}
          </div>
          <div className="flex-1 truncate">
            <p className="text-xs font-medium truncate">{user.username}</p>
            <p className="text-[10px] text-slate-500 truncate">Free Tier</p>
          </div>
        </div>
        <button 
          onClick={onLogout}
          className="w-full flex items-center gap-2 hover:bg-slate-800 text-slate-400 hover:text-white px-3 py-2 rounded-lg transition-all text-xs"
        >
          <LogOut className="w-4 h-4" />
          Log out
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
