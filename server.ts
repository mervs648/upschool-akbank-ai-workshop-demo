import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '10mb' }));

// Shared server-side Gemini client utility
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Helper for model calling with transient 503/429 fallback and retry
async function generateContentWithFallback(config: any) {
  const modelsToTry = ['gemini-3.8-flash', 'gemini-flash-latest', 'gemini-3.1-flash-lite'];
  let lastError: any = null;

  for (const model of modelsToTry) {
    try {
      const response = await ai.models.generateContent({
        ...config,
        model,
      });
      return response;
    } catch (err: any) {
      lastError = err;
      console.warn(`Model ${model} failed, attempting next if transient:`, err?.message || err);
      // Wait 800ms before next attempt
      await new Promise((resolve) => setTimeout(resolve, 800));
    }
  }
  throw lastError;
}

// Endpoint 1: Generate Interview Questions & Persona Insights based on Interviewer Title
app.post('/api/interview-intel', async (req: Request, res: Response) => {
  try {
    const {
      interviewerTitle,
      candidateTargetRole = 'Yazılım Mühendisi',
      seniorityLevel = 'Yeni Mezun / Staj Arayan',
      companyType = 'Genel Teknoloji Şirketi',
      additionalNotes = '',
    } = req.body;

    if (!interviewerTitle || typeof interviewerTitle !== 'string') {
      return res.status(400).json({ error: 'Mülakatçı unvanı (interviewerTitle) gereklidir.' });
    }

    const prompt = `Sen kıdemli bir Teknik İşe Alım Direktörü ve Kariyer Koçusun.
Aday yazılım/teknoloji mülakatına girecek ve mülakatı yapacak kişinin unvanı: "${interviewerTitle}".
Adayın hedef pozisyonu: "${candidateTargetRole}".
Adayın seviyesi: "${seniorityLevel}" (Özellikle üniversiteden yeni mezun, staj veya iş arayanlar, ya da junior adaylar olabilir).
Şirket türü/kültürü: "${companyType}".
Ekstra bağlam/notlar: "${additionalNotes}".

Lütfen bu spesifik unvana sahip mülakatçının psikolojisini, motivasyonunu ve adaya yönelteceği en muhtemel, en vurucu 6 adet mülakat sorusunu derinlemesine analiz et.
Unvanın bakış açısı çok önemlidir:
- Eğer HR / Yetenek Uzmanı ise: Kültürel uyum, motivasyon, iletişim, takım çalışması, kariyer hedefi, zor durum yönetimi.
- Eğer Engineering Manager / Direktör ise: Sorumluluk alma, öğrenme hızı, geri bildirime açıklık, sistemik düşünme, iş etiği, teslimat disiplini.
- Eğer Senior / Staff / Tech Lead ise: Temel veri yapıları ve algoritmalar, kod kalitesi, debug yeteneği, trade-off analizi, kullanılan framework'ün arkasındaki çalışma mantığı.
- Eğer Kurucu / CTO ise: Şirkete katma değer, merak, adaptasyon hızı, tutku.

Yanıtı aşağıdaki JSON formatında üret.`;

    const response = await generateContentWithFallback({
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            interviewerPersona: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                mindset: { type: Type.STRING, description: 'Bu mülakatçının adaya bakış açısı ve mülakattaki zihniyeti' },
                topPriorities: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: 'Bu unvanın adayda en çok aradığı 3-4 kilit özellik',
                },
                secretChecklist: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: 'Adayın fark etmediği ama bu mülakatçının puanladığı gizli kriterler',
                },
                redFlags: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: 'Bu mülakatçıyı derhal soğutan ve elenmeye sebep olan kırmızı çizgiler',
                },
              },
              required: ['title', 'mindset', 'topPriorities', 'secretChecklist', 'redFlags'],
            },
            questions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  category: { type: Type.STRING, description: 'Örn: Teknik Derinlik, Davranışsal & STAR, Problem Çözme, Motivasyon, vb.' },
                  difficulty: { type: Type.STRING, description: 'Başlangıç, Orta veya İleri Seviye' },
                  question: { type: Type.STRING, description: 'Mülakatçının soracağı net soru cümlesi' },
                  whyInterviewerAsks: { type: Type.STRING, description: 'Bu mülakatçı neden tam olarak bunu soruyor?' },
                  evaluationCriteria: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                    description: 'Cevapta aranacak 3 kilit unsur',
                  },
                  idealAnswerFramework: { type: Type.STRING, description: 'Aday cevabı nasıl kurgulamalı? STAR veya teknik çerçeve taktiği' },
                  sampleExemplaryAnswer: { type: Type.STRING, description: 'Mülakatçıyı etkileyecek örnek güçlü cevap özeti' },
                  trapToAvoid: { type: Type.STRING, description: 'Bu soruda adayların düştüğü en yaygın tuzak' },
                },
                required: [
                  'id',
                  'category',
                  'difficulty',
                  'question',
                  'whyInterviewerAsks',
                  'evaluationCriteria',
                  'idealAnswerFramework',
                  'sampleExemplaryAnswer',
                  'trapToAvoid',
                ],
              },
            },
          },
          required: ['interviewerPersona', 'questions'],
        },
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json(parsed);
  } catch (error: any) {
    console.error('Error generating interview intel:', error);
    return res.status(500).json({
      error: 'Mülakat soruları üretilirken bir hata oluştu: ' + (error?.message || 'Bilinmeyen hata'),
    });
  }
});

