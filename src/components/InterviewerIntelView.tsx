import React, { useState } from 'react';
import {
  Search,
  Sparkles,
  RefreshCw,
  UserCheck,
  ShieldAlert,
  ListChecks,
  ChevronRight,
  Filter,
  HelpCircle,
  Lightbulb,
  AlertOctagon,
  PlayCircle,
  GraduationCap,
  Briefcase,
} from 'lucide-react';
import { InterviewIntelResponse, InterviewQuestion, SeniorityLevel, CompanyType } from '../types';
import { PRESET_INTERVIEWER_TITLES } from '../mockData';

interface InterviewerIntelViewProps {
  onStartSimulation: (question: InterviewQuestion, interviewerTitle: string, candidateRole: string, seniority: string) => void;
  cachedIntel: InterviewIntelResponse | null;
  setCachedIntel: (data: InterviewIntelResponse | null) => void;
  activeTitle: string;
  setActiveTitle: (title: string) => void;
}

export const InterviewerIntelView: React.FC<InterviewerIntelViewProps> = ({
  onStartSimulation,
  cachedIntel,
  setCachedIntel,
  activeTitle,
  setActiveTitle,
}) => {
  const [candidateRole, setCandidateRole] = useState('Junior / Yeni Mezun Yazılım Mühendisi');
  const [seniorityLevel, setSeniorityLevel] = useState<SeniorityLevel>('Yeni Mezun (Entry-level / New Grad)');
  const [companyType, setCompanyType] = useState<CompanyType>('Hızlı Büyüyen Startup');
  const [additionalNotes, setAdditionalNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<string>('Tümü');
  const [expandedQuestionId, setExpandedQuestionId] = useState<string | null>(null);

  const seniorityOptions: SeniorityLevel[] = [
    'Üniversite Öğrencisi / Staj Arayan',
    'Yeni Mezun (Entry-level / New Grad)',
    'Junior (0-2 Yıl Deneyim)',
    'Mid-level (2-4 Yıl Deneyim)',
    'Senior (5+ Yıl Deneyim)',
  ];

  const companyOptions: CompanyType[] = [
    'Hızlı Büyüyen Startup',
    'Kurumsal / FinTech / Banka',
    'Yazılım Evi / Danışmanlık',
    'Global Teknoloji / FAANG Tarzı',
  ];

  const handleGenerate = async (targetTitle = activeTitle) => {
    if (!targetTitle.trim()) {
      setError('Lütfen mülakat yapacağınız kişinin unvanını girin veya aşağıdaki hazır unvanlardan birini seçin.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/interview-intel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          interviewerTitle: targetTitle,
          candidateTargetRole: candidateRole,
          seniorityLevel,
          companyType,
          additionalNotes,
        }),
      });

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.error || 'Mülakat soruları üretilemedi.');
      }

      const data: InterviewIntelResponse = await res.json();
      setCachedIntel(data);
      if (data.questions && data.questions.length > 0) {
        setExpandedQuestionId(data.questions[0].id);
      }
    } catch (err: any) {
      setError(err.message || 'Bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectPreset = (title: string) => {
    setActiveTitle(title);
    handleGenerate(title);
  };

  // Filter questions
  const categories = ['Tümü', ...Array.from(new Set(cachedIntel?.questions.map((q) => q.category) || []))];
  const filteredQuestions = cachedIntel?.questions.filter((q) =>
    categoryFilter === 'Tümü' ? true : q.category === categoryFilter
  ) || [];

  return (
    <div className="space-y-8">
      {/* Hero & Setup Box */}
      <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-sm">
        <div className="max-w-3xl mb-6">
          <div className="flex items-center gap-2 text-xs text-blue-400 font-medium mb-1">
            <GraduationCap className="w-4 h-4" />
            <span>Üniversite Mezunları, Staj ve İş Arayanlar İçin Hedef Odaklı Hazırlık</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Mülakatçının Unvanına Göre Sorular ve Taktikler Üretin
          </h1>
          <p className="text-sm text-slate-400 mt-2 leading-relaxed">
            Mülakata gireceğiniz kişinin unvanını girin (örneğin <em>Engineering Manager</em>, <em>Staff Backend Lead</em> veya <em>İK Yetenek Yöneticisi</em>). Yapay zeka o kişinin bakış açısını, gizli değerlendirme kriterlerini ve soracağı potansiyel soruları çıkarsın.
          </p>
        </div>

        {/* Input Form */}
        <div className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
            {/* Title Input */}
            <div className="lg:col-span-8">
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Mülakatçının Unvanı / Rolü <span className="text-rose-400">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={activeTitle}
                  onChange={(e) => setActiveTitle(e.target.value)}
                  placeholder="Örn: Engineering Manager, Senior Frontend Architect, Talent Acquisition Lead..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
                />
              </div>
            </div>

            {/* Target Role */}
            <div className="lg:col-span-4">
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Başvurduğunuz Pozisyon
              </label>
              <input
                type="text"
                value={candidateRole}
                onChange={(e) => setCandidateRole(e.target.value)}
                placeholder="Örn: Junior Frontend Developer"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              />
            </div>
          </div>

          {/* Quick Selectors for Seniority & Company */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-1">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">
                Kıdem Seviyeniz
              </label>
              <select
                value={seniorityLevel}
                onChange={(e) => setSeniorityLevel(e.target.value as SeniorityLevel)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {seniorityOptions.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">
                Şirket Türü
              </label>
              <select
                value={companyType}
                onChange={(e) => setCompanyType(e.target.value as CompanyType)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {companyOptions.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">
                Özel Not / Odak Noktası (Opsiyonel)
              </label>
              <input
                type="text"
                value={additionalNotes}
                onChange={(e) => setAdditionalNotes(e.target.value)}
                placeholder="Örn: Bitirme projesi hakkında konuşacağız"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Preset Title Chips */}
          <div className="pt-2">
            <div className="text-xs text-slate-400 mb-2">Hızlı Unvan Şablonları:</div>
            <div className="flex flex-wrap gap-2">
              {PRESET_INTERVIEWER_TITLES.map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSelectPreset(preset.title)}
                  className={`text-xs px-3 py-1.5 rounded-lg border text-left transition-all ${
                    activeTitle === preset.title
                      ? 'bg-blue-600/20 border-blue-500/50 text-blue-300'
                      : 'bg-slate-950/80 border-slate-800 text-slate-300 hover:border-slate-700 hover:text-white'
                  }`}
                >
                  <span className="font-medium">{preset.title}</span>
                </button>
              ))}
            </div>
          </div>

          {error && (
            <div className="p-3 bg-red-950/30 border border-red-900/50 rounded-xl text-xs text-red-300">
              {error}
            </div>
          )}

          {/* Action Button */}
          <div className="flex justify-end pt-2">
            <button
              onClick={() => handleGenerate()}
              disabled={loading}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold rounded-xl shadow-sm flex items-center gap-2 disabled:opacity-50 transition-colors"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Sorular ve Taktikler Üretiliyor...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Mülakat Zekasını ve Soruları Üret</span>
                </>
              )}
            </button>
          </div>
        </div>
      </section>

      {/* Results Section */}
      {cachedIntel && (
        <div className="space-y-8 animate-fadeIn">
          {/* Interviewer Persona Insights */}
          <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8">
            <div className="flex items-center gap-2 text-xs text-blue-400 font-semibold mb-2">
              <UserCheck className="w-4 h-4" />
              <span>MÜLAKATÇI PROFİL ANALİZİ</span>
            </div>
            <h2 className="text-xl font-bold text-white mb-3">
              {cachedIntel.interviewerPersona.title} Gözünden Bu Mülakat
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed bg-slate-950/60 p-4 rounded-xl border border-slate-800 mb-6">
              {cachedIntel.interviewerPersona.mindset}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Top Priorities */}
              <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl">
                <div className="flex items-center gap-2 text-xs font-semibold text-blue-400 mb-2">
                  <Briefcase className="w-4 h-4" />
                  <span>En Çok Dikkat Ettiği Kriterler</span>
                </div>
                <ul className="space-y-1.5 text-xs text-slate-300">
                  {cachedIntel.interviewerPersona.topPriorities.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <span className="text-blue-500">·</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Secret Checklist */}
              <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl">
                <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 mb-2">
                  <ListChecks className="w-4 h-4" />
                  <span>Gizli Kontrol Listesi</span>
                </div>
                <ul className="space-y-1.5 text-xs text-slate-300">
                  {cachedIntel.interviewerPersona.secretChecklist.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <span className="text-emerald-500">·</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Red Flags */}
              <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl">
                <div className="flex items-center gap-2 text-xs font-semibold text-rose-400 mb-2">
                  <ShieldAlert className="w-4 h-4" />
                  <span>Kırmızı Çizgiler (Elenecek Noktalar)</span>
                </div>
                <ul className="space-y-1.5 text-xs text-slate-300">
                  {cachedIntel.interviewerPersona.redFlags.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <span className="text-rose-500">·</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          {/* Questions Section */}
          <section className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  Potansiyel Mülakat Soruları
                  <span className="text-xs font-mono font-normal text-slate-400 px-2 py-0.5 rounded-full bg-slate-800">
                    {filteredQuestions.length} Soru
                  </span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Soruları inceleyin ve 'Simülatörde Cevapla' ile anında STAR koçluk puanı alın.
                </p>
              </div>

              {/* Category Filter Tabs */}
              {categories.length > 2 && (
                <div className="flex items-center gap-1 p-1 bg-slate-900 border border-slate-800 rounded-xl overflow-x-auto">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setCategoryFilter(cat)}
                      className={`px-3 py-1 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
                        categoryFilter === cat
                          ? 'bg-blue-600 text-white'
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Questions List */}
            <div className="space-y-3">
              {filteredQuestions.map((q, idx) => {
                const isExpanded = expandedQuestionId === q.id;
                return (
                  <div
                    key={q.id || idx}
                    className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden transition-all duration-200 hover:border-slate-700"
                  >
                    {/* Question Header Row */}
                    <div className="p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div
                        className="flex-1 cursor-pointer"
                        onClick={() => setExpandedQuestionId(isExpanded ? null : q.id)}
                      >
                        <div className="flex items-center gap-2 text-xs text-slate-400 mb-1.5">
                          <span className="text-blue-400 font-medium">{q.category}</span>
                          <span aria-hidden="true">·</span>
                          <span className="font-mono">{q.difficulty}</span>
                        </div>
                        <h4 className="text-base font-semibold text-white leading-snug hover:text-blue-300 transition-colors">
                          {q.question}
                        </h4>
                      </div>

                      <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto">
                        <button
                          onClick={() =>
                            onStartSimulation(q, activeTitle, candidateRole, seniorityLevel)
                          }
                          className="flex-1 sm:flex-none px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-lg shadow-sm flex items-center justify-center gap-1.5 transition-colors"
                        >
                          <PlayCircle className="w-4 h-4" />
                          <span>Simülatörde Cevapla</span>
                        </button>
                        <button
                          onClick={() => setExpandedQuestionId(isExpanded ? null : q.id)}
                          className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
                          aria-label={isExpanded ? 'Detayları gizle' : 'Detayları göster'}
                        >
                          <ChevronRight
                            className={`w-5 h-5 transition-transform duration-200 ${
                              isExpanded ? 'rotate-90' : ''
                            }`}
                          />
                        </button>
                      </div>
                    </div>

                    {/* Question Expanded Coaching Details */}
                    {isExpanded && (
                      <div className="px-5 pb-5 pt-2 border-t border-slate-800/80 bg-slate-950/40 space-y-4 text-xs animate-fadeIn">
                        {/* Why asked */}
                        <div className="p-3.5 bg-slate-900 border border-slate-800 rounded-xl">
                          <div className="flex items-center gap-1.5 font-semibold text-slate-200 mb-1">
                            <HelpCircle className="w-3.5 h-3.5 text-blue-400" />
                            <span>Mülakatçı Bu Soruda Neyi Test Ediyor?</span>
                          </div>
                          <p className="text-slate-300 leading-relaxed">{q.whyInterviewerAsks}</p>
                        </div>

                        {/* Evaluation Criteria & Traps to Avoid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div className="p-3.5 bg-slate-900 border border-slate-800 rounded-xl">
                            <div className="flex items-center gap-1.5 font-semibold text-emerald-400 mb-1.5">
                              <ListChecks className="w-3.5 h-3.5" />
                              <span>Cevapta Aranacak Anahtar Unsurlar</span>
                            </div>
                            <ul className="space-y-1 text-slate-300">
                              {q.evaluationCriteria.map((c, i) => (
                                <li key={i} className="flex items-start gap-1.5">
                                  <span className="text-emerald-500">·</span>
                                  <span>{c}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          <div className="p-3.5 bg-slate-900 border border-slate-800 rounded-xl">
                            <div className="flex items-center gap-1.5 font-semibold text-rose-400 mb-1.5">
                              <AlertOctagon className="w-3.5 h-3.5" />
                              <span>Kaçınılması Gereken En Büyük Tuzak</span>
                            </div>
                            <p className="text-slate-300 leading-relaxed">{q.trapToAvoid}</p>
                          </div>
                        </div>

                        {/* Ideal framework & exemplary answer */}
                        <div className="p-3.5 bg-blue-950/20 border border-blue-900/30 rounded-xl">
                          <div className="flex items-center gap-1.5 font-semibold text-blue-400 mb-1.5">
                            <Lightbulb className="w-3.5 h-3.5" />
                            <span>İdeal Cevap Çatısı & Taktik</span>
                          </div>
                          <p className="text-slate-200 leading-relaxed mb-3">
                            {q.idealAnswerFramework}
                          </p>

                          <div className="border-t border-blue-900/30 pt-2.5">
                            <span className="font-semibold text-slate-300">
                              Örnek Güçlü Cevap Özeti:{' '}
                            </span>
                            <span className="text-slate-300 italic">
                              "{q.sampleExemplaryAnswer}"
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        </div>
      )}
    </div>
  );
};
