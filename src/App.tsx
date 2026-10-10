import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { InterviewerIntelView } from './components/InterviewerIntelView';
import { TrainingGapView } from './components/TrainingGapView';
import { SavedSessionsView } from './components/SavedSessionsView';
import { AnswerModal } from './components/AnswerModal';
import {
  CompletedTraining,
  InterviewIntelResponse,
  InterviewQuestion,
  SavedPracticeSession,
  TrainingAnalysisResult,
  AnswerEvaluation,
} from './types';
import { PRESET_TRAINING_PACKS } from './mockData';

export default function App() {
  const [activeTab, setActiveTab] = useState<'interview' | 'training' | 'saved'>('interview');

  // Interview view state
  const [activeTitle, setActiveTitle] = useState('Engineering Manager (Yazılım Mühendisliği Müdürü)');
  const [cachedIntel, setCachedIntel] = useState<InterviewIntelResponse | null>(null);

  // Training view state (default with Starter CS pack for new grads/interns)
  const [trainings, setTrainings] = useState<CompletedTraining[]>(() => {
    const saved = localStorage.getItem('coach_trainings');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // fallback
      }
    }
    return PRESET_TRAINING_PACKS[0].trainings;
  });

  const [analysisResult, setAnalysisResult] = useState<TrainingAnalysisResult | null>(() => {
    const saved = localStorage.getItem('coach_analysis');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // fallback
      }
    }
    return null;
  });

  // Saved mock sessions
  const [savedSessions, setSavedSessions] = useState<SavedPracticeSession[]>(() => {
    const saved = localStorage.getItem('coach_saved_sessions');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // fallback
      }
    }
    return [];
  });

  // Simulation modal state
  const [simModalState, setSimModalState] = useState<{
    isOpen: boolean;
    question: InterviewQuestion | null;
    interviewerTitle: string;
    candidateRole: string;
    seniority: string;
  }>({
    isOpen: false,
    question: null,
    interviewerTitle: '',
    candidateRole: '',
    seniority: '',
  });

  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem('coach_trainings', JSON.stringify(trainings));
  }, [trainings]);

  useEffect(() => {
    if (analysisResult) {
      localStorage.setItem('coach_analysis', JSON.stringify(analysisResult));
    }
  }, [analysisResult]);

  useEffect(() => {
    localStorage.setItem('coach_saved_sessions', JSON.stringify(savedSessions));
  }, [savedSessions]);

  const handleStartSimulation = (
    question: InterviewQuestion,
    interviewerTitle: string,
    candidateRole: string,
    seniority: string
  ) => {
    setSimModalState({
      isOpen: true,
      question,
      interviewerTitle,
      candidateRole,
      seniority,
    });
  };

  const handleSaveSession = (evalData: AnswerEvaluation, answerText: string) => {
    if (!simModalState.question) return;

    const newSession: SavedPracticeSession = {
      id: 'session-' + Date.now(),
      timestamp: new Date().toISOString(),
      interviewerTitle: simModalState.interviewerTitle,
      candidateRole: simModalState.candidateRole,
      question: simModalState.question.question,
      candidateAnswer: answerText,
      evaluation: evalData,
    };

    setSavedSessions((prev) => [newSession, ...prev]);
  };

  const handleDeleteSession = (id: string) => {
    setSavedSessions((prev) => prev.filter((s) => s.id !== id));
  };

  const handleClearAllSessions = () => {
    if (window.confirm('Tüm pratik geçmişini silmek istediğinize emin misiniz?')) {
      setSavedSessions([]);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        savedCount={savedSessions.length}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'interview' && (
          <InterviewerIntelView
            onStartSimulation={handleStartSimulation}
            cachedIntel={cachedIntel}
            setCachedIntel={setCachedIntel}
            activeTitle={activeTitle}
            setActiveTitle={setActiveTitle}
          />
        )}

        {activeTab === 'training' && (
          <TrainingGapView
            trainings={trainings}
            setTrainings={setTrainings}
            analysisResult={analysisResult}
            setAnalysisResult={setAnalysisResult}
          />
        )}

        {activeTab === 'saved' && (
          <SavedSessionsView
            sessions={savedSessions}
            onDeleteSession={handleDeleteSession}
            onClearAll={handleClearAllSessions}
            onGoToInterview={() => setActiveTab('interview')}
          />
        )}
      </main>

      {/* Answer Evaluation Simulator Modal */}
      {simModalState.isOpen && simModalState.question && (
        <AnswerModal
          question={simModalState.question}
          interviewerTitle={simModalState.interviewerTitle}
          candidateRole={simModalState.candidateRole}
          seniorityLevel={simModalState.seniority}
          onClose={() =>
            setSimModalState({
              isOpen: false,
              question: null,
              interviewerTitle: '',
              candidateRole: '',
              seniority: '',
            })
          }
          onSaveSession={handleSaveSession}
        />
      )}

      {/* Subtle Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/60 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>
            Kariyer & Mülakat Koçu AI · Üniversite yeni mezunları, stajyerler ve mühendisler için akıllı rehber
          </div>
          <div className="text-slate-600">
            STAR Metodu & Beceri Boşluk Analizi Modeli
          </div>
        </div>
      </footer>
    </div>
  );
}
