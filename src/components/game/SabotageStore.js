import React, { useState } from 'react';
import { Zap, EyeOff, Move, Maximize, Ghost, ChevronDown, ChevronUp } from 'lucide-react';

const ITEMS = [
    { id: 'invisible_ink', name: 'Tinta Invisível', price: 15, icon: Ghost, desc: 'O traço só aparece depois.' },
    { id: 'earthquake', name: 'Terremoto', price: 10, icon: Move, desc: 'Treme a tela do desenhista.' },
    { id: 'censorship', name: 'Censura', price: 12, icon: EyeOff, desc: 'Tarja preta no desenho.' },
    { id: 'mirror', name: 'Espelho', price: 8, icon: Maximize, desc: 'Inverte o desenho.' }
];

export default function SabotageStore({ coins, inventory, onBuy, onUse, isDrawer, players, myId }) {
    const [isCollapsed, setIsCollapsed] = useState(false);

    return (
        <div className={`transition-all duration-300 ${isCollapsed ? 'h-auto' : 'h-auto'}`}>
            <div className="bg-slate-900 text-white p-3 rounded-xl shadow-xl border border-slate-700 flex flex-col gap-2">
                <div 
                    className="flex justify-between items-center cursor-pointer select-none"
                    onClick={() => setIsCollapsed(!isCollapsed)}
                >
                    <h3 className="font-black text-yellow-400 flex items-center gap-2 text-sm">
                        <Zap size={16} /> LOJA DE SABOTAGEM
                    </h3>
                    <div className="flex items-center gap-2">
                        <div className="bg-yellow-500 text-black px-2 py-0.5 rounded-full font-bold text-xs">
                            $ {coins}
                        </div>
                        {isCollapsed ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </div>
                </div>

                {!isCollapsed && (
                    <>
                        {/* Inventory */}
                        {inventory.length > 0 && (
                            <div className="grid grid-cols-4 gap-2 pb-2 border-b border-slate-700">
                                {inventory.map((itemId, idx) => {
                                    const item = ITEMS.find(i => i.id === itemId);
                                    if (!item) return null;
                                    return (
                                        <button 
                                            key={idx}
                                            onClick={() => onUse(itemId)}
                                            className="bg-slate-800 hover:bg-red-900 p-2 rounded border border-slate-600 flex flex-col items-center gap-1 transition-colors group relative"
                                            title={item.desc}
                                        >
                                            <item.icon size={16} className="text-red-400 group-hover:text-white" />
                                            <span className="text-[10px] font-bold text-slate-300 group-hover:text-white text-center leading-tight">{item.name}</span>
                                        </button>
                                    );
                                })}
                            </div>
                        )}

                        {/* Shop */}
                        <div className="space-y-1">
                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Disponível</p>
                            {ITEMS.map(item => (
                                <button
                                    key={item.id}
                                    disabled={coins < item.price}
                                    onClick={() => onBuy(item.id)}
                                    className={`w-full flex items-center justify-between p-1.5 rounded border transition-all
                                        ${coins >= item.price 
                                            ? 'bg-slate-800 border-slate-600 hover:bg-slate-700 hover:border-yellow-500 cursor-pointer' 
                                            : 'bg-slate-900 border-slate-800 opacity-50 cursor-not-allowed'}`}
                                >
                                    <div className="flex items-center gap-2">
                                        <div className="p-1 bg-slate-900 rounded-lg text-slate-400">
                                            <item.icon size={12} />
                                        </div>
                                        <div className="text-left">
                                            <div className="text-xs font-bold text-slate-200">{item.name}</div>
                                            <div className="text-[9px] text-slate-500 hidden sm:block">{item.desc}</div>
                                        </div>
                                    </div>
                                    <span className={`font-mono font-bold text-xs ${coins >= item.price ? 'text-yellow-400' : 'text-slate-600'}`}>
                                        ${item.price}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

