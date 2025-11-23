import React from 'react';
import { Card, Input, Button } from '../UIComponents';
import { Activity, AlertTriangle, Palette, Radio } from 'lucide-react';
import TutorialModal from '../common/TutorialModal';
import AvatarSelector from '../common/AvatarSelector';

export default function LobbyMenu({ 
    THEME, 
    nickname, 
    setNickname, 
    user, 
    avatarSeed, 
    setAvatarSeed, 
    isVip, 
    setIsVip, 
    showAvatarSelector, 
    setShowAvatarSelector, 
    saveUserProfile, 
    createRoom, 
    roomCode, 
    setRoomCode, 
    joinRoom, 
    error, 
    handleLogout, 
    showTutorial, 
    setShowTutorial, 
    saveAvatarSeed 
}) {
    return (
      <div className={`min-h-screen ${THEME.bg} flex items-center justify-center p-4 font-sans`}>
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
             <div className="absolute top-[-20%] right-[-10%] w-[60%] h-[60%] bg-cyan-600 rounded-full blur-[150px] opacity-10"></div>
        </div>

        <div className="max-w-md w-full space-y-8 text-center relative z-10">
          <div>
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-slate-900 border border-fuchsia-500 text-fuchsia-400 mb-4">
                <Radio size={24} />
            </div>
            <h1 className="text-4xl font-black mb-2 text-slate-900">Olá, <span className="text-fuchsia-600">{nickname}</span></h1>
            <p className="text-xs text-slate-500 font-mono">{user?.email}</p>
          </div>
          
          <Card className={`space-y-6 ${THEME.paper} border-2 border-slate-200 text-slate-900 shadow-xl`}>
            <div className="flex justify-center mb-4 relative">
              <div className={`w-24 h-24 bg-white rounded-full flex items-center justify-center border-4 ${isVip ? 'border-yellow-500' : 'border-fuchsia-500'} overflow-hidden relative transition-all cursor-pointer shadow-[0_0_20px_rgba(232,121,249,0.3)]`} onClick={() => setShowAvatarSelector(true)}>
                 <img src={`https://api.dicebear.com/7.x/notionists/svg?seed=${avatarSeed}`} alt="avatar" />
                 <button onClick={(e) => { e.stopPropagation(); setShowAvatarSelector(true); }} className="absolute bottom-0 right-0 bg-white p-1.5 border border-fuchsia-500 rounded-full hover:bg-slate-50 text-fuchsia-600"><Palette size={14}/></button>
              </div>
            </div>

            <div className="space-y-2 bg-slate-50 p-4 rounded border border-slate-200">
              <p className="text-xs font-bold text-fuchsia-600 mb-2 uppercase tracking-wider">Sua Identidade</p>
              <div className="flex gap-2">
                <input 
                  value={nickname} 
                  onChange={(e) => setNickname(e.target.value)} 
                  placeholder="Seu Nome" 
                  maxLength={20}
                  className={`flex-1 p-2 rounded border-2 outline-none transition-all ${THEME.input} focus:border-fuchsia-500`}
                />
                <button 
                  onClick={async () => {
                    if (user?.uid && nickname.trim()) {
                      await saveUserProfile(user.uid, nickname.trim());
                    }
                  }}
                  disabled={!nickname.trim()}
                  className={`px-4 font-bold rounded uppercase text-sm transition-all ${THEME.buttonSecondary}`}
                >
                  Salvar
                </button>
              </div>
              <p className="text-xs text-slate-600 text-right">{nickname.length}/20</p>
            </div>
              
            <div className="pt-4 border-t-2 border-slate-700 space-y-4">
              <button 
                onClick={createRoom} 
                disabled={!nickname.trim()}
                className={`w-full py-4 font-bold rounded uppercase tracking-widest text-lg transition-all ${THEME.button} shadow-lg shadow-cyan-900/20`}
              >
                Criar Nova Sala
              </button>
                
              <div className="flex gap-2">
                <input 
                  value={roomCode} 
                  onChange={(e) => setRoomCode(e.target.value.toUpperCase())} 
                  placeholder="CÓDIGO" 
                  maxLength={6}
                  className={`flex-1 p-3 rounded border-2 outline-none text-center font-mono tracking-widest text-xl transition-all ${THEME.input} focus:border-cyan-500 uppercase`}
                />
                <button 
                  onClick={joinRoom}
                  disabled={!nickname.trim() || !roomCode.trim()}
                  className={`px-6 font-bold rounded uppercase tracking-wider transition-all ${THEME.buttonSecondary}`}
                >
                  Entrar
                </button>
              </div>
              
              {error && (
                <div className="bg-red-900/30 border-2 border-red-500/50 p-3 rounded animate-pulse">
                  <p className="text-red-400 text-sm font-bold">{error}</p>
                </div>
              )}
            </div>
            
            <div className="flex gap-2 pt-2">
              <button onClick={() => setShowTutorial(true)} className="text-xs text-slate-500 underline hover:text-cyan-400 transition-colors flex items-center justify-center gap-1 flex-1">
                <Activity size={12}/> Como Jogar
              </button>
            </div>

            <div className="pt-4 border-t-2 border-slate-700">
              <button onClick={handleLogout} className="w-full py-2 text-xs font-bold text-red-400 hover:text-red-300 hover:bg-red-900/20 rounded transition-colors">
                Sair da Frequência
              </button>
            </div>
          </Card>
        </div>

        <TutorialModal showTutorial={showTutorial} setShowTutorial={setShowTutorial} />
        <AvatarSelector 
          showAvatarSelector={showAvatarSelector} 
          setShowAvatarSelector={setShowAvatarSelector}
          avatarSeed={avatarSeed}
          setAvatarSeed={setAvatarSeed}
          user={user}
          saveAvatarSeed={saveAvatarSeed}
        />
      </div>
    );
}
