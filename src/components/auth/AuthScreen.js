import React from 'react';
import { Activity, AlertTriangle, Radio, PenTool } from 'lucide-react';

export default function AuthScreen({ 
    authMode, 
    setAuthMode, 
    loginEmail, 
    setLoginEmail, 
    loginPassword, 
    setLoginPassword, 
    registerEmail, 
    setRegisterEmail, 
    registerPassword, 
    setRegisterPassword, 
    registerPassword2, 
    setRegisterPassword2, 
    registerUsername, 
    setRegisterUsername, 
    authLoading, 
    handleLogin, 
    handleRegister, 
    handleGoogleLogin, 
    error,
    showTutorial,
    setShowTutorial
}) {
    return (
        <div className="min-h-screen flex items-center justify-center p-4 font-['Patrick_Hand'] bg-[#fffdf5]" style={{backgroundImage: 'radial-gradient(#e5e7eb 1px, transparent 1px)', backgroundSize: '20px 20px'}}>
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
             {/* Sketchy background doodles could go here */}
          </div>

          <div className="max-w-md w-full space-y-8 relative overflow-hidden box-sketch p-8 bg-white">
            
            <div className="text-center space-y-2 mt-4 transform -rotate-1">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-black text-white mb-4 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)] transform rotate-3">
                <PenTool size={40} className="animate-bounce" />
              </div>
              <h1 className="text-6xl font-black tracking-tighter text-black relative inline-block transform -rotate-2">
                RABISCO
              </h1>
              <p className="text-slate-500 font-bold text-xl transform rotate-1">Desenhe, adivinhe e divirta-se!</p>
            </div>

            {/* Tabs */}
            <div className="flex border-b-4 border-black gap-2 pb-2">
              <button 
                className={`flex-1 py-3 font-bold text-xl uppercase tracking-widest transition-all border-2 border-black rounded-t-xl mb-[-10px] z-10 relative ${authMode === "login" ? "bg-yellow-300 translate-y-0" : "bg-white translate-y-2 text-slate-400 hover:translate-y-1 hover:text-black"}`}
                onClick={() => setAuthMode("login")}
              >
                Entrar
              </button>
              <button 
                className={`flex-1 py-3 font-bold text-xl uppercase tracking-widest transition-all border-2 border-black rounded-t-xl mb-[-10px] z-10 relative ${authMode === "register" ? "bg-yellow-300 translate-y-0" : "bg-white translate-y-2 text-slate-400 hover:translate-y-1 hover:text-black"}`}
                onClick={() => setAuthMode("register")}
              >
                Registrar
              </button>
            </div>

            <div className="bg-white p-6 pt-8 border-t-0">
            {authMode === "login" ? (
              <div className="space-y-5">
                <div>
                  <label className="text-lg font-bold uppercase text-black block mb-1 transform -rotate-1">Email</label>
                  <input 
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="seu@email.com"
                    type="email"
                    className="w-full p-3 rounded-xl border-2 border-black outline-none transition-all font-sans text-xl bg-slate-50 focus:bg-white focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:-translate-y-1 focus:rotate-1 placeholder:text-slate-300"
                  />
                </div>
                <div>
                  <label className="text-lg font-bold uppercase text-black block mb-1 transform rotate-1">Senha</label>
                  <input 
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="••••••••"
                    type="password"
                    className="w-full p-3 rounded-xl border-2 border-black outline-none transition-all font-sans text-xl bg-slate-50 focus:bg-white focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:-translate-y-1 focus:rotate-1 placeholder:text-slate-300"
                  />
                </div>
                
                <button 
                  onClick={handleLogin}
                  disabled={authLoading}
                  className="w-full py-4 font-black text-2xl rounded-xl btn-sketch bg-black text-white hover:bg-slate-800 hover:text-yellow-300 uppercase tracking-wider transform hover:-rotate-1 transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-y-1 active:shadow-none"
                >
                  {authLoading ? "Rabiscando..." : "ENTRAR AGORA"}
                </button>

                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t-4 border-black border-dashed opacity-20"></span>
                  </div>
                  <div className="relative flex justify-center text-sm uppercase">
                    <span className="bg-white px-3 text-black font-black border-2 border-black rounded-lg rotate-3 transform hover:scale-110 transition-transform">Ou</span>
                  </div>
                </div>

                <button 
                  onClick={handleGoogleLogin}
                  disabled={authLoading}
                  className="w-full py-3 font-bold text-xl rounded-xl btn-sketch flex items-center justify-center gap-3 hover:bg-blue-50 transform hover:rotate-1 transition-all"
                >
                  <svg className="w-6 h-6" viewBox="0 0 24 24"><path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" /><path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" /><path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.84z" /><path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" /></svg>
                  Entrar com Google
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="text-lg font-bold uppercase text-black block mb-1 transform -rotate-1">Apelido</label>
                  <input 
                    value={registerUsername}
                    onChange={(e) => setRegisterUsername(e.target.value)}
                    placeholder="Seu Apelido"
                    maxLength={20}
                    className="w-full p-3 rounded-xl border-2 border-black outline-none transition-all font-sans text-xl bg-slate-50 focus:bg-white focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:-translate-y-1 focus:rotate-1 placeholder:text-slate-300"
                  />
                </div>

                <div>
                  <label className="text-lg font-bold uppercase text-black block mb-1 transform rotate-1">Email</label>
                  <input 
                    value={registerEmail}
                    onChange={(e) => setRegisterEmail(e.target.value)}
                    placeholder="seu@email.com"
                    type="email"
                    className="w-full p-3 rounded-xl border-2 border-black outline-none transition-all font-sans text-xl bg-slate-50 focus:bg-white focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:-translate-y-1 focus:rotate-1 placeholder:text-slate-300"
                  />
                </div>
                
                <div>
                  <label className="text-lg font-bold uppercase text-black block mb-1 transform -rotate-1">Senha</label>
                  <input 
                    value={registerPassword}
                    onChange={(e) => setRegisterPassword(e.target.value)}
                    placeholder="••••••••"
                    type="password"
                    className="w-full p-3 rounded-xl border-2 border-black outline-none transition-all font-sans text-xl bg-slate-50 focus:bg-white focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:-translate-y-1 focus:rotate-1 placeholder:text-slate-300"
                  />
                </div>

                <div>
                  <label className="text-lg font-bold uppercase text-black block mb-1 transform rotate-1">Confirmar Senha</label>
                  <input 
                    value={registerPassword2}
                    onChange={(e) => setRegisterPassword2(e.target.value)}
                    placeholder="••••••••"
                    type="password"
                    className="w-full p-3 rounded-xl border-2 border-black outline-none transition-all font-sans text-xl bg-slate-50 focus:bg-white focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:-translate-y-1 focus:rotate-1 placeholder:text-slate-300"
                  />
                </div>

                <button 
                  onClick={handleRegister}
                  disabled={authLoading}
                  className="w-full py-4 font-black text-2xl rounded-xl btn-sketch bg-black text-white hover:bg-slate-800 hover:text-yellow-300 uppercase tracking-wider transform hover:rotate-1 transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-y-1 active:shadow-none mt-2"
                >
                  {authLoading ? "Registrando..." : "CRIAR CONTA"}
                </button>
              </div>
            )}
            </div>

            {error && (
              <div className="bg-red-100 border-2 border-black p-4 rounded animate-pulse transform rotate-1 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <p className="text-red-600 text-lg font-bold flex items-center gap-2">
                    <AlertTriangle size={24} />
                    {error}
                </p>
              </div>
            )}

            <div className="pt-4 border-t-2 border-black border-dashed text-center">
              <button 
                onClick={() => setShowTutorial(true)} 
                className="text-lg text-slate-500 hover:text-black hover:underline hover:scale-110 transition-all font-bold inline-flex items-center gap-2"
              >
                <Activity size={20}/> Como Jogar?
              </button>
            </div>
          </div>
        </div>
    );
}
