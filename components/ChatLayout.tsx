
import React, { useState, useEffect, useRef } from 'react';
import { User, ChatSession, Role, Message } from '../types';
import { StorageService } from '../services/storageService';
import { AIService } from '../services/aiService';
import Sidebar from './Sidebar';
import ChatWindow from './ChatWindow';
import { v4 as uuidv4 } from 'uuid';

interface ChatLayoutProps {
  user: User;
  onLogout: () => void;
}

const ChatLayout: React.FC<ChatLayoutProps> = ({ user, onLogout }) => {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [streamingText, setStreamingText] = useState("");

  useEffect(() => {
    const loaded = StorageService.getSessions(user.id);
    setSessions(loaded);
    if (loaded.length > 0) {
      setActiveSessionId(loaded[0].id);
    } else {
      createNewChat();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user.id]);

  const createNewChat = async () => {
    const newSession: ChatSession = {
      id: uuidv4(),
      title: 'New Chat',
      messages: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    const updated = [newSession, ...sessions];
    setSessions(updated);
    setActiveSessionId(newSession.id);
    StorageService.saveSessions(user.id, updated);
  };

  const activeSession = sessions.find(s => s.id === activeSessionId);

  const handleSendMessage = async (content: string) => {
    if (!activeSessionId || !content.trim() || isGenerating) return;

    const currentSession = sessions.find(s => s.id === activeSessionId);
    if (!currentSession) return;

    const userMessage: Message = {
      id: uuidv4(),
      role: Role.USER,
      content,
      timestamp: Date.now(),
    };

    const updatedMessages = [...currentSession.messages, userMessage];
    const sessionWithUserMsg = {
      ...currentSession,
      messages: updatedMessages,
      updatedAt: Date.now(),
    };

    // Update local state and storage immediately
    const updatedSessions = sessions.map(s => s.id === activeSessionId ? sessionWithUserMsg : s);
    setSessions(updatedSessions);
    StorageService.saveSessions(user.id, updatedSessions);

    // Auto-generate title if it's the first message
    if (currentSession.messages.length === 0) {
        AIService.generateTitle(content).then(title => {
            setSessions(prev => prev.map(s => s.id === activeSessionId ? { ...s, title } : s));
            StorageService.updateSession(user.id, { ...sessionWithUserMsg, title });
        });
    }

    // Start AI Generation
    setIsGenerating(true);
    setStreamingText("");
    
    try {
      const finalResponse = await AIService.generateResponseStream(
        currentSession.messages,
        content,
        (chunk) => setStreamingText(chunk)
      );

      const botMessage: Message = {
        id: uuidv4(),
        role: Role.BOT,
        content: finalResponse,
        timestamp: Date.now(),
      };

      const sessionWithBotMsg = {
        ...sessionWithUserMsg,
        messages: [...updatedMessages, botMessage],
        updatedAt: Date.now(),
      };

      setSessions(prev => prev.map(s => s.id === activeSessionId ? sessionWithBotMsg : s));
      StorageService.saveSessions(user.id, updatedSessions.map(s => s.id === activeSessionId ? sessionWithBotMsg : s));
    } catch (error) {
      console.error(error);
      const errorMessage: Message = {
        id: uuidv4(),
        role: Role.BOT,
        content: "Sorry, I encountered an error processing your request. Please check your API key or connection.",
        timestamp: Date.now(),
      };
      setSessions(prev => prev.map(s => s.id === activeSessionId ? { ...s, messages: [...s.messages, errorMessage] } : s));
    } finally {
      setIsGenerating(false);
      setStreamingText("");
    }
  };

  const deleteSession = (id: string) => {
    const filtered = sessions.filter(s => s.id !== id);
    setSessions(filtered);
    StorageService.deleteSession(user.id, id);
    if (activeSessionId === id) {
      setActiveSessionId(filtered.length > 0 ? filtered[0].id : null);
      if (filtered.length === 0) createNewChat();
    }
  };

  const clearChat = () => {
    if (!activeSessionId) return;
    const session = sessions.find(s => s.id === activeSessionId);
    if (!session) return;
    const cleared = { ...session, messages: [], updatedAt: Date.now() };
    const updated = sessions.map(s => s.id === activeSessionId ? cleared : s);
    setSessions(updated);
    StorageService.saveSessions(user.id, updated);
  };

  return (
    <div className="flex w-full h-full">
      <Sidebar 
        sessions={sessions}
        activeId={activeSessionId}
        onSelect={setActiveSessionId}
        onNewChat={createNewChat}
        onDelete={deleteSession}
        onLogout={onLogout}
        user={user}
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
      />
      <main className="flex-1 flex flex-col h-full bg-[#0b0d11] relative overflow-hidden">
         <ChatWindow 
           session={activeSession}
           onSendMessage={handleSendMessage}
           isGenerating={isGenerating}
           streamingText={streamingText}
           onClearChat={clearChat}
           onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
           sidebarOpen={isSidebarOpen}
         />
      </main>
    </div>
  );
};

export default ChatLayout;
