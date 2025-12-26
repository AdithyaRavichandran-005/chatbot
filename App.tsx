
import React, { useState, useEffect, useCallback } from 'react';
import { AuthState, User, ChatSession, Role, Message } from './types';
import { StorageService } from './services/storageService';
import LoginView from './components/LoginView';
import RegisterView from './components/RegisterView';
import ChatLayout from './components/ChatLayout';
import { v4 as uuidv4 } from 'uuid';

const App: React.FC = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: StorageService.getCurrentUser(),
    isAuthenticated: !!StorageService.getCurrentUser(),
  });
  const [view, setView] = useState<'login' | 'register' | 'chat'>(
    StorageService.getCurrentUser() ? 'chat' : 'login'
  );

  const handleLogin = (user: User) => {
    StorageService.setCurrentUser(user);
    setAuthState({ user, isAuthenticated: true });
    setView('chat');
  };

  const handleLogout = () => {
    StorageService.setCurrentUser(null);
    setAuthState({ user: null, isAuthenticated: false });
    setView('login');
  };

  if (!authState.isAuthenticated) {
    return view === 'login' ? (
      <LoginView onLogin={handleLogin} onNavigateRegister={() => setView('register')} />
    ) : (
      <RegisterView onRegister={handleLogin} onNavigateLogin={() => setView('login')} />
    );
  }

  return (
    <div className="flex h-screen w-full bg-[#0b0d11] text-slate-200 overflow-hidden">
      <ChatLayout user={authState.user!} onLogout={handleLogout} />
    </div>
  );
};

export default App;
