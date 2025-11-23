import React, { useState, useEffect, useRef } from 'react';

export default function Chat({ messages, onSendMessage, isDrawer, guessed }) {
    const [input, setInput] = useState("");
    const bottomRef = useRef(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!input.trim()) return;
        onSendMessage(input);
        setInput("");
    };

    return (
        <div className="flex flex-col h-full bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-3 border-b border-slate-100 bg-slate-50 font-bold text-slate-700 text-sm">
                Chat da Sala
            </div>
            
            <div className="flex-1 overflow-y-auto p-3 space-y-2">
                {messages.map((msg) => (
                    <div key={msg.id} className={`text-sm ${msg.type === 'system-near' ? 'text-yellow-600 bg-yellow-50 p-1 rounded text-center font-bold' : ''}`}>
                        {msg.type === 'user' && (
                             <p>
                                 <span className="font-bold text-slate-900">{msg.author}: </span>
                                 <span className={`break-words ${guessed ? 'text-green-600 font-bold' : 'text-slate-600'}`}>
                                     {msg.text}
                                 </span>
                             </p>
                        )}
                        {msg.type === 'system' && (
                             <p className="text-center text-slate-400 text-xs italic">{msg.text}</p>
                        )}
                        {msg.type === 'system-win' && (
                             <p className="text-center text-green-600 font-bold bg-green-50 p-1 rounded">{msg.text}</p>
                        )}
                    </div>
                ))}
                <div ref={bottomRef} />
            </div>

            <form onSubmit={handleSubmit} className="p-2 border-t border-slate-100 bg-slate-50">
                <input 
                    type="text" 
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder={isDrawer ? "Você está desenhando..." : guessed ? "Você já acertou!" : "Digite sua resposta..."}
                    className={`w-full px-3 py-2 rounded-lg border-2 outline-none transition-colors ${
                        guessed ? 'bg-green-50 border-green-200 text-green-700 placeholder-green-400' :
                        isDrawer ? 'bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed' :
                        'bg-white border-slate-200 focus:border-fuchsia-400'
                    }`}
                    disabled={isDrawer}
                />
            </form>
        </div>
    );
}

