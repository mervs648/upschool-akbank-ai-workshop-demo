import React, { useState } from 'react';
import {
  GraduationCap,
  Plus,
  Trash2,
  Sparkles,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  Compass,
  Calendar,
  Layers,
  Code2,
  FolderGit2,
  FileText,
  Upload,
  BookOpen,
  ArrowRight,
} from 'lucide-react';
import { CompletedTraining, TrainingAnalysisResult } from '../types';
import { PRESET_TRAINING_PACKS } from '../mockData';

interface TrainingGapViewProps {
  trainings: CompletedTraining[];
  setTrainings: React.Dispatch<React.SetStateAction<CompletedTraining[]>>;
  analysisResult: TrainingAnalysisResult | null;
  setAnalysisResult: (result: TrainingAnalysisResult | null) => void;
}

export const TrainingGapView: React.FC<TrainingGapViewProps> = ({
  trainings,
  setTrainings,
  analysisResult,
  setAnalysisResult,
}) => {
  const [targetGoal, setTargetGoal] = useState('Yeni mezun olarak ilk yazılım geliştirici işime girmek');
  const [currentLevel, setCurrentLevel] = useState('Üniversiteden Yeni Mezun / Staj Arayan');
  const [learningPreference, setLearningPreference] = useState('Proje odaklı, uygulamalı ve mülakat odaklı');

  // New training form state
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newProvider, setNewProvider] = useState('');
  const [newTopics, setNewTopics] = useState('');
  const [newLearnings, setNewLearnings] = useState('');

  // Bulk paste modal state
  const [isBulkPasteOpen, setIsBulkPasteOpen] = useState(false);
  const [bulkText, setBulkText] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAddTraining = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newTopics.trim()) {
      setError('Lütfen eğitim başlığı ve en azından kapsanan konuları girin.');
      return;
    }

    const item: CompletedTraining = {
      id: 'train-' + Date.now(),
      title: newTitle.trim(),
      provider: newProvider.trim() || 'Online Platform / Üniversite',
      topicsCovered: newTopics.trim(),
      keyLearnings: newLearnings.trim() || undefined,
      completionYear: new Date().getFullYear().toString(),
    };

    setTrainings((prev) => [item, ...prev]);
    setNewTitle('');
    setNewProvider('');
    setNewTopics('');
    setNewLearnings('');
    setIsAddingNew(false);
    setError(null);
  };

  const handleDeleteTraining = (id: string) => {
    setTrainings((prev) => prev.filter((t) => t.id !== id));
  };

  const handleLoadPresetPack = (packIndex: number) => {
    const pack = PRESET_TRAINING_PACKS[packIndex];
    if (pack) {
      setTrainings(pack.trainings);
    }
  };

  const handleBulkImport = () => {
    if (!bulkText.trim()) return;

    // Create a new comprehensive training item from the pasted curriculum
    const item: CompletedTraining = {
      id: 'train-bulk-' + Date.now(),
      title: 'Toplu Girilen Eğitim / Müfredat İçerikleri',
      provider: 'Özel Kurslar / Üniversite',
      topicsCovered: bulkText.trim(),
      completionYear: new Date().getFullYear().toString(),
    };

    setTrainings((prev) => [item, ...prev]);
    setBulkText('');
    setIsBulkPasteOpen(false);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        const item: CompletedTraining = {
          id: 'train-file-' + Date.now(),
          title: file.name.replace(/\.[^/.]+$/, ''),
          provider: 'Yüklenen Dosya (' + file.name + ')',
          topicsCovered: content.slice(0, 5000), // Protect payload size
          completionYear: new Date().getFullYear().toString(),
        };
        setTrainings((prev) => [item, ...prev]);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleRunAnalysis = async () => {
    if (trainings.length === 0) {
      setError('Analiz yapabilmemiz için lütfen en az bir adet tamamlanan eğitim içeriği ekleyin veya hazır paketlerden birini seçin.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/training-gap-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          completedTrainings: trainings,
          targetCareerGoal: targetGoal,
          currentLevel,
          learningStylePreference: learningPreference,
        }),
      });

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.error || 'Eğitim analizi yapılamadı.');
      }

      const data: TrainingAnalysisResult = await res.json();
      setAnalysisResult(data);
    } catch (err: any) {
      setError(err.message || 'Analiz sırasında bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Intro Header */}
      <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8">
        <div className="max-w-3xl mb-6">
          <div className="flex items-center gap-2 text-xs text-blue-400 font-medium mb-1">
            <GraduationCap className="w-4 h-4" />
            <span>Kişiselleştirilmiş Müfredat & Eksik Boşluk Analizi</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Eğitim İçeriklerinizi Analiz Edin, Bir Sonraki Adımı Keşfedin
          </h1>
          <p className="text-sm text-slate-400 mt-2 leading-relaxed">
            Şu ana kadar aldığınız kursların, üniversite derslerinin veya sertifikaların içeriklerini girin. Yapay zeka sektörün ve mülakatların beklentilerine göre <strong>hangi kritik konuların eksik kaldığını</strong> tespit etsin ve <strong>bir sonraki adımda tam olarak hangi eğitimi</strong> almanız gerektiğini önersin.
          </p>
        </div>

        {/* Goal & Level Selectors */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 p-4 bg-slate-950/70 border border-slate-800 rounded-xl mb-6 text-xs">
          <div>
            <label className="block font-medium text-slate-300 mb-1">
              Kariyer Hedefiniz
            </label>
            <input
              type="text"
              value={targetGoal}
              onChange={(e) => setTargetGoal(e.target.value)}
              placeholder="Örn: İlk Junior Frontend işine girmek"
              className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block font-medium text-slate-300 mb-1">
              Mevcut Seviyeniz
            </label>
            <input
              type="text"
              value={currentLevel}
              onChange={(e) => setCurrentLevel(e.target.value)}
              placeholder="Örn: Üniversiteden Yeni Mezun / Staj Arayan"
              className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block font-medium text-slate-300 mb-1">
              Öğrenme Tercihiniz
            </label>
            <input
              type="text"
              value={learningPreference}
              onChange={(e) => setLearningPreference(e.target.value)}
              placeholder="Örn: Proje ve GitHub portfolyo odaklı"
              className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Quick Presets Strip */}
        <div className="mb-6">
          <div className="text-xs text-slate-400 mb-2">Hızlı Başlangıç Hazır Eğitim Paketleri:</div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {PRESET_TRAINING_PACKS.map((pack, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleLoadPresetPack(idx)}
                className="p-3 bg-slate-950/80 hover:bg-slate-950 border border-slate-800 hover:border-slate-700 rounded-xl text-left transition-colors"
              >
                <div className="text-xs font-semibold text-slate-200">{pack.label}</div>
                <div className="text-[11px] text-slate-400 mt-1 line-clamp-2">{pack.description}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Action bar for adding trainings */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-800">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsAddingNew(true)}
              className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg border border-slate-700 flex items-center gap-1.5 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Yeni Eğitim Ekle</span>
            </button>

            <button
              onClick={() => setIsBulkPasteOpen(true)}
              className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg border border-slate-700 flex items-center gap-1.5 transition-colors"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Müfredat / Metin Yapıştır</span>
            </button>

            <label className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg border border-slate-700 flex items-center gap-1.5 cursor-pointer transition-colors">
              <Upload className="w-3.5 h-3.5" />
              <span>Dosya Yükle (.txt / .md)</span>
              <input
                type="file"
                accept=".txt,.md,.json"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
          </div>

          <button
            onClick={handleRunAnalysis}
            disabled={loading || trainings.length === 0}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-lg shadow-sm flex items-center gap-2 disabled:opacity-50 transition-colors"
          >
            {loading ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Eğitimler Analiz Ediliyor...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5" />
                <span>Eğitimleri Analiz Et & Sonraki Adımı Belirle</span>
              </>
            )}
          </button>
        </div>

        {error && (
          <div className="mt-4 p-3 bg-red-950/30 border border-red-900/50 rounded-xl text-xs text-red-300">
            {error}
          </div>
        )}
      </section>

      {/* Modal: Add New Training Form */}
      {isAddingNew && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-blue-400" />
              <span>Tamamlanan Eğitim / Kurs Detayı</span>
            </h3>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Eğitim / Kurs Başlığı <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="Örn: İleri Seviye Node.js ve Mikroservis Mimarisi"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Eğitim Platformu / Kurum
              </label>
              <input
                type="text"
                value={newProvider}
                onChange={(e) => setNewProvider(e.target.value)}
                placeholder="Örn: Udemy, BTK Akademi, Coursera, Üniversite..."
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Kapsanan Konular ve Müfredat İçeriği <span className="text-rose-400">*</span>
              </label>
              <textarea
                value={newTopics}
                onChange={(e) => setNewTopics(e.target.value)}
                rows={5}
                placeholder="Eğitimin içeriğini buraya yapıştırın. Örn: Event Loop, Asenkron programlama, Express routing, Middleware, JWT auth, MongoDB bağlantısı, Dockerfile hazırlama..."
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Kazanılan Beceriler / Çıktılar (Opsiyonel)
              </label>
              <input
                type="text"
                value={newLearnings}
                onChange={(e) => setNewLearnings(e.target.value)}
                placeholder="Örn: Kendi RESTful API'ımı sıfırdan yazabildim"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsAddingNew(false)}
                className="px-3.5 py-2 text-xs text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
              >
                İptal
              </button>
              <button
                type="button"
                onClick={handleAddTraining}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-lg"
              >
                Eğitimi Ekle
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Bulk Paste Curriculum */}
      {isBulkPasteOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <FileText className="w-4 h-4 text-blue-400" />
              <span>Tüm Eğitim Müfredatını Serbest Metin Olarak Yapıştırın</span>
            </h3>
            <p className="text-xs text-slate-400">
              Aldığınız sertifika ders programını, üniversite transkript ders içeriklerini veya aldığınız kursların konu başlıklarını doğrudan buraya yapıştırabilirsiniz.
            </p>

            <textarea
              value={bulkText}
              onChange={(e) => setBulkText(e.target.value)}
              rows={8}
              placeholder="Örnek: 
- HTML5, CSS3, Flexbox, CSS Grid
- Modern JavaScript ES6+: Promises, async/await, Array methods
- React: Hooks (useState, useEffect, useMemo), React Router v6
- Redux Toolkit ile Global State Yönetimi
- Tailwind CSS ile Responsive Tasarım"
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsBulkPasteOpen(false)}
                className="px-3.5 py-2 text-xs text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
              >
                İptal
              </button>
              <button
                type="button"
                onClick={handleBulkImport}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-lg"
              >
                İçerikleri Aktar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Currently Added Trainings Grid */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            Mevcut Eğitimleriniz
            <span className="text-xs font-mono font-normal text-slate-400 px-2 py-0.5 rounded-full bg-slate-800">
              {trainings.length} Eğitim
            </span>
          </h2>
          {trainings.length > 0 && (
            <button
              onClick={() => setTrainings([])}
              className="text-xs text-slate-500 hover:text-rose-400 transition-colors"
            >
              Listeyi Temizle
            </button>
          )}
        </div>

        {trainings.length === 0 ? (
          <div className="p-8 text-center bg-slate-900 border border-dashed border-slate-800 rounded-2xl">
            <BookOpen className="w-8 h-8 text-slate-600 mx-auto mb-2" />
            <p className="text-sm text-slate-300 font-medium">Henüz bir eğitim eklemediniz</p>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              Yukarıdaki "Hızlı Başlangıç Paketleri"nden birini seçebilir ya da "Yeni Eğitim Ekle" butonuyla kendi eğitimlerinizi ekleyebilirsiniz.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {trainings.map((t) => (
              <div
                key={t.id}
                className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col justify-between group hover:border-slate-700 transition-colors"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <h3 className="text-sm font-semibold text-white leading-snug line-clamp-1">
                      {t.title}
                    </h3>
                    <button
                      onClick={() => handleDeleteTraining(t.id)}
                      className="text-slate-500 hover:text-rose-400 p-1 opacity-60 group-hover:opacity-100 transition-opacity"
                      aria-label="Sil"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div className="text-[11px] text-blue-400 font-medium mb-2">{t.provider}</div>
                  <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed bg-slate-950/60 p-2 rounded-lg border border-slate-800/80">
                    {t.topicsCovered}
                  </p>
                </div>

                {t.keyLearnings && (
                  <div className="mt-2.5 pt-2 border-t border-slate-800/80 text-[11px] text-slate-300">
                    <span className="text-slate-500">Kazanım: </span>
                    {t.keyLearnings}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Analysis Output Section */}
      {analysisResult && (
        <div className="space-y-8 animate-fadeIn pt-4">
          {/* Section: Current Skills & Blind Spots */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Current Profile */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
              <div className="flex items-center gap-2 text-xs font-semibold text-blue-400 mb-2">
                <Layers className="w-4 h-4" />
                <span>MEVCUT YETKİNLİK PROFİLİ</span>
              </div>
              <h3 className="text-lg font-bold text-white mb-2">
                Kazanılmış Altyapı Özeti
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/60 p-3.5 rounded-xl border border-slate-800 mb-4">
                {analysisResult.currentSkillsProfile.overallAssessment}
              </p>

              <div className="space-y-3">
                <div>
                  <div className="text-xs font-semibold text-emerald-400 mb-1.5 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Sağlamlaşan Yetkinlikler</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {analysisResult.currentSkillsProfile.masteredSkills.map((s, i) => (
                      <span
                        key={i}
                        className="text-xs px-2.5 py-1 rounded-md bg-emerald-950/20 text-emerald-300 border border-emerald-900/40"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="text-xs font-semibold text-slate-400 mb-1.5">
                    Derinleştirilmesi Gereken Alanlar
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {analysisResult.currentSkillsProfile.inProgressOrSurfaceSkills.map((s, i) => (
                      <span
                        key={i}
                        className="text-xs px-2.5 py-1 rounded-md bg-slate-950 text-slate-400 border border-slate-800"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Critical Gaps (Blind Spots) */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
              <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 mb-2">
                <AlertTriangle className="w-4 h-4" />
                <span>KRİTİK BOŞLUKLAR (BLIND SPOTS)</span>
              </div>
              <h3 className="text-lg font-bold text-white mb-2">
                Sektörün Beklediği Fakat Eksik Kalan Konular
              </h3>
              <p className="text-xs text-slate-400 mb-4">
                Bu konular iş ilanlarında ve teknik mülakatlarda doğrudan sorulup eleme nedeni olabilecek kritik halkalardır:
              </p>

              <div className="space-y-2.5">
                {analysisResult.criticalGaps.map((gap, i) => (
                  <div
                    key={i}
                    className="p-3 bg-slate-950 border border-slate-800 rounded-xl flex items-start justify-between gap-3"
                  >
                    <div>
                      <div className="text-xs font-semibold text-slate-200">
                        {gap.topic}
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
                        {gap.whyCritical}
                      </div>
                    </div>
                    <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-amber-950/30 text-amber-300 border border-amber-800/40 shrink-0">
                      {gap.riskLevel} Risk
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Core Feature: Recommended Next Trainings */}
          <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8">
            <div className="flex items-center gap-2 text-xs font-semibold text-blue-400 mb-2">
              <Compass className="w-4 h-4" />
              <span>BİR SONRAKİ ADIM İÇİN EĞİTİM ÖNERİLERİ</span>
            </div>
            <h2 className="text-xl font-bold text-white mb-2">
              Tam Olarak Hangi Eğitimi Almalısınız?
            </h2>
            <p className="text-xs text-slate-400 mb-6">
              Mevcut altyapınızı tamamlayacak ve sizi doğrudan mülakatları geçiren yetkin bir adaya dönüştürecek spesifik eğitim adımları:
            </p>

            <div className="space-y-4">
              {analysisResult.nextTrainingRecommendations.map((rec) => (
                <div
                  key={rec.order}
                  className="bg-slate-950 border border-slate-800 rounded-xl p-5 hover:border-blue-900/50 transition-colors"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-md bg-blue-600/20 text-blue-400 font-mono text-xs font-bold flex items-center justify-center border border-blue-500/30">
                        {rec.order}
                      </span>
                      <h4 className="text-base font-bold text-white">{rec.trainingTitle}</h4>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-slate-400">
                      <span className="text-blue-400 font-medium">{rec.level}</span>
                      <span aria-hidden="true">·</span>
                      <span className="font-mono">{rec.estimatedEffort}</span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-300 mb-4 leading-relaxed bg-slate-900/60 p-3 rounded-lg border border-slate-800">
                    <span className="text-blue-400 font-semibold">Hedeflenen Sıçrama: </span>
                    {rec.targetOutcome}
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs mb-4">
                    {/* Must-have syllabus */}
                    <div className="p-3 bg-slate-900/80 border border-slate-800 rounded-lg">
                      <div className="font-semibold text-slate-200 mb-2 flex items-center gap-1.5">
                        <Code2 className="w-3.5 h-3.5 text-blue-400" />
                        <span>Eğitimde Mutlaka Olması Gereken Konular</span>
                      </div>
                      <ul className="space-y-1 text-slate-300">
                        {rec.mustHaveCurriculum.map((mod, mi) => (
                          <li key={mi} className="flex items-start gap-1.5">
                            <span className="text-blue-500">·</span>
                            <span>{mod}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Hands-on portfolio project */}
                    <div className="p-3 bg-slate-900/80 border border-slate-800 rounded-lg">
                      <div className="font-semibold text-emerald-400 mb-2 flex items-center gap-1.5">
                        <FolderGit2 className="w-3.5 h-3.5" />
                        <span>Bitince GitHub'a Eklenecek Proje</span>
                      </div>
                      <p className="text-slate-300 leading-relaxed">
                        {rec.handsOnPortfolioProject}
                      </p>
                    </div>
                  </div>

                  {/* Search keywords */}
                  <div className="text-xs text-slate-400 flex flex-wrap items-center gap-1.5">
                    <span className="text-slate-500">Arama yaparken anahtar kelimeler:</span>
                    {rec.recommendedKeywords.map((kw, ki) => (
                      <span
                        key={ki}
                        className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300 text-[11px]"
                      >
                        {kw}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* 30-60-90 Day Action Roadmap */}
          <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8">
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 mb-2">
              <Calendar className="w-4 h-4" />
              <span>UYGULANABİLİR GELİŞİM YOL HARİTASI</span>
            </div>
            <h2 className="text-xl font-bold text-white mb-4">
              30 - 60 - 90 Günlük Eylem Planı
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl">
                <div className="font-mono text-blue-400 font-bold mb-1">GÜN 1 - 30</div>
                <div className="font-semibold text-white mb-2">Temel Boşlukları Kapatma</div>
                <p className="text-slate-300 leading-relaxed">
                  {analysisResult.roadmap30_60_90.first30Days}
                </p>
              </div>

              <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl">
                <div className="font-mono text-indigo-400 font-bold mb-1">GÜN 31 - 60</div>
                <div className="font-semibold text-white mb-2">İleri Seviye & Proje Üretimi</div>
                <p className="text-slate-300 leading-relaxed">
                  {analysisResult.roadmap30_60_90.days31To60}
                </p>
              </div>

              <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl">
                <div className="font-mono text-emerald-400 font-bold mb-1">GÜN 61 - 90</div>
                <div className="font-semibold text-white mb-2">Portfolyo & Mülakat Hazırlığı</div>
                <p className="text-slate-300 leading-relaxed">
                  {analysisResult.roadmap30_60_90.days61To90}
                </p>
              </div>
            </div>
          </section>

          {/* Coach Advice for New Grads Banner */}
          <section className="p-6 bg-gradient-to-r from-blue-950/30 to-indigo-950/30 border border-blue-900/40 rounded-2xl">
            <div className="flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
              <div>
                <h3 className="text-sm font-bold text-blue-300 mb-1">
                  Yeni Mezun & Staj Arayanlar İçin Kariyer Koçunun Altın Tavsiyesi
                </h3>
                <p className="text-xs text-slate-200 leading-relaxed whitespace-pre-line">
                  {analysisResult.coachAdviceForNewGrads}
                </p>
              </div>
            </div>
          </section>
        </div>
      )}
    </div>
  );
};
