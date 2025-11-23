import React from 'react';
import { Card, Input, Button } from '../UIComponents';
import { Activity, AlertTriangle, Palette, Radio, PenTool } from 'lucide-react';
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
      <div className={`min-h-screen bg-[#fffdf5] flex items-center justify-center p-4 font-['Patrick_Hand'] text-xl`} style={{backgroundImage: 'radial-gradient(#e5e7eb 1px, transparent 1px)', backgroundSize: '20px 20px'}}>
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
             {/* Background doodles */}
        </div>

        <div className="max-w-md w-full space-y-8 text-center relative z-10">
          <div>
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-black text-white mb-4 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)] transform -rotate-3">
                <PenTool size={32} className="animate-pulse" />
            </div>
            <h1 className="text-5xl font-black mb-2 text-black tracking-tighter transform rotate-1">Olá, <span className="text-yellow-500 bg-black px-2 rounded transform -rotate-2 inline-block">{nickname}</span></h1>
            <p className="text-sm text-slate-500 font-bold">{user?.email}</p>
          </div>
          
          <Card className={`space-y-6 bg-white border-2 border-black text-slate-900 box-sketch p-6 transform rotate-1`}>
            <div className="flex justify-center mb-4 relative">
              <div className={`w-32 h-32 bg-white rounded-full flex items-center justify-center border-4 border-black overflow-hidden relative transition-all cursor-pointer shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:scale-105`} onClick={() => setShowAvatarSelector(true)}>
                 <img src={`https://api.dicebear.com/7.x/notionists/svg?seed=${avatarSeed}`} alt="avatar" />
                 <button onClick={(e) => { e.stopPropagation(); setShowAvatarSelector(true); }} className="absolute bottom-0 right-0 bg-yellow-300 p-2 border-2 border-black rounded-full hover:bg-yellow-400 text-black shadow-sm"><Palette size={18}/></button>
              </div>
            </div>

            <div className="space-y-3 bg-slate-50 p-4 rounded-xl border-2 border-slate-200 border-dashed">
              <p className="text-sm font-black text-black mb-2 uppercase tracking-wider transform -rotate-1">Sua Identidade</p>
              <div className="flex gap-2">
                <input 
                  value={nickname} 
                  onChange={(e) => setNickname(e.target.value)} 
                  placeholder="Seu Nome" 
                  maxLength={20}
                  className={`flex-1 p-3 rounded-lg border-2 border-black outline-none transition-all font-sans text-lg focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:-translate-y-1`}
                />
                <button 
                  onClick={async () => {
                    if (user?.uid && nickname.trim()) {
                      await saveUserProfile(user.uid, nickname.trim());
                    }
                  }}
                  disabled={!nickname.trim()}
                  className={`px-4 font-bold rounded-lg uppercase text-sm transition-all btn-sketch bg-yellow-300 border-black hover:bg-yellow-400`}
                >
                  Salvar
                </button>
              </div>
              <p className="text-xs text-slate-500 text-right font-bold">{nickname.length}/20</p>
            </div>
              
            <div className="pt-6 border-t-2 border-black border-dashed space-y-4">
              <button 
                onClick={createRoom} 
                disabled={!nickname.trim()}
                className={`w-full py-4 font-black rounded-xl uppercase tracking-widest text-xl transition-all btn-sketch bg-black text-white hover:bg-slate-800 hover:text-yellow-300 transform hover:-rotate-1`}
              >
                Criar Nova Sala
              </button>
                
              <div className="flex flex-col sm:flex-row gap-2">
                <input 
                  value={roomCode} 
                  onChange={(e) => setRoomCode(e.target.value.toUpperCase())} 
                  placeholder="CÓDIGO" 
                  maxLength={6}
                  className={`w-full sm:w-2/3 p-3 rounded-xl border-2 border-black outline-none text-center font-mono tracking-widest text-2xl transition-all focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:-translate-y-1 uppercase`}
                />
                <button 
                  onClick={joinRoom}
                  disabled={!nickname.trim() || !roomCode.trim()}
                  className={`w-full sm:w-1/3 px-4 py-3 font-black rounded-xl uppercase tracking-wider transition-all btn-sketch bg-white hover:bg-slate-50`}
                >
                  Entrar
                </button>
              </div>
              
              {error && (
                <div className="bg-red-50 border-2 border-black p-3 rounded-lg animate-pulse transform rotate-1 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                  <p className="text-red-600 text-sm font-bold flex items-center justify-center gap-2"><AlertTriangle size={16}/> {error}</p>
                </div>
              )}
            </div>
            
            <div className="flex gap-2 pt-2">
              <button onClick={() => setShowTutorial(true)} className="text-sm text-slate-500 hover:text-black font-bold hover:underline transition-colors flex items-center justify-center gap-1 flex-1">
                <Activity size={16}/> Como Jogar
              </button>
            </div>

            <div className="pt-4 border-t-2 border-black border-dashed">
              <button onClick={handleLogout} className="w-full py-2 text-sm font-bold text-red-500 hover:text-red-700 hover:bg-red-50 rounded transition-colors">
                Sair
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
