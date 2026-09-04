'use client';
import { useState } from 'react';
import { Terminal, Lock, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { setCredentials } from '@/lib/features/authSlice';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call for static UI phase
    setTimeout(() => {
      dispatch(setCredentials({ accessToken: 'mock-jwt-token-123' }));
      router.push('/dashboard');
    }, 800);
  };

  return (
    <div className="h-screen w-screen bg-[#050505] flex items-center justify-center p-4 relative overflow-hidden font-inter text-slate-300">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg h-96 bg-indigo-600/10 blur-[120px] rounded-full pointer-events-none"></div>

      <div className="w-full max-w-md z-10">
        <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
          
          {/* Top accent line */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500"></div>

          <div className="mb-8 text-center">
            <div className="mx-auto w-12 h-12 bg-indigo-500/10 border border-indigo-500/30 rounded-xl flex items-center justify-center mb-4 text-indigo-400">
              <Lock size={24} />
            </div>
            <h1 className="font-outfit text-3xl font-bold text-white mb-2">Owner Access</h1>
            <p className="text-slate-400 text-sm">Enter your credentials to access the telemetry dashboard.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Email Identifier</label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-950/50 border border-slate-800 rounded-lg px-4 py-3 text-slate-200 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all placeholder:text-slate-700"
                  placeholder="admin@system.local"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Passcode</label>
              <div className="relative">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-950/50 border border-slate-800 rounded-lg px-4 py-3 text-slate-200 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all placeholder:text-slate-700 font-mono"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-4 bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed group"
            >
              {isLoading ? (
                <span className="font-mono text-sm tracking-widest">AUTHENTICATING...</span>
              ) : (
                <>
                  <span className="font-bold tracking-wide">INITIALIZE SESSION</span>
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-800/50 flex items-center justify-center gap-2 text-slate-500 text-xs font-mono uppercase">
            <Terminal size={14} />
            <span>Secure Connection V1.0</span>
          </div>
        </div>
      </div>
    </div>
  );
}
