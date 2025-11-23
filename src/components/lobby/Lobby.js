import React, { useState } from 'react';
import { Card, Button } from '../UIComponents';
import { Share2, Crown, Users, Play, Settings, Clipboard } from 'lucide-react';

export default function Lobby({ 
    gameState, 
    players, 
    user, 
    copyRoomLink, 
    copySuccess, 
    startGame
}) {
    const [maxScore, setMaxScore] = useState(120);

    return (
        <div className="flex-1 flex flex-col gap-6 max-w-4xl mx-auto w-full p-4 font-['Patrick_Hand']">
            <div className="text-center py-6">
              <h2 className="text-6xl font-black mb-2 text-black tracking-tighter transform -rotate-2">RABISCO</h2>
              <p className="text-slate-500 font-bold text-xl transform rotate-1">A arte da sabotagem e dedução.</p>
              
              <div className="my-8 flex justify-center">
                  <div className="bg-white border-4 border-black rounded-2xl px-8 py-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transform rotate-1 transition-transform hover:scale-105 cursor-pointer relative group" onClick={copyRoomLink}>
                      <p className="text-sm font-black text-slate-400 uppercase tracking-widest mb-2">CÓDIGO DA SALA</p>
                      <p className="text-5xl font-black text-black tracking-widest font-mono select-all group-hover:text-yellow-500 transition-colors">
                          {gameState.code}
                      </p>
                      <div className="absolute -top-3 -right-3 bg-yellow-300 border-2 border-black rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                         <Clipboard size={20} className="text-black" />
                      </div>
                  </div>
              </div>
              
              <div className="mt-4 flex justify-center">
                <Button 
                  onClick={copyRoomLink}
                  className="flex items-center justify-center gap-2 text-lg font-bold bg-white text-black border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all rounded-xl px-6 py-2 btn-sketch"
                >
                  <Share2 size={20} />
                  {copySuccess ? <span className="text-green-600 font-bold">Link Copiado!</span> : "Convidar Amigos"}
                </Button>
              </div>
            </div>

            {/* Settings (Host Only) */}
            {gameState.hostId === user?.uid && (
                <div className="flex justify-center">
                    <div className="bg-white p-4 rounded-xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)] flex items-center gap-4 transform -rotate-1">
                        <div className="flex items-center gap-2 text-slate-500 font-bold text-lg uppercase tracking-wider">
                            <Settings size={20} /> Configuração
                        </div>
                        <div className="flex items-center gap-2">
                            <label className="text-lg font-bold text-slate-900">Pontuação Máxima:</label>
                            <input 
                                type="number" 
                                value={maxScore}
                                onChange={(e) => setMaxScore(parseInt(e.target.value))}
                                className="w-24 px-3 py-1 border-2 border-black rounded-lg text-center font-bold text-xl text-black focus:bg-yellow-50 outline-none"
                                min="30"
                                max="500"
                                step="10"
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* Player List */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {players.length > 0 ? (
                players.map((p, i) => {
                    if (!p || !p.id) return null;
                    return (
                    <div key={p.id} className="relative group">
                        <div className={`flex flex-col items-center gap-3 p-4 transition-all hover:-translate-y-2 border-2 border-black rounded-2xl ${p.id === gameState.hostId ? 'bg-yellow-50 rotate-1' : 'bg-white -rotate-1'} shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]`}>
                        <div className="w-20 h-20 rounded-full bg-white border-2 border-black overflow-hidden relative">
                            <img src={`https://api.dicebear.com/7.x/notionists/svg?seed=${p.avatar || 0}`} alt={p.nickname} />
                        </div>
                        
                        <div className="text-center w-full">
                            <div className="font-bold truncate text-xl text-black flex items-center justify-center gap-1">
                                {p.nickname}
                                {p.id === gameState.hostId && <Crown size={16} className="text-yellow-500 fill-yellow-500" />}
                            </div>
                            <div className="text-sm font-bold text-slate-400 mt-1">
                                <span>{p.totalScore || 0} pts</span>
                            </div>
                        </div>
                        </div>
                    </div>
                    );
                })
                ) : (
                <div className="col-span-full text-center text-slate-400 py-12 box-sketch bg-white">
                    <div className="animate-spin w-8 h-8 border-4 border-slate-200 border-t-black rounded-full mx-auto mb-4"></div>
                    <p className="font-bold text-xl">Aguardando jogadores...</p>
                </div>
                )}
            </div>

            <div className="mt-auto flex flex-col items-center justify-center py-8 gap-4">
              {gameState.hostId === user?.uid ? (
                <Button onClick={() => startGame(maxScore)} disabled={players.length < 2} className="w-full max-w-md text-2xl py-6 font-black tracking-widest bg-black hover:bg-slate-800 text-white shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 transition-all border-none flex items-center justify-center gap-3 rounded-2xl btn-sketch transform rotate-1">
                   <Play fill="currentColor" size={24} /> INICIAR PARTIDA
                </Button>
              ) : (
                <div className="animate-pulse text-slate-400 font-mono bg-white border-2 border-slate-200 px-8 py-4 rounded-full text-lg font-bold uppercase tracking-widest flex items-center gap-3 shadow-sm">
                    <div className="w-3 h-3 bg-slate-400 rounded-full animate-bounce"></div>
                    Aguardando host iniciar...
                </div>
              )}
              
              {players.length < 2 && (
                <div className="flex items-center gap-2 text-sm text-red-500 font-bold bg-white px-4 py-2 rounded-full border-2 border-red-200 shadow-sm transform -rotate-1">
                  <Users size={16} />
                  Mínimo 2 jogadores necessários ({players.length}/2)
                </div>
              )}
            </div>
        </div>
    );
}
