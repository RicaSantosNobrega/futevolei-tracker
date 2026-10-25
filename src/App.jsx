import React, { useState, useEffect } from 'react';
import { 
  Dumbbell, Trophy, Calendar, User, Users, Building2, Flame, Shield, 
  CheckCircle2, Play, RefreshCw, Sun, Moon, Share2, Calculator, 
  Award, Sparkles, ChevronRight, Volume2, ArrowUpRight
} from 'lucide-react';

export default function App() {
  const [profile, setProfile] = useState('aluno'); // 'aluno', 'professor', 'arena'
  const [outdoorMode, setOutdoorMode] = useState(false);
  const [level, setLevel] = useState('intermediario'); // 'iniciante', 'intermediario', 'avancado'
  const [selectedDay, setSelectedDay] = useState('segunda');
  const [activeWorkout, setActiveWorkout] = useState(null);
  const [workoutTime, setWorkoutTime] = useState(0);
  const [restTimer, setRestTimer] = useState(0);
  const [isResting, setIsResting] = useState(false);
  const [completedSets, setCompletedSets] = useState({});
  const [rpeScore, setRpeScore] = useState(7);
  const [workoutNotes, setWorkoutNotes] = useState('');
  const [showShareCard, setShowShareCard] = useState(false);
  const [lastSummary, setLastSummary] = useState(null);

  // Timer de Treino
  useEffect(() => {
    let timer;
    if (activeWorkout && !isResting) {
      timer = setInterval(() => setWorkoutTime(prev => prev + 1), 1000);
    }
    return () => clearInterval(timer);
  }, [activeWorkout, isResting]);

  // Timer de Descanso
  useEffect(() => {
    let timer;
    if (isResting && restTimer > 0) {
      timer = setInterval(() => setRestTimer(prev => prev - 1), 1000);
    } else if (restTimer === 0 && isResting) {
      setIsResting(false);
    }
    return () => clearInterval(timer);
  }, [isResting, restTimer]);

  const toggleSet = (exId, setIdx) => {
    const key = `${exId}-${setIdx}`;
    setCompletedSets(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const startRest = (seconds) => {
    setRestTimer(seconds);
    setIsResting(true);
  };

  const finishWorkout = () => {
    const totalMin = Math.floor(workoutTime / 60);
    let recommendation = "Manter carga atual e focar na técnica.";
    if (rpeScore <= 6) recommendation = "Intensidade Leve/Moderada. Sugestão: Aumentar +2kg na próxima semana.";
    if (rpeScore >= 9) recommendation = "Carga Máxima/Fadiga Alta! Recomendado 24h de recuperação para treino na areia.";

    const summary = {
      title: activeWorkout.title,
      duration: totalMin || 1,
      rpe: rpeScore,
      recommendation,
      date: new Date().toLocaleDateString('pt-BR')
    };

    setLastSummary(summary);
    setActiveWorkout(null);
    setShowShareCard(true);
  };

  return (
    <div className={`min-h-screen transition-colors duration-200 ${
      outdoorMode 
        ? 'bg-amber-100 text-slate-900 font-bold' 
        : 'bg-slate-950 text-slate-100'
    }`}>
      
      {/* CABEÇALHO COM A LOGOMARCA OFICIAL: ARENA PONTO COM (OPÇÃO 2) */}
      <header className={`border-b px-4 py-3 sticky top-0 z-50 backdrop-blur-md ${
        outdoorMode ? 'bg-amber-200/90 border-amber-300' : 'bg-slate-900/90 border-slate-800'
      }`}>
        <div className="max-w-md mx-auto flex items-center justify-between">
          
          {/* LOGO OPÇÃO 2 (LETRA A + REDE + PONTO AMARELO) */}
          <div className="flex items-center space-x-2">
            <div className="relative w-9 h-9 bg-gradient-to-br from-amber-400 to-amber-600 rounded-xl flex items-center justify-center shadow-lg shadow-amber-500/20">
              <span className="text-slate-950 font-black text-xl italic tracking-tighter">A</span>
              <div className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-amber-300 border-2 border-slate-950 rounded-full animate-pulse" />
            </div>
            <div>
              <h1 className="font-black text-lg tracking-wider leading-none bg-gradient-to-r from-amber-400 via-amber-200 to-yellow-400 bg-clip-text text-transparent">
                ARENA<span className="text-amber-500">.COM</span>
              </h1>
              <p className="text-[10px] text-amber-400/80 font-medium tracking-widest uppercase">
                Futevôlei Ecosystem
              </p>
            </div>
          </div>

          {/* ALTERNADOR DE MODO OUTDOOR (SOL/AREIA) */}
          <button 
            onClick={() => setOutdoorMode(!outdoorMode)}
            className={`p-2 rounded-xl border transition-all ${
              outdoorMode 
                ? 'bg-amber-400 text-slate-950 border-amber-500 font-bold' 
                : 'bg-slate-800/80 text-amber-400 border-slate-700 hover:bg-slate-700'
            }`}
            title="Modo Sol / Alta Visibilidade"
          >
            {outdoorMode ? <Sun className="w-5 h-5 fill-slate-950" /> : <Sun className="w-5 h-5" />}
          </button>
        </div>

        {/* SELETOR TRILATERAL DE PERFIL (ALUNO | PROFESSOR | ARENA) */}
        <div className="max-w-md mx-auto mt-3 grid grid-cols-3 gap-1 p-1 bg-slate-900/80 rounded-xl border border-slate-800">
          <button
            onClick={() => setProfile('aluno')}
            className={`py-1.5 px-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center space-x-1 ${
              profile === 'aluno' ? 'bg-amber-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>Atleta</span>
          </button>

          <button
            onClick={() => setProfile('professor')}
            className={`py-1.5 px-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center space-x-1 ${
              profile === 'professor' ? 'bg-amber-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Professor</span>
          </button>

          <button
            onClick={() => setProfile('arena')}
            className={`py-1.5 px-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center space-x-1 ${
              profile === 'arena' ? 'bg-amber-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>Arena</span>
          </button>
        </div>
      </header>

      {/* CONTEÚDO PRINCIPAL DO APLICATIVO */}
      <main className="max-w-md mx-auto p-4 space-y-6 pb-24">
        
        {/* VISÃO DO ATLETA / ALUNO */}
        {profile === 'aluno' && (
          <div className="space-y-4">
            
            {/* SELETOR DE NÍVEL */}
            <div className="flex justify-between items-center bg-slate-900/50 p-3 rounded-2xl border border-slate-800">
              <span className="text-xs text-slate-400 font-medium">Nível Técnico:</span>
              <div className="flex space-x-1">
                {['iniciante', 'intermediario', 'avancado'].map((lvl) => (
                  <button
                    key={lvl}
                    onClick={() => setLevel(lvl)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold capitalize transition-all ${
                      level === lvl 
                        ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' 
                        : 'text-slate-500 hover:text-slate-300'
                    }`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            </div>

            {/* CARD DE INÍCIO RÁPIDO DE TREINO */}
            <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-amber-950/40 p-5 rounded-3xl border border-amber-500/20 shadow-xl relative overflow-hidden">
              <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-amber-500/10 rounded-full blur-xl" />
              <div className="flex items-center space-x-2 text-amber-400 text-xs font-bold tracking-wider uppercase mb-1">
                <Sparkles className="w-4 h-4" />
                <span>Treino Recomendado Hoje</span>
              </div>
              <h2 className="text-xl font-extrabold text-white mb-2">Dia A: Potência & Salto Vertical</h2>
              <p className="text-xs text-slate-400 mb-4 leading-relaxed">
                45 min • Pliometria em caixa + Agachamento Búlgaro + Estabilidade de Tornozelo na areia.
              </p>
              
              <button
                onClick={() => setActiveWorkout({ title: "Dia A: Potência & Salto Vertical" })}
                className="w-full bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-slate-950 font-black py-3 px-4 rounded-2xl flex items-center justify-center space-x-2 shadow-lg shadow-amber-500/20 transition-all active:scale-[0.98]"
              >
                <Play className="w-5 h-5 fill-slate-950" />
                <span>INICIAR TREINO DE HOJE</span>
              </button>
            </div>

            {/* RANKING RÁPIDO DA ARENA */}
            <div className="bg-slate-900/60 p-4 rounded-2xl border border-slate-800 space-y-3">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <Trophy className="w-4 h-4 text-amber-400" />
                  <h3 className="text-sm font-bold text-white">Ranking Rei da Praia (Semanal)</h3>
                </div>
                <span className="text-[10px] bg-amber-500/10 text-amber-400 px-2 py-0.5 rounded-full border border-amber-500/20">
                  Arena Central
                </span>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between items-center p-2 bg-amber-500/10 rounded-xl border border-amber-500/20">
                  <span className="font-bold text-amber-300">1º Lucas & Gabriel</span>
                  <span className="font-black text-amber-400">1.240 pts</span>
                </div>
                <div className="flex justify-between items-center p-2 bg-slate-800/40 rounded-xl">
                  <span className="text-slate-300">2º Mateus & Rodrigo</span>
                  <span className="font-bold text-slate-400">980 pts</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* VISÃO DO PROFESSOR */}
        {profile === 'professor' && (
          <div className="space-y-4">
            <div className="bg-slate-900/80 p-5 rounded-3xl border border-slate-800">
              <h2 className="text-base font-bold text-white mb-1">Matriz Curricular Semanal</h2>
              <p className="text-xs text-slate-400 mb-4">Estruturação de aulas dividida por fases e níveis.</p>
              
              <div className="space-y-3">
                <div className="p-3 bg-slate-800/50 rounded-2xl border border-slate-700/50">
                  <span className="text-[10px] text-amber-400 font-bold uppercase">Fase 1: Aquecimento</span>
                  <h4 className="text-xs font-bold text-white mt-0.5">Pliometria na areia com escadinha</h4>
                </div>
                <div className="p-3 bg-slate-800/50 rounded-2xl border border-slate-700/50">
                  <span className="text-[10px] text-amber-400 font-bold uppercase">Fase 2: Técnico / Fundamento</span>
                  <h4 className="text-xs font-bold text-white mt-0.5">Pinga na diagonal + Ajuste de peito</h4>
                </div>
              </div>

              <button className="w-full mt-4 bg-slate-800 hover:bg-slate-700 text-amber-400 text-xs font-bold py-2.5 rounded-xl border border-slate-700 flex items-center justify-center space-x-2">
                <Share2 className="w-4 h-4" />
                <span>PUBLICAR AULA PARA AS TURMAS</span>
              </button>
            </div>
          </div>
        )}

        {/* VISÃO DA ARENA */}
        {profile === 'arena' && (
          <div className="space-y-4">
            <div className="bg-slate-900/80 p-5 rounded-3xl border border-slate-800">
              <h2 className="text-base font-bold text-white mb-3">Gestão de Quadras em Tempo Real</h2>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl">
                  <span className="text-[10px] text-emerald-400 font-bold">QUADRA 1</span>
                  <p className="font-bold text-white mt-1">Turma Intermediária</p>
                  <p className="text-[10px] text-emerald-300/80">Prof. Bruno • 8/8 Alunos</p>
                </div>
                <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-2xl">
                  <span className="text-[10px] text-amber-400 font-bold">QUADRA 2</span>
                  <p className="font-bold text-white mt-1">Alugada (Day Use)</p>
                  <p className="text-[10px] text-amber-300/80">Livre em 25 min</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* MODAL DE CARD SOCIAL PARA COMPARTILHAR TREINO NO INSTAGRAM/WHATSAPP */}
      {showShareCard && lastSummary && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div className="bg-gradient-to-b from-slate-900 to-amber-950 p-6 rounded-3xl border border-amber-500/30 max-w-sm w-full space-y-4 text-center shadow-2xl">
            <div className="w-12 h-12 bg-amber-500/20 text-amber-400 rounded-full flex items-center justify-center mx-auto border border-amber-500/30">
              <Award className="w-6 h-6" />
            </div>
            
            <div>
              <span className="text-[10px] text-amber-400 font-bold tracking-widest uppercase">Treino Concluído</span>
              <h3 className="text-lg font-black text-white">{lastSummary.title}</h3>
              <p className="text-xs text-slate-400 mt-1">{lastSummary.date} • {lastSummary.duration} minutos</p>
            </div>

            <div className="p-3 bg-slate-950/60 rounded-2xl border border-slate-800 text-left text-xs space-y-1">
              <span className="text-amber-400 font-bold">Recomendação Automática de RPE:</span>
              <p className="text-slate-300 text-[11px] leading-relaxed">{lastSummary.recommendation}</p>
            </div>

            <button
              onClick={() => setShowShareCard(false)}
              className="w-full bg-amber-400 text-slate-950 font-black py-2.5 rounded-xl text-xs"
            >
              FECHAR E CONTINUAR
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
