import React, { useState, useEffect } from 'react';
import { 
  Dumbbell, Trophy, Calendar, CheckCircle2, Play, RefreshCw, 
  Flame, Award, Clock, ArrowRight, Activity, Users, MapPin, 
  Megaphone, Plus, ShieldCheck, ChevronRight, Sparkles, Volume2
} from 'lucide-react';

export default function App() {
  // --- ESTADOS DE PERFIL E NAVEGAÇÃO ---
  const [userRole, setUserRole] = useState('aluno'); // 'aluno' | 'professor' | 'arena'
  const [activeTab, setActiveTab] = useState('agenda'); // aluno: 'agenda'|'biblioteca'|'escolinha'|'historico'
  const [studentLevel, setStudentLevel] = useState('Intermediário'); // 'Iniciante' | 'Intermediário' | 'Avançado'
  const [selectedDay, setSelectedDay] = useState('Segunda-feira');

  // --- ESTADO DE EXECUÇÃO DE TREINO (MODO ATIVO) ---
  const [activeWorkout, setActiveWorkout] = useState(null);
  const [workoutTimer, setWorkoutTimer] = useState(0);
  const [restTimer, setRestTimer] = useState(0);
  const [isResting, setIsResting] = useState(false);
  const [completedSets, setCompletedSets] = useState({});
  const [rpeRating, setRpeRating] = useState(8);
  const [workoutNotes, setWorkoutNotes] = useState('');

  // --- BANCO DE DADOS LOCAL (PERSISTÊNCIA) ---
  const [workoutLogs, setWorkoutLogs] = useState(() => {
    const saved = localStorage.getItem('futevolei_logs');
    return saved ? JSON.parse(saved) : [
      { id: 1, date: '21/10/2026', title: 'Dia A: Potência de Pernas', duration: '45 min', rpe: 8, type: 'Academia' },
      { id: 2, date: '23/10/2026', title: 'Treino de Areia: Controle & Pliometria', duration: '50 min', rpe: 9, type: 'Areia' }
    ];
  });

  // Schedule / Programação Semanal do Aluno
  const [weeklySchedule, setWeeklySchedule] = useState({
    'Segunda-feira': { type: 'Academia', title: 'Dia A: Potência & Explosão' },
    'Terça-feira': { type: 'Areia', title: 'Treino de Areia: Controle & Pliometria' },
    'Quarta-feira': { type: 'Academia', title: 'Dia B: Rotação & Superiores' },
    'Quinta-feira': { type: 'Escolinha', title: 'Aula da Arena: Defesa & Ataque' },
    'Sexta-feira': { type: 'Academia', title: 'Dia C: Prevenção & Estabilidade' },
    'Sábado': { type: 'Areia', title: 'Jogo Treino / Day Use' },
    'Domingo': { type: 'Descanso', title: 'Recuperação Ativa / Descanso' }
  });

  // Matriz Curricular do Professor (Aulas da Escolinha por Nível)
  const [teacherCurriculum, setTeacherCurriculum] = useState({
    'Iniciante': {
      title: 'Fundamentos de Controle & Passe',
      warmup: '10 min - Deslocamento lateral + coordenação de passos na areia',
      technical: '20 min - Domínio de peito em dupla (bola parada e em movimento)',
      tactical: '15 min - Posicionamento básico na quadra (divisão de lado)',
      game: '15 min - Ponto condicionado com 1 pingo permitido'
    },
    'Intermediário': {
      title: 'Passagem de Peito & Transição Defesa-Ataque',
      warmup: '10 min - Pliometria leve na escada de agilidade + mobilidade',
      technical: '20 min - Levantamento de ombro/cabeça na diagonal sob pressão',
      tactical: '15 min - Defesa de pingo no fundo x cobertura na rede (Comunicação)',
      game: '15 min - Set até 15 pontos (Pontos de ataque valem 2)'
    },
    'Avançado': {
      title: 'Shark Attack, Saltos & Timing de Rede',
      warmup: '10 min - Saltos sobre minibarramenros + reação de velocidade',
      technical: '20 min - Aproximação de corrida + Shark Attack de sola',
      tactical: '15 min - Leitura de bloqueio e rotação de cobertura defensiva',
      game: '15 min - Tie-break simulado (Começando em 12x12)'
    }
  });

  // Estado da Arena (Quadras e Avisos)
  const [arenaCourts, setArenaCourts] = useState([
    { id: 1, name: 'Quadra 1 (Principal)', status: 'Aula Escolinha', info: 'Turma Intermediário (07:00 - 08:00)' },
    { id: 2, name: 'Quadra 2', status: 'Alugada / Day Use', info: 'Atletas Privados' },
    { id: 3, name: 'Quadra 3', status: 'Livre', info: 'Disponível para Locação' },
    { id: 4, name: 'Quadra 4', status: 'Manutenção', info: 'Troca de Areia' }
  ]);

  const [arenaAnnouncements, setArenaAnnouncements] = useState([
    { id: 1, title: '🏆 Torneio Interno de Duplas Mistas', date: '15 de Novembro', text: 'Inscrições abertas na recepção da arena! Vagas limitadas.' },
    { id: 2, title: '🦈 Clínica Especial de Shark Attack', date: '01 de Novembro', text: 'Com o Prof. Carlos. Foco em aperfeiçoamento de salto e ataque.' }
  ]);

  // Save LocalStorage
  useEffect(() => {
    localStorage.setItem('futevolei_logs', JSON.stringify(workoutLogs));
  }, [workoutLogs]);

  // Timers Effect
  useEffect(() => {
    let interval = null;
    if (activeWorkout) {
      interval = setInterval(() => {
        setWorkoutTimer((prev) => prev + 1);
        if (isResting && restTimer > 0) {
          setRestTimer((prevRest) => {
            if (prevRest <= 1) {
              setIsResting(false);
              playBeepSound();
              return 0;
            }
            return prevRest - 1;
          });
        }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [activeWorkout, isResting, restTimer]);

  // Som de Alerta no Fim do Descanso
  const playBeepSound = () => {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = 'sine';
      osc.frequency.value = 880;
      osc.start();
      setTimeout(() => { osc.stop(); ctx.close(); }, 300);
    } catch (e) {
      console.log('Audio Context indisponível');
    }
  };

  // Funções de Treino
  const startWorkout = (title, type) => {
    setActiveWorkout({
      title,
      type,
      exercises: type === 'Academia' ? [
        { name: 'Agachamento Búlgaro', sets: 3, reps: '8-10', weight: '12kg' },
        { name: 'Salto na Caixa (Box Jump)', sets: 4, reps: '5', weight: 'Peso do Corpo' },
        { name: 'RDL com Halteres', sets: 3, reps: '10', weight: '16kg' },
        { name: 'Panturrilha Unilateral', sets: 3, reps: '15', weight: 'Peso do Corpo' },
        { name: 'Prancha Abdominal', sets: 3, reps: '45s', weight: '-' }
      ] : [
        { name: 'Deslocamento em V na Areia', sets: 4, reps: '30s', weight: '-' },
        { name: 'Controle de Bola Unilateral', sets: 3, reps: '50 toques', weight: 'Bola' },
        { name: 'Saltos sobre Barreira + Passe', sets: 4, reps: '8 repetições', weight: '-' }
      ]
    });
    setWorkoutTimer(0);
    setCompletedSets({});
  };

  const toggleSet = (exIndex, setIndex) => {
    const key = `${exIndex}-${setIndex}`;
    setCompletedSets((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const startRest = (seconds) => {
    setRestTimer(seconds);
    setIsResting(true);
  };

  const finishWorkout = () => {
    const newLog = {
      id: Date.now(),
      date: new Date().toLocaleDateString('pt-BR'),
      title: activeWorkout.title,
      duration: `${Math.floor(workoutTimer / 60)} min`,
      rpe: rpeRating,
      type: activeWorkout.type,
      notes: workoutNotes
    };
    setWorkoutLogs([newLog, ...workoutLogs]);
    setActiveWorkout(null);
    setWorkoutNotes('');
    alert('🏆 Treino Concluído e Salvo com Sucesso!');
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans pb-12">
      {/* HEADER PRINCIPAL - ALTERNÂNCIA DE PERFIL */}
      <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-3 flex flex-col sm:flex-row justify-between items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-amber-500 rounded-xl text-slate-950 font-black">
              ⚽
            </div>
            <div>
              <h1 className="font-bold text-lg text-amber-400 leading-tight">Futevôlei Ecosystem</h1>
              <p className="text-xs text-slate-400">Plataforma Integrada de Treinos & Arenas</p>
            </div>
          </div>

          {/* Seletor Trilateral de Perfil */}
          <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs font-semibold">
            <button
              onClick={() => setUserRole('aluno')}
              className={`px-3 py-1.5 rounded-lg transition-all ${userRole === 'aluno' ? 'bg-amber-500 text-slate-950 shadow' : 'text-slate-400 hover:text-white'}`}
            >
              🏃 Atleta / Aluno
            </button>
            <button
              onClick={() => setUserRole('professor')}
              className={`px-3 py-1.5 rounded-lg transition-all ${userRole === 'professor' ? 'bg-amber-500 text-slate-950 shadow' : 'text-slate-400 hover:text-white'}`}
            >
              🧢 Professor
            </button>
            <button
              onClick={() => setUserRole('arena')}
              className={`px-3 py-1.5 rounded-lg transition-all ${userRole === 'arena' ? 'bg-amber-500 text-slate-950 shadow' : 'text-slate-400 hover:text-white'}`}
            >
              🏟️ Arena / Clube
            </button>
          </div>
        </div>
      </header>

      {/* CONTEÚDO PRINCIPAL DE ACORDO COM O PERFIL */}
      <main className="max-w-4xl mx-auto px-4 mt-6">

        {/* ========================================================
            MODO EXECUÇÃO DE TREINO ATIVO (OVERLAY POPUP)
           ======================================================== */}
        {activeWorkout && (
          <div className="fixed inset-0 bg-slate-950/95 backdrop-blur-md z-50 overflow-y-auto p-4">
            <div className="max-w-xl mx-auto bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl my-8">
              <div className="flex justify-between items-start mb-6 border-b border-slate-800 pb-4">
                <div>
                  <span className="px-3 py-1 bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs font-bold rounded-full">
                    🔴 TREINO EM ANDAMENTO
                  </span>
                  <h2 className="text-2xl font-black text-white mt-2">{activeWorkout.title}</h2>
                </div>
                <div className="text-right">
                  <div className="text-xs text-slate-400">Tempo Total</div>
                  <div className="text-2xl font-mono font-bold text-amber-400">{formatTime(workoutTimer)}</div>
                </div>
              </div>

              {/* Timer de Descanso */}
              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 mb-6 text-center">
                <div className="text-xs text-slate-400 mb-1 flex items-center justify-center gap-1">
                  <Clock size={14} className="text-amber-400" /> Cronômetro de Descanso Entre Séries
                </div>
                {isResting ? (
                  <div className="text-4xl font-mono font-black text-emerald-400 animate-pulse my-2">
                    {formatTime(restTimer)}
                  </div>
                ) : (
                  <div className="text-sm text-slate-500 my-2">Selecione o tempo para iniciar descanso</div>
                )}
                <div className="flex justify-center gap-2 mt-2">
                  {[30, 45, 60, 90].map((sec) => (
                    <button
                      key={sec}
                      onClick={() => startRest(sec)}
                      className="px-3 py-1 bg-slate-800 hover:bg-amber-500 hover:text-slate-950 text-slate-300 font-bold rounded-lg text-xs transition"
                    >
                      {sec}s
                    </button>
                  ))}
                </div>
              </div>

              {/* Lista de Exercícios */}
              <div className="space-y-4 mb-6">
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Exercícios Prescritos</h3>
                {activeWorkout.exercises.map((ex, exIdx) => (
                  <div key={exIdx} className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                    <div className="flex justify-between font-bold text-white mb-2">
                      <span>{ex.name}</span>
                      <span className="text-xs text-slate-400">{ex.sets}x {ex.reps} ({ex.weight})</span>
                    </div>
                    <div className="flex gap-2">
                      {Array.from({ length: ex.sets }).map((_, setIdx) => {
                        const isDone = completedSets[`${exIdx}-${setIdx}`];
                        return (
                          <button
                            key={setIdx}
                            onClick={() => toggleSet(exIdx, setIdx)}
                            className={`flex-1 py-2 rounded-lg font-bold text-xs transition flex items-center justify-center gap-1 ${
                              isDone ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                            }`}
                          >
                            <CheckCircle2 size={12} /> S{setIdx + 1}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>

              {/* Percepção de Esforço & Finalização */}
              <div className="border-t border-slate-800 pt-4 space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1">
                    Esforço Percebido (RPE: {rpeRating}/10)
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={rpeRating}
                    onChange={(e) => setRpeRating(Number(e.target.value))}
                    className="w-full accent-amber-500"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500">
                    <span>1 - Muito Leve</span>
                    <span>5 - Moderado</span>
                    <span>10 - Esforço Máximo</span>
                  </div>
                </div>

                <textarea
                  placeholder="Observações (ex: dor leve, vento forte, aumento de carga...)"
                  value={workoutNotes}
                  onChange={(e) => setWorkoutNotes(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-slate-200 focus:outline-none focus:border-amber-500"
                  rows="2"
                />

                <div className="flex gap-3">
                  <button
                    onClick={() => setActiveWorkout(null)}
                    className="flex-1 py-3 bg-slate-800 text-slate-300 font-bold rounded-xl hover:bg-slate-700 text-sm"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={finishWorkout}
                    className="flex-1 py-3 bg-amber-500 text-slate-950 font-black rounded-xl hover:bg-amber-400 text-sm shadow-lg shadow-amber-500/20"
                  >
                    🏁 Concluir Treino
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================
            VISÃO 1: PERFIL ALUNO / ATLETA
           ======================================================== */}
        {userRole === 'aluno' && (
          <div>
            {/* Sub-navegação do Aluno */}
            <div className="flex gap-2 overflow-x-auto pb-3 mb-6 scrollbar-none">
              {[
                { id: 'agenda', label: '📅 Programação Semanal' },
                { id: 'escolinha', label: '🏖️ Treino da Escolinha' },
                { id: 'biblioteca', label: '📚 Biblioteca Autônoma' },
                { id: 'historico', label: '📊 Meu Histórico' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition ${
                    activeTab === tab.id ? 'bg-amber-500 text-slate-950 shadow' : 'bg-slate-900 text-slate-400 hover:text-white'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* ABA: AGENDA SEMANAL DO ALUNO */}
            {activeTab === 'agenda' && (
              <div className="space-y-6">
                <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6">
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <h2 className="text-xl font-bold text-white">Sua Programação Semanal</h2>
                      <p className="text-xs text-slate-400">Combine academia, quadra e descanso para alta performance na areia</p>
                    </div>
                    <span className="px-3 py-1 bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs font-bold rounded-full">
                      Nível: {studentLevel}
                    </span>
                  </div>

                  {/* Dias da Semana */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    {Object.entries(weeklySchedule).map(([day, info]) => (
                      <div
                        key={day}
                        className={`p-4 rounded-2xl border transition cursor-pointer ${
                          selectedDay === day ? 'bg-slate-800 border-amber-500' : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                        }`}
                        onClick={() => setSelectedDay(day)}
                      >
                        <div className="text-xs font-bold text-amber-400 mb-1">{day}</div>
                        <div className="font-bold text-slate-100 text-sm">{info.title}</div>
                        <div className="text-[11px] text-slate-500 mt-2 flex items-center justify-between">
                          <span>Tipo: {info.type}</span>
                          <ChevronRight size={14} className="text-slate-600" />
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Detalhes do Dia Selecionado */}
                  <div className="mt-6 pt-6 border-t border-slate-800 flex flex-col sm:flex-row justify-between items-center gap-4">
                    <div>
                      <div className="text-xs text-slate-400">Treino Selecionado para {selectedDay}:</div>
                      <div className="text-lg font-bold text-white">{weeklySchedule[selectedDay]?.title}</div>
                    </div>
                    <button
                      onClick={() => startWorkout(weeklySchedule[selectedDay]?.title, weeklySchedule[selectedDay]?.type)}
                      className="w-full sm:w-auto px-6 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-xl flex items-center justify-center gap-2 transition"
                    >
                      <Play size={16} fill="currentColor" /> Iniciar Treino de Hoje
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* ABA: TREINO DA ESCOLINHA (ENVIADO PELO PROFESSOR) */}
            {activeTab === 'escolinha' && (
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-amber-500/20 text-amber-400 rounded-2xl">
                    <Sparkles size={24} />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">Treino Oficial Prescrito da Semana</h2>
                    <p className="text-xs text-slate-400">Elaborado pelo seu professor para a turma de nível <strong className="text-amber-400">{studentLevel}</strong></p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
                    <div className="text-xs font-bold text-amber-400 uppercase tracking-wide">Fase 1: Aquecimento & Mobilidade</div>
                    <div className="text-sm font-semibold text-slate-200 mt-1">{teacherCurriculum[studentLevel]?.warmup}</div>
                  </div>
                  <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
                    <div className="text-xs font-bold text-amber-400 uppercase tracking-wide">Fase 2: Exercício Técnico / Fundamento</div>
                    <div className="text-sm font-semibold text-slate-200 mt-1">{teacherCurriculum[studentLevel]?.technical}</div>
                  </div>
                  <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
                    <div className="text-xs font-bold text-amber-400 uppercase tracking-wide">Fase 3: Treino Tático & Posicionamento</div>
                    <div className="text-sm font-semibold text-slate-200 mt-1">{teacherCurriculum[studentLevel]?.tactical}</div>
                  </div>
                  <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
                    <div className="text-xs font-bold text-amber-400 uppercase tracking-wide">Fase 4: Situação Real de Jogo</div>
                    <div className="text-sm font-semibold text-slate-200 mt-1">{teacherCurriculum[studentLevel]?.game}</div>
                  </div>
                </div>
              </div>
            )}

            {/* ABA: HISTÓRICO DE TREINOS */}
            {activeTab === 'historico' && (
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6">
                <h2 className="text-xl font-bold text-white mb-4">Seu Histórico de Treinos</h2>
                <div className="space-y-3">
                  {workoutLogs.map((log) => (
                    <div key={log.id} className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex justify-between items-center">
                      <div>
                        <div className="text-xs text-slate-500">{log.date} • {log.type}</div>
                        <div className="font-bold text-white text-sm">{log.title}</div>
                        {log.notes && <div className="text-xs text-slate-400 mt-1">"{log.notes}"</div>}
                      </div>
                      <div className="text-right">
                        <span className="px-2.5 py-1 bg-amber-500/10 text-amber-400 text-xs font-bold rounded-lg">
                          RPE {log.rpe}/10
                        </span>
                        <div className="text-xs text-slate-400 mt-1">{log.duration}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ========================================================
            VISÃO 2: PERFIL PROFESSOR / TREINADOR
           ======================================================== */}
        {userRole === 'professor' && (
          <div className="space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-xl font-bold text-white">Painel do Professor - Escolinha de Futevôlei</h2>
                  <p className="text-xs text-slate-400">Monte a matriz curricular das turmas por nível técnico</p>
                </div>
                {/* Seletor de Nível para Edição */}
                <select
                  value={studentLevel}
                  onChange={(e) => setStudentLevel(e.target.value)}
                  className="bg-slate-950 border border-slate-800 text-amber-400 font-bold text-xs rounded-xl px-3 py-2 focus:outline-none"
                >
                  <option value="Iniciante">Turma: Iniciante</option>
                  <option value="Intermediário">Turma: Intermediário</option>
                  <option value="Avançado">Turma: Avançado</option>
                </select>
              </div>

              {/* Formulário de Montagem de Aula */}
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1">Tema Principal da Aula</label>
                  <input
                    type="text"
                    value={teacherCurriculum[studentLevel]?.title}
                    onChange={(e) => setTeacherCurriculum({
                      ...teacherCurriculum,
                      [studentLevel]: { ...teacherCurriculum[studentLevel], title: e.target.value }
                    })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-400 mb-1">Fase 1: Aquecimento & Mobilidade</label>
                    <textarea
                      rows="2"
                      value={teacherCurriculum[studentLevel]?.warmup}
                      onChange={(e) => setTeacherCurriculum({
                        ...teacherCurriculum,
                        [studentLevel]: { ...teacherCurriculum[studentLevel], warmup: e.target.value }
                      })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-400 mb-1">Fase 2: Exercício Técnico (Fundamento)</label>
                    <textarea
                      rows="2"
                      value={teacherCurriculum[studentLevel]?.technical}
                      onChange={(e) => setTeacherCurriculum({
                        ...teacherCurriculum,
                        [studentLevel]: { ...teacherCurriculum[studentLevel], technical: e.target.value }
                      })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-400 mb-1">Fase 3: Treino Tático</label>
                    <textarea
                      rows="2"
                      value={teacherCurriculum[studentLevel]?.tactical}
                      onChange={(e) => setTeacherCurriculum({
                        ...teacherCurriculum,
                        [studentLevel]: { ...teacherCurriculum[studentLevel], tactical: e.target.value }
                      })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-400 mb-1">Fase 4: Situação de Jogo Real</label>
                    <textarea
                      rows="2"
                      value={teacherCurriculum[studentLevel]?.game}
                      onChange={(e) => setTeacherCurriculum({
                        ...teacherCurriculum,
                        [studentLevel]: { ...teacherCurriculum[studentLevel], game: e.target.value }
                      })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                <button
                  onClick={() => alert(`✅ Treino da Turma ${studentLevel} publicado com sucesso para os alunos!`)}
                  className="w-full py-3 bg-amber-500 text-slate-950 font-black rounded-xl hover:bg-amber-400 transition shadow-lg shadow-amber-500/20"
                >
                  🚀 Publicar Aula para Alunos da Arena
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================
            VISÃO 3: PERFIL ARENA / CLUBE
           ======================================================== */}
        {userRole === 'arena' && (
          <div className="space-y-6">
            {/* Status das Quadras em Tempo Real */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6">
              <h2 className="text-xl font-bold text-white mb-2">Painel de Ocupação das Quadras</h2>
              <p className="text-xs text-slate-400 mb-6">Monitoramento e alocação em tempo real</p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {arenaCourts.map((court) => (
                  <div key={court.id} className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex justify-between items-center">
                    <div>
                      <div className="font-bold text-white text-sm">{court.name}</div>
                      <div className="text-xs text-slate-400 mt-1">{court.info}</div>
                    </div>
                    <span className={`px-2.5 py-1 text-[10px] font-bold rounded-full ${
                      court.status.includes('Livre') ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                      court.status.includes('Aula') ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                      'bg-slate-800 text-slate-400'
                    }`}>
                      {court.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Mural de Avisos da Comunidade */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-white">Mural de Avisos & Torneios</h2>
                <button
                  onClick={() => alert('Função de adicionar novo comunicado')}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-amber-400 font-bold text-xs rounded-xl flex items-center gap-1"
                >
                  <Plus size={14} /> Criar Aviso
                </button>
              </div>

              <div className="space-y-3">
                {arenaAnnouncements.map((ann) => (
                  <div key={ann.id} className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
                    <div className="flex justify-between items-start">
                      <div className="font-bold text-amber-400 text-sm">{ann.title}</div>
                      <span className="text-[10px] text-slate-500">{ann.date}</span>
                    </div>
                    <p className="text-xs text-slate-300 mt-2">{ann.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}