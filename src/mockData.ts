import { CompletedTraining } from './types';

export const PRESET_INTERVIEWER_TITLES = [
  {
    title: 'Stajyer / Yeni Mezun Yetenek Yöneticisi (Talent Specialist)',
    category: 'İK & İşe Alım',
    focus: 'Öğrenme potansiyeli, motivasyon, iletişim ve kültürel uyum',
  },
  {
    title: 'Engineering Manager (Yazılım Mühendisliği Müdürü)',
    category: 'Mühendislik Yönetimi',
    focus: 'Sorumluluk alma, takım çalışması, teslimat disiplini ve geri bildirime açıklık',
  },
  {
    title: 'Senior Software Engineer (Frontend / Backend)',
    category: 'Teknik Ekip',
    focus: 'Kodlama temelleri, debug yeteneği, algoritma ve framework çalışma prensibi',
  },
  {
    title: 'Tech Lead / Principal Architect',
    category: 'Sistem Mimarisi',
    focus: 'Sistem tasarımı, trade-off kararları, kod kalitesi ve ölçeklenebilirlik',
  },
  {
    title: 'CTO / Kurucu Ortak (Co-founder)',
    category: 'Üst Yönetim',
    focus: 'Vizyon, şirket kültürüne katkı, merak ve hızlı değer üretme',
  },
  {
    title: 'Senior HR Business Partner (HRBP)',
    category: 'İnsan Kaynakları',
    focus: 'STAR mülakat yöntemi, kriz anı yönetimi, uzun vadeli kariyer hedefleri',
  },
];

export const PRESET_TRAINING_PACKS: { label: string; description: string; trainings: CompletedTraining[] }[] = [
  {
    label: 'Üniversite / Yeni Mezun CS Temelleri Paketi',
    description: 'Üniversitede veya temel online eğitimlerde alınan algoritma, OOP ve web temelleri',
    trainings: [
      {
        id: 't-cs-1',
        title: 'Veri Yapıları ve Algoritmalar (Data Structures & Algorithms)',
        provider: 'Üniversite Müfredatı / Coursera',
        topicsCovered:
          'Diziler (Arrays), Bağlı Listeler (Linked Lists), Yığın ve Kuyruk (Stack & Queue), İkili Ağaçlar (Binary Trees), Sıralama ve Arama Algoritmaları (Quicksort, Binary Search), Big-O Karmaşıklık Analizi.',
        keyLearnings: 'Algoritmik düşünme, bellek ve zaman karmaşıklığı hesaplama.',
        completionYear: '2025',
      },
      {
        id: 't-cs-2',
        title: 'Nesne Yönelimli Programlama ve Java/C# Temelleri',
        provider: 'Üniversite Dersi / BTK Akademi',
        topicsCovered:
          'Encapsulation, Inheritance, Polymorphism, Abstraction, Interface kullanımı, Temel Design Pattern girişleri (Singleton, Factory), İstisna Yönetimi (Exception Handling).',
        keyLearnings: 'OOP prensipleriyle modüler kod yazma ve sınıf hiyerarşisi oluşturma.',
        completionYear: '2025',
      },
      {
        id: 't-cs-3',
        title: 'İlişkisel Veritabanları ve SQL Giriş',
        provider: 'BTK Akademi / Udemy',
        topicsCovered:
          'SELECT, INSERT, UPDATE, DELETE sorguları, JOIN operasyonları (INNER, LEFT, RIGHT), GROUP BY, HAVING, İndeksler, Birincil ve Yabancı Anahtarlar, Normalizasyon.',
        keyLearnings: 'Temel veri modelleme ve SQL ile sorgulama.',
        completionYear: '2025',
      },
    ],
  },
  {
    label: 'Modern Frontend & React Geliştirici Paketi',
    description: 'HTML5/CSS3, JavaScript ES6+ ve temel React eğitimi tamamlamış adaylar için',
    trainings: [
      {
        id: 't-fe-1',
        title: 'Sıfırdan İleri Seviye Modern JavaScript (ES6+)',
        provider: 'Udemy / Jonas Schmedtmann',
        topicsCovered:
          'Değişkenler, Fonksiyonlar, Arrow Functions, Array Metotları (map, filter, reduce), Asenkron JS (Promises, async/await, Fetch API), DOM Manipülasyonu, Event Loop ve Scope mantığı.',
        keyLearnings: 'Saf JavaScript ile interaktif web sayfaları ve dinamik veri çekme.',
        completionYear: '2025',
      },
      {
        id: 't-fe-2',
        title: 'React 19 & Tailwind CSS ile Web Geliştirme',
        provider: 'YouTube / Udemy',
        topicsCovered:
          'React Bileşenleri, JSX, Props, useState, useEffect, React Router ile sayfalama, Tailwind CSS utility class kullanımı, basit Todo App ve E-ticaret sepet arayüzü yapımı.',
        keyLearnings: 'Bileşen tabanlı UI geliştirme ve API verisini ekranda listeleme.',
        completionYear: '2026',
      },
    ],
  },
  {
    label: 'Backend & RESTful API Temelleri Paketi',
    description: 'Node.js/Express veya Python ile sunucu taraflı kodlama öğrenmiş adaylar',
    trainings: [
      {
        id: 't-be-1',
        title: 'Node.js, Express & MongoDB API Geliştirme',
        provider: 'Udemy',
        topicsCovered:
          'Node.js runtime temelleri, Express routing, Middleware kullanımı, MongoDB & Mongoose ile CRUD işlemleri, JWT ile kimlik doğrulama, Postman ile API testi.',
        keyLearnings: 'RESTful API mimarisi kurma ve veritabanı bağlantısı.',
        completionYear: '2025',
      },
      {
        id: 't-be-2',
        title: 'Git & GitHub ile Versiyon Kontrolü',
        provider: 'YouTube / Açık Kaynak Rehberi',
        topicsCovered:
          'git init, add, commit, branch açma, merge, pull request oluşturma, GitHub üzerinde repo yönetimi ve issue takibi.',
        keyLearnings: 'Takım çalışması için versiyon kontrol disiplini.',
        completionYear: '2025',
      },
    ],
  },
];