// Endpoint 2: Evaluate Candidate's Answer in the Mock Simulator
app.post('/api/evaluate-answer', async (req: Request, res: Response) => {
  try {
    const {
      question,
      interviewerTitle,
      candidateAnswer,
      candidateTargetRole = 'Yazılım Mühendisi',
      seniorityLevel = 'Yeni Mezun / Staj Arayan',
    } = req.body;

    if (!question || !candidateAnswer) {
      return res.status(400).json({ error: 'Soru ve aday cevabı zorunludur.' });
    }

    const prompt = `Sen uzman bir Kariyer ve Mülakat Simülatörü Koçusun.
Karşındaki mülakatçı: "${interviewerTitle || 'Kıdemli Mülakatçı'}".
Aday pozisyonu ve seviyesi: "${candidateTargetRole}" - "${seniorityLevel}".

SORULAN SORU:
"${question}"

ADAYIN VERDİĞİ CEVAP:
"${candidateAnswer}"

Lütfen adayın bu cevabını detaylı incele.
Özellikle:
1. STAR Metodu (Durum, Görev, Eylem, Sonuç) veya Teknik Açıklık dengesi nasıl?
2. Mülakatçının unvanı ("${interviewerTitle}") bu cevaptan tatmin olur mu?
3. Cevapta samimiyet, sahiplenme, teknik doğruluk ve gelişim zihniyeti var mı?
4. Adayın puanı (1-100), güçlü yönleri, eksik kalan yönleri ve cevabın çok daha etkileyici bir şekilde nasıl yeniden ifade edilebileceğini (Örnek Revize Edilmiş Cevap) üret.

Yanıtı aşağıdaki JSON şemasında ver.`;

    const response = await generateContentWithFallback({
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            overallScore: { type: Type.INTEGER, description: '1 ile 100 arasında puan' },
            verdict: { type: Type.STRING, description: 'Güçlü Kabul, Olumlu, Geliştirilmeli veya Riskli' },
            summary: { type: Type.STRING, description: 'Cevabın genel özeti ve etkisi' },
            starAnalysis: {
              type: Type.OBJECT,
              properties: {
                situation: { type: Type.STRING, description: 'Durum (Situation) analizi ve puanı' },
                task: { type: Type.STRING, description: 'Görev (Task) analizi ve puanı' },
                action: { type: Type.STRING, description: 'Eylem (Action) analizi ve puanı' },
                result: { type: Type.STRING, description: 'Sonuç (Result) analizi ve puanı' },
              },
              required: ['situation', 'task', 'action', 'result'],
            },
            strengths: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'Cevaptaki en başarılı 2-3 nokta',
            },
            improvements: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'Somut gelişim önerileri',
            },
            revisedAnswerExample: {
              type: Type.STRING,
              description: 'Adayın aynı deneyimi çok daha profesyonel ve etkileyici anlatan revize cevap versiyonu',
            },
            interviewerImpression: {
              type: Type.STRING,
              description: 'Bu unvandaki mülakatçının bu cevabı dinlerken aklından geçen iç monolog',
            },
          },
          required: [
            'overallScore',
            'verdict',
            'summary',
            'starAnalysis',
            'strengths',
            'improvements',
            'revisedAnswerExample',
            'interviewerImpression',
          ],
        },
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json(parsed);
  } catch (error: any) {
    console.error('Error evaluating answer:', error);
    return res.status(500).json({
      error: 'Cevap değerlendirilirken hata oluştu: ' + (error?.message || 'Bilinmeyen hata'),
    });
  }
});

