import React from 'react';
import { Card, Button } from '../UIComponents';
import { X } from 'lucide-react';

export default function AvatarSelector({ 
  showAvatarSelector, 
  setShowAvatarSelector, 
  avatarSeed, 
  setAvatarSeed, 
  user, 
  saveAvatarSeed 
}) {
  if (!showAvatarSelector) return null;

  const generateNewSeed = () => {
    const newSeed = Math.floor(Math.random() * 10000);
    setAvatarSeed(newSeed);
  };

  const handleSave = async () => {
    if (user?.uid) {
      await saveAvatarSeed(user.uid, avatarSeed);
      setShowAvatarSelector(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <Card className="max-w-md w-full p-6 relative bg-slate-800 border-2 border-slate-600 shadow-2xl">
        <button
          onClick={() => setShowAvatarSelector(false)}
          className="absolute top-4 right-4 text-slate-400 hover:text-red-400 transition-colors"
        >
          <X size={24} />
        </button>

        <h2 className="text-2xl font-bold mb-4 text-white">Selecionar Identidade</h2>

        <div className="flex justify-center mb-6">
          <div className="w-32 h-32 rounded-full border-4 border-cyan-500 overflow-hidden bg-slate-700 shadow-[0_0_20px_rgba(34,211,238,0.3)]">
            <img 
              src={`https://api.dicebear.com/7.x/notionists/svg?seed=${avatarSeed}`} 
              alt="avatar preview" 
            />
          </div>
        </div>

        <div className="space-y-4">
          <Button onClick={generateNewSeed} variant="secondary" className="w-full">
            Gerar Nova Identidade
          </Button>
          
          <div className="flex gap-2">
            <Button 
              onClick={handleSave} 
              className="flex-1"
            >
              Confirmar
            </Button>
            <Button 
              onClick={() => setShowAvatarSelector(false)} 
              variant="danger" 
              className="flex-1"
            >
              Cancelar
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
