import React, { useState } from 'react';
import { BookmarkCheck, Copy, Check, Trash2, ArrowRight, Award, MessageSquare, Sparkles } from 'lucide-react';
import { SavedPracticeSession } from '../types';

interface SavedSessionsViewProps {
  sessions: SavedPracticeSession[];
  onDeleteSession: (id: string) => void;
  onClearAll: () => void;
  onGoToInterview: () => void;
}

export const SavedSessionsView: React.FC<SavedSessionsViewProps> = ({
  sessions,
  onDeleteSession,
  onClearAll,
  onGoToInterview,
}) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (session: SavedPracticeSession) => {
    const text = `=== MÜLAKAT SORU PRATİĞİ ===
Mülakatçı: ${session.interviewerTitle}
Hedef Pozisyon: ${session.candidateRole}
Tarih: ${new Date(session.timestamp).toLocaleDateString('tr-TR')}

SORU:
${session.question}

ADAY CEVABI:
${session.candidateAnswer}

DEĞERLENDİRME:
Puan: ${session.evaluation.overallScore}/100 (${session.evaluation.verdict})
Özet: ${session.evaluation.summary}

STAR ANALİZİ:
- Durum: ${session.evaluation.starAnalysis.situation}
- Görev: ${session.evaluation.starAnalysis.task}
- Eylem: ${session.evaluation.starAnalysis.action}
- Sonuç: ${session.evaluation.starAnalysis.result}

REVİZE EDİLMİŞ ÖRNEK CEVAP:
${session.evaluation.revisedAnswerExample}
`;

    navigator.clipboard.writeText(text);
    setCopiedId(session.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleExportAllMarkdown = () => {
    let md = `# Kariyer & Mülakat Koçu - Pratik Raporu\nOluşturulma Tarihi: ${new Date().toLocaleDateString('tr-TR')}\n\n`;

    sessions.forEach((s, idx) => {
      md += `## ${idx + 1}. ${s.question}\n`;
      md += `- **Mülakatçı Unvanı:** ${s.interviewerTitle}\n`;
      md += `- **Hedef Pozisyon:** ${s.candidateRole}\n`;
      md += `- **Puan:** ${s.evaluation.overallScore}/100 (${s.evaluation.verdict})\n\n`;
      md += `### Sizin Cevabınız\n>${s.candidateAnswer}\n\n`;
      md += `### Koç Revize Cevap Önerisi\n${s.evaluation.revisedAnswerExample}\n\n`;
      md += `### STAR Değerlendirmesi\n- **Durum:** ${s.evaluation.starAnalysis.situation}\n- **Görev:** ${s.evaluation.starAnalysis.task}\n- **Eylem:** ${s.evaluation.starAnalysis.action}\n- **Sonuç:** ${s.evaluation.starAnalysis.result}\n\n---\n\n`;
    });

    const blob = new Blob([md], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `mulakat-pratik-raporu-${Date.now()}.md`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <BookmarkCheck className="w-5 h-5 text-blue-400" />
            <span>Kaydedilen Pratik Oturumları</span>
            <span className="text-xs font-mono font-normal text-slate-400 px-2 py-0.5 rounded-full bg-slate-800">
              {sessions.length} Oturum
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Mülakat simülatöründe verdiğiniz cevaplar, STAR puanları ve revize model yanıtlar burada saklanır.
          </p>
        </div>

        {sessions.length > 0 && (
          <div className="flex items-center gap-2">
            <button
              onClick={handleExportAllMarkdown}
              className="px-3.5 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>Markdown Raporu İndir</span>
            </button>
            <button
              onClick={onClearAll}
              className="px-3.5 py-2 bg-slate-800 hover:bg-rose-950/40 text-slate-400 hover:text-rose-400 text-xs font-medium rounded-lg border border-slate-700 transition-colors"
            >
              Tümünü Temizle
            </button>
          </div>
        )}
      </div>

      {sessions.length === 0 ? (
        <div className="p-12 text-center bg-slate-900 border border-dashed border-slate-800 rounded-2xl">
          <BookmarkCheck className="w-10 h-10 text-slate-600 mx-auto mb-3" />
          <h3 className="text-base font-bold text-white">Henüz kaydedilmiş pratik oturumu yok</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto mb-4">
            Mülakatçı Soruları sekmesinden bir soru seçip "Simülatörde Cevapla" butonuna tıklayarak pratik yapabilir ve sonuçları buraya kaydedebilirsiniz.
          </p>
          <button
            onClick={onGoToInterview}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-lg inline-flex items-center gap-1.5 transition-colors"
          >
            <span>Mülakat Pratiğine Başla</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {sessions.map((s) => (
            <div
              key={s.id}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 hover:border-slate-700 transition-colors"
            >
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
                <div>
                  <div className="text-xs text-blue-400 font-medium">
                    {s.interviewerTitle} · {s.candidateRole}
                  </div>
                  <h3 className="text-base font-bold text-white mt-0.5">{s.question}</h3>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 font-mono text-xs">
                    <span className="font-bold text-blue-400 tabular-nums">
                      {s.evaluation.overallScore}/100
                    </span>
                    <span className="text-slate-500">·</span>
                    <span className="text-slate-300 font-sans">{s.evaluation.verdict}</span>
                  </div>

                  <button
                    onClick={() => handleCopy(s)}
                    className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
                    title="Panoya Kopyala"
                  >
                    {copiedId === s.id ? (
                      <Check className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>

                  <button
                    onClick={() => onDeleteSession(s.id)}
                    className="p-2 text-slate-400 hover:text-rose-400 rounded-lg hover:bg-slate-800 transition-colors"
                    title="Sil"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Answers Comparison */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                {/* Candidate Answer */}
                <div className="p-4 bg-slate-950 rounded-xl border border-slate-800">
                  <div className="font-semibold text-slate-300 mb-2">Verdiğiniz Cevap</div>
                  <p className="text-slate-400 leading-relaxed whitespace-pre-line">
                    {s.candidateAnswer}
                  </p>
                </div>

                {/* Revised Model Answer */}
                <div className="p-4 bg-blue-950/20 rounded-xl border border-blue-900/30">
                  <div className="font-semibold text-blue-400 mb-2 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Önerilen Revize Cevap (STAR Modeli)</span>
                  </div>
                  <p className="text-slate-200 leading-relaxed whitespace-pre-line">
                    {s.evaluation.revisedAnswerExample}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
