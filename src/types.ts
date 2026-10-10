export type SeniorityLevel =
  | 'Üniversite Öğrencisi / Staj Arayan'
  | 'Yeni Mezun (Entry-level / New Grad)'
  | 'Junior (0-2 Yıl Deneyim)'
  | 'Mid-level (2-4 Yıl Deneyim)'
  | 'Senior (5+ Yıl Deneyim)';

export type CompanyType =
  | 'Hızlı Büyüyen Startup'
  | 'Kurumsal / FinTech / Banka'
  | 'Yazılım Evi / Danışmanlık'
  | 'Global Teknoloji / FAANG Tarzı';

export interface InterviewerPersona {
  title: string;
  mindset: string;
  topPriorities: string[];
  secretChecklist: string[];
  redFlags: string[];
}

export interface InterviewQuestion {
  id: string;
  category: string;
  difficulty: string;
  question: string;
  whyInterviewerAsks: string;
  evaluationCriteria: string[];
  idealAnswerFramework: string;
  sampleExemplaryAnswer: string;
  trapToAvoid: string;
}

export interface InterviewIntelResponse {
  interviewerPersona: InterviewerPersona;
  questions: InterviewQuestion[];
}

export interface AnswerEvaluation {
  overallScore: number;
  verdict: 'Güçlü Kabul' | 'Olumlu' | 'Geliştirilmeli' | 'Riskli' | string;
  summary: string;
  starAnalysis: {
    situation: string;
    task: string;
    action: string;
    result: string;
  };
  strengths: string[];
  improvements: string[];
  revisedAnswerExample: string;
  interviewerImpression: string;
}

export interface CompletedTraining {
  id: string;
  title: string;
  provider: string;
  topicsCovered: string;
  keyLearnings?: string;
  completionYear?: string;
}

export interface CriticalGap {
  topic: string;
  whyCritical: string;
  riskLevel: 'Kritik' | 'Yüksek' | 'Orta' | string;
}

export interface NextTrainingRecommendation {
  order: number;
  trainingTitle: string;
  level: string;
  targetOutcome: string;
  mustHaveCurriculum: string[];
  handsOnPortfolioProject: string;
  estimatedEffort: string;
  recommendedKeywords: string[];
}

export interface TrainingAnalysisResult {
  currentSkillsProfile: {
    masteredSkills: string[];
    inProgressOrSurfaceSkills: string[];
    overallAssessment: string;
  };
  criticalGaps: CriticalGap[];
  nextTrainingRecommendations: NextTrainingRecommendation[];
  roadmap30_60_90: {
    first30Days: string;
    days31To60: string;
    days61To90: string;
  };
  coachAdviceForNewGrads: string;
}

export interface SavedPracticeSession {
  id: string;
  timestamp: string;
  interviewerTitle: string;
  candidateRole: string;
  question: string;
  candidateAnswer: string;
  evaluation: AnswerEvaluation;
}
