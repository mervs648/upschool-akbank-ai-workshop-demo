import React, { useState } from 'react';
import { X, Send, Award, CheckCircle2, AlertTriangle, MessageSquare, Sparkles, RefreshCw, BookmarkPlus } from 'lucide-react';
import { InterviewQuestion, AnswerEvaluation } from '../types';

interface AnswerModalProps {
  question: InterviewQuestion;
  interviewerTitle: string;
  candidateRole: string;
  seniorityLevel: string;
  onClose: () => void;
  onSaveSession: (evalData: AnswerEvaluation, answerText: string) => void;
}

export const AnswerModal: React.FC<AnswerModalProps> = ({
  question,
  interviewerTitle,
  candidateRole,
  seniorityLevel,
  onClose,
  onSaveSession,
}) => {
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);
  const [evaluation, setEvaluation] = useState<AnswerEvaluation | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const starterPhrases = [
    'Üniversite bitirme projemizde bir ekiple çalışırken...',
    'Katıldığım bir hackathonda zaman kısıtı altında...',
    'Staj sürecimde production ortamında karşılaştığımız bir bug sırasında...',
    'Kendi geliştirdiğim açık kaynaklı projede kullanıcı geri bildirimlerini incelerken...',
  ];

  const handleEvaluate = async () => {
    if (!answer.trim() || answer.trim().length < 15) {
      setError('Lütfen koçluk analizi yapabilmemiz için en az bir iki cümlelik somut bir cevap yazın.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/evaluate-answer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: question.question,
          interviewerTitle,
          candidateAnswer: answer,
          candidateTargetRole: candidateRole,
          seniorityLevel,
        }),
      });

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.error || 'Cevap değerlendirilemedi.');
      }

      const data: AnswerEvaluation = await res.json();
      setEvaluation(data);
    } catch (err: any) {
      setError(err.message || 'Değerlendirme sırasında bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = () => {
    if (evaluation) {
      onSaveSession(evaluation, answer);
      setSaved(true);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 sm:p-8 my-8 max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          aria-label="Kapat"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="mb-6 pr-8">
          <div className="text-xs text-blue-400 font-medium mb-1">
            {interviewerTitle} · {question.category}
          </div>
          <h2 className="text-xl font-bold text-white leading-snug">
            {question.question}
          </h2>
          <p className="text-xs text-slate-400 mt-2 bg-slate-950/60 p-3 rounded-lg border border-slate-800/80">
            <span className="text-slate-300 font-semibold">Mülakatçının Beklentisi: </span>
            {question.whyInterviewerAsks}
          </p>
        </div>

        {/* Input Phase */}
        {!evaluation ? (
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-slate-200">
                  Cevabınızı Yazın
                </label>
                <span className="text-xs text-slate-500 font-mono tabular-nums">
                  {answer.length} karakter
                </span>
              </div>
              <textarea
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder="Örneğin: Üniversite 3. sınıfta yaptığımız projede veritabanı sorgularının yavaşladığını fark ettim. Bunun üzerine indeksleme uygulayarak yanıt süresini %40 düşürdüm..."
                rows={6}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>

            {/* Quick Starter Templates */}
            <div>
              <div className="text-xs text-slate-400 mb-2">Hızlı Giriş Kalıpları (Yeni Mezun & Staj İçin):</div>
              <div className="flex flex-wrap gap-2">
                {starterPhrases.map((phrase, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setAnswer((prev) => (prev ? prev + ' ' + phrase : phrase))}
                    className="text-xs px-2.5 py-1.5 rounded-md bg-slate-800/80 hover:bg-slate-800 text-slate-300 border border-slate-700/60 hover:text-white transition-colors text-left"
                  >
                    + {phrase.slice(0, 36)}...
                  </button>
                ))}
              </div>
            </div>

            {/* STAR coaching reminder */}
            <div className="p-3.5 bg-blue-950/20 border border-blue-900/30 rounded-xl text-xs text-blue-300 flex items-start gap-3">
              <Sparkles className="w-4 h-4 shrink-0 text-blue-400 mt-0.5" />
              <div>
                <span className="font-semibold text-blue-200">Koç İpucu (STAR Metodu): </span>
                Cevabınızda mutlaka <strong>Durum (S)</strong>, üstlendiğiniz <strong>Görev (T)</strong>, bizzat attığınız teknik <strong>Eylem (A)</strong> ve elde edilen somut <strong>Sonuç (R)</strong> veya edindiğiniz dersi belirtin.
              </div>
            </div>

            {error && (
              <div className="p-3 bg-red-950/30 border border-red-900/50 rounded-xl text-xs text-red-300">
                {error}
              </div>
            )}

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
              >
                Vazgeç
              </button>
              <button
                type="button"
                onClick={handleEvaluate}
                disabled={loading}
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold rounded-lg shadow-sm flex items-center gap-2 disabled:opacity-50 transition-colors"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Koç İnceliyor...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Cevabı Değerlendir</span>
                  </>
                )}
              </button>
            </div>
          </div>
        ) : (
          /* Evaluation Results Phase */
          <div className="space-y-6">
            {/* Score & Verdict Banner */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-slate-950 border border-slate-800 rounded-xl gap-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl bg-blue-600/20 border border-blue-500/30 flex flex-col items-center justify-center font-mono">
                  <span className="text-2xl font-bold text-blue-400 tabular-nums">
                    {evaluation.overallScore}
                  </span>
                  <span className="text-[10px] text-slate-400">/100</span>
                </div>
                <div>
                  <div className="text-xs text-slate-400">Genel Değerlendirme</div>
                  <div className="text-base font-bold text-white flex items-center gap-2">
                    {evaluation.verdict}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  onClick={handleSave}
                  disabled={saved}
                  className={`flex-1 sm:flex-none px-3.5 py-2 text-xs font-medium rounded-lg border transition-colors flex items-center justify-center gap-1.5 ${
                    saved
                      ? 'bg-emerald-950/40 border-emerald-800/60 text-emerald-300'
                      : 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-200'
                  }`}
                >
                  <BookmarkPlus className="w-3.5 h-3.5" />
                  <span>{saved ? 'Kaydedildi' : 'Sonucu Kaydet'}</span>
                </button>
                <button
                  onClick={() => setEvaluation(null)}
                  className="px-3.5 py-2 text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg border border-slate-700 transition-colors"
                >
                  Tekrar Dene
                </button>
              </div>
            </div>

            {/* Coach Summary */}
            <div className="text-sm text-slate-300 leading-relaxed bg-slate-950/50 p-4 rounded-xl border border-slate-800">
              <span className="font-semibold text-white">Koç Yorumu: </span>
              {evaluation.summary}
            </div>

            {/* STAR Breakdown */}
            <div>
              <h3 className="text-xs uppercase font-semibold text-slate-400 tracking-wider mb-3">
                STAR Metodu Analizi
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-slate-950 border border-slate-800/80 rounded-lg">
                  <span className="font-semibold text-blue-400">Situation (Durum):</span>
                  <p className="text-slate-300 mt-1">{evaluation.starAnalysis.situation}</p>
                </div>
                <div className="p-3 bg-slate-950 border border-slate-800/80 rounded-lg">
                  <span className="font-semibold text-blue-400">Task (Görev):</span>
                  <p className="text-slate-300 mt-1">{evaluation.starAnalysis.task}</p>
                </div>
                <div className="p-3 bg-slate-950 border border-slate-800/80 rounded-lg">
                  <span className="font-semibold text-blue-400">Action (Eylem):</span>
                  <p className="text-slate-300 mt-1">{evaluation.starAnalysis.action}</p>
                </div>
                <div className="p-3 bg-slate-950 border border-slate-800/80 rounded-lg">
                  <span className="font-semibold text-blue-400">Result (Sonuç):</span>
                  <p className="text-slate-300 mt-1">{evaluation.starAnalysis.result}</p>
                </div>
              </div>
            </div>

            {/* Strengths & Improvements */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 bg-emerald-950/10 border border-emerald-900/30 rounded-xl">
                <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 mb-2">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Güçlü Noktalar</span>
                </div>
                <ul className="space-y-1.5 text-xs text-slate-300">
                  {evaluation.strengths.map((s, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <span className="text-emerald-500">·</span>
                      <span>{s}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-4 bg-amber-950/10 border border-amber-900/30 rounded-xl">
                <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 mb-2">
                  <AlertTriangle className="w-4 h-4" />
                  <span>Geliştirilecek Alanlar</span>
                </div>
                <ul className="space-y-1.5 text-xs text-slate-300">
                  {evaluation.improvements.map((imp, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <span className="text-amber-500">·</span>
                      <span>{imp}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Interviewer Impression */}
            <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl">
              <div className="flex items-center gap-2 text-xs font-semibold text-indigo-400 mb-1.5">
                <MessageSquare className="w-4 h-4" />
                <span>Mülakatçının ({interviewerTitle}) İç Sesi</span>
              </div>
              <p className="text-xs text-slate-300 italic leading-relaxed">
                "{evaluation.interviewerImpression}"
              </p>
            </div>

            {/* Revised Model Answer */}
            <div className="p-4 bg-blue-950/20 border border-blue-900/30 rounded-xl">
              <div className="flex items-center gap-2 text-xs font-semibold text-blue-400 mb-2">
                <Sparkles className="w-4 h-4" />
                <span>Nasıl Cevaplarsanız Mest Ederdi? (Örnek Revize Cevap)</span>
              </div>
              <p className="text-xs text-slate-200 leading-relaxed whitespace-pre-line bg-slate-950/60 p-3 rounded-lg border border-blue-900/20">
                {evaluation.revisedAnswerExample}
              </p>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={onClose}
                className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-white text-sm font-medium rounded-lg transition-colors"
              >
                Pencereyi Kapat
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
