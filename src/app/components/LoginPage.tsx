import { useState } from 'react';
import logo from '../../imports/Logo.png';

interface LoginPageProps {
  onLogin: (username: string, isSignup: boolean) => Promise<string | null>;
  onGuest: () => void;
}

export function LoginPage({ onLogin, onGuest }: LoginPageProps) {
  const [view, setView] = useState<'menu' | 'login' | 'signup'>('menu');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim()) {
      setLoading(true);
      setErrorMsg(null);
      const err = await onLogin(username, view === 'signup');
      setLoading(false);
      if (err) {
        setErrorMsg(err);
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#F5DEB3] flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Pixel dots pattern overlay */}
      <div className="absolute inset-0 pointer-events-none z-0 opacity-[0.03]"
           style={{
             backgroundImage: 'radial-gradient(circle, #000 1px, transparent 1px)',
             backgroundSize: '4px 4px'
           }} />

      <div className="z-10 w-full max-w-sm flex flex-col items-center">
        {/* Logo/Icon */}
        <div className="mb-8 flex flex-col items-center">
          <div className="w-24 h-24 border-4 border-[#3E2723] rounded-2xl flex items-center justify-center mb-4 shadow-[4px_4px_0_0_#6D4C41] overflow-hidden bg-white">
            <img src={logo} alt="Chicha" className="w-full h-full object-contain scale-[2.2]" style={{ imageRendering: 'pixelated' }} />
          </div>
          <h1 className="font-['VCR_OSD_Mono'] text-xl text-[#3E2723] text-center leading-relaxed">
            CHICHA
          </h1>
        </div>

        {view === 'menu' && (
          <div className="w-full space-y-4">
            <button 
              onClick={() => setView('login')}
              className="w-full bg-[#A8D5BA] hover:bg-[#A8D5BA]/80 border-4 border-[#3E2723] rounded-xl py-4 font-['VCR_OSD_Mono'] text-xs text-[#3E2723] shadow-[4px_4px_0_0_#6D4C41] active:shadow-[2px_2px_0_0_#6D4C41] active:translate-x-[2px] active:translate-y-[2px] transition-all"
            >
              LOG IN
            </button>
            <button 
              onClick={() => setView('signup')}
              className="w-full bg-[#FFD966] hover:bg-[#FFD966]/80 border-4 border-[#3E2723] rounded-xl py-4 font-['VCR_OSD_Mono'] text-xs text-[#3E2723] shadow-[4px_4px_0_0_#6D4C41] active:shadow-[2px_2px_0_0_#6D4C41] active:translate-x-[2px] active:translate-y-[2px] transition-all"
            >
              CREATE PROFILE
            </button>
            <div className="pt-4">
              <button 
                onClick={onGuest}
                className="w-full bg-white hover:bg-gray-50 border-4 border-[#3E2723] rounded-xl py-4 font-['VCR_OSD_Mono'] text-xs text-[#6D4C41] shadow-[4px_4px_0_0_#6D4C41] active:shadow-[2px_2px_0_0_#6D4C41] active:translate-x-[2px] active:translate-y-[2px] transition-all"
              >
                GUEST MODE
              </button>
            </div>
          </div>
        )}

        {(view === 'login' || view === 'signup') && (
          <form onSubmit={handleLoginSubmit} className="w-full space-y-4">
            <div className="bg-white border-4 border-[#3E2723] rounded-xl p-4 shadow-[4px_4px_0_0_#6D4C41]">
              <h2 className="font-['VCR_OSD_Mono'] text-sm text-[#D2691E] mb-4 text-center">
                {view === 'login' ? 'WELCOME BACK' : 'NEW PROFILE'}
              </h2>
              {errorMsg && (
                <p className="font-['VCR_OSD_Mono'] text-[8px] text-red-500 mb-4 text-center">{errorMsg}</p>
              )}
              
              <div className="space-y-4">
                <div>
                  <label className="block font-['VCR_OSD_Mono'] text-[8px] text-[#6D4C41] mb-2">USERNAME</label>
                  <input 
                    type="text" 
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    className="w-full bg-[#FFF9E6] border-2 border-[#3E2723] rounded p-2 text-sm text-[#3E2723] outline-none focus:border-[#D2691E]"
                  />
                </div>
                <div>
                  <label className="block font-['VCR_OSD_Mono'] text-[8px] text-[#6D4C41] mb-2">PASSWORD</label>
                  <input 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full bg-[#FFF9E6] border-2 border-[#3E2723] rounded p-2 text-sm text-[#3E2723] outline-none focus:border-[#D2691E]"
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button 
                type="button"
                onClick={() => setView('menu')}
                className="flex-1 bg-white hover:bg-gray-50 border-4 border-[#3E2723] rounded-xl py-3 font-['VCR_OSD_Mono'] text-[10px] text-[#6D4C41] shadow-[4px_4px_0_0_#6D4C41] active:translate-x-[2px] active:translate-y-[2px] transition-all"
              >
                BACK
              </button>
              <button 
                type="submit"
                disabled={loading}
                className="flex-1 bg-[#FFD966] hover:bg-[#FFD966]/80 disabled:opacity-50 border-4 border-[#3E2723] rounded-xl py-3 font-['VCR_OSD_Mono'] text-[10px] text-[#3E2723] shadow-[4px_4px_0_0_#6D4C41] active:translate-x-[2px] active:translate-y-[2px] transition-all"
              >
                {loading ? 'WAIT...' : (view === 'login' ? 'ENTER' : 'CREATE')}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