// Endpoint 3: Analyze Completed Trainings, Identify Skill Gaps, and Recommend Next Learning Steps
app.post('/api/training-gap-analysis', async (req: Request, res: Response) => {
  try {
    const {
      completedTrainings = [],
      targetCareerGoal = 'Junior / Yeni Mezun Yazılım Geliştirici olarak sektöre girmek',
      currentLevel = 'Yeni Mezun / Öğrenci / Staj Arayan',
      learningStylePreference = 'Proje odaklı, uygulamalı',
    } = req.body;

    if (!Array.isArray(completedTrainings) || completedTrainings.length === 0) {
      return res.status(400).json({ error: 'En az bir tamamlanan eğitim/kurs içeriği sağlanmalıdır.' });
    }

    const trainingSummaries = completedTrainings
      .map(
        (t: any, idx: number) =>
          `[Eğitim #${idx + 1}]
Başlık: ${t.title || 'Belirtilmedi'}
Platform / Kurum: ${t.provider || 'Belirtilmedi'}
İçerik / Müfredat Konuları:
${t.topicsCovered || t.content || 'Detay verilmedi'}
Kazanılan Beceriler: ${t.keyLearnings || 'Belirtilmedi'}`
      )
      .join('\n\n');

    const prompt = `Sen Baş Teknoloji Eğitmeni ve Yazılım Kariyer Danışmanısın.
Bir yazılım geliştirici / adayın katıldığı ve tamamladığı eğitimlerin içeriklerini aşağıda veriyorum.

ADAYIN HEDEFİ:
"${targetCareerGoal}"

ADAYIN MEVCUT DURUMU:
"${currentLevel}" (Özellikle üniversiteden yeni mezun, stajyer veya iş arayan olabilir).

TAMAMLANAN EĞİTİMLER VE İÇERİKLERİ:
${trainingSummaries}

ÖĞRENME TERCİHİ:
"${learningStylePreference}"

GÖREVİN:
1. Bu eğitim içeriklerini derinlemesine analiz et: Aday neleri öğrenmiş, hangi teorik ve pratik temelleri atmış?
2. KRİTİK BOŞLUKLARI (Blind Spots) tespit et: Hedef pozisyondaki mülakatlarda ve gerçek iş ortamında olup da bu eğitimlerde hiç bahsedilmeyen veya yüzeysel geçilen konular neler? (Örn: Sadece React state öğrenilmiş ama Test/Jest/Cypress, CI/CD, State Management mimarisi, Performance optimization veya Docker atlanmış mı?)
3. BİR SONRAKİ ADIM İÇİN EĞİTİM ÖNERİSİ: Aday bundan sonra HANGİ EĞİTİMİ almalı?
   - Spesifik eğitim başlığı
   - İçinde kesinlikle bulunması gereken modüller/müfredat
   - Hangi seviyede olmalı (Başlangıç/Orta/İleri)
   - Bu eğitimin sonunda yapması gereken somut portfolyo projesi
4. 30-60-90 Günlük Odaklanmış Öğrenme ve Aksiyon Yol Haritası çıkar.
5. Yeni mezunlar ve staj arayanlar için kariyer koçundan altın tavsiye ver.

Yanıtı aşağıdaki JSON şemasında ver.`;

    const response = await generateContentWithFallback({
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            currentSkillsProfile: {
              type: Type.OBJECT,
              properties: {
                masteredSkills: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: 'Eğitimlerden sağlam kazanılmış yetkinlikler',
                },
                inProgressOrSurfaceSkills: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: 'Temeli atılmış ancak derinleşilmesi gereken konular',
                },
                overallAssessment: {
                  type: Type.STRING,
                  description: 'Adayın mevcut teknik altyapısının genel değerlendirmesi',
                },
              },
              required: ['masteredSkills', 'inProgressOrSurfaceSkills', 'overallAssessment'],
            },
            criticalGaps: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  topic: { type: Type.STRING, description: 'Eksik olan konu veya teknoloji' },
                  whyCritical: { type: Type.STRING, description: 'Mülakatlarda veya işte neden bu konu belirleyici?' },
                  riskLevel: { type: Type.STRING, description: 'Yüksek / Kritik / Orta' },
                },
                required: ['topic', 'whyCritical', 'riskLevel'],
              },
            },
            nextTrainingRecommendations: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  order: { type: Type.INTEGER },
                  trainingTitle: { type: Type.STRING, description: 'Alınması önerilen spesifik eğitimin adı' },
                  level: { type: Type.STRING, description: 'Orta / İleri / Uzmanlık' },
                  targetOutcome: { type: Type.STRING, description: 'Bu eğitimin adaya katacağı sıçrama' },
                  mustHaveCurriculum: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                    description: 'Eğitimde mutlaka olması gereken 4-6 ana konu',
                  },
                  handsOnPortfolioProject: {
                    type: Type.STRING,
                    description: 'Bu eğitimin ardından GitHub portfolyosuna eklenecek somut proje',
                  },
                  estimatedEffort: { type: Type.STRING, description: 'Tahmini süre (Örn: 3 Hafta, günde 2 saat)' },
                  recommendedKeywords: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                    description: 'Kurs ararken bakılacak arama terimleri veya platformlar',
                  },
                },
                required: [
                  'order',
                  'trainingTitle',
                  'level',
                  'targetOutcome',
                  'mustHaveCurriculum',
                  'handsOnPortfolioProject',
                  'estimatedEffort',
                  'recommendedKeywords',
                ],
              },
            },
            roadmap30_60_90: {
              type: Type.OBJECT,
              properties: {
                first30Days: { type: Type.STRING, description: '1-30 Gün: Acil kapatılması gereken temel boşluklar' },
                days31To60: { type: Type.STRING, description: '31-60 Gün: İleri seviye konular ve proje üretimi' },
                days61To90: { type: Type.STRING, description: '61-90 Gün: Mülakat hazırlığı, portfolyo cilalama ve iş başvurusu' },
              },
              required: ['first30Days', 'days31To60', 'days61To90'],
            },
            coachAdviceForNewGrads: {
              type: Type.STRING,
              description: 'Özellikle yeni mezun / staj / junior adaylara özel stratejik kariyer tavsiyesi',
            },
          },
          required: [
            'currentSkillsProfile',
            'criticalGaps',
            'nextTrainingRecommendations',
            'roadmap30_60_90',
            'coachAdviceForNewGrads',
          ],
        },
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json(parsed);
  } catch (error: any) {
    console.error('Error analyzing trainings:', error);
    return res.status(500).json({
      error: 'Eğitim analizi yapılırken hata oluştu: ' + (error?.message || 'Bilinmeyen hata'),
    });
  }
});

// Vite Middleware for Development / Static serving for production
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`Career Coach server running on port ${PORT}`);
  });
}

startServer();
