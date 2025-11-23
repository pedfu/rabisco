import React, { useState, useEffect, useRef } from 'react';
import { auth, db } from './components/FirebaseConfig';
import { Button } from './components/UIComponents';
import { 
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth';
import { 
  doc, 
  setDoc, 
  getDoc, 
  serverTimestamp
} from 'firebase/firestore';
import { BrainCircuit, Share2, Users } from 'lucide-react';
import { socket } from './socket';

import { THEME } from './utils/constants';
import { saveEmailToLocalStorage, getSavedEmail, clearSavedEmail } from './utils/storage';

import AuthScreen from './components/auth/AuthScreen';
import LobbyMenu from './components/lobby/LobbyMenu';
import Lobby from './components/lobby/Lobby';
import Game from './components/game/Game';
import TutorialModal from './components/common/TutorialModal';
import AvatarSelector from './components/common/AvatarSelector';

export default function Rabisco() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authMode, setAuthMode] = useState("login");
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [registerPassword2, setRegisterPassword2] = useState("");
  const [registerUsername, setRegisterUsername] = useState("");
  const [authLoading, setAuthLoading] = useState(false);
  
  const [roomCode, setRoomCode] = useState("");
  const [nickname, setNickname] = useState("");
  const [avatarSeed, setAvatarSeed] = useState(Math.floor(Math.random() * 1000));
  const [isVip, setIsVip] = useState(false);
  
  const [gameState, setGameState] = useState(null);
  const [players, setPlayers] = useState([]);
  const [error, setError] = useState("");
  const [copySuccess, setCopySuccess] = useState(false);
  
  const [view, setView] = useState("LOADING");
  const [showTutorial, setShowTutorial] = useState(false);
  const [showAvatarSelector, setShowAvatarSelector] = useState(false);
  
  const hasAutoJoinedRef = useRef(false);

  // Carregar email salvo
  useEffect(() => {
    const savedEmail = getSavedEmail();
    if (savedEmail) {
      setLoginEmail(savedEmail);
    }
  }, []);

  // Ler roomCode da URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const urlRoomCode = params.get('roomCode');
    if (urlRoomCode) {
      setRoomCode(urlRoomCode.toUpperCase());
    }
  }, []);

  // Auth Init
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      if (u) {
        setUser(u);
        loadUserProfile(u.uid);
        setView("LOBBY_MENU");
      } else {
        setView("LOGIN");
      }
      setLoading(false);
    }, (error) => {
      console.error('Erro no estado de autenticação:', error);
      setError('Erro na configuração do Firebase.');
      setView("LOGIN");
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Configuração do Socket.IO
  useEffect(() => {
    socket.connect();

    socket.on('room_created', ({ roomCode }) => {
      setRoomCode(roomCode);
      updateURLWithRoomCode(roomCode);
      setView("LOBBY");
      setError("");
    });

    socket.on('joined_room', ({ roomCode }) => {
      setView("LOBBY");
      setError("");
    });

    socket.on('game_state', (state) => {
      setGameState(state);
      if (state.players) setPlayers(state.players);
    });
    
    socket.on('drawer_data', (data) => {
        // Update user state with private data
        setUser(prev => ({ ...prev, drawerData: data }));
    });

    socket.on('error', (data) => {
      setError(data.message);
    });

    return () => {
      socket.disconnect();
      socket.off('room_created');
      socket.off('joined_room');
      socket.off('game_state');
      socket.off('drawer_data');
      socket.off('error');
    };
  }, []);

  const updateURLWithRoomCode = (code) => {
    const url = new URL(window.location.href);
    if (code) {
      url.searchParams.set('roomCode', code);
    } else {
      url.searchParams.delete('roomCode');
    }
    window.history.pushState({}, '', url.toString());
  };

  const loadUserProfile = async (userId) => {
    try {
      const userDocRef = doc(db, 'users', userId);
      const userDoc = await getDoc(userDocRef);
      if (userDoc.exists()) {
        const data = userDoc.data();
        setNickname(data.username);
        if (data.avatarSeed !== undefined && data.avatarSeed !== null) {
          setAvatarSeed(data.avatarSeed);
        }
      }
    } catch (error) {
      console.error('[PERFIL] Erro ao carregar perfil:', error);
    }
  };

  const saveUserProfile = async (userId, username) => {
    try {
      const userDocRef = doc(db, 'users', userId);
      await setDoc(userDocRef, { 
        username, 
        avatarSeed: avatarSeed,
        createdAt: serverTimestamp() 
      }, { merge: true });
    } catch (error) {
      console.error('[PERFIL] Erro ao salvar perfil:', error);
      throw error;
    }
  };

  const saveAvatarSeed = async (userId, seed) => {
    try {
      const userDocRef = doc(db, 'users', userId);
      await setDoc(userDocRef, { 
        avatarSeed: seed,
        updatedAt: serverTimestamp() 
      }, { merge: true });
      setAvatarSeed(seed);
    } catch (error) {
      console.error('[PERFIL] Erro ao salvar avatarSeed:', error);
      throw error;
    }
  };

  const handleRegister = async () => {
    if (!registerEmail || !registerPassword || !registerPassword2 || !registerUsername) {
      setError("Preencha todos os campos.");
      return;
    }
    if (registerPassword !== registerPassword2) {
      setError("As senhas não conferem.");
      return;
    }
    if (registerPassword.length < 6) {
      setError("A senha deve ter no mínimo 6 caracteres.");
      return;
    }
    if (registerUsername.length < 3) {
      setError("O nome deve ter no mínimo 3 caracteres.");
      return;
    }

    setAuthLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, registerEmail, registerPassword);
      const newUser = userCredential.user;
      
      await saveUserProfile(newUser.uid, registerUsername.trim());
      
      setUser(newUser);
      setNickname(registerUsername.trim());
      saveEmailToLocalStorage(registerEmail);
      
      setView("LOBBY_MENU");
      setError("");
    } catch (error) {
      console.error('[REGISTRO] Erro:', error);
      if (error.code === 'auth/email-already-in-use') {
        setError("Este email já está registrado.");
      } else {
        setError("Erro ao registrar: " + error.message);
      }
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogin = async () => {
    if (!loginEmail || !loginPassword) {
      setError("Preencha email e senha.");
      return;
    }

    setAuthLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, loginEmail, loginPassword);
      setUser(userCredential.user);
      
      await loadUserProfile(userCredential.user.uid);
      saveEmailToLocalStorage(loginEmail);
      
      setView("LOBBY_MENU");
      setError("");
    } catch (error) {
      console.error('[LOGIN] Erro:', error);
      if (error.code === 'auth/user-not-found') {
        setError("Email não registrado.");
      } else if (error.code === 'auth/wrong-password') {
        setError("Senha incorreta.");
      } else {
        setError("Erro ao fazer login: " + error.message);
      }
    } finally {
      setAuthLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setAuthLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(auth, provider);
      setUser(userCredential.user);
      
      saveEmailToLocalStorage(userCredential.user.email);
      await loadUserProfile(userCredential.user.uid);
      
      setView("LOBBY_MENU");
      setError("");
    } catch (error) {
      console.error('[GOOGLE LOGIN] Erro:', error);
      if (error.code !== 'auth/popup-closed-by-user') {
        setError("Erro ao fazer login com Google: " + error.message);
      }
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      clearSavedEmail();
      
      setUser(null);
      setView("LOGIN");
      setNickname("");
      setRoomCode("");
      setGameState(null);
      setPlayers([]);
      setError("");
    } catch (error) {
      console.error('[LOGOUT] Erro:', error);
      setError("Erro ao desconectar: " + error.message);
    }
  };

  const createRoom = async () => {
    if (!nickname || !nickname.trim()) return setError("Escolha um apelido.");
    if (!user || !user.uid) return setError("Erro de autenticação.");
    
    socket.emit('create_room', {
        hostId: user.uid,
        nickname: nickname.trim(),
        avatar: avatarSeed,
        isVip
    });
  };

  const joinRoom = async () => {
    if (!nickname || !nickname.trim()) return setError("Escolha um apelido.");
    if (!roomCode) return setError("Insira o código da sala.");
    if (!user || !user.uid) return setError("Erro de autenticação.");
    
    socket.emit('join_room', {
        roomCode: roomCode.toUpperCase(),
        userId: user.uid,
        nickname: nickname.trim(),
        avatar: avatarSeed,
        isVip
    });
  };

  const leaveGame = async () => {
    if (!user?.uid || !roomCode) return;
    
    socket.emit('leave_room', { roomCode, userId: user.uid });

    updateURLWithRoomCode(null);
    hasAutoJoinedRef.current = false;
    setView("LOBBY_MENU");
    setRoomCode("");
    setGameState(null);
    setPlayers([]);
    setError("");
  };

  const copyRoomLink = async () => {
    const link = `${window.location.origin}${window.location.pathname}?roomCode=${roomCode}`;
    try {
      await navigator.clipboard.writeText(link);
      setCopySuccess(true);
      setTimeout(() => {
        setCopySuccess(false);
      }, 2000);
    } catch (err) {
      setError("Erro ao copiar link.");
    }
  };

  const startGame = async (maxScore) => {
    if (players.length < 2) return setError("Mínimo de 2 jogadores."); 
    socket.emit('start_game', { roomCode, maxScore });
  };


  // --- VIEW RENDERERS ---

  if (loading || view === "LOADING") {
    return <div className="h-screen flex items-center justify-center animate-pulse text-xl font-bold">Carregando...</div>;
  }

  if (view === "LOGIN") {
    return (
        <AuthScreen 
            authMode={authMode}
            setAuthMode={setAuthMode}
            loginEmail={loginEmail}
            setLoginEmail={setLoginEmail}
            loginPassword={loginPassword}
            setLoginPassword={setLoginPassword}
            registerEmail={registerEmail}
            setRegisterEmail={setRegisterEmail}
            registerPassword={registerPassword}
            setRegisterPassword={setRegisterPassword}
            registerPassword2={registerPassword2}
            setRegisterPassword2={setRegisterPassword2}
            registerUsername={registerUsername}
            setRegisterUsername={setRegisterUsername}
            authLoading={authLoading}
            handleLogin={handleLogin}
            handleRegister={handleRegister}
            handleGoogleLogin={handleGoogleLogin}
            error={error}
            showTutorial={showTutorial}
            setShowTutorial={setShowTutorial}
        />
    );
  }

  if (view === "LOBBY_MENU") {
    return (
        <LobbyMenu 
            THEME={THEME}
            nickname={nickname}
            setNickname={setNickname}
            user={user}
            avatarSeed={avatarSeed}
            setAvatarSeed={setAvatarSeed}
            isVip={isVip}
            setIsVip={setIsVip}
            showAvatarSelector={showAvatarSelector}
            setShowAvatarSelector={setShowAvatarSelector}
            saveUserProfile={saveUserProfile}
            createRoom={createRoom}
            roomCode={roomCode}
            setRoomCode={setRoomCode}
            joinRoom={joinRoom}
            error={error}
            handleLogout={handleLogout}
            showTutorial={showTutorial}
            setShowTutorial={setShowTutorial}
            saveAvatarSeed={saveAvatarSeed}
        />
    );
  }

  if (!gameState) return (
    <div className="h-screen flex items-center justify-center animate-pulse text-slate-900">
      <div className="text-center">
        <BrainCircuit size={48} className="mx-auto mb-4 animate-bounce text-fuchsia-500" />
        <p className="text-xl font-bold">Conectando ao Rabisco...</p>
      </div>
    </div>
  );

  return (
    <div className={`min-h-screen bg-slate-100 ${THEME.text} ${THEME.fontParams} flex flex-col transition-colors duration-1000 relative overflow-hidden`}>
        {gameState.status === 'LOBBY' ? (
             <Lobby 
                gameState={gameState}
                players={players}
                user={user}
                copyRoomLink={copyRoomLink}
                copySuccess={copySuccess}
                startGame={startGame}
            />
        ) : (
             <Game 
                gameState={gameState}
                user={user}
                roomCode={roomCode}
             />
        )}

      {/* Modais */}
      <TutorialModal showTutorial={showTutorial} setShowTutorial={setShowTutorial} />
      <AvatarSelector 
        showAvatarSelector={showAvatarSelector} 
        setShowAvatarSelector={setShowAvatarSelector}
        avatarSeed={avatarSeed}
        setAvatarSeed={setAvatarSeed}
        user={user}
        saveAvatarSeed={saveAvatarSeed}
      />
    </div>
  );
}
