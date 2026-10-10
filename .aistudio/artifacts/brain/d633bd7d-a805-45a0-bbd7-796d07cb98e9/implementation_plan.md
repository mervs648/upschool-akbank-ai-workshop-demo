# Kariyer & Mülakat Koçu (Career & Interview Coach Agent)

Yazılım ve teknoloji profesyonellerinin mülakat yapacağı kişinin unvanına göre özel soru setleri ve stratejileri üreten, tamamlanan eğitim içeriklerini analiz ederek bir sonraki adım için hedeflenmiş eğitim ve gelişim yol haritası çıkaran, interaktif mülakat simülatörüne sahip kapsamlı bir kariyer koçu platformu.

### User Review & Critical Decisions

> [!IMPORTANT]
> Aşağıdaki temel tercihler 1. aşama soru-cevap sürecinde netleştirilmiş olup bu doğrultuda planlanmıştır:

- **Confirmed Decision 1 (Hedef Kariyer Alanı)**: Yazılım ve Teknoloji (Frontend, Backend, DevOps, Cloud, Sistem Mimarisi vb.). Mülakatçı soruları ve eğitim boşluk analizleri bu alana göre optimize edilecek.
- **Confirmed Decision 2 (İnteraktif Mülakat Simülatörü)**: Kullanıcı üretilen sorulara kendi yanıtlarını yazıp gönderebilecek; yapay zeka adayın yanıtını STAR metodu, teknik derinlik ve iletişim kriterleriyle puanlayıp detaylı yapıcı geri bildirim sunacak.
- **Confirmed Decision 3 (Eğitim Verisi Girişi)**: Hem hızlı hazır şablonlar (Frontend React/TS, Backend Node/Go/Python, DevOps/Docker/K8s, vb.) hem de serbest metin/müfredat yapıştırma ve sertifika/içerik dosyası (.txt/.md/.json) yükleme desteği sağlanacak.
- **Tavsiye Edilen Model Seçimi**: Gemini 3.8 Flash (`gemini-3.8-flash`) — yapılandırılmış JSON çıktıları, derin teknik analiz, mülakat değerlendirmesi ve eğitim öneri motoru için yüksek hız ve yüksek muhakeme performansı sağlar.

---

### 1. Overview & Core Concept

- **Ne Yapar**:
  1. **Mülakatçı Unvanına Özel Soru & Taktik Motoru**: Kullanıcı gireceği mülakatçının unvanını (örneğin *Engineering Manager*, *Staff Backend Engineer*, *VP of Engineering*, *Senior HR Partner*, *Solutions Architect*) belirttiğinde; o unvanın bakış açısını, ölçtüğü kriterleri, potansiyel teknik/davranışsal/sistem tasarımı sorularını, "interviewer's secret checklist" maddelerini ve ideal cevap stratejilerini üretir.
  2. **İnteraktif Mülakat Simülasyonu**: Seçilen sorulara kullanıcının yazdığı veya denediği cevapları alır; STAR (Situation, Task, Action, Result) metodu, teknik doğruluk, terminoloji ve liderlik tonu üzerinden puanlayıp geliştirme tüyoları verir.
  3. **Eğitim Boşluk Analizi & Sonraki Adım Öneri Motoru**: Kullanıcının aldığı geçmiş eğitimleri (kurs içerikleri, sertifikalar, tamamlanan konular) inceler; güçlü yönlerini, eksik halkaları (blind spots) tespit eder ve bir sonraki adımda alması gereken spesifik eğitim konularını, somut müfredat maddelerini, proje fikirlerini ve kişiselleştirilmiş 30-60-90 günlük gelişim yol haritasını üretir.
  4. **Kariyer Dosyası & İlerleme Paneli**: Oturumları kaydetme, PDF/Markdown formatında mülakat hazırlık özeti ve eğitim yol haritası indirme imkanı.

- **Hedef Kitle**: Mülakatlara hazırlanan yazılım mühendisleri, kariyer basamağı atlamak (Senior, Lead, Staff, Manager) isteyen teknoloji profesyonelleri.
- **Ana Değer**: "Karşımda kim oturacak ve bana ne soracak?" belirsizliğini ortadan kaldırmak; rastgele eğitimler almak yerine mevcut bilgi birikimini bir üst seviyeye taşıyan stratejik eğitim adımları sunmak.

