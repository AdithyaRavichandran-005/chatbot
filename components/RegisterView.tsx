
import React, { useState } from 'react';
import { User } from '../types';
import { StorageService } from '../services/storageService';
import { UserPlus, Sparkles, AlertCircle } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

interface RegisterViewProps {
  onRegister: (user: User) => void;
  onNavigateLogin: () => void;
}

const RegisterView: React.FC<RegisterViewProps> = ({ onRegister, onNavigateLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!username || !password) {
      setError('Please fill in all fields');
      return;
    }

    const users = StorageService.getUsers();
    if (users.find(u => u.username === username)) {
      setError('Username already exists');
      return;
    }

    const newUser: User = {
      id: uuidv4(),
      username,
    };

    StorageService.saveUser(newUser);
    onRegister(newUser);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#0b0d11] p-4 font-sans">
      <div className="max-w-md w-full space-y-8 bg-[#17191e] p-8 rounded-3xl border border-slate-800 shadow-2xl animate-in fade-in zoom-in duration-500">
        <div className="text-center">
          <div className="w-16 h-16 bg-indigo-600 rounded-3xl mx-auto flex items-center justify-center mb-6 shadow-xl shadow-indigo-600/20">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl font-extrabold text-white tracking-tight">Create Account</h2>
          <p className="mt-2 text-slate-500">Join the next generation of AI chat</p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="flex items-center gap-2 text-red-400 bg-red-400/10 p-3 rounded-xl border border-red-400/20 text-sm">
              <AlertCircle className="w-4 h-4" />
              {error}
            </div>
          )}
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1 ml-1">Username</label>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-[#0b0d11] border border-slate-800 rounded-xl px-4 py-3 text-white outline-none focus:ring-2 focus:ring-indigo-600 transition-all"
                placeholder="Choose a username"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1 ml-1">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#0b0d11] border border-slate-800 rounded-xl px-4 py-3 text-white outline-none focus:ring-2 focus:ring-indigo-600 transition-all"
                placeholder="Create a password"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold transition-all shadow-lg shadow-indigo-600/20 active:scale-[0.98]"
          >
            <UserPlus className="w-5 h-5" />
            Sign up
          </button>
        </form>

        <p className="text-center text-sm text-slate-500">
          Already have an account?{' '}
          <button onClick={onNavigateLogin} className="text-indigo-400 font-bold hover:underline">
            Login here
          </button>
        </p>
      </div>
    </div>
  );
};

export default RegisterView;
