import React from 'react';
import { X, PenTool, Eye, Zap, Trophy, MessageSquare } from 'lucide-react';

export default function TutorialModal({ showTutorial, setShowTutorial }) {
  if (!showTutorial) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 font-['Patrick_Hand'] text-xl">
      <div className="max-w-3xl w-full p-6 relative max-h-[90vh] overflow-y-auto bg-white border-4 border-black text-slate-800 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] rounded-xl box-sketch">
        <button
          onClick={() => setShowTutorial(false)}
          className="absolute top-4 right-4 text-slate-400 hover:text-red-500 transition-colors transform hover:rotate-90 hover:scale-110"
        >
          <X size={32} strokeWidth={3} />
        </button>

        <div className="flex items-center gap-4 mb-6 border-b-4 border-black border-dashed pb-4 transform -rotate-1">
          <div className="bg-black p-3 rounded-full border-4 border-black shadow-sm transform rotate-3">
            <PenTool size={32} className="text-white" />
          </div>
          <div>
            <h2 className="text-4xl font-black text-black tracking-tighter uppercase">Como Jogar Rabisco</h2>
            <p className="text-slate-500 font-bold text-lg">Desenhe, Sabote e Adivinhe!</p>
          </div>
        </div>

        <div className="space-y-6">
          {/* Section 1: Drawing & Guessing */}
          <section className="bg-yellow-50 p-4 rounded-xl border-2 border-black transform rotate-1 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
            <h3 className="text-2xl font-black mb-3 flex items-center gap-2 text-black uppercase">
              <Eye size={24} />
              Desenhar & Adivinhar
            </h3>
            <p className="mb-2 font-bold text-slate-700">
              A cada rodada, um jogador é o <span className="text-black bg-yellow-300 px-1 transform -rotate-2 inline-block border border-black">Desenhista</span>.
            </p>
            <ul className="space-y-2 list-none pl-2">
              <li className="flex gap-2">
                <span className="font-black text-black">•</span>
                <span>O desenhista escolhe uma palavra e deve desenhá-la no quadro.</span>
              </li>
              <li className="flex gap-2">
                <span className="font-black text-black">•</span>
                <span>Os outros jogadores devem digitar no chat para tentar adivinhar a palavra.</span>
              </li>
              <li className="flex gap-2">
                <span className="font-black text-black">•</span>
                <span>Quem adivinha ganha pontos! O desenhista ganha pontos se alguém acertar.</span>
              </li>
            </ul>
          </section>

          {/* Section 2: Sabotages */}
          <section className="bg-white p-4 rounded-xl border-2 border-black transform -rotate-1 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
            <h3 className="text-2xl font-black mb-3 flex items-center gap-2 text-black uppercase">
              <Zap size={24} />
              Loja de Sabotagem
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
               <div className="flex items-start gap-3">
                  <div className="bg-slate-900 text-white p-2 rounded border-2 border-black transform rotate-2">
                      <span className="text-xs font-black">$$$</span>
                  </div>
                  <div>
                      <h4 className="font-bold text-black text-lg leading-none">Ganhe Moedas</h4>
                      <p className="text-sm text-slate-600 font-bold">Acertar ou desenhar bem rende moedas.</p>
                  </div>
               </div>
               <div className="flex items-start gap-3">
                  <div className="bg-red-500 text-white p-2 rounded border-2 border-black transform -rotate-2">
                      <Zap size={16} fill="currentColor"/>
                  </div>
                  <div>
                      <h4 className="font-bold text-black text-lg leading-none">Compre Caos</h4>
                      <p className="text-sm text-slate-600 font-bold">Use moedas para comprar itens: Tinta Invisível, Terremoto, Espelho...</p>
                  </div>
               </div>
            </div>
            <p className="mt-4 text-sm font-bold text-slate-500 italic text-center border-t-2 border-dashed border-slate-300 pt-2">
                Use sabotagens para atrapalhar o desenhista ou confundir os outros adivinhadores!
            </p>
          </section>

          {/* Section 3: Points */}
          <section className="bg-slate-100 p-4 rounded-xl border-2 border-black transform rotate-1 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
            <h3 className="text-2xl font-black mb-3 flex items-center gap-2 text-black uppercase">
              <Trophy size={24} />
              Vencendo o Jogo
            </h3>
            <ul className="space-y-2 list-none pl-2 font-bold text-slate-700">
              <li className="flex items-center gap-2">
                <span className="bg-green-500 text-white text-xs px-2 py-0.5 rounded border border-black transform -rotate-3">Rápido!</span>
                <span>Quem acerta primeiro ganha mais pontos (10, 9, 8...).</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="bg-yellow-400 text-black text-xs px-2 py-0.5 rounded border border-black transform rotate-2">Dicas</span>
                <span>O desenhista pode dar dicas, mas perde pontos por isso.</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="bg-black text-white text-xs px-2 py-0.5 rounded border border-black">Fim</span>
                <span>O jogo acaba quando alguém atinge a pontuação máxima ou após X rodadas.</span>
              </li>
            </ul>
          </section>
        </div>

        <div className="mt-8 pt-6 border-t-4 border-black border-dashed text-center">
          <button 
            onClick={() => setShowTutorial(false)} 
            className="px-8 py-3 text-2xl font-black bg-black text-white rounded-xl btn-sketch hover:bg-slate-800 hover:text-yellow-300 transform hover:-rotate-1 transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
          >
            VAMOS RABISCAR!
          </button>
        </div>
      </div>
    </div>
  );
}