---

### 2. User Experience & Visual Design

- **Kullanıcı Akışı**:
  1. **Genel Bakış & Hızlı Başlangıç Paneli**: İki ana mod arasında geçiş yapılabilir:
     - **Mod A: Mülakat Hazırlığı (Interviewer Intel & Mock)**
     - **Mod B: Eğitim Analizi & Sonraki Adım Yol Haritası (Training Gap & Next Steps)**
  2. **Mod A Akışı**:
     - Kullanıcı mülakatçının unvanını girer (hızlı unvan çipleri: *Engineering Manager*, *Tech Lead / Principal*, *Senior HR / Talent Partner*, *Staff Frontend Engineer*, *Product VP*).
     - Şirket tipi veya seviye (Senior, Mid, FAANG vs Startup) opsiyonel olarak seçilebilir.
     - "Mülakat Zekasını Üret" tıklandığında yapay zeka: Mülakatçının motivasyonu, 6-8 odak sorusu, bu soruların altındaki gizli beklentiler ve ideal yanıt çatılarını oluşturur.
     - Her sorunun yanındaki "Simülatörde Cevapla" butonuyla interaktif pratik yapılır; anında puanlama ve koçluk yorumu alınır.
  3. **Mod B Akışı**:
     - Kullanıcı tamamladığı eğitimleri listeler (hızlı örnek setlerini tek tıkla yükleyebilir veya kendi kurs içeriklerini yapıştırabilir).
     - "Eğitimleri Analiz Et & Sonraki Adımı Belirle" tıklandığında yapay zeka:
       - Mevcut Yetkinlik Özeti (Neleri kapsıyor)
       - Kritik Boşluklar (Hangi kritik konular eksik kalmış)
       - Bir Sonraki Adım İçin Önerilen Eğitim Başlıkları (Örn: *Distributed Systems & Consensus Algorithms*, *Advanced Web Performance & Core Web Vitals at Scale*)
       - Örnek Öğrenme Planı ve Yapılacak Pekiştirme Projesi
  4. **Dışa Aktarma & Rapor**: Hazırlanan soru kartları ve eğitim önerileri temiz Markdown/Yazdırılabilir formatta kaydedilebilir.

- **Görsel Kimlik & Tema**:
  - *Estetik Yön*: Minimal, yüksek kaliteli SaaS çalışma alanı; "Bloomberg Terminal for Career Prep" ciddiyetinde, modern ve odaklanmayı artıran bir tasarım.
  - *Renk Paleti*:
    - Tuval: Temiz nötr arduvaz zemin (`#090D16` koyu tema veya `#FAFAFB` temiz açık tema / zarif slate-900 / slate-50 dengesi).
    - Vurgu Rengi: Stratejik kobalt/indigo (`#2563EB` / `#3B82F6`) ve başarı göstergeleri için narin zümrüt yeşili (`#10B981`).
    - Nötrler: Titizlikle dengelenmiş sınır çizgileri (`border-slate-200 dark:border-slate-800`), unboxed tipografik meta veriler (`·` ayraçlı).
  - *Tipografi*:
    - Başlıklar: `Plus Jakarta Sans` veya `Outfit` (modern, özgüvenli, dengeli).
    - Metin & İçerik: `Public Sans` / `DM Sans` (yüksek okunabilirlik).
    - Kod & Skor & Zaman: Tabular rakamlar (`tabular-nums font-mono`).
  - *Anti-Slop Kuralları*: Statik hap rozetler yok, sahte skor kokpitleri yok, anlamsız dekoratif yanıp sönen noktalar yok. Her buton gerçek bir fonksiyona bağlı.

---

### 3. Key Product Decisions & Trade-Offs

- **Karar 1: Model & API Mimarisi**
  - *Seçim*: Sunucu tarafında Node.js / Express proxy endpoint'leri üzerinden `gemini-3.8-flash` kullanımı. `responseSchema` ile yapılandırılmış JSON çıktısı.
  - *Neden*: Güvenli API anahtarı yönetimi, deterministik UI rendering ve yüksek model hızı.
  - *Alternatifler*: İstemcide doğrudan çağırmak güvenlik kurallarına aykırıdır; bu nedenle sunucu katmanı kullanılır.
