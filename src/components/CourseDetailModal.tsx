import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  X,
  ArrowLeft,
  Share2,
  Check,
  Play,
  Clock,
  BookOpen,
  Award,
  Users,
  Sparkles,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Image as ImageIcon,
  Mail,
  Send,
  Calendar,
  AlertCircle,
  ZoomIn,
  ChevronLeft,
  ChevronRight,
  ArrowUp,
  Layers,
  FileCheck,
  GraduationCap
} from 'lucide-react';
import { CourseTrack, CoursePortfolioItem, CurriculumModule } from '../types';
import { addCourseWaitlistEntry } from '../services/courseWaitlistService';

interface CourseDetailModalProps {
  course: CourseTrack | null;
  onClose: () => void;
  onSelectCourse?: (course: CourseTrack) => void;
  allCourses?: CourseTrack[];
}

export const CourseDetailModal: React.FC<CourseDetailModalProps> = ({
  course,
  onClose,
  onSelectCourse,
  allCourses = []
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [expandedModules, setExpandedModules] = useState<{ [key: number]: boolean }>({ 0: true, 1: true });
  
  // Waitlist form state
  const [waitlistEmail, setWaitlistEmail] = useState('');
  const [waitlistStatus, setWaitlistStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [waitlistMessage, setWaitlistMessage] = useState('');

  // Lightbox state for gallery
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  // Sync expanded modules & reset scroll when course changes
  useEffect(() => {
    if (course) {
      setExpandedModules({ 0: true, 1: true });
      setWaitlistEmail('');
      setWaitlistStatus('idle');
      setWaitlistMessage('');
      setLightboxIndex(null);
      if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollTop = 0;
      }
    }
  }, [course?.id]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (!course) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (lightboxIndex !== null) {
          setLightboxIndex(null);
        } else {
          onClose();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [course, lightboxIndex, onClose]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const top = e.currentTarget.scrollTop;
    setShowScrollTop(top > 350);
  };

  const scrollToTop = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Build unified comprehensive curriculum:
  // If the course has fullCurriculum and course.modules has more modules, we seamlessly merge them
  // so that even 20+ modules are fully rendered with numbering and structure!
  const fullModuleList = useMemo(() => {
    if (!course) return [];
    const fromFull = course.fullCurriculum || [];
    const fromSimple = course.modules || [];

    if (fromFull.length >= fromSimple.length && fromFull.length > 0) {
      return fromFull;
    }

    // Merge or expand simple modules
    return fromSimple.map((modStr, idx) => {
      const existingFull = fromFull[idx];
      if (existingFull) return existingFull;

      const title = modStr.startsWith('Модуль') ? modStr : `Модуль ${idx + 1}: ${modStr}`;
      return {
        title,
        description: 'Практические задания, закрепление алгоритмов и разбор реального кейса',
        lessons: [
          { title: `${idx + 1}.1 Методология и теоретическая база`, duration: '25 мин' },
          { title: `${idx + 1}.2 Пошаговый практический алгоритм`, duration: '35 мин' },
          { title: `${idx + 1}.3 Типичные ошибки и способы их предотвращения`, duration: '20 мин' }
        ]
      };
    });
  }, [course]);

  if (!course) return null;

  const toggleModule = (index: number) => {
    setExpandedModules((prev) => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const expandAllModules = () => {
    const allExpanded: { [key: number]: boolean } = {};
    fullModuleList.forEach((_, idx) => {
      allExpanded[idx] = true;
    });
    setExpandedModules(allExpanded);
  };

  const collapseAllModules = () => {
    setExpandedModules({});
  };

  const handleCopyLink = () => {
    try {
      const shareUrl = `${window.location.origin}${window.location.pathname}#course=${course.id}`;
      navigator.clipboard.writeText(shareUrl);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    } catch {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  const handleWaitlistSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!waitlistEmail || waitlistStatus === 'loading') return;

    setWaitlistStatus('loading');
    setWaitlistMessage('');

    const res = await addCourseWaitlistEntry(course.id, course.title, waitlistEmail);
    if (res.success) {
      setWaitlistStatus('success');
      setWaitlistMessage(res.message);
      setWaitlistEmail('');
    } else {
      setWaitlistStatus('error');
      setWaitlistMessage(res.message);
    }
  };

  const getSoftwareColor = (software: string) => {
    switch (software.toLowerCase()) {
      case 'revit':
        return { bg: 'bg-blue-600', text: 'text-blue-600', light: 'bg-blue-50 border-blue-200' };
      case 'autocad':
        return { bg: 'bg-red-600', text: 'text-red-600', light: 'bg-red-50 border-red-200' };
      case 'archicad':
        return { bg: 'bg-indigo-600', text: 'text-indigo-600', light: 'bg-indigo-50 border-indigo-200' };
      case 'twinmotion':
        return { bg: 'bg-emerald-600', text: 'text-emerald-600', light: 'bg-emerald-50 border-emerald-200' };
      default:
        return { bg: 'bg-slate-700', text: 'text-slate-700', light: 'bg-slate-50 border-slate-200' };
    }
  };

  const colors = getSoftwareColor(course.software);
  const portfolioImages: CoursePortfolioItem[] = course.portfolioImages || [];

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-0 sm:p-4 md:p-6"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="w-full max-w-5xl h-full sm:h-[92vh] max-h-[100dvh] bg-white rounded-none sm:rounded-3xl shadow-2xl flex flex-col border border-slate-200/90 overflow-hidden relative animate-in fade-in zoom-in-95 duration-200"
      >
        {/* Sticky Pinned Top Header */}
        <header className="shrink-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 px-4 sm:px-6 py-3.5 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-700 hover:text-slate-950 transition-colors py-1.5 px-3 rounded-xl hover:bg-slate-100"
          >
            <ArrowLeft className="w-4 h-4 text-slate-500" />
            <span>Вернуться к каталогу курсов</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopyLink}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg transition-colors border border-slate-200"
              title="Скопировать прямую ссылку на этот курс"
            >
              {copiedLink ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700 font-bold">Ссылка скопирована!</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Поделиться</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
              aria-label="Закрыть"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </header>

        {/* Dedicated Main Scrollable Body */}
        <div
          ref={scrollContainerRef}
          onScroll={handleScroll}
          tabIndex={0}
          className="flex-1 overflow-y-auto overscroll-contain focus:outline-none scroll-smooth"
        >
          {/* Top Hero Banner */}
          <div className="relative bg-slate-950 text-white overflow-hidden border-b border-slate-800">
            {course.bannerImage && (
              <img
                src={course.bannerImage}
                alt={course.title}
                className="absolute inset-0 w-full h-full object-cover opacity-25"
                referrerPolicy="no-referrer"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent" />

            <div className="relative z-10 p-6 sm:p-8 md:p-10 max-w-4xl">
              {/* Badges Bar */}
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <span className={`px-3 py-1 rounded-lg text-xs font-mono font-bold uppercase tracking-wider text-white ${colors.bg}`}>
                  {course.softwareLabel}
                </span>

                <span className="px-3 py-1 rounded-lg bg-slate-800/90 border border-slate-700 text-xs font-mono text-slate-200">
                  Уровень: {course.targetAudience}
                </span>

                <span className="px-3 py-1 rounded-lg bg-slate-800/90 border border-slate-700 text-xs font-mono text-slate-200 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-orange-400" />
                  <span>{course.duration}</span>
                </span>

                <span className="px-3 py-1 rounded-lg bg-slate-800/90 border border-slate-700 text-xs font-mono text-slate-200 flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-orange-400" />
                  <span>{course.lessonsCount}</span>
                </span>

                {course.inDevelopment ? (
                  <span className="px-3 py-1 rounded-lg bg-amber-500/20 border border-amber-400/50 text-amber-300 text-xs font-mono font-bold flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    <span>В разработке • Предзапись</span>
                  </span>
                ) : (
                  <span className="px-3 py-1 rounded-lg bg-emerald-500/20 border border-emerald-400/50 text-emerald-300 text-xs font-mono font-bold flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Курс открыт</span>
                  </span>
                )}
              </div>

              {/* Title & Detailed Intro */}
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight leading-tight mb-4">
                {course.title}
              </h1>

              <p className="text-sm sm:text-base md:text-lg text-slate-300 leading-relaxed max-w-3xl mb-6">
                {course.detailedDescription || course.description}
              </p>

              {/* Development Status Note Alert if in dev */}
              {course.inDevelopment && course.developmentStatusNote && (
                <div className="mb-6 p-4 rounded-2xl bg-amber-950/40 border border-amber-500/40 text-amber-200 text-xs sm:text-sm flex items-start gap-3">
                  <Sparkles className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-amber-300 block mb-1">Информация о стадии записи:</span>
                    <p className="leading-relaxed">{course.developmentStatusNote}</p>
                  </div>
                </div>
              )}

              {/* Action Buttons in Hero */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                {course.inDevelopment ? (
                  <a
                    href="#waitlist-section"
                    onClick={(e) => {
                      e.preventDefault();
                      document.getElementById('waitlist-section')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold text-sm flex items-center gap-2 shadow-lg shadow-amber-500/20 transition-all active:scale-98"
                  >
                    <Mail className="w-4 h-4" />
                    <span>Записаться в лист ожидания со скидкой</span>
                  </a>
                ) : course.customCourseUrl || course.boostyExclusiveUrl ? (
                  <a
                    href={course.customCourseUrl || course.boostyExclusiveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold text-sm flex items-center gap-2 shadow-lg shadow-orange-500/20 transition-all active:scale-98"
                  >
                    <span>Перейти к обучению на Boosty</span>
                    <ExternalLink className="w-4 h-4" />
                  </a>
                ) : null}

                {course.videoPresentationUrl && (
                  <a
                    href={course.videoPresentationUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 sm:px-5 py-3.5 rounded-xl bg-white/15 hover:bg-white/25 border border-white/20 text-white font-semibold text-sm flex items-center gap-2 transition-colors active:scale-98"
                  >
                    <Play className="w-4 h-4 text-orange-400 fill-orange-400" />
                    <span>Смотреть видеопрезентацию</span>
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Body Content Container */}
          <div className="p-6 sm:p-8 md:p-10 space-y-12 max-w-5xl mx-auto">
            
            {/* SECTION 1: WHAT YOU WILL LEARN (NUMBERED BY POINTS: 1, 2, 3, 4, 5, 6, 7...) */}
            {course.whatYouWillLearn && course.whatYouWillLearn.length > 0 && (
              <section className="space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 pb-2 border-b border-slate-200">
                  <div>
                    <div className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-blue-700 uppercase tracking-wider mb-1">
                      <FileCheck className="w-3.5 h-3.5" />
                      <span>Результаты обучения</span>
                    </div>
                    <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
                      Чему вы научитесь на курсе
                    </h2>
                  </div>
                  <span className="text-xs font-mono text-slate-500 bg-slate-100 px-3 py-1 rounded-lg shrink-0">
                    {course.whatYouWillLearn.length} ключевых практических навыков
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                  {course.whatYouWillLearn.map((outcome, idx) => (
                    <div
                      key={idx}
                      className="p-4 sm:p-5 rounded-2xl bg-slate-50/90 border border-slate-200/90 hover:border-blue-300 hover:bg-blue-50/40 transition-all flex items-start gap-4 group shadow-2xs"
                    >
                      <div className="w-8 h-8 rounded-xl bg-blue-600 text-white font-mono font-black text-sm flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-105 transition-transform">
                        {idx + 1}
                      </div>
                      <div className="flex-1 pt-0.5">
                        <p className="text-xs sm:text-sm font-semibold text-slate-800 leading-relaxed">
                          {outcome}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* SECTION 2: PORTFOLIO & WORK EXAMPLES GALLERY */}
            {portfolioImages.length > 0 && (
              <section className="space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 pb-2 border-b border-slate-200">
                  <div>
                    <div className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-blue-700 uppercase tracking-wider mb-1">
                      <ImageIcon className="w-3.5 h-3.5" />
                      <span>Практический результат</span>
                    </div>
                    <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
                      Примеры работ и чертежей, которым вы научитесь
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-500 mt-1">
                      Реальные проектные материалы, которые вы создадите в процессе обучения и сможете включить в портфолио.
                    </p>
                  </div>
                  <span className="text-xs text-slate-400 font-mono shrink-0">
                    Кликните для просмотра на весь экран
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {portfolioImages.map((img, idx) => (
                    <div
                      key={idx}
                      onClick={() => setLightboxIndex(idx)}
                      className="group relative rounded-2xl overflow-hidden border border-slate-200 bg-slate-900 cursor-pointer shadow-2xs hover:shadow-md transition-all flex flex-col"
                    >
                      <div className="relative aspect-4/3 overflow-hidden bg-slate-100">
                        <img
                          src={img.url}
                          alt={img.title}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                          loading="lazy"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <div className="py-1.5 px-3 rounded-lg bg-white/90 text-slate-900 text-xs font-bold flex items-center gap-1.5 shadow-sm">
                            <ZoomIn className="w-3.5 h-3.5 text-blue-600" />
                            <span>Увеличить чертеж</span>
                          </div>
                        </div>

                        {img.tag && (
                          <div className="absolute top-2.5 left-2.5 py-1 px-2.5 rounded-md bg-slate-900/85 text-white text-[11px] font-mono font-semibold backdrop-blur-xs">
                            {img.tag}
                          </div>
                        )}
                      </div>

                      <div className="p-4 bg-white flex-1 flex flex-col justify-between">
                        <h4 className="font-bold text-xs sm:text-sm text-slate-900 group-hover:text-blue-600 transition-colors">
                          {img.title}
                        </h4>
                        {img.caption && (
                          <p className="text-[11px] text-slate-500 mt-1 leading-snug line-clamp-2">
                            {img.caption}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* SECTION 3: COURSE CURRICULUM (PROGRAM WITH ALL MODULES 1..20+) */}
            <section className="space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 pb-2 border-b border-slate-200">
                <div>
                  <div className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-blue-700 uppercase tracking-wider mb-1">
                    <Layers className="w-3.5 h-3.5" />
                    <span>Учебный план</span>
                  </div>
                  <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
                    Подробная программа курса ({fullModuleList.length} модулей)
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                    Структурированное пошаговое прохождение: от базовой настройки до экспорта финального комплекта чертежей.
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={expandAllModules}
                    className="text-xs font-semibold text-slate-600 hover:text-slate-900 px-3 py-1.5 rounded-lg hover:bg-slate-100 transition-colors border border-slate-200"
                  >
                    Развернуть всё
                  </button>
                  <button
                    type="button"
                    onClick={collapseAllModules}
                    className="text-xs font-semibold text-slate-600 hover:text-slate-900 px-3 py-1.5 rounded-lg hover:bg-slate-100 transition-colors border border-slate-200"
                  >
                    Свернуть всё
                  </button>
                </div>
              </div>

              <div className="space-y-3.5">
                {fullModuleList.map((mod, mIdx) => {
                  const isExpanded = !!expandedModules[mIdx];
                  const lessons = mod.lessons || [];

                  return (
                    <div
                      key={mIdx}
                      className="border border-slate-200/90 rounded-2xl overflow-hidden bg-white transition-all shadow-2xs hover:border-slate-300"
                    >
                      <button
                        type="button"
                        onClick={() => toggleModule(mIdx)}
                        className="w-full text-left p-4 sm:p-5 flex items-start justify-between gap-4 hover:bg-slate-50/80 transition-colors"
                      >
                        <div className="flex items-start gap-3 sm:gap-4">
                          <span className="w-9 h-9 rounded-xl bg-slate-900 font-mono font-extrabold text-xs text-white flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                            {mIdx + 1}
                          </span>
                          <div>
                            <h3 className="font-bold text-sm sm:text-base text-slate-900 leading-snug">
                              {mod.title}
                            </h3>
                            {mod.description && (
                              <p className="text-xs sm:text-sm text-slate-500 mt-1 leading-relaxed">
                                {mod.description}
                              </p>
                            )}
                            <div className="flex items-center gap-3 mt-2 text-[11px] font-mono text-slate-400">
                              <span>Уроков и тем: {lessons.length > 0 ? lessons.length : '1 тема + разбор'}</span>
                            </div>
                          </div>
                        </div>

                        <div className="p-1 rounded-lg text-slate-400 hover:text-slate-700 shrink-0">
                          {isExpanded ? (
                            <ChevronUp className="w-5 h-5" />
                          ) : (
                            <ChevronDown className="w-5 h-5" />
                          )}
                        </div>
                      </button>

                      {isExpanded && lessons.length > 0 && (
                        <div className="border-t border-slate-100 bg-slate-50/60 p-4 sm:p-5 space-y-2.5">
                          {lessons.map((lesson, lIdx) => {
                            const isObject = typeof lesson === 'object' && lesson !== null;
                            const title = isObject ? lesson.title : lesson;
                            const duration = isObject ? lesson.duration : null;
                            const isFree = isObject ? lesson.isFreePreview : false;

                            return (
                              <div
                                key={lIdx}
                                className="p-3.5 rounded-xl bg-white border border-slate-200/80 flex items-center justify-between gap-3 text-xs sm:text-sm text-slate-700 shadow-2xs"
                              >
                                <div className="flex items-center gap-2.5">
                                  <div className="w-2 h-2 rounded-full bg-blue-500 shrink-0" />
                                  <span className="font-medium text-slate-800">{title}</span>
                                </div>

                                <div className="flex items-center gap-2 shrink-0">
                                  {isFree && (
                                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                                      Бесплатный предпросмотр
                                    </span>
                                  )}
                                  {duration && (
                                    <span className="text-[11px] font-mono text-slate-400">
                                      {duration}
                                    </span>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>

            {/* SECTION 4: WHO IS THIS COURSE FOR? */}
            {course.targetWhoIsFor && course.targetWhoIsFor.length > 0 && (
              <section className="space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-slate-200">
                  <div className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-blue-700 uppercase tracking-wider">
                    <Users className="w-3.5 h-3.5" />
                    <span>Целевая аудитория</span>
                  </div>
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                  Кому идеально подойдет этот курс
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {course.targetWhoIsFor.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 flex items-start gap-3"
                    >
                      <div className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center shrink-0 mt-0.5">
                        <Check className="w-3 h-3 stroke-[2.5]" />
                      </div>
                      <span className="text-xs sm:text-sm text-slate-700 font-medium leading-relaxed">
                        {item}
                      </span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* SECTION 5: WAITLIST / PURCHASE ACTION BLOCK */}
            <section
              id="waitlist-section"
              className={`p-6 sm:p-8 md:p-10 rounded-3xl border ${
                course.inDevelopment
                  ? 'bg-gradient-to-br from-amber-500/10 via-orange-500/5 to-white border-amber-300'
                  : 'bg-gradient-to-br from-blue-500/10 via-indigo-500/5 to-white border-blue-200'
              }`}
            >
              {course.inDevelopment ? (
                <div className="max-w-2xl mx-auto text-center space-y-4">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 border border-amber-200 text-amber-900 text-xs font-mono font-bold">
                    <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                    <span>ЛИСТ ОЖИДАНИЯ • РАННИЙ ДОСТУП</span>
                  </div>

                  <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-950">
                    Курс находится в активной разработке
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    Оставьте ваш email, чтобы первыми получить уведомление о старте курса и забронировать персональную скидку 30% на доступ к материалам и закрытому чату.
                  </p>

                  <form onSubmit={handleWaitlistSubmit} className="pt-2 max-w-md mx-auto space-y-3">
                    <div className="flex flex-col sm:flex-row gap-2">
                      <input
                        type="email"
                        required
                        value={waitlistEmail}
                        onChange={(e) => setWaitlistEmail(e.target.value)}
                        placeholder="Ваш рабочий email..."
                        className="flex-1 px-4 py-3 rounded-xl border border-slate-300 bg-white text-sm outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-200"
                      />
                      <button
                        type="submit"
                        disabled={waitlistStatus === 'loading'}
                        className="px-5 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold text-sm shadow-md transition-all active:scale-98 shrink-0 flex items-center justify-center gap-2"
                      >
                        {waitlistStatus === 'loading' ? (
                          <span>Отправка...</span>
                        ) : (
                          <>
                            <Send className="w-4 h-4" />
                            <span>Записаться</span>
                          </>
                        )}
                      </button>
                    </div>

                    {waitlistStatus === 'success' && (
                      <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-medium">
                        ✓ {waitlistMessage}
                      </div>
                    )}

                    {waitlistStatus === 'error' && (
                      <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs font-medium">
                        ⚠ {waitlistMessage}
                      </div>
                    )}

                    <div className="text-[11px] text-slate-400">
                      Никакого спама. Только оповещение о запуске и промокод на скидку.
                    </div>
                  </form>
                </div>
              ) : (
                <div className="max-w-2xl mx-auto text-center space-y-4">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 border border-blue-200 text-blue-900 text-xs font-mono font-bold">
                    <GraduationCap className="w-3.5 h-3.5 text-blue-600" />
                    <span>ПОЛНЫЙ ДОСТУП К КУРСУ</span>
                  </div>

                  <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-950">
                    Готовы прокачать свои навыки в {course.softwareLabel}?
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    Курс доступен на платформе Boosty с исходными шаблонами проектов, семействами и поддержкой автора.
                  </p>

                  <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
                    <a
                      href={course.customCourseUrl || course.boostyExclusiveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold text-sm flex items-center gap-2 shadow-lg shadow-orange-500/25 transition-all active:scale-98"
                    >
                      <span>Смотреть курс на Boosty</span>
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              )}
            </section>

            {/* SECTION 6: SWITCH TO OTHER COURSES (CATALOG QUICK ACCESS) */}
            {allCourses.length > 1 && (
              <section className="pt-6 border-t border-slate-200">
                <h3 className="text-xs font-mono uppercase text-slate-400 font-bold tracking-wider mb-4">
                  Другие практические курсы центра:
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {allCourses
                    .filter((c) => c.id !== course.id)
                    .map((otherCourse) => (
                      <button
                        key={otherCourse.id}
                        type="button"
                        onClick={() => {
                          if (onSelectCourse) {
                            onSelectCourse(otherCourse);
                          }
                        }}
                        className="p-3.5 rounded-xl border border-slate-200 bg-white hover:border-blue-400 hover:bg-blue-50/30 text-left transition-all group shadow-2xs flex flex-col justify-between"
                      >
                        <div>
                          <span className="text-[10px] font-mono font-bold uppercase text-blue-700 block mb-1">
                            {otherCourse.softwareLabel}
                          </span>
                          <div className="font-bold text-xs text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                            {otherCourse.title}
                          </div>
                        </div>
                        <div className="mt-2 text-[10px] text-slate-400 font-mono">
                          {otherCourse.targetAudience} • {otherCourse.duration}
                        </div>
                      </button>
                    ))}
                </div>
              </section>
            )}

          </div>
        </div>

        {/* Floating "Наверх" Button */}
        {showScrollTop && (
          <button
            type="button"
            onClick={scrollToTop}
            className="absolute bottom-6 right-6 z-40 py-2.5 px-4 rounded-full bg-slate-900/90 hover:bg-slate-900 text-white shadow-xl backdrop-blur-sm border border-white/20 transition-all flex items-center gap-2 text-xs font-bold active:scale-95 cursor-pointer"
            title="Вернуться к началу описания курса"
          >
            <ArrowUp className="w-4 h-4 text-orange-400" />
            <span>Наверх</span>
          </button>
        )}

      </div>

      {/* Lightbox Modal for Fullscreen Image Viewing */}
      {lightboxIndex !== null && portfolioImages[lightboxIndex] && (
        <div
          className="fixed inset-0 z-60 bg-black/95 flex flex-col items-center justify-center p-4"
          onClick={() => setLightboxIndex(null)}
        >
          <div
            className="absolute top-4 right-4 z-70 flex items-center gap-3"
            onClick={(e) => e.stopPropagation()}
          >
            <span className="text-xs font-mono text-slate-300">
              {lightboxIndex + 1} / {portfolioImages.length}
            </span>
            <button
              type="button"
              onClick={() => setLightboxIndex(null)}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {portfolioImages.length > 1 && (
            <>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setLightboxIndex((prev) =>
                    prev !== null ? (prev - 1 + portfolioImages.length) % portfolioImages.length : 0
                  );
                }}
                className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors z-70 cursor-pointer"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setLightboxIndex((prev) =>
                    prev !== null ? (prev + 1) % portfolioImages.length : 0
                  );
                }}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors z-70 cursor-pointer"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </>
          )}

          <div
            className="max-w-5xl max-h-[85vh] flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={portfolioImages[lightboxIndex].url}
              alt={portfolioImages[lightboxIndex].title}
              className="max-h-[75vh] w-auto max-w-full object-contain rounded-lg shadow-2xl"
              referrerPolicy="no-referrer"
            />
            <div className="text-center mt-3 text-white max-w-2xl px-4">
              <h3 className="font-bold text-sm sm:text-base">
                {portfolioImages[lightboxIndex].title}
              </h3>
              {portfolioImages[lightboxIndex].caption && (
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  {portfolioImages[lightboxIndex].caption}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
