import React, { useRef, useState, useEffect } from 'react';
import { Eraser, Square, Circle, PaintBucket } from 'lucide-react';

export default function Canvas({ 
    isDrawer, 
    onDrawStroke, 
    onClearCanvas, 
    strokes, 
    sabotagesActive, 
    myId 
}) {
    const canvasRef = useRef(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [currentPoints, setCurrentPoints] = useState([]);
    const [color, setColor] = useState('#000000');
    const [width, setWidth] = useState(3);
    const [tool, setTool] = useState('pen'); // pen, eraser, rect, circle

    // Sabotage Effects
    const isEarthquake = Object.values(sabotagesActive).some(s => s.type === 'earthquake' && s.targetId === myId);
    const isMirror = Object.values(sabotagesActive).some(s => s.type === 'mirror' && (s.targetId === myId || (!isDrawer && s.targetId === 'all_guessers'))); 
    const shouldMirror = !isDrawer && Object.values(sabotagesActive).some(s => s.type === 'mirror');
    const isCensored = Object.values(sabotagesActive).some(s => s.type === 'censorship');
    const isInvisibleInk = Object.values(sabotagesActive).some(s => s.type === 'invisible_ink' && s.targetId === myId);

    const getCoords = (e) => {
        const canvas = canvasRef.current;
        if (!canvas) return { x: 0, y: 0 };
        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;
        
        let clientX = e.clientX;
        let clientY = e.clientY;
        
        if (e.touches && e.touches.length > 0) {
            clientX = e.touches[0].clientX;
            clientY = e.touches[0].clientY;
        }

        let x = (clientX - rect.left) * scaleX;
        let y = (clientY - rect.top) * scaleY;

        if (isEarthquake && isDrawer) {
             x += (Math.random() - 0.5) * 20;
             y += (Math.random() - 0.5) * 20;
        }

        return { x, y };
    };

    const startDrawing = (e) => {
        if (!isDrawer) return;
        e.preventDefault();
        setIsDrawing(true);
        const point = getCoords(e);
        setCurrentPoints([point]);
    };

    const draw = (e) => {
        if (!isDrawing || !isDrawer) return;
        e.preventDefault();
        const point = getCoords(e);
        setCurrentPoints(prev => [...prev, point]);
    };

    const stopDrawing = () => {
        if (!isDrawing || !isDrawer) return;
        setIsDrawing(false);
        
        // For shapes, we only need start and end points really, but currentPoints has path.
        // We can simplify for storage if needed, but keeping all points allows replay if we wanted.
        // Actually for shapes we just need first and last point.
        
        if (currentPoints.length > 0) {
            let finalPoints = currentPoints;
            let strokeType = tool;
            
            if (tool === 'rect' || tool === 'circle') {
                // Optimize: just keep start and end
                finalPoints = [currentPoints[0], currentPoints[currentPoints.length - 1]];
            }

            const stroke = {
                points: finalPoints,
                color: tool === 'eraser' ? '#ffffff' : color,
                width: tool === 'eraser' ? width * 2 : width,
                type: strokeType,
                createdAt: Date.now(),
                invisible: isInvisibleInk
            };
            onDrawStroke(stroke);
        }
        setCurrentPoints([]);
    };

    const [now, setNow] = useState(Date.now());
    useEffect(() => {
        const interval = setInterval(() => setNow(Date.now()), 1000);
        return () => clearInterval(interval);
    }, []);

    const visibleStrokes = strokes.filter(s => {
        if (s.invisible) {
            return now > s.createdAt + 3000;
        }
        return true;
    });

    const renderStroke = (stroke, idx) => {
        const type = stroke.type || 'pen';
        const points = stroke.points;
        if (points.length === 0) return null;

        const strokeColor = stroke.color;
        const strokeWidth = stroke.width;

        if (type === 'pen' || type === 'eraser') {
            const d = points.map((p, i) => `${i===0?'M':'L'} ${p.x} ${p.y}`).join(' ');
            return <path key={idx} d={d} stroke={strokeColor} strokeWidth={strokeWidth} fill="none" strokeLinecap="round" strokeLinejoin="round" />;
        } else if (type === 'rect') {
            const start = points[0];
            const end = points[points.length - 1];
            const x = Math.min(start.x, end.x);
            const y = Math.min(start.y, end.y);
            const w = Math.abs(end.x - start.x);
            const h = Math.abs(end.y - start.y);
            return <rect key={idx} x={x} y={y} width={w} height={h} stroke={strokeColor} strokeWidth={strokeWidth} fill="none" />;
        } else if (type === 'circle') {
            const start = points[0];
            const end = points[points.length - 1];
            const r = Math.sqrt(Math.pow(end.x - start.x, 2) + Math.pow(end.y - start.y, 2));
            return <circle key={idx} cx={start.x} cy={start.y} r={r} stroke={strokeColor} strokeWidth={strokeWidth} fill="none" />;
        }
        return null;
    };

    const renderPreview = () => {
        if (currentPoints.length === 0) return null;
        
        const strokeColor = tool === 'eraser' ? '#ffffff' : color; // White for eraser preview
        // Add outline for eraser if white on white?
        const strokeWidth = tool === 'eraser' ? width * 2 : width;
        
        if (tool === 'pen' || tool === 'eraser') {
             const d = currentPoints.map((p, i) => `${i===0?'M':'L'} ${p.x} ${p.y}`).join(' ');
             return <path d={d} stroke={strokeColor} strokeWidth={strokeWidth} fill="none" strokeLinecap="round" strokeLinejoin="round" opacity="0.6" />;
        } else if (tool === 'rect') {
            const start = currentPoints[0];
            const end = currentPoints[currentPoints.length - 1];
            const x = Math.min(start.x, end.x);
            const y = Math.min(start.y, end.y);
            const w = Math.abs(end.x - start.x);
            const h = Math.abs(end.y - start.y);
            return <rect x={x} y={y} width={w} height={h} stroke={strokeColor} strokeWidth={strokeWidth} fill="none" opacity="0.6" />;
        } else if (tool === 'circle') {
            const start = currentPoints[0];
            const end = currentPoints[currentPoints.length - 1];
            const r = Math.sqrt(Math.pow(end.x - start.x, 2) + Math.pow(end.y - start.y, 2));
            return <circle cx={start.x} cy={start.y} r={r} stroke={strokeColor} strokeWidth={strokeWidth} fill="none" opacity="0.6" />;
        }
    };

    const PALETTE = [
        '#000000', '#ffffff', '#7f7f7f', '#c3c3c3', 
        '#880015', '#b97a57', '#ed1c24', '#ffaec9',
        '#ff7f27', '#ffc90e', '#fff200', '#efe4b0',
        '#22b14c', '#b5e61d', '#00a2e8', '#99d9ea',
        '#3f48cc', '#7092be', '#a349a4', '#c8bfe7'
    ];

    return (
        <div className={`relative w-full h-full bg-white rounded-xl shadow-inner overflow-hidden border-4 border-slate-800 cursor-crosshair touch-none ${isEarthquake ? 'animate-shake' : ''}`}>
            <style>{`
                @keyframes shake {
                    0% { transform: translate(1px, 1px) rotate(0deg); }
                    20% { transform: translate(-3px, 0px) rotate(1deg); }
                    40% { transform: translate(1px, -1px) rotate(1deg); }
                    60% { transform: translate(-3px, 1px) rotate(0deg); }
                    80% { transform: translate(-1px, -1px) rotate(1deg); }
                    100% { transform: translate(1px, -2px) rotate(-1deg); }
                }
                .animate-shake { animation: shake 0.5s infinite; }
            `}</style>

            <div className="absolute inset-0" style={{ transform: shouldMirror ? 'scaleX(-1)' : 'none' }}>
                <svg className="w-full h-full" viewBox="0 0 800 600" preserveAspectRatio="xMidYMid meet">
                    {/* Background White */}
                    <rect x="0" y="0" width="800" height="600" fill="white" />
                    {visibleStrokes.map((s, i) => renderStroke(s, i))}
                    {isDrawing && renderPreview()}
                </svg>
            </div>

            {isCensored && (
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3/4 h-24 bg-black z-20 flex items-center justify-center text-white font-bold uppercase tracking-widest">
                    CENSURADO
                </div>
            )}

            <canvas
                ref={canvasRef}
                width={800}
                height={600}
                className="absolute inset-0 w-full h-full z-30 opacity-0"
                onPointerDown={startDrawing}
                onPointerMove={draw}
                onPointerUp={stopDrawing}
                onPointerLeave={stopDrawing}
            />

            {isDrawer && (
                <div className="absolute bottom-2 left-2 z-40 bg-slate-100 p-2 rounded-xl shadow-lg border border-slate-300 flex flex-col gap-2 w-64">
                    {/* Tools */}
                    <div className="flex justify-between gap-1 bg-white p-1 rounded-lg border border-slate-200">
                        <button onClick={() => setTool('pen')} className={`p-1 rounded ${tool === 'pen' ? 'bg-blue-100 text-blue-600' : 'text-slate-500 hover:bg-slate-50'}`} title="Pincel">
                            <div className="w-4 h-4 bg-current rounded-full" />
                        </button>
                        <button onClick={() => setTool('eraser')} className={`p-1 rounded ${tool === 'eraser' ? 'bg-blue-100 text-blue-600' : 'text-slate-500 hover:bg-slate-50'}`} title="Borracha">
                            <Eraser size={16} />
                        </button>
                        <button onClick={() => setTool('rect')} className={`p-1 rounded ${tool === 'rect' ? 'bg-blue-100 text-blue-600' : 'text-slate-500 hover:bg-slate-50'}`} title="Quadrado">
                            <Square size={16} />
                        </button>
                        <button onClick={() => setTool('circle')} className={`p-1 rounded ${tool === 'circle' ? 'bg-blue-100 text-blue-600' : 'text-slate-500 hover:bg-slate-50'}`} title="Círculo">
                            <Circle size={16} />
                        </button>
                        <div className="w-[1px] bg-slate-200 mx-1" />
                        <button onClick={onClearCanvas} className="text-xs font-bold text-red-500 px-2 hover:bg-red-50 rounded uppercase">
                            Limpar
                        </button>
                    </div>

                    {/* Thickness */}
                    <div className="flex items-center gap-2 px-1">
                        <div className="w-2 h-2 rounded-full bg-slate-400" />
                        <input 
                            type="range" 
                            min="1" 
                            max="20" 
                            value={width} 
                            onChange={(e) => setWidth(parseInt(e.target.value))}
                            className="w-full h-1 bg-slate-300 rounded-lg appearance-none cursor-pointer"
                        />
                        <div className="w-4 h-4 rounded-full bg-slate-400" />
                    </div>

                    {/* Colors */}
                    <div className="grid grid-cols-10 gap-1">
                        {PALETTE.map(c => (
                            <button
                                key={c}
                                className={`w-5 h-5 rounded border ${color === c ? 'border-black scale-110 shadow-sm z-10' : 'border-slate-300'}`}
                                style={{ backgroundColor: c }}
                                onClick={() => { setColor(c); setTool('pen'); }}
                            />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