- **Karar 2: Eğitim Analizi Algoritması**
  - *Seçim*: Sadece kurs adını değil, eğitim müfredat içeriklerini/konularını semantik olarak ayrıştırıp Bloom taksonomisi ve kıdem seviyesine göre boşluk analizi yapmak.
  - *Neden*: "React kursu aldım" demek yetersizdir; "React Fiber mimarisi, SSR ve concurrent features" kapsanıp kapsanmadığı bir sonraki eğitimin seviyesini belirler.
- **Karar 3: İnteraktif Mülakat Değerlendirme Çatısı**
  - *Seçim*: STAR formatı analizi (Durum, Görev, Eylem, Sonuç) + Teknik Hassasiyet + Mülakatçının Unvanına Uygun Dil Analizi.
  - *Neden*: Bir Engineering Manager strateji ve etki duymak isterken, Staff Engineer teknik derinlik ve trade-off duymak ister.

---

### 4. Technical Architecture & Data Strategy *(Technical Reference)*

```
┌────────────────────────────────────────────────────────────────────────┐
│                        Vite Frontend (React 19)                       │
│                                                                        │
│  ┌───────────────────────┐  ┌───────────────────────────────────────┐  │
│  │ Top Navigation        │  │ Active Mode Switch:                   │  │
│  │ Career Coach Agent    │  │ [Mülakat Hazırlığı] | [Eğitim Analizi]│  │
│  └───────────────────────┘  └───────────────────────────────────────┘  │
│                                                                        │
│  ┌───────────────────────────────────────────────────────────────────┐  │
│  │ View 1: Interviewer Intel & Mock Simulatörü                       │  │
│  │ - Unvan Seçici / Girişi (HR, EM, Lead, VP, Principal)             │  │
│  │ - Rol & Kıdem Seviyesi Ayarı                                      │  │
│  │ - Gemini Tarafından Üretilen Soru Kartları & Gizli Değerlendirme  │  │
│  │ - İnteraktif Cevap Simülatörü & Anlık STAR Geri Bildirim Paneli   │  │
│  └───────────────────────────────────────────────────────────────────┘  │
│                                                                        │
│  ┌───────────────────────────────────────────────────────────────────┐  │
│  │ View 2: Eğitim Boşluk Analizi & Sonraki Adım Motoru               │  │
│  │ - Tamamlanan Eğitimler Listesi (Örnek Şablonlar / Manuel / Dosya) │  │
│  │ - Yetkinlik Kapsama Analizi                                       │  │
│  │ - Boşluk & Eksik Konular Raporu                                   │  │
│  │ - Bir Sonraki Adım İçin Önerilen Spesifik Eğitim & Yol Haritası   │  │
│  └───────────────────────────────────────────────────────────────────┘  │
│                                   ▲                                    │
│                                   │ Fetch (/api/gemini/...)            │
└───────────────────────────────────┼────────────────────────────────────┘
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│               Server Proxy Backend (Node.js / Express / Vite)          │
│                                                                        │
│  POST /api/interview-intel      --> ai.models.generateContent (...)    │
│  POST /api/evaluate-answer      --> ai.models.generateContent (...)    │
│  POST /api/training-gap-analysis--> ai.models.generateContent (...)    │
│                                                                        │
│  SDK: @google/genai (model: gemini-3.8-flash, thinking: default)      │
│  Headers: 'User-Agent': 'aistudio-build'                               │
│  Key: process.env.GEMINI_API_KEY                                       │
└────────────────────────────────────────────────────────────────────────┘
```

- **Veri Modelleri & Durum Yönetimi**:
  - `InterviewerProfile`: `{ title, seniority, companyType, candidateRole }`
  - `InterviewQuestion`: `{ id, category, question, whyInterviewerAsks, lookFor, redFlags, sampleGoodAnswer }`
  - `AnswerEvaluation`: `{ score, starBreakdown: { situation, task, action, result }, strengths, improvements, coachAdvice }`
  - `CompletedTraining`: `{ id, title, provider, topicsCovered, completionDate }`
  - `TrainingAnalysisResult`: `{ coveredSkills, blindSpots, nextTrainingRecommendations: [{ title, difficulty, keyModules, targetOutcome, suggestedProjects }], roadmap30_60_90 }`
  - Oturum durumu `localStorage` ile yedeklenerek sayfa yenilense dahi kullanıcının eğitim ve mülakat notları korunur.
