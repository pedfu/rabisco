import React, { useState } from 'react';
import { Card, Button } from '../UIComponents';
import { Share2, Crown, Users, Play, Settings } from 'lucide-react';

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
        <div className="flex-1 flex flex-col gap-6 max-w-4xl mx-auto w-full">
            <div className="text-center py-8">
              <h2 className="text-5xl font-black mb-2 text-slate-900 tracking-tighter">RABISCO</h2>
              <p className="text-slate-500 font-bold">A arte da sabotagem e dedução.</p>
              
              <div className="my-6">
                  <div className="inline-block bg-slate-100 border-2 border-slate-200 rounded-xl px-8 py-4 shadow-sm">
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">CÓDIGO DA SALA</p>
                      <p className="text-4xl font-black text-slate-900 tracking-widest font-mono select-all cursor-pointer hover:text-fuchsia-600 transition-colors" onClick={copyRoomLink} title="Clique para copiar link">
                          {gameState.code}
                      </p>
                  </div>
              </div>
              
              <div className="mt-2 flex justify-center">
                <Button 
                  onClick={copyRoomLink}
                  variant="secondary"
                  className="flex items-center justify-center gap-2 text-sm bg-white border-2 border-slate-200 shadow-sm hover:bg-slate-50 hover:border-slate-400 transition-all"
                >
                  <Share2 size={18} />
                  {copySuccess ? <span className="text-green-600 font-bold">Link Copiado!</span> : "Convidar Amigos"}
                </Button>
              </div>
            </div>

            {/* Settings (Host Only) */}
            {gameState.hostId === user?.uid && (
                <div className="flex justify-center">
                    <div className="bg-white p-4 rounded-xl border-2 border-slate-100 shadow-sm flex items-center gap-4">
                        <div className="flex items-center gap-2 text-slate-400 font-bold text-sm uppercase tracking-wider">
                            <Settings size={16} /> Configuração
                        </div>
                        <div className="flex items-center gap-2">
                            <label className="text-sm font-bold text-slate-700">Pontuação Máxima:</label>
                            <input 
                                type="number" 
                                value={maxScore}
                                onChange={(e) => setMaxScore(parseInt(e.target.value))}
                                className="w-20 px-2 py-1 border-2 border-slate-200 rounded text-center font-bold text-slate-900 focus:border-slate-900 outline-none"
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
                players.map((p) => {
                    if (!p || !p.id) return null;
                    return (
                    <div key={p.id} className="relative group">
                        <Card className={`flex flex-col items-center gap-3 p-6 transition-all hover:-translate-y-1 border-b-4 ${p.id === gameState.hostId ? 'border-yellow-400 bg-yellow-50' : 'border-slate-200 bg-white'} shadow-sm hover:shadow-md`}>
                        <div className="w-20 h-20 rounded-full bg-white border-2 border-slate-200 overflow-hidden relative">
                            <img src={`https://api.dicebear.com/7.x/notionists/svg?seed=${p.avatar || 0}`} alt={p.nickname} />
                        </div>
                        
                        <div className="text-center w-full">
                            <div className="font-bold truncate text-slate-900 flex items-center justify-center gap-1">
                                {p.nickname}
                                {p.id === gameState.hostId && <Crown size={14} className="text-yellow-500 fill-yellow-500" />}
                            </div>
                            <div className="text-xs font-mono text-slate-400 mt-1">
                                {p.coins !== undefined && <span className="text-yellow-600 font-bold mr-2">$ {p.coins}</span>}
                                <span>{p.totalScore || 0} pts</span>
                            </div>
                        </div>
                        </Card>
                    </div>
                    );
                })
                ) : (
                <div className="col-span-full text-center text-slate-400 py-12">
                    <div className="animate-spin w-8 h-8 border-4 border-slate-200 border-t-slate-400 rounded-full mx-auto mb-4"></div>
                    <p>Aguardando jogadores...</p>
                </div>
                )}
            </div>

            <div className="mt-auto flex flex-col items-center justify-center py-8 gap-4">
              {gameState.hostId === user?.uid ? (
                <Button onClick={() => startGame(maxScore)} disabled={players.length < 2} className="w-full max-w-md text-xl py-6 font-black tracking-widest bg-slate-900 hover:bg-slate-800 text-white shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all border-none flex items-center justify-center gap-3">
                   <Play fill="currentColor" /> INICIAR PARTIDA
                </Button>
              ) : (
                <div className="animate-pulse text-slate-400 font-mono bg-slate-100 px-6 py-3 rounded-full text-sm font-bold uppercase tracking-widest flex items-center gap-2">
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                    Aguardando host iniciar...
                </div>
              )}
              
              {players.length < 2 && (
                <div className="flex items-center gap-2 text-xs text-rose-500 font-bold bg-rose-50 px-4 py-2 rounded-full border border-rose-100">
                  <Users size={14} />
                  Mínimo 2 jogadores necessários ({players.length}/2)
                </div>
              )}
            </div>
        </div>
    );
}
