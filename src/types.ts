export type SoftwareCategory = 'all' | 'revit' | 'autocad' | 'archicad' | 'twinmotion' | 'scripts';

export interface PlatformItem {
  id: string;
  name: string;
  subscribers: number;
  subscribersFormatted: string;
  description: string;
  badge: string;
  url: string;
  color: string;
  iconType: 'rutube' | 'vk' | 'max' | 'dzen' | 'tenchat' | 'boosty' | 'telegram';
  frequency: string;
  actionLabel?: string;
}

export interface ResourceItem {
  id: string;
  title: string;
  software: 'revit' | 'autocad' | 'archicad' | 'twinmotion' | 'scripts';
  softwareLabel: string;
  category: string;
  version: string;
  description: string;
  benefits: string[];
  downloadsCount: number;
  fileSize: string;
  fileFormat: string;
  isFree: boolean;
  downloadUrl?: string;
  githubUrl?: string;
  videoTutorialUrl?: string;
  inDevelopment?: boolean;
  isPinnedFlagship?: boolean;
}

export interface CoursePortfolioItem {
  title: string;
  url: string;
  caption?: string;
  tag?: string;
}

export interface CurriculumLesson {
  title: string;
  duration?: string;
  isFreePreview?: boolean;
}

export interface CurriculumModule {
  title: string;
  description?: string;
  lessons?: (string | CurriculumLesson)[];
}

export interface CourseTrack {
  id: string;
  title: string;
  software: 'revit' | 'autocad' | 'archicad' | 'twinmotion' | string;
  softwareLabel: string;
  targetAudience: 'Начинающие' | 'Продолжающие' | 'Комплексный' | string;
  duration: string;
  lessonsCount: string;
  description: string;
  detailedDescription?: string;
  modules: string[];
  fullCurriculum?: CurriculumModule[];
  whatYouWillLearn?: string[];
  portfolioImages?: CoursePortfolioItem[];
  targetWhoIsFor?: string[];
  freeVideosPlatform: string;
  boostyExclusiveUrl: string;
  bannerImage: string;
  videoPresentationUrl?: string;
  customCourseUrl?: string;
  inDevelopment?: boolean;
  developmentStatusNote?: string;
}

export interface CourseWaitlistEntry {
  id: string;
  courseId: string;
  courseTitle: string;
  email: string;
  date: string;
  notified?: boolean;
}

export interface NotificationSettings {
  telegramEnabled: boolean;
  telegramBotToken: string;
  telegramChatId: string;
  emailEnabled: boolean;
  web3FormsKey: string;
  targetEmail: string;
  maxWebhookEnabled: boolean;
  maxWebhookUrl: string;
}

export interface FeedbackSubmission {
  id: string;
  name: string;
  contact: string;
  topic: string;
  software: string;
  message: string;
  date: string;
}

