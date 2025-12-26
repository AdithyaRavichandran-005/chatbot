
import { ChatSession, User, Message } from '../types';

const STORAGE_KEYS = {
  SESSIONS: 'gemini_chat_sessions',
  USERS: 'gemini_chat_users',
  CURRENT_USER: 'gemini_chat_current_user',
};

export const StorageService = {
  // Users
  getUsers: (): User[] => {
    const data = localStorage.getItem(STORAGE_KEYS.USERS);
    return data ? JSON.parse(data) : [];
  },
  
  saveUser: (user: User) => {
    const users = StorageService.getUsers();
    users.push(user);
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  },

  getCurrentUser: (): User | null => {
    const data = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    return data ? JSON.parse(data) : null;
  },

  setCurrentUser: (user: User | null) => {
    if (user) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    }
  },

  // Sessions
  getSessions: (userId: string): ChatSession[] => {
    const data = localStorage.getItem(`${STORAGE_KEYS.SESSIONS}_${userId}`);
    return data ? JSON.parse(data) : [];
  },

  saveSessions: (userId: string, sessions: ChatSession[]) => {
    localStorage.setItem(`${STORAGE_KEYS.SESSIONS}_${userId}`, JSON.stringify(sessions));
  },

  updateSession: (userId: string, updatedSession: ChatSession) => {
    const sessions = StorageService.getSessions(userId);
    const index = sessions.findIndex(s => s.id === updatedSession.id);
    if (index !== -1) {
      sessions[index] = updatedSession;
    } else {
      sessions.unshift(updatedSession);
    }
    StorageService.saveSessions(userId, sessions);
  },

  deleteSession: (userId: string, sessionId: string) => {
    const sessions = StorageService.getSessions(userId);
    const filtered = sessions.filter(s => s.id !== sessionId);
    StorageService.saveSessions(userId, filtered);
  }
};
