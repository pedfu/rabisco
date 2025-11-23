import React, { useState, useEffect } from 'react';
import { socket } from '../../socket';
import Canvas from './Canvas';
import Chat from './Chat';
import SabotageStore from './SabotageStore';
import { Timer, PenTool, Crown } from 'lucide-react';

export default function Game({ gameState, user, roomCode }) {
    const [localStrokes, setLocalStrokes] = useState([]);
    const [messages, setMessages] = useState([]);
    const [timeLeft, setTimeLeft] = useState(gameState.timeLeft || 0);
    
    const myPlayer = gameState.players.find(p => p.id === user.uid) || {};
    const isDrawer = gameState.currentDrawerId === user.uid;
    
    // Use drawer data if available, otherwise use gameState (which might be hidden/null)
    const drawerWord = user.drawerData?.word; 
    const displayWord = isDrawer ? (drawerWord || gameState.currentWord) : gameState.currentWord;

    useEffect(() => {
        setTimeLeft(gameState.timeLeft || 0);
    }, [gameState.timeLeft]);

    // Sync strokes from gamestate when it changes (e.g. reconnect or round change)
    useEffect(() => {
        if (gameState.strokes) {
            setLocalStrokes(gameState.strokes);
        }
    }, [gameState.strokes, gameState.round, gameState.status]);

    // Listen for live updates
    useEffect(() => {
        const handleNewStroke = (stroke) => {
            setLocalStrokes(prev => [...prev, stroke]);
        };
        
        const handleChatMessage = (msg) => {
            setMessages(prev => [...prev, msg]);
        };
        
        const handleClear = () => {
            setLocalStrokes([]);
        };

        // Sabotage Events
        const handleSabotageTrigger = ({ type, sourceName }) => {
            // Optional: Show toast/notification
            setMessages(prev => [...prev, {
                id: Date.now(),
                type: 'system-near',
                text: `${sourceName} usou ${type.toUpperCase()}!`
            }]);
        };

        const handleTimerPulse = (t) => {
            setTimeLeft(t);
        };

        socket.on('new_stroke', handleNewStroke);
        socket.on('chat_message', handleChatMessage);
        socket.on('canvas_cleared', handleClear);
        socket.on('sabotage_triggered', handleSabotageTrigger);
        socket.on('timer_pulse', handleTimerPulse);

        return () => {
            socket.off('new_stroke', handleNewStroke);
            socket.off('chat_message', handleChatMessage);
            socket.off('canvas_cleared', handleClear);
            socket.off('sabotage_triggered', handleSabotageTrigger);
            socket.off('timer_pulse', handleTimerPulse);
        };
    }, []);

    const handleDrawStroke = (stroke) => {
        setLocalStrokes(prev => [...prev, stroke]);
        socket.emit('draw_stroke', { roomCode, stroke });
    };

    const handleClearCanvas = () => {
        setLocalStrokes([]);
        socket.emit('clear_canvas', { roomCode });
    };

    const handleSendMessage = (text) => {
        socket.emit('send_message', { roomCode, message: text });
    };

    const handleChooseWord = (wordObj) => {
        socket.emit('choose_word', { roomCode, wordObj });
    };
    
    const handleGiveHint = () => {
        socket.emit('give_hint', { roomCode });
    };

    const handleBuySabotage = (itemId) => {
        socket.emit('buy_sabotage', { roomCode, itemId });
    };

    const handleUseSabotage = (itemId) => {
        // Default target: drawer? Or ask user?
        // For MVP, auto target drawer or guessers depending on item type logic in server/client?
        // Store passed `targetId`.
        // If I am drawer, can I sabotage guessers? Yes.
        // If I am guesser, I sabotage drawer.
        let targetId = null;
        
        // Logic:
        // Invisible Ink -> Target Drawer (if guesser uses)
        // Earthquake -> Target Drawer
        // Mirror -> Target Guessers (if drawer uses) or Drawer (if guesser uses?)
        // Let's simplify: Guesser attacks Drawer. Drawer attacks Guessers.
        
        if (isDrawer) {
            targetId = 'all_guessers'; 
        } else {
            targetId = gameState.currentDrawerId;
        }
        
        socket.emit('use_sabotage', { roomCode, itemId, targetId });
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className="flex flex-col h-screen bg-slate-100 p-4 gap-4 overflow-hidden">
            {/* Header */}
            <header className="bg-white p-3 rounded-xl shadow-sm flex justify-between items-center shrink-0">
                <div className="flex items-center gap-4">
                    <div className="bg-slate-900 text-white px-3 py-1 rounded font-black tracking-widest">
                        RABISCO
                    </div>
                    <div className="flex items-center gap-2 text-slate-600 font-bold bg-slate-100 px-3 py-1 rounded-lg">
                        <Timer size={18} />
                        <span className={timeLeft < 10 ? 'text-red-500 animate-pulse' : ''}>
                            {formatTime(timeLeft)}
                        </span>
                    </div>
                    <div className="text-sm font-bold text-slate-500">
                        Rodada {gameState.round}/{gameState.maxRounds}
                    </div>
                </div>

                {/* Word Display */}
                <div className="absolute left-1/2 -translate-x-1/2 bg-white px-6 py-2 rounded-b-xl shadow-md border-t-0 border-2 border-slate-200 -mt-3">
                    {gameState.status === 'DRAWING' ? (
                        isDrawer ? (
                            <div className="flex flex-col items-center">
                                <span className="font-black text-xl tracking-widest text-slate-900">{displayWord}</span>
                                <button 
                                    onClick={handleGiveHint}
                                    className="text-[10px] bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded border border-yellow-200 font-bold hover:bg-yellow-200 mt-1"
                                >
                                    DAR DICA (-2 pts)
                                </button>
                            </div>
                        ) : (
                            <div className="flex gap-2">
                                {gameState.wordLength > 0 ? (
                                    Array(gameState.wordLength).fill('').map((_, i) => (
                                        <span key={i} className="w-6 h-8 border-b-4 border-slate-300 flex items-end justify-center font-bold text-slate-400">
                                            {gameState.maskedWord && gameState.maskedWord[i] ? gameState.maskedWord[i] : ''}
                                        </span>
                                    ))
                                ) : (
                                    <div className="flex gap-1">
                                        {/* Hidden word length indicator? Or just ??? */}
                                        <span className="text-slate-400 font-bold">? ? ?</span>
                                    </div>
                                )}
                            </div>
                        )
                    ) : (
                        <span className="font-bold text-slate-400">Aguardando...</span>
                    )}
                </div>

                <div className="flex gap-2">
                    {/* Icons/Menu */}
                </div>
            </header>

            {/* Main Content */}
            <div className="flex-1 flex gap-4 min-h-0">
                {/* Left: Players */}
                <div className="w-64 bg-white rounded-xl shadow-sm flex flex-col overflow-hidden shrink-0 border border-slate-200">
                    <div className="p-3 bg-slate-50 border-b border-slate-100 font-bold text-slate-600 text-sm uppercase">
                        Jogadores
                    </div>
                    <div className="flex-1 overflow-y-auto p-2 space-y-2">
                        {gameState.players.sort((a,b) => b.score - a.score).map(p => (
                            <div key={p.id} className={`flex items-center gap-2 p-2 rounded-lg ${p.id === gameState.currentDrawerId ? 'bg-yellow-50 border border-yellow-200' : 'bg-slate-50'}`}>
                                <div className="relative">
                                    <img 
                                        src={`https://api.dicebear.com/7.x/notionists/svg?seed=${p.avatar}`} 
                                        className="w-10 h-10 rounded-full bg-white border border-slate-200"
                                    />
                                    {p.id === gameState.currentDrawerId && (
                                        <div className="absolute -top-1 -right-1 bg-yellow-400 text-white p-0.5 rounded-full border-2 border-white">
                                            <PenTool size={10} />
                                        </div>
                                    )}
                                    {gameState.guessedPlayers && gameState.guessedPlayers.includes(p.id) && (
                                        <div className="absolute inset-0 bg-green-500/80 rounded-full flex items-center justify-center text-white font-bold text-xs animate-in zoom-in">
                                            OK
                                        </div>
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="font-bold text-sm truncate text-slate-800 flex items-center gap-1">
                                        {p.nickname}
                                        {p.id === gameState.hostId && <Crown size={10} className="text-yellow-500 fill-yellow-500" />}
                                    </div>
                                    <div className="text-xs text-slate-500 font-mono">
                                        {p.score} pts
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Center: Canvas */}
                <div className="flex-1 relative bg-white rounded-xl shadow-sm overflow-hidden border-4 border-slate-800">
                    {gameState.status === 'CHOOSING_WORD' && isDrawer ? (
                         <div className="absolute inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center">
                             <div className="bg-white p-8 rounded-2xl shadow-2xl text-center animate-in zoom-in">
                                 <h2 className="text-2xl font-black text-slate-900 mb-6">Escolha uma palavra</h2>
                                 <div className="flex gap-4">
                                     {user.drawerData?.options?.map((opt, i) => (
                                         <button 
                                            key={i}
                                            onClick={() => handleChooseWord(opt)}
                                            className="px-6 py-4 bg-slate-100 hover:bg-yellow-400 hover:text-black hover:scale-105 transition-all rounded-xl font-bold text-lg text-slate-700 border-2 border-slate-200 hover:border-black shadow-sm"
                                         >
                                             <div className="text-xs uppercase tracking-widest opacity-50 mb-1">{opt.difficulty}</div>
                                             {opt.text}
                                         </button>
                                     ))}
                                 </div>
                             </div>
                         </div>
                    ) : gameState.status === 'CHOOSING_WORD' ? (
                        <div className="absolute inset-0 z-50 flex items-center justify-center bg-slate-50">
                            <div className="text-center animate-pulse">
                                <p className="text-2xl font-bold text-slate-400 mb-2">O desenhista está escolhendo...</p>
                                <div className="flex gap-2 justify-center">
                                    <div className="w-3 h-3 bg-slate-300 rounded-full animate-bounce"></div>
                                    <div className="w-3 h-3 bg-slate-300 rounded-full animate-bounce delay-100"></div>
                                    <div className="w-3 h-3 bg-slate-300 rounded-full animate-bounce delay-200"></div>
                                </div>
                            </div>
                        </div>
                    ) : null}

                    {gameState.status === 'ROUND_END' && (
                        <div className="absolute inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center text-white">
                            <div className="text-center">
                                <p className="text-xl font-bold text-slate-300 mb-2">A palavra era</p>
                                <h2 className="text-5xl font-black text-yellow-400 mb-8">{gameState.currentWord}</h2>
                                
                                {/* Winner of round? Or just scores */}
                            </div>
                        </div>
                    )}

                    <Canvas 
                        isDrawer={isDrawer && gameState.status === 'DRAWING'}
                        onDrawStroke={handleDrawStroke}
                        onClearCanvas={handleClearCanvas}
                        strokes={localStrokes}
                        sabotagesActive={gameState.sabotagesActive || {}}
                        myId={user.uid}
                    />
                </div>

                {/* Right: Chat & Store */}
                <div className="w-80 flex flex-col gap-4 shrink-0">
                    <div className="flex-1 min-h-0">
                        <Chat 
                            messages={messages} 
                            onSendMessage={handleSendMessage}
                            isDrawer={isDrawer}
                            guessed={gameState.guessedPlayers && gameState.guessedPlayers.includes(user.uid)}
                        />
                    </div>
                    
                    <SabotageStore 
                        coins={myPlayer.coins || 0}
                        inventory={myPlayer.inventory || []}
                        onBuy={handleBuySabotage}
                        onUse={handleUseSabotage}
                        isDrawer={isDrawer}
                        players={gameState.players}
                        myId={user.uid}
                    />
                </div>
            </div>
        </div>
    );
}

