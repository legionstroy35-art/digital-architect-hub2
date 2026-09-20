import React, { useState, useEffect } from 'react';
import { ArrowDown, ArrowUpRight, Download, Send, PlayCircle, Sparkles, CheckCircle2, Users, FileCode2, Layers, Star, Play } from 'lucide-react';
import { PLATFORMS } from '../data/mockData';
import { HubLogo } from './HubLogo';
import { PlatformLogo } from './PlatformLogo';
import { ResourceItem } from '../types';
import { getActiveFlagshipPlugin, subscribeToContentChanges } from '../services/contentManager';

interface HeroProps {
  onScrollToSection: (sectionId: string) => void;
  onOpenBoostyModal: () => void;
  onSelectResource?: (resource: ResourceItem) => void;
  onOpenAdminModal?: (tab?: 'sheet' | 'plugins' | 'courses' | 'waitlist') => void;
  onOpenVideoModal?: (url: string, title: string) => void;
  isAdmin?: boolean;
}

export const Hero: React.FC<HeroProps> = ({
  onScrollToSection,
  onOpenBoostyModal,
  onSelectResource,
  onOpenAdminModal,
  onOpenVideoModal,
  isAdmin = false,
}) => {
  const totalSubscribers = PLATFORMS.reduce((acc, p) => acc + p.subscribers, 0);
  const [flagship, setFlagship] = useState<ResourceItem | null>(() => getActiveFlagshipPlugin());

  useEffect(() => {
    const unsubscribe = subscribeToContentChanges(() => {
      setFlagship(getActiveFlagshipPlugin());
    });
    return unsubscribe;
  }, []);

  return (
    <section
      id="hero"
      className="relative pt-28 pb-16 md:pt-36 md:pb-24 overflow-hidden bg-blueprint-grid border-b border-slate-200"
    >
      {/* Soft warm/cool radial glows in light theme */}
      <div className="absolute top-12 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-blue-500/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute top-36 right-4 w-72 h-72 bg-amber-500/10 blur-[100px] rounded-full pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Community Badge */}
        <div className="flex flex-wrap items-center gap-2.5 mb-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-800 text-xs font-semibold shadow-xs">
            <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
            <span className="font-mono uppercase tracking-wide">ЦИФРОВОЙ ХАБ АРХИТЕКТОРА // ARCHITECT DIGITAL HUB</span>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 border border-slate-200 text-slate-700 text-xs font-mono">
            <Users className="w-3.5 h-3.5 text-slate-500" />
            <span>Сообщество: <strong className="text-slate-900 font-bold">3 000+ подписчиков</strong></span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          
          {/* Left: Hook & Value Proposition (7 cols) */}
          <div className="lg:col-span-7">
            <div className="flex items-center gap-4 mb-5">
              <div className="relative group">
                <HubLogo size={78} variant="light" interactive={false} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold tracking-widest text-blue-600 uppercase block">
                    ОФИЦИАЛЬНЫЙ ПОРТАЛ СООБЩЕСТВА
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 font-mono">
                  Цифровой хаб архитектора
                </h2>
              </div>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[2.9rem] font-extrabold text-slate-950 tracking-tight leading-[1.15] mb-6">
              Осваивайте <span className="text-blue-600">Revit, AutoCAD, Archicad, Twinmotion</span> и скачивайте бесплатные плагины
            </h1>

            <p className="text-base sm:text-lg text-slate-600 leading-relaxed mb-8 max-w-2xl">
              Портал практикующего архитектора. Разрабатываю плагины и скрипты, которые снимают рутину проектирования, автоматизируют ведомости по ГОСТ и <strong>бесплатно распространяются для сообщества</strong>. 
              А для тех, кто хочет быстро освоить софт с нуля или выйти на профессиональный уровень — записываю открытые видеоуроки и веду углубленные курсы на Boosty.
            </p>

            {/* Quick Benefits Checklist */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8 text-xs sm:text-sm text-slate-700 font-medium">
              <div className="flex items-center gap-2.5 bg-white border border-slate-200/80 px-3.5 py-2.5 rounded-xl shadow-xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Бесплатные плагины для Revit и блоки AutoCAD</span>
              </div>
              <div className="flex items-center gap-2.5 bg-white border border-slate-200/80 px-3.5 py-2.5 rounded-xl shadow-xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Видеоуроки на Rutube, VK и в Telegram</span>
              </div>
              <div className="flex items-center gap-2.5 bg-white border border-slate-200/80 px-3.5 py-2.5 rounded-xl shadow-xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Практика для студентов и работающих архитекторов</span>
              </div>
              <div className="flex items-center gap-2.5 bg-white border border-slate-200/80 px-3.5 py-2.5 rounded-xl shadow-xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Закрытые курсы и исходники .rvt на Boosty</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5">
              <button
                onClick={() => onScrollToSection('downloads')}
                className="px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm sm:text-base transition-all shadow-md shadow-blue-600/20 active:scale-98 flex items-center justify-center gap-2.5"
              >
                <Download className="w-4 h-4" />
                <span>Каталог бесплатных плагинов</span>
              </button>

              <a
                href="https://t.me/DigitalArchitectHub"
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-3.5 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-800 font-bold text-sm sm:text-base transition-all border border-sky-200 flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4 text-sky-600" />
                <span>Telegram-канал</span>
              </a>

              <button
                onClick={onOpenBoostyModal}
                className="px-5 py-3.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold text-sm sm:text-base transition-all shadow-md shadow-orange-500/20 active:scale-98 flex items-center justify-center gap-2"
              >
                <span>Boosty</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>
            </div>

            <p className="mt-4 text-xs text-slate-500 font-mono flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Все плагины и базовые уроки — 100% бесплатно и без ограничений</span>
            </p>
          </div>

          {/* Right: Interactive Showcase Card (5 cols) */}
          <div className="lg:col-span-5">
            <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-7 shadow-xl shadow-slate-200/50 relative overflow-hidden">
              
              {/* Card Header */}
              <div className="flex items-center justify-between pb-4 mb-5 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                    <FileCode2 className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-slate-900 text-sm block">
                        Флагманский плагин месяца
                      </span>
                      {flagship?.isPinnedFlagship && (
                        <span className="inline-flex items-center gap-0.5 px-1.5 py-0.2 rounded bg-amber-100 text-amber-900 text-[10px] font-mono font-bold">
                          <Star className="w-2.5 h-2.5 fill-amber-500 text-amber-500" />
                          <span>Закреплён</span>
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] font-mono text-emerald-600 font-semibold">
                      {flagship ? `● ${flagship.version} • ${flagship.category}` : '● Релиз для архитекторов'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  {isAdmin && onOpenAdminModal && (
                    <button
                      type="button"
                      onClick={() => onOpenAdminModal('plugins')}
                      className="p-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-700 transition-colors border border-amber-200 cursor-pointer"
                      title="Выбрать или сменить флагманский плагин в панели управления"
                    >
                      <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                    </button>
                  )}
                  <span className="text-[11px] font-mono font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-md border border-blue-200">
                    FREE DOWNLOAD
                  </span>
                </div>
              </div>

              {/* Visual preview box */}
              {flagship ? (
                <div className="rounded-2xl bg-slate-900 text-white p-5 mb-5 relative overflow-hidden shadow-inner">
                  <div className="flex justify-between items-start mb-3">
                    <span className="text-xs font-mono text-blue-400 font-bold bg-slate-800 px-2 py-0.5 rounded">
                      {flagship.softwareLabel}
                    </span>
                    <span className="text-xs font-mono text-slate-400">
                      {flagship.downloadsCount.toLocaleString('ru-RU')} скачиваний
                    </span>
                  </div>

                  <div className="text-base font-bold text-white mb-2 leading-snug">
                    {flagship.title}
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed mb-4 line-clamp-3">
                    {flagship.description}
                  </p>

                  <div className="flex items-center justify-between pt-3 border-t border-slate-800 text-[11px] font-mono text-slate-400 mb-4">
                    <span>Размер: {flagship.fileSize} ({flagship.fileFormat})</span>
                    <span className="text-emerald-400 font-semibold">Лицензия: Free</span>
                  </div>

                  {/* Interactive Action Buttons directly in the showcase */}
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        if (onSelectResource) {
                          onSelectResource(flagship);
                        } else {
                          onScrollToSection('downloads');
                        }
                      }}
                      className="flex-1 py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-md shadow-blue-600/30 active:scale-98 cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Скачать плагин</span>
                    </button>

                    {flagship.videoTutorialUrl && (
                      <button
                        type="button"
                        onClick={() => {
                          if (onOpenVideoModal) {
                            onOpenVideoModal(flagship.videoTutorialUrl!, flagship.title);
                          }
                        }}
                        className="py-2.5 px-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                        title="Смотреть видеообзор"
                      >
                        <Play className="w-3.5 h-3.5 text-orange-400 fill-orange-400" />
                        <span className="hidden sm:inline">Видео</span>
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                <div className="rounded-2xl bg-slate-900 text-white p-6 mb-5 text-center">
                  <p className="text-xs text-slate-400 mb-2">Плагины еще не загружены</p>
                  <button
                    type="button"
                    onClick={() => onScrollToSection('downloads')}
                    className="text-xs text-blue-400 underline"
                  >
                    Перейти в каталог
                  </button>
                </div>
              )}

              {/* Supported Software Pills */}
              <div className="mb-5">
                <span className="text-xs font-mono uppercase text-slate-500 block mb-2 font-semibold">
                  Обучаю и создаю инструменты для:
                </span>
                <div className="flex flex-wrap gap-2">
                  {['Autodesk Revit', 'AutoCAD', 'Archicad', 'Twinmotion'].map((soft) => (
                    <span
                      key={soft}
                      className="px-2.5 py-1 rounded-lg bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-700 font-mono"
                    >
                      {soft}
                    </span>
                  ))}
                </div>
              </div>

              {/* Channel Quick Summary */}
              <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-200 flex items-center justify-between text-xs">
                <div>
                  <span className="text-slate-500 block">Каналы сообщества:</span>
                  <span className="font-bold text-slate-900">Telegram • Rutube • VK • TenChat • Дзен</span>
                </div>
                <button
                  onClick={() => onScrollToSection('platforms')}
                  className="text-xs font-bold text-blue-600 hover:text-blue-700 underline underline-offset-2"
                >
                  Все каналы →
                </button>
              </div>

            </div>
          </div>

        </div>

        {/* Live Channel Statistics Strip */}
        <div className="mt-14 pt-8 border-t border-slate-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
            <div className="text-xs font-mono text-slate-500 uppercase tracking-wider font-bold text-center sm:text-left">
              Площадки Цифрового хаба архитектора:
            </div>
            <button
              onClick={() => onScrollToSection('platforms')}
              className="text-xs font-bold text-blue-600 hover:text-blue-700 underline underline-offset-2 self-center sm:self-auto"
            >
              Смотреть все площадки и сообщества →
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {PLATFORMS.filter((p) => p.id !== 'boosty').map((plat) => (
              <a
                key={plat.id}
                href={plat.url}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white rounded-2xl border border-slate-200/90 p-3.5 shadow-2xs hover:border-blue-400 hover:shadow-md transition-all group flex items-center gap-3"
              >
                <PlatformLogo platform={plat.iconType} size={36} />
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-bold text-slate-800 truncate group-hover:text-blue-600 transition-colors">
                    {plat.name.replace('-канал', '')}
                  </div>
                  <div className="text-xs font-extrabold text-slate-950 font-mono mt-0.5">
                    {plat.subscribersFormatted}
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};
