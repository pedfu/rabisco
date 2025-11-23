import React from 'react';
import { Activity, AlertTriangle, Radio } from 'lucide-react';
import { Card, Input, Button } from '../UIComponents';
import { THEME } from '../../utils/constants';

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
        <div className={`min-h-screen ${THEME.bg} flex items-center justify-center p-4 font-sans`}>
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
             <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-blue-600 rounded-full blur-[120px] opacity-20"></div>
             <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-purple-600 rounded-full blur-[120px] opacity-20"></div>
          </div>

          <Card className={`max-w-md w-full space-y-8 relative overflow-hidden border-2 border-slate-200 ${THEME.paper} text-slate-900 shadow-2xl`}>
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 via-fuchsia-500 to-rose-500"></div>
            
            <div className="text-center space-y-2 mt-4">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-900 border-2 border-fuchsia-500 text-fuchsia-400 mb-4 shadow-[0_0_15px_rgba(232,121,249,0.3)]">
                <Radio size={32} />
              </div>
              <h1 className="text-5xl font-black tracking-tighter text-slate-900 relative inline-block">
                Sync<span className="text-fuchsia-600">Mind</span>
              </h1>
              <p className="text-slate-500 font-medium">Sintonize na mesma frequência</p>
            </div>

            {/* Tabs */}
            <div className="flex border-b-2 border-slate-200">
              <button 
                className={`flex-1 py-3 font-bold text-sm uppercase tracking-widest transition-colors ${authMode === "login" ? "text-fuchsia-600 border-b-2 border-fuchsia-500 bg-fuchsia-50" : "text-slate-400 hover:text-slate-600 hover:bg-slate-50"}`}
                onClick={() => setAuthMode("login")}
              >
                Entrar
              </button>
              <button 
                className={`flex-1 py-3 font-bold text-sm uppercase tracking-widest transition-colors ${authMode === "register" ? "text-fuchsia-600 border-b-2 border-fuchsia-500 bg-fuchsia-50" : "text-slate-400 hover:text-slate-600 hover:bg-slate-50"}`}
                onClick={() => setAuthMode("register")}
              >
                Registrar
              </button>
            </div>

            {authMode === "login" ? (
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold uppercase text-slate-500 block mb-2">Email</label>
                  <input 
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="seu@email.com"
                    type="email"
                    className={`w-full p-3 rounded border-2 outline-none transition-all ${THEME.input} focus:border-fuchsia-500 focus:shadow-[0_0_10px_rgba(232,121,249,0.2)]`}
                  />
                </div>
                <div>
                  <label className="text-xs font-bold uppercase text-slate-500 block mb-2">Senha</label>
                  <input 
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="••••••••"
                    type="password"
                    className={`w-full p-3 rounded border-2 outline-none transition-all ${THEME.input} focus:border-fuchsia-500 focus:shadow-[0_0_10px_rgba(232,121,249,0.2)]`}
                  />
                </div>
                
                <button 
                  onClick={handleLogin}
                  disabled={authLoading}
                  className={`w-full py-3 font-bold rounded uppercase tracking-wider transition-all ${THEME.button} shadow-lg shadow-fuchsia-200`}
                >
                  {authLoading ? "Sintonizando..." : "Conectar"}
                </button>

                <div className="relative my-4">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-slate-200"></span>
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className={`${THEME.paper} px-2 text-slate-400`}>Ou</span>
                  </div>
                </div>

                <button 
                  onClick={handleGoogleLogin}
                  disabled={authLoading}
                  className={`w-full py-3 font-bold rounded uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${THEME.buttonSecondary}`}
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24"><path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" /><path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" /><path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.84z" /><path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" /></svg>
                  Entrar com Google
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold uppercase text-slate-400 block mb-2">Nome</label>
                  <input 
                    value={registerUsername}
                    onChange={(e) => setRegisterUsername(e.target.value)}
                    placeholder="Seu Apelido"
                    maxLength={20}
                    className={`w-full p-3 rounded border-2 outline-none transition-all ${THEME.input} focus:border-cyan-500 focus:shadow-[0_0_10px_rgba(34,211,238,0.2)]`}
                  />
                </div>

                <div>
                  <label className="text-xs font-bold uppercase text-slate-400 block mb-2">Email</label>
                  <input 
                    value={registerEmail}
                    onChange={(e) => setRegisterEmail(e.target.value)}
                    placeholder="seu@email.com"
                    type="email"
                    className={`w-full p-3 rounded border-2 outline-none transition-all ${THEME.input} focus:border-cyan-500 focus:shadow-[0_0_10px_rgba(34,211,238,0.2)]`}
                  />
                </div>
                
                <div>
                  <label className="text-xs font-bold uppercase text-slate-400 block mb-2">Senha</label>
                  <input 
                    value={registerPassword}
                    onChange={(e) => setRegisterPassword(e.target.value)}
                    placeholder="••••••••"
                    type="password"
                    className={`w-full p-3 rounded border-2 outline-none transition-all ${THEME.input} focus:border-cyan-500 focus:shadow-[0_0_10px_rgba(34,211,238,0.2)]`}
                  />
                </div>

                <div>
                  <label className="text-xs font-bold uppercase text-slate-400 block mb-2">Confirmar Senha</label>
                  <input 
                    value={registerPassword2}
                    onChange={(e) => setRegisterPassword2(e.target.value)}
                    placeholder="••••••••"
                    type="password"
                    className={`w-full p-3 rounded border-2 outline-none transition-all ${THEME.input} focus:border-cyan-500 focus:shadow-[0_0_10px_rgba(34,211,238,0.2)]`}
                  />
                </div>

                <button 
                  onClick={handleRegister}
                  disabled={authLoading}
                  className={`w-full py-3 font-bold rounded uppercase tracking-wider transition-all ${THEME.button} shadow-lg shadow-cyan-900/20`}
                >
                  {authLoading ? "Registrando..." : "Criar Frequência"}
                </button>
              </div>
            )}

            {error && (
              <div className="bg-red-900/30 border-2 border-red-500/50 p-4 rounded animate-pulse">
                <p className="text-red-400 text-sm font-bold flex items-center gap-2">
                    <AlertTriangle size={16} />
                    {error}
                </p>
              </div>
            )}

            <div className="pt-4 border-t-2 border-slate-700">
              <button 
                onClick={() => setShowTutorial(true)} 
                className="w-full text-xs text-slate-500 underline hover:text-cyan-400 transition-colors flex items-center justify-center gap-1 py-2"
              >
                <Activity size={14}/> Como Jogar
              </button>
            </div>
          </Card>
        </div>
    );
}
