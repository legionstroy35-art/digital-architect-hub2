import React, { useState, useEffect, useMemo } from 'react';
import {
  GraduationCap,
  ArrowUpRight,
  CheckCircle2,
  Clock,
  BookOpen,
  Sparkles,
  Video,
  PlayCircle,
  Settings2,
  Play,
  Layers,
  LayoutGrid,
  ChevronRight,
  ExternalLink,
  Check
} from 'lucide-react';
import { CourseTrack } from '../types';
import { getStoredCourses, subscribeToContentChanges } from '../services/contentManager';

interface CoursesSectionProps {
  onOpenBoostyModal: () => void;
  onOpenVideoModal?: (url: string, title: string) => void;
  onOpenAdminModal?: (tab?: 'sheet' | 'plugins' | 'courses' | 'waitlist') => void;
  onOpenCourseDetail?: (course: CourseTrack) => void;
  isAdmin?: boolean;
}

export const CoursesSection: React.FC<CoursesSectionProps> = ({
  onOpenBoostyModal,
  onOpenVideoModal,
  onOpenAdminModal,
  onOpenCourseDetail,
  isAdmin = false,
}) => {
  const [courses, setCourses] = useState<CourseTrack[]>(() => getStoredCourses());
  const [selectedSoftware, setSelectedSoftware] = useState<string>('all');
  const [activeCourseId, setActiveCourseId] = useState<string>(() => courses[0]?.id || '');
  const [viewMode, setViewMode] = useState<'showcase' | 'grid'>('showcase');

  useEffect(() => {
    const unsubscribe = subscribeToContentChanges(() => {
      const updated = getStoredCourses();
      setCourses(updated);
      if (!updated.some((c) => c.id === activeCourseId)) {
        setActiveCourseId(updated[0]?.id || '');
      }
    });
    return unsubscribe;
  }, [activeCourseId]);

  // Extract unique software categories dynamically
  const softwareCategories = useMemo(() => {
    const standard = [
      { id: 'all', label: 'Все направления', count: courses.length },
      { id: 'revit', label: 'Autodesk Revit', count: courses.filter((c) => c.software.toLowerCase() === 'revit').length },
      { id: 'autocad', label: 'AutoCAD', count: courses.filter((c) => c.software.toLowerCase() === 'autocad').length },
      { id: 'archicad', label: 'Archicad', count: courses.filter((c) => c.software.toLowerCase() === 'archicad').length },
      { id: 'twinmotion', label: 'Twinmotion', count: courses.filter((c) => c.software.toLowerCase() === 'twinmotion').length },
    ];

    const knownIds = new Set(standard.map((s) => s.id));

    // Also pick up any custom software added by admin
    courses.forEach((c) => {
      const low = c.software.toLowerCase();
      if (!knownIds.has(low)) {
        knownIds.add(low);
        standard.push({
          id: low,
          label: c.softwareLabel || c.software,
          count: courses.filter((item) => item.software.toLowerCase() === low).length
        });
      }
    });

    return standard.filter((cat) => cat.id === 'all' || cat.count > 0);
  }, [courses]);

  // Filter courses by chosen software category
  const filteredCourses = useMemo(() => {
    if (selectedSoftware === 'all') return courses;
    return courses.filter((c) => c.software.toLowerCase() === selectedSoftware.toLowerCase());
  }, [courses, selectedSoftware]);

  // Ensure activeCourseId is valid for the filtered list
  useEffect(() => {
    if (filteredCourses.length > 0 && !filteredCourses.some((c) => c.id === activeCourseId)) {
      setActiveCourseId(filteredCourses[0].id);
    }
  }, [filteredCourses, activeCourseId]);

  const activeCourse = courses.find((c) => c.id === activeCourseId) || filteredCourses[0] || courses[0];

  if (!activeCourse) return null;

  const handleWatchVideo = (courseToWatch: CourseTrack) => {
    if (courseToWatch.videoPresentationUrl && onOpenVideoModal) {
      onOpenVideoModal(courseToWatch.videoPresentationUrl, courseToWatch.title);
    } else {
      onOpenBoostyModal();
    }
  };

  const getSoftwareColor = (software: string) => {
    switch (software.toLowerCase()) {
      case 'revit':
        return { badge: 'bg-blue-100 text-blue-800 border-blue-200', activeTab: 'bg-blue-600 text-white' };
      case 'autocad':
        return { badge: 'bg-red-100 text-red-800 border-red-200', activeTab: 'bg-red-600 text-white' };
      case 'archicad':
        return { badge: 'bg-indigo-100 text-indigo-800 border-indigo-200', activeTab: 'bg-indigo-600 text-white' };
      case 'twinmotion':
        return { badge: 'bg-emerald-100 text-emerald-800 border-emerald-200', activeTab: 'bg-emerald-600 text-white' };
      default:
        return { badge: 'bg-slate-100 text-slate-800 border-slate-200', activeTab: 'bg-slate-800 text-white' };
    }
  };

  return (
    <section id="courses" className="py-16 md:py-24 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div className="max-w-3xl">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-50 border border-orange-200 text-orange-800 text-xs font-mono font-semibold">
                <GraduationCap className="w-4 h-4" />
                <span>[ПРАКТИЧЕСКОЕ ОБУЧЕНИЕ С НУЛЯ И ДЛЯ ПРОФИ]</span>
              </div>
              {isAdmin && onOpenAdminModal && (
                <button
                  type="button"
                  onClick={() => onOpenAdminModal('courses')}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-mono transition-colors border border-slate-200 cursor-pointer"
                  title="Панель добавления и редактирования курсов"
                >
                  <Settings2 className="w-3.5 h-3.5 text-orange-600" />
                  <span>Управление курсами</span>
                </button>
              )}
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-950 tracking-tight">
              Каталог обучающих курсов
            </h2>
            <p className="mt-3 text-base text-slate-600 leading-relaxed">
              Практическое обучение от действующего инженера. Без затянутой теории — только реальные рабочие приемы, нормативная база СП/ГОСТ, шаблоны проектов и алгоритмы ускорения выпуска чертежей.
            </p>
          </div>

          {/* View Mode Switcher */}
          <div className="flex items-center p-1 bg-slate-100 rounded-xl border border-slate-200 shrink-0 self-start md:self-auto">
            <button
              type="button"
              onClick={() => setViewMode('showcase')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                viewMode === 'showcase'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Обзор курса</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('grid')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                viewMode === 'grid'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Все курсы сеткой ({filteredCourses.length})</span>
            </button>
          </div>
        </div>

        {/* Software Category Filters (Revit, AutoCAD, Archicad, Twinmotion...) */}
        <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-6 scrollbar-thin">
          {softwareCategories.map((cat) => {
            const isSelected = selectedSoftware === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedSoftware(cat.id)}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all shrink-0 flex items-center gap-2 border cursor-pointer ${
                  isSelected
                    ? 'bg-slate-900 border-slate-900 text-white shadow-xs'
                    : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'
                }`}
              >
                <span>{cat.label}</span>
                <span
                  className={`text-[10px] font-mono px-1.5 py-0.5 rounded-md ${
                    isSelected ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  {cat.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* ============================================================ */}
        {/* VIEW 1: SHOWCASE MODE WITH SELECTOR LIST & FEATURED BANNER */}
        {/* ============================================================ */}
        {viewMode === 'showcase' && (
          <div className="space-y-6">
            
            {/* Horizontal Course Selector (Shows all courses in current category) */}
            <div>
              <div className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500 mb-2.5 flex items-center justify-between">
                <span>
                  {selectedSoftware === 'all'
                    ? `Все доступные курсы (${filteredCourses.length}):`
                    : `Курсы по направлению ${softwareCategories.find((s) => s.id === selectedSoftware)?.label || ''} (${filteredCourses.length}):`}
                </span>
                <span className="text-[11px] text-slate-400 font-normal">
                  Кликните курс для быстрого предпросмотра
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {filteredCourses.map((course) => {
                  const isSelected = activeCourse.id === course.id;
                  const color = getSoftwareColor(course.software);

                  return (
                    <div
                      key={course.id}
                      onClick={() => setActiveCourseId(course.id)}
                      className={`p-4 rounded-2xl border text-left transition-all relative flex flex-col justify-between cursor-pointer group ${
                        isSelected
                          ? 'bg-blue-50/70 border-blue-500 shadow-sm ring-2 ring-blue-500/20'
                          : 'bg-slate-50 hover:bg-slate-100/80 border-slate-200/90 text-slate-700'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-1.5">
                          <span className={`text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded-md border ${color.badge}`}>
                            {course.softwareLabel}
                          </span>

                          <div className="flex items-center gap-1.5">
                            {course.inDevelopment ? (
                              <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300 text-[10px] font-mono font-bold flex items-center gap-1">
                                <Sparkles className="w-2.5 h-2.5 text-amber-600" />
                                <span>Предзапись</span>
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300 text-[10px] font-mono font-bold flex items-center gap-1">
                                <Check className="w-2.5 h-2.5 text-emerald-600" />
                                <span>Boosty</span>
                              </span>
                            )}
                          </div>
                        </div>

                        <h4 className="text-sm font-bold text-slate-900 leading-snug group-hover:text-blue-600 transition-colors line-clamp-2">
                          {course.title}
                        </h4>

                        <div className="mt-2 flex flex-wrap items-center gap-2 text-[11px] font-mono text-slate-500">
                          <span>{course.targetAudience}</span>
                          <span>•</span>
                          <span>{course.duration}</span>
                          <span>•</span>
                          <span>{course.lessonsCount}</span>
                        </div>
                      </div>

                      {/* Card Action Buttons */}
                      <div className="mt-3 pt-3 border-t border-slate-200/70 flex items-center justify-between gap-2">
                        {onOpenCourseDetail && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              onOpenCourseDetail(course);
                            }}
                            className="text-xs font-bold text-blue-700 hover:text-blue-900 flex items-center gap-1 py-1 px-2 rounded-lg hover:bg-blue-100/60 transition-colors cursor-pointer"
                          >
                            <BookOpen className="w-3.5 h-3.5" />
                            <span>Подробнее о курсе</span>
                          </button>
                        )}

                        <span className="text-[11px] font-mono font-semibold text-slate-400 group-hover:text-slate-600 flex items-center gap-0.5">
                          {isSelected ? 'Активен' : 'Выбрать'}
                          <ChevronRight className="w-3.5 h-3.5" />
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Featured Active Course Showcase Card */}
            <div className="bg-slate-50 rounded-3xl border border-slate-200/90 overflow-hidden shadow-sm">
              <div className="grid grid-cols-1 lg:grid-cols-12">
                
                {/* Left Course Specs (7 cols) */}
                <div className="lg:col-span-7 p-6 sm:p-8 md:p-10 flex flex-col justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-4">
                      <span className="px-2.5 py-1 rounded-lg bg-blue-100 text-blue-800 text-xs font-mono font-bold">
                        {activeCourse.softwareLabel}
                      </span>
                      <span className="px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-800 text-xs font-mono font-semibold">
                        Уровень: {activeCourse.targetAudience}
                      </span>
                      <span className="flex items-center gap-1 text-xs text-slate-500 font-mono">
                        <Clock className="w-3.5 h-3.5" />
                        {activeCourse.duration}
                      </span>
                      <span className="flex items-center gap-1 text-xs text-slate-500 font-mono">
                        <BookOpen className="w-3.5 h-3.5" />
                        {activeCourse.lessonsCount}
                      </span>
                      {activeCourse.inDevelopment ? (
                        <span className="px-2.5 py-1 rounded-lg bg-amber-100 text-amber-900 border border-amber-300 text-xs font-mono font-bold flex items-center gap-1">
                          <Sparkles className="w-3 h-3 text-amber-600" />
                          В разработке • Предзапись
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-900 border border-emerald-300 text-xs font-mono font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          Полный курс доступен
                        </span>
                      )}
                    </div>

                    <h3 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-slate-950 mb-3 leading-snug">
                      {activeCourse.title}
                    </h3>

                    <p className="text-sm sm:text-base text-slate-600 leading-relaxed mb-5">
                      {activeCourse.description}
                    </p>

                    {activeCourse.inDevelopment && activeCourse.developmentStatusNote && (
                      <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs sm:text-sm mb-5 flex items-start gap-2.5">
                        <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                        <div>
                          <span className="font-bold block mb-0.5">Статус разработки:</span>
                          <span>{activeCourse.developmentStatusNote}</span>
                        </div>
                      </div>
                    )}

                    {/* Modules preview */}
                    <div className="space-y-2.5 mb-6">
                      <div className="flex items-center justify-between">
                        <div className="text-xs font-mono uppercase text-slate-400 font-bold tracking-wider">
                          Ключевые темы и модули курса ({activeCourse.modules.length}):
                        </div>
                        {onOpenCourseDetail && (
                          <button
                            type="button"
                            onClick={() => onOpenCourseDetail(activeCourse)}
                            className="text-xs font-bold text-blue-600 hover:text-blue-800 transition-colors flex items-center gap-1 cursor-pointer"
                          >
                            <span>Смотреть всю программу</span>
                            <ArrowUpRight className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {activeCourse.modules.slice(0, 4).map((mod, idx) => (
                          <div
                            key={idx}
                            className="p-2.5 rounded-xl bg-white border border-slate-200/80 text-xs text-slate-700 flex items-center gap-2 shadow-2xs"
                          >
                            <span className="w-5 h-5 rounded-md bg-blue-100 text-blue-800 font-mono text-[10px] font-bold flex items-center justify-center shrink-0">
                              {idx + 1}
                            </span>
                            <span className="truncate font-medium">{mod}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Showcase Action Bar */}
                  <div className="pt-4 border-t border-slate-200/80 flex flex-wrap items-center justify-between gap-3">
                    <div className="text-xs font-mono text-slate-500">
                      {activeCourse.freeVideosPlatform}
                    </div>

                    <div className="flex flex-wrap items-center gap-2.5">
                      {onOpenCourseDetail && (
                        <button
                          type="button"
                          onClick={() => onOpenCourseDetail(activeCourse)}
                          className="px-4 sm:px-5 py-3 rounded-xl bg-white hover:bg-slate-100 border border-slate-300 text-slate-900 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-2xs cursor-pointer active:scale-98"
                        >
                          <BookOpen className="w-4 h-4 text-blue-600" />
                          <span>Подробнее о курсе</span>
                        </button>
                      )}

                      {activeCourse.inDevelopment ? (
                        <button
                          type="button"
                          onClick={() => {
                            if (onOpenCourseDetail) {
                              onOpenCourseDetail(activeCourse);
                            } else {
                              onOpenBoostyModal();
                            }
                          }}
                          className="px-5 sm:px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md shadow-amber-500/20 transition-transform active:scale-98 cursor-pointer"
                        >
                          <Sparkles className="w-4 h-4" />
                          <span>Предзапись со скидкой</span>
                          <ArrowUpRight className="w-4 h-4" />
                        </button>
                      ) : activeCourse.customCourseUrl ? (
                        <a
                          href={activeCourse.customCourseUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-5 sm:px-6 py-3 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md shadow-orange-500/20 transition-transform active:scale-98"
                        >
                          <span>Перейти к курсу</span>
                          <ArrowUpRight className="w-4 h-4" />
                        </a>
                      ) : (
                        <button
                          type="button"
                          onClick={onOpenBoostyModal}
                          className="px-5 sm:px-6 py-3 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md shadow-orange-500/20 transition-transform active:scale-98 cursor-pointer"
                        >
                          <span>Курс на Boosty</span>
                          <ArrowUpRight className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right Course Visual Preview (5 cols) */}
                <div className="lg:col-span-5 relative bg-slate-900 min-h-[300px] lg:min-h-full overflow-hidden flex flex-col justify-end p-6 sm:p-8 group">
                  <img
                    src={activeCourse.bannerImage}
                    alt={activeCourse.title}
                    className="absolute inset-0 w-full h-full object-cover opacity-40 transition-transform duration-500 group-hover:scale-105"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />

                  <div className="relative z-10 text-white">
                    <div className="flex items-center gap-3 mb-4">
                      <button
                        type="button"
                        onClick={() => handleWatchVideo(activeCourse)}
                        className="w-12 h-12 rounded-2xl bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 flex items-center justify-center text-white transition-all transform hover:scale-105 active:scale-95 shadow-lg cursor-pointer"
                        title={activeCourse.videoPresentationUrl ? 'Смотреть видеопрезентацию' : 'Узнать подробнее'}
                      >
                        <PlayCircle className="w-6 h-6 text-orange-400" />
                      </button>

                      {onOpenCourseDetail && (
                        <button
                          type="button"
                          onClick={() => onOpenCourseDetail(activeCourse)}
                          className="px-3.5 py-2 rounded-xl bg-white/15 hover:bg-white/25 backdrop-blur-md border border-white/20 text-xs font-bold text-white transition-all flex items-center gap-1.5 cursor-pointer"
                        >
                          <BookOpen className="w-3.5 h-3.5 text-orange-400" />
                          <span>Открыть страницу курса</span>
                        </button>
                      )}
                    </div>

                    {activeCourse.portfolioImages && activeCourse.portfolioImages.length > 0 && (
                      <div className="mb-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/10 backdrop-blur-xs text-xs text-orange-300 font-mono">
                        <span>🖼 Примеры работ: {activeCourse.portfolioImages.length} чертежей</span>
                      </div>
                    )}
                    <div className="text-xs font-mono text-orange-400 font-semibold mb-1">
                      ЧТО ВХОДИТ В ОБУЧЕНИЕ:
                    </div>
                    <ul className="text-xs sm:text-sm text-slate-200 space-y-2 mb-4">
                      <li className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-orange-400" />
                        Полные записи мастер-классов без рекламы
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-orange-400" />
                        Исходные файлы проектов (.rvt, .dwg, .pln)
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-orange-400" />
                        Закрытый чат студентов с проверкой домашних работ
                      </li>
                    </ul>

                    <div className="text-[11px] text-slate-400 font-mono">
                      Доступно по ежемесячной подписке или разовой покупке
                    </div>
                  </div>
                </div>

              </div>
            </div>

          </div>
        )}

        {/* ============================================================ */}
        {/* VIEW 2: FULL GRID CATALOG MODE (ALL COURSES SIDE BY SIDE) */}
        {/* ============================================================ */}
        {viewMode === 'grid' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course) => {
              const color = getSoftwareColor(course.software);

              return (
                <div
                  key={course.id}
                  className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
                >
                  {/* Top Image Banner */}
                  <div className="relative aspect-16/9 bg-slate-900 overflow-hidden">
                    <img
                      src={course.bannerImage}
                      alt={course.title}
                      className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

                    <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                      <span className={`px-2.5 py-0.5 rounded-lg text-xs font-mono font-bold uppercase shadow-sm ${color.badge}`}>
                        {course.softwareLabel}
                      </span>
                    </div>

                    <div className="absolute top-3 right-3">
                      {course.inDevelopment ? (
                        <span className="px-2.5 py-0.5 rounded-full bg-amber-500 text-slate-950 text-xs font-mono font-bold flex items-center gap-1 shadow-sm">
                          <Sparkles className="w-3 h-3 text-slate-950" />
                          <span>Предзапись</span>
                        </span>
                      ) : (
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-600 text-white text-xs font-mono font-bold flex items-center gap-1 shadow-sm">
                          <Check className="w-3 h-3" />
                          <span>Boosty</span>
                        </span>
                      )}
                    </div>

                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs font-mono">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-orange-400" />
                        {course.duration}
                      </span>
                      <span className="flex items-center gap-1">
                        <BookOpen className="w-3.5 h-3.5 text-orange-400" />
                        {course.lessonsCount}
                      </span>
                    </div>
                  </div>

                  {/* Body Info */}
                  <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between space-y-4">
                    <div>
                      <div className="text-xs font-mono text-slate-500 mb-1">
                        Уровень: {course.targetAudience}
                      </div>
                      <h3 className="font-extrabold text-base sm:text-lg text-slate-950 leading-snug group-hover:text-blue-600 transition-colors">
                        {course.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-600 mt-2 line-clamp-3 leading-relaxed">
                        {course.description}
                      </p>
                    </div>

                    {/* Key modules pills */}
                    <div className="space-y-1.5 pt-2 border-t border-slate-100">
                      <div className="text-[11px] font-mono text-slate-400 font-semibold">
                        Программа ({course.modules.length} тем):
                      </div>
                      <div className="space-y-1">
                        {course.modules.slice(0, 3).map((mod, idx) => (
                          <div key={idx} className="text-xs text-slate-700 flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />
                            <span className="truncate">{mod}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Buttons */}
                    <div className="pt-4 border-t border-slate-100 flex flex-col gap-2">
                      {onOpenCourseDetail && (
                        <button
                          type="button"
                          onClick={() => onOpenCourseDetail(course)}
                          className="w-full py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-900 font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
                        >
                          <BookOpen className="w-3.5 h-3.5 text-blue-600" />
                          <span>Подробнее о курсе</span>
                        </button>
                      )}

                      <div className="flex items-center gap-2">
                        {course.videoPresentationUrl && (
                          <button
                            type="button"
                            onClick={() => handleWatchVideo(course)}
                            className="p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 transition-colors cursor-pointer"
                            title="Смотреть видео"
                          >
                            <Play className="w-4 h-4 text-orange-500 fill-orange-500" />
                          </button>
                        )}

                        {course.inDevelopment ? (
                          <button
                            type="button"
                            onClick={() => {
                              if (onOpenCourseDetail) {
                                onOpenCourseDetail(course);
                              } else {
                                onOpenBoostyModal();
                              }
                            }}
                            className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-2xs transition-all cursor-pointer"
                          >
                            <Sparkles className="w-3.5 h-3.5" />
                            <span>Предзапись со скидкой</span>
                          </button>
                        ) : course.customCourseUrl ? (
                          <a
                            href={course.customCourseUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 py-2.5 px-4 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs text-center flex items-center justify-center gap-1.5 shadow-2xs"
                          >
                            <span>Курс на Boosty</span>
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        ) : (
                          <button
                            type="button"
                            onClick={onOpenBoostyModal}
                            className="flex-1 py-2.5 px-4 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs text-center flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer"
                          >
                            <span>Курс на Boosty</span>
                            <ExternalLink className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </section>
  );
};
