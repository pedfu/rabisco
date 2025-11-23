import React from 'react';
import { Card, Button } from '../UIComponents';
import { X, Radio, Target, Zap, Activity } from 'lucide-react';

export default function TutorialModal({ showTutorial, setShowTutorial }) {
  if (!showTutorial) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <Card className="max-w-3xl w-full p-6 relative max-h-[90vh] overflow-y-auto bg-slate-900 border-4 border-cyan-600 text-white shadow-2xl shadow-cyan-900/50">
        <button
          onClick={() => setShowTutorial(false)}
          className="absolute top-4 right-4 text-slate-400 hover:text-red-400 transition-colors"
        >
          <X size={32} />
        </button>

        <div className="flex items-center gap-3 mb-8 border-b-2 border-slate-700 pb-4">
          <div className="bg-slate-800 p-3 rounded-full border border-cyan-500">
            <Radio size={32} className="text-cyan-400" />
          </div>
          <div>
            <h2 className="text-3xl font-black text-white">Como Jogar SyncMind</h2>
            <p className="text-cyan-400">Sintonize na mente do Mestre</p>
          </div>
        </div>

        <div className="space-y-8 text-slate-200">
          {/* Seção 1: O Básico */}
          <section className="bg-slate-800 p-4 rounded-lg border border-slate-700">
            <h3 className="text-xl font-bold mb-3 flex items-center gap-2 text-cyan-400">
              <Activity size={24} />
              Objetivo da Sintonização
            </h3>
            <p className="mb-2">
              O objetivo é ler a mente do Mestre e adivinhar onde o alvo secreto está localizado no espectro.
            </p>
            <p>
              O Mestre dará uma dica baseada em dois conceitos opostos (ex: Quente / Frio).
            </p>
          </section>

          {/* Seção 2: O Espectro */}
          <section>
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-cyan-400">
              <Target size={24} />
              A Mecânica do Espectro
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border-2 border-cyan-900 bg-slate-800 p-4 rounded-lg flex gap-4 items-start">
                <div className="w-12 h-12 bg-cyan-900 rounded-full flex-shrink-0 flex items-center justify-center text-cyan-400 font-bold shadow-lg border-2 border-cyan-500">1</div>
                <div>
                  <h4 className="font-bold text-cyan-400">O Alvo Secreto</h4>
                  <p className="text-sm text-slate-400">Apenas o Mestre vê onde está o alvo na roleta (uma fatia colorida).</p>
                </div>
              </div>

              <div className="border-2 border-purple-900 bg-slate-800 p-4 rounded-lg flex gap-4 items-start">
                <div className="w-12 h-12 bg-purple-900 rounded-full flex-shrink-0 flex items-center justify-center text-purple-400 font-bold shadow-lg border-2 border-purple-500">2</div>
                <div>
                  <h4 className="font-bold text-purple-400">A Dica</h4>
                  <p className="text-sm text-slate-400">Se o alvo estiver muito à esquerda ("Frio"), o Mestre pode dizer "Antártida". Se estiver no meio, "Primavera".</p>
                </div>
              </div>
            </div>
          </section>

          {/* Seção 3: Pontuação */}
          <section className="bg-slate-800 p-4 rounded-lg border border-slate-700">
            <h3 className="text-xl font-bold mb-3 flex items-center gap-2 text-cyan-400">
              <Zap size={24} />
              Pontuação
            </h3>
            <ul className="space-y-2 list-disc pl-5 marker:text-cyan-500">
              <li><span className="text-white font-bold">4 Pontos:</span> Acerto exato (Centro do alvo)</li>
              <li><span className="text-white font-bold">3 Pontos:</span> Quase lá</li>
              <li><span className="text-white font-bold">2 Pontos:</span> Perto</li>
              <li><span className="text-slate-400 italic">Modo Equipe:</span> Se a equipe acertar no centro (4 pts), joga novamente!</li>
            </ul>
          </section>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-700">
          <Button onClick={() => setShowTutorial(false)} className="w-full text-lg py-4 shadow-lg hover:scale-[1.02] transition-transform bg-cyan-600 hover:bg-cyan-500 text-white border-none">
            Entendi! Sintonizar
          </Button>
        </div>
      </Card>
    </div>
  );
}
