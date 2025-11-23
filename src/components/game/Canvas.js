import React, { useRef, useState, useEffect, useLayoutEffect } from 'react';
import { Eraser, Square, Circle, PaintBucket } from 'lucide-react';

// Helper: Hex to RGB
const hexToRgb = (hex) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
        a: 255
    } : { r: 0, g: 0, b: 0, a: 255 };
};

// Flood Fill Algorithm (Stack-based scanline for performance)
const floodFill = (ctx, startX, startY, fillColor) => {
    const canvas = ctx.canvas;
    const w = canvas.width;
    const h = canvas.height;
    
    // Bounds check
    if(startX < 0 || startY < 0 || startX >= w || startY >= h) return;

    const imageData = ctx.getImageData(0, 0, w, h);
    const data = imageData.data;
    
    const targetColor = hexToRgb(fillColor);
    
    // Get start color
    const startPos = (startY * w + startX) * 4;
    const startR = data[startPos];
    const startG = data[startPos+1];
    const startB = data[startPos+2];
    const startA = data[startPos+3];
    
    // If color is already same, return
    if (startR === targetColor.r && startG === targetColor.g && 
        startB === targetColor.b && startA === targetColor.a) return;

    // Match function
    const matches = (pos) => {
        return data[pos] === startR && 
               data[pos+1] === startG && 
               data[pos+2] === startB && 
               data[pos+3] === startA;
    };
    
    const colorPixel = (pos) => {
        data[pos] = targetColor.r;
        data[pos+1] = targetColor.g;
        data[pos+2] = targetColor.b;
        data[pos+3] = targetColor.a;
    };

    const stack = [[startX, startY]];
    
    while (stack.length) {
        const [x, y] = stack.pop();
        let pixelPos = (y * w + x) * 4;
        
        // Move up to find top boundary
        let y1 = y;
        while (y1 >= 0 && matches(pixelPos)) {
            y1--;
            pixelPos -= w * 4;
        }
        y1++;
        pixelPos += w * 4; // Step back to valid pixel
        
        let spanLeft = false;
        let spanRight = false;
        
        while (y1 < h && matches(pixelPos)) {
            colorPixel(pixelPos);
            
            if (x > 0) {
                if (matches(pixelPos - 4)) {
                    if (!spanLeft) {
                        stack.push([x - 1, y1]);
                        spanLeft = true;
                    }
                } else if (spanLeft) {
                    spanLeft = false;
                }
            }
            
            if (x < w - 1) {
                if (matches(pixelPos + 4)) {
                    if (!spanRight) {
                        stack.push([x + 1, y1]);
                        spanRight = true;
                    }
                } else if (spanRight) {
                    spanRight = false;
                }
            }
            
            y1++;
            pixelPos += w * 4;
        }
    }
    
    ctx.putImageData(imageData, 0, 0);
};

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
    const [tool, setTool] = useState('pen'); // pen, eraser, rect, circle, fill
    const [now, setNow] = useState(Date.now());

    // Sabotage Effects
    const isEarthquake = Object.values(sabotagesActive).some(s => s.type === 'earthquake' && s.targetId === myId);
    const isMirror = Object.values(sabotagesActive).some(s => s.type === 'mirror' && (s.targetId === myId || (!isDrawer && s.targetId === 'all_guessers'))); 
    const shouldMirror = !isDrawer && Object.values(sabotagesActive).some(s => s.type === 'mirror');
    const isCensored = Object.values(sabotagesActive).some(s => s.type === 'censorship');
    const isInvisibleInk = Object.values(sabotagesActive).some(s => s.type === 'invisible_ink' && s.targetId === myId);

    // Refresh for invisible ink reveal
    useEffect(() => {
        const interval = setInterval(() => setNow(Date.now()), 1000);
        return () => clearInterval(interval);
    }, []);

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

    const drawStroke = (ctx, stroke) => {
        const { points, color, width, type, x, y } = stroke;
        
        if (type === 'fill') {
            floodFill(ctx, Math.floor(x), Math.floor(y), color);
            return;
        }

        if (!points || points.length === 0) return;

        ctx.beginPath();
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.strokeStyle = color;
        ctx.lineWidth = width;

        if (type === 'pen' || type === 'eraser') {
            if (points.length === 1) {
                // Dot
                ctx.fillStyle = color;
                ctx.beginPath();
                ctx.arc(points[0].x, points[0].y, width / 2, 0, Math.PI * 2);
                ctx.fill();
            } else {
                ctx.beginPath();
                ctx.moveTo(points[0].x, points[0].y);
                for (let i = 1; i < points.length; i++) {
                    ctx.lineTo(points[i].x, points[i].y);
                }
                ctx.stroke();
            }
        } else if (type === 'rect') {
            const start = points[0];
            const end = points[points.length - 1];
            const w = end.x - start.x;
            const h = end.y - start.y;
            ctx.strokeRect(start.x, start.y, w, h);
        } else if (type === 'circle') {
            const start = points[0];
            const end = points[points.length - 1];
            const r = Math.sqrt(Math.pow(end.x - start.x, 2) + Math.pow(end.y - start.y, 2));
            ctx.beginPath();
            ctx.arc(start.x, start.y, r, 0, Math.PI * 2);
            ctx.stroke();
        }
    };

    // Main Draw Loop
    useLayoutEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        
        // Clear
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Background White
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Draw saved strokes
        strokes.forEach(stroke => {
            // Check visibility (Invisible Ink)
            if (stroke.invisible && now < stroke.createdAt + 3000) {
                return;
            }
            drawStroke(ctx, stroke);
        });

        // Draw preview
        if (currentPoints.length > 0) {
            const previewStroke = {
                points: currentPoints,
                color: tool === 'eraser' ? '#ffffff' : color,
                width: tool === 'eraser' ? width * 2 : width,
                type: tool
            };
            
            // For preview, we might want opacity or different style, but direct draw is fine
            // Save context to apply opacity only to preview if desired
            ctx.save();
            if (tool !== 'eraser') ctx.globalAlpha = 0.6;
            drawStroke(ctx, previewStroke);
            ctx.restore();
        }

    }, [strokes, currentPoints, now]); // Re-render when these change

    const startDrawing = (e) => {
        if (!isDrawer) return;
        e.preventDefault();
        
        const point = getCoords(e);
        
        if (tool === 'fill') {
            // Instant action
            const stroke = {
                type: 'fill',
                x: point.x,
                y: point.y,
                color: color,
                createdAt: Date.now(),
                invisible: isInvisibleInk
            };
            onDrawStroke(stroke);
            return;
        }

        setIsDrawing(true);
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
        
        if (currentPoints.length > 0) {
            let finalPoints = currentPoints;
            let strokeType = tool;
            
            if (tool === 'rect' || tool === 'circle') {
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

    // Key handlers
    useEffect(() => {
        if (!isDrawer) return;
        const handleKeyDown = (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
                e.preventDefault();
                onDrawStroke(null, 'undo');
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isDrawer, onDrawStroke]);

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
                <canvas
                    ref={canvasRef}
                    width={800}
                    height={600}
                    className="w-full h-full"
                    onPointerDown={startDrawing}
                    onPointerMove={draw}
                    onPointerUp={stopDrawing}
                    onPointerLeave={stopDrawing}
                />
            </div>

            {isCensored && (
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3/4 h-24 bg-black z-20 flex items-center justify-center text-white font-bold uppercase tracking-widest">
                    CENSURADO
                </div>
            )}

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
                        <button onClick={() => setTool('fill')} className={`p-1 rounded ${tool === 'fill' ? 'bg-blue-100 text-blue-600' : 'text-slate-500 hover:bg-slate-50'}`} title="Balde de Tinta">
                            <PaintBucket size={16} />
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
                                onClick={() => { setColor(c); if(tool === 'eraser') setTool('pen'); }}
                            />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
