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
        <div className="flex flex-col h-screen bg-[#fffdf5] p-4 gap-4 overflow-hidden font-['Patrick_Hand'] text-xl" style={{backgroundImage: 'radial-gradient(#e5e7eb 1px, transparent 1px)', backgroundSize: '20px 20px'}}>
            {/* Header */}
            <header className="box-sketch p-3 flex justify-between items-center shrink-0 bg-white">
                <div className="flex items-center gap-4">
                    <div className="bg-black text-white px-3 py-1 -rotate-2 rounded-sm font-black tracking-widest text-2xl">
                        RABISCO
                    </div>
                    <div className="flex items-center gap-2 text-slate-700 font-bold bg-yellow-50 border-2 border-black px-3 py-1 rounded-full shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                        <Timer size={20} />
                        <span className={timeLeft < 10 ? 'text-red-500 animate-pulse' : ''}>
                            {formatTime(timeLeft)}
                        </span>
                    </div>
                    <div className="text-lg font-bold text-slate-600">
                        Rodada {gameState.round}/{gameState.maxRounds}
                    </div>
                </div>

                {/* Word Display */}
                <div className="absolute left-1/2 -translate-x-1/2 bg-white px-8 py-4 rounded-b-3xl border-2 border-t-0 border-black shadow-[0px_4px_0px_0px_rgba(0,0,0,0.1)] -mt-4 transform rotate-1">
                    {gameState.status === 'DRAWING' ? (
                        isDrawer ? (
                            <div className="flex flex-col items-center">
                                <span className="font-black text-2xl tracking-widest text-slate-900">{displayWord}</span>
                                <button 
                                    onClick={handleGiveHint}
                                    className="text-sm bg-yellow-200 text-black px-3 py-1 mt-1 border-2 border-black rounded-full hover:bg-yellow-300 hover:-rotate-2 transition-transform font-bold"
                                >
                                    DAR DICA (-2 pts)
                                </button>
                            </div>
                        ) : (
                            <div className="flex gap-3">
                                {gameState.wordLength > 0 ? (
                                    Array(gameState.wordLength).fill('').map((_, i) => (
                                        <span key={i} className="w-8 h-10 border-b-4 border-black flex items-end justify-center font-bold text-2xl text-slate-700 font-mono">
                                            {gameState.maskedWord && gameState.maskedWord[i] ? gameState.maskedWord[i] : ''}
                                        </span>
                                    ))
                                ) : (
                                    <div className="flex gap-2">
                                        <span className="text-slate-400 font-bold text-2xl animate-bounce">?</span>
                                        <span className="text-slate-400 font-bold text-2xl animate-bounce delay-100">?</span>
                                        <span className="text-slate-400 font-bold text-2xl animate-bounce delay-200">?</span>
                                    </div>
                                )}
                            </div>
                        )
                    ) : (
                        <span className="font-bold text-slate-400 text-xl">Aguardando...</span>
                    )}
                </div>

                <div className="flex gap-2">
                    {/* Icons/Menu */}
                </div>
            </header>

            {/* Main Content */}
            <div className="flex-1 flex gap-4 min-h-0">
                {/* Left: Players */}
                <div className="w-64 box-sketch flex flex-col overflow-hidden shrink-0 bg-white transform -rotate-1">
                    <div className="p-3 bg-yellow-50 border-b-2 border-black font-bold text-slate-800 text-lg uppercase flex items-center justify-between">
                        <span>Jogadores</span>
                        <span className="text-xs bg-black text-white px-2 py-0.5 rounded-full">{gameState.players.length}</span>
                    </div>
                    <div className="flex-1 overflow-y-auto p-3 space-y-3">
                        {gameState.players.sort((a,b) => b.score - a.score).map((p, i) => (
                            <div key={p.id} className={`flex items-center gap-3 p-2 rounded-lg border-2 transition-all ${p.id === gameState.currentDrawerId ? 'bg-yellow-100 border-black translate-x-1' : 'bg-white border-slate-200 hover:border-slate-400'}`}>
                                <div className="relative">
                                    <img 
                                        src={`https://api.dicebear.com/7.x/notionists/svg?seed=${p.avatar}`} 
                                        className="w-10 h-10 rounded-full bg-white border-2 border-black"
                                    />
                                    {p.id === gameState.currentDrawerId && (
                                        <div className="absolute -top-2 -right-2 bg-yellow-400 text-black p-1 rounded-full border-2 border-black z-10">
                                            <PenTool size={12} />
                                        </div>
                                    )}
                                    {gameState.guessedPlayers && gameState.guessedPlayers.includes(p.id) && (
                                        <div className="absolute inset-0 bg-green-500/90 rounded-full flex items-center justify-center text-white font-bold border-2 border-black animate-in zoom-in">
                                            OK
                                        </div>
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="font-bold text-lg truncate text-slate-800 flex items-center gap-1 leading-none">
                                        {i+1}. {p.nickname}
                                        {p.id === gameState.hostId && <Crown size={14} className="text-yellow-500 fill-yellow-500" />}
                                    </div>
                                    <div className="text-sm text-slate-500 font-bold">
                                        {p.score} pts
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Center: Canvas */}
                <div className="flex-1 relative box-sketch overflow-hidden bg-white p-2">
                    <div className="w-full h-full border-2 border-slate-100 rounded-lg overflow-hidden relative">
                    {gameState.status === 'CHOOSING_WORD' && isDrawer ? (
                         <div className="absolute inset-0 z-50 bg-white/90 backdrop-blur-sm flex items-center justify-center">
                             <div className="bg-white p-8 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] rounded-2xl text-center max-w-2xl w-full rotate-1">
                                 <h2 className="text-3xl font-black text-black mb-8 uppercase tracking-widest transform -rotate-2">Escolha uma palavra</h2>
                                 <div className="grid grid-cols-3 gap-4">
                                     {user.drawerData?.options?.map((opt, i) => (
                                         <button 
                                            key={i}
                                            onClick={() => handleChooseWord(opt)}
                                            className="group relative h-32 bg-white border-4 border-black rounded-xl hover:-translate-y-1 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all"
                                         >
                                             <div className={`absolute inset-0 opacity-10 ${i===0 ? 'bg-green-500' : i===1 ? 'bg-yellow-500' : 'bg-red-500'}`}></div>
                                             <div className="text-sm font-bold uppercase tracking-widest text-slate-500 mb-2">{opt.difficulty}</div>
                                             <div className="text-2xl font-black text-black group-hover:scale-110 transition-transform">{opt.text}</div>
                                         </button>
                                     ))}
                                 </div>
                             </div>
                         </div>
                    ) : gameState.status === 'CHOOSING_WORD' ? (
                        <div className="absolute inset-0 z-50 flex items-center justify-center bg-white/50 backdrop-blur-sm">
                            <div className="text-center animate-pulse bg-white p-6 border-4 border-black rounded-full shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                                <p className="text-2xl font-bold text-black mb-2">O desenhista está escolhendo...</p>
                                <div className="flex gap-2 justify-center">
                                    <div className="w-4 h-4 bg-black rounded-full animate-bounce"></div>
                                    <div className="w-4 h-4 bg-black rounded-full animate-bounce delay-100"></div>
                                    <div className="w-4 h-4 bg-black rounded-full animate-bounce delay-200"></div>
                                </div>
                            </div>
                        </div>
                    ) : null}

                    {gameState.status === 'ROUND_END' && (
                        <div className="absolute inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center text-white">
                            <div className="text-center transform rotate-2">
                                <p className="text-2xl font-bold text-slate-300 mb-2 font-hand">A palavra era</p>
                                <h2 className="text-6xl font-black text-yellow-400 mb-8 border-4 border-white p-4 rounded-xl -rotate-2 inline-block bg-black">{gameState.currentWord}</h2>
                                
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
                </div>

                {/* Right: Chat & Store */}
                <div className="w-80 flex flex-col gap-4 shrink-0 h-full">
                    <div className="flex-1 min-h-0 box-sketch overflow-hidden bg-white flex flex-col transform rotate-1 transition-all duration-300">
                        <div className="p-2 bg-slate-100 border-b-2 border-black font-bold text-center">Chat</div>
                        <div className="flex-1 min-h-0 relative">
                            <Chat 
                                messages={messages} 
                                onSendMessage={handleSendMessage}
                                isDrawer={isDrawer}
                                guessed={gameState.guessedPlayers && gameState.guessedPlayers.includes(user.uid)}
                            />
                        </div>
                    </div>
                    
                    <div className="box-sketch bg-white p-2 transform -rotate-1 transition-all duration-300">
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
        </div>
    );
}

