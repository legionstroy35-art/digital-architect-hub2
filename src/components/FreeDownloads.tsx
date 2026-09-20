import React, { useState, useEffect } from 'react';
import { Download, Play, CheckCircle2, Filter, Sparkles, HelpCircle, ChevronDown, ChevronUp, Clock, Hammer, ExternalLink, Settings2, FileSpreadsheet, Star } from 'lucide-react';
import { ResourceItem, SoftwareCategory } from '../types';
import { DataConfigGuideModal } from './DataConfigGuideModal';
import { getStoredPlugins, subscribeToContentChanges, getFlagshipPluginId } from '../services/contentManager';

interface FreeDownloadsProps {
  onSelectResource: (resource: ResourceItem) => void;
  onOpenAdminModal?: (tab?: 'sheet' | 'plugins' | 'courses') => void;
  isAdmin?: boolean;
}

const INITIAL_CARD_LIMIT = 6;

export const FreeDownloads: React.FC<FreeDownloadsProps> = ({
  onSelectResource,
  onOpenAdminModal,
  isAdmin = false,
}) => {
  const [resources, setResources] = useState<ResourceItem[]>(() => getStoredPlugins());
  const [flagshipId, setFlagshipId] = useState<string | null>(() => getFlagshipPluginId());
  const [selectedFilter, setSelectedFilter] = useState<SoftwareCategory>('all');
  const [guideModalOpen, setGuideModalOpen] = useState(false);
  const [showAllCards, setShowAllCards] = useState(false);

  useEffect(() => {
    const unsubscribe = subscribeToContentChanges(() => {
      setResources(getStoredPlugins());
      setFlagshipId(getFlagshipPluginId());
    });
    return unsubscribe;
  }, []);

  const filterOptions: { id: SoftwareCategory; label: string }[] = [
    { id: 'all', label: 'Все материалы' },
    { id: 'autocad', label: 'AutoCAD' },
    { id: 'revit', label: 'Autodesk Revit' },
    { id: 'archicad', label: 'Archicad' },
    { id: 'twinmotion', label: 'Twinmotion' },
    { id: 'scripts', label: 'Dynamo Скрипты' },
  ];

  const filteredResources = resources.filter((res) => {
    if (selectedFilter === 'all') return true;
    return res.software === selectedFilter;
  });

  const displayedResources = showAllCards
    ? filteredResources
    : filteredResources.slice(0, INITIAL_CARD_LIMIT);

  const hasHiddenCards = filteredResources.length > INITIAL_CARD_LIMIT;

  return (
    <section id="downloads" className="py-16 md:py-24 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-mono font-semibold mb-3">
              <Download className="w-3.5 h-3.5" />
              <span>[БЕСПЛАТНЫЙ КАТАЛОГ ДЛЯ ПОДПИСЧИКОВ]</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-950 tracking-tight">
              Плагины, скрипты и шаблоны для скачивания
            </h2>
            <p className="mt-2 text-sm sm:text-base text-slate-600 leading-relaxed">
              Инструменты, которые я написал для своей практики и делюсь со всеми бесплатно. Забирайте, внедряйте в рабочие проекты и автоматизируйте рутину.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 self-start md:self-auto">
            {/* Admin Management Button */}
            {isAdmin && onOpenAdminModal && (
              <button
                onClick={() => onOpenAdminModal('plugins')}
                className="flex items-center gap-1.5 text-xs font-mono font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 px-3.5 py-2 rounded-xl border border-blue-200 transition-colors shadow-2xs"
                title="Панель добавления и удаления плагинов"
              >
                <Settings2 className="w-4 h-4 text-blue-600" />
                <span>Управление плагинами</span>
              </button>
            )}

            {/* Google Sheet Sync shortcut */}
            {isAdmin && onOpenAdminModal && (
              <button
                onClick={() => onOpenAdminModal('sheet')}
                className="flex items-center gap-1.5 text-xs font-mono font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-3.5 py-2 rounded-xl border border-emerald-200 transition-colors shadow-2xs"
                title="Синхронизация с Google Таблицей"
              >
                <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                <span>Google Таблица</span>
              </button>
            )}

            <div className="flex items-center gap-2 text-xs font-mono text-slate-500 bg-white px-3 py-2 rounded-xl border border-slate-200 shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>Версии 2024–2025</span>
            </div>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 mb-8">
          <span className="text-xs font-mono text-slate-400 mr-1 flex items-center gap-1">
            <Filter className="w-3 h-3" /> Программа:
          </span>
          {filterOptions.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedFilter(tab.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                selectedFilter === tab.id
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200 hover:border-slate-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Resources Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedResources.map((item) => {
            const isInDev = !!item.inDevelopment;

            return (
              <div
                key={item.id}
                className={`rounded-2xl p-6 flex flex-col justify-between shadow-xs transition-all duration-300 group ${
                  isInDev
                    ? 'bg-amber-50/40 border-2 border-dashed border-amber-300 hover:border-amber-400'
                    : 'bg-white border border-slate-200/90 hover:border-blue-300 hover:shadow-md'
                }`}
              >
                <div>
                  {/* Header tags: Left tag & Right version */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span
                        className={`text-[11px] font-mono font-bold px-2.5 py-1 rounded-lg border ${
                          isInDev
                            ? 'text-amber-800 bg-amber-100/80 border-amber-300'
                            : 'text-blue-700 bg-blue-50 border-blue-200'
                        }`}
                      >
                        {item.softwareLabel}
                      </span>
                      {(flagshipId === item.id || (!flagshipId && resources[0]?.id === item.id)) && (
                        <span
                          className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 border border-amber-300 flex items-center gap-1 shadow-2xs"
                          title="Этот плагин отображается на главной в блоке «Флагманский плагин месяца»"
                        >
                          <Star className="w-2.5 h-2.5 fill-amber-500 text-amber-500" />
                          <span>Флагман</span>
                        </span>
                      )}
                    </div>
                    <span
                      className={`text-[11px] font-mono font-semibold ${
                        isInDev ? 'text-amber-700 font-bold' : 'text-slate-500'
                      }`}
                    >
                      {item.version}
                    </span>
                  </div>

                  {/* Title */}
                  <h3
                    className={`text-lg font-bold transition-colors mb-2 leading-snug ${
                      isInDev
                        ? 'text-slate-900 group-hover:text-amber-700'
                        : 'text-slate-900 group-hover:text-blue-600'
                    }`}
                  >
                    {item.title}
                  </h3>

                  {/* Description */}
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-4">
                    {item.description}
                  </p>

                  {/* Benefits block with checkmarks */}
                  <div
                    className={`space-y-1.5 mb-5 p-3 rounded-xl border ${
                      isInDev
                        ? 'bg-amber-100/30 border-amber-200/70'
                        : 'bg-slate-50 border-slate-150'
                    }`}
                  >
                    {item.benefits.map((b, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs text-slate-700">
                        {isInDev ? (
                          <Clock className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                        ) : (
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        )}
                        <span>{b}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bottom bar & Actions */}
                <div className={`pt-4 border-t ${isInDev ? 'border-amber-200/70' : 'border-slate-100'}`}>
                  <div className="flex items-center justify-between text-xs font-mono text-slate-500 mb-3">
                    <span>Формат: {item.fileFormat}</span>
                    <span className={isInDev ? 'font-bold text-amber-700' : ''}>{item.fileSize}</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    {isInDev ? (
                      <>
                        <button
                          onClick={() => onSelectResource(item)}
                          className="w-full py-2.5 px-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs transition-colors"
                        >
                          <Clock className="w-3.5 h-3.5" />
                          <span>В разработке</span>
                        </button>

                        <a
                          href="https://t.me/DigitalArchitectHub"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full py-2.5 px-3 rounded-xl bg-white hover:bg-amber-50 text-amber-800 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors border border-amber-200"
                        >
                          <ExternalLink className="w-3.5 h-3.5 text-amber-600" />
                          <span>Анонс в TG</span>
                        </a>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => onSelectResource(item)}
                          className="w-full py-2.5 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs transition-colors active:scale-98"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>Скачать</span>
                        </button>

                        <a
                          href={item.videoTutorialUrl || 'https://rutube.ru/channel/42238519'}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors border border-slate-200"
                        >
                          <Play className="w-3.5 h-3.5 text-blue-600" />
                          <span>Инструкция</span>
                        </a>
                      </>
                    )}
                  </div>
                </div>

              </div>
            );
          })}
        </div>

        {/* Show More / Show Less Toggle (Defaults to 6 cards) */}
        {hasHiddenCards && (
          <div className="mt-8 flex justify-center">
            <button
              onClick={() => setShowAllCards(!showAllCards)}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-white hover:bg-slate-50 border border-slate-200 hover:border-blue-300 text-slate-800 text-xs sm:text-sm font-bold shadow-xs hover:shadow-md transition-all duration-200"
            >
              {showAllCards ? (
                <>
                  <ChevronUp className="w-4 h-4 text-blue-600" />
                  <span>Свернуть до 6 карточек</span>
                </>
              ) : (
                <>
                  <ChevronDown className="w-4 h-4 text-blue-600" />
                  <span>Показать все материалы ({filteredResources.length})</span>
                </>
              )}
            </button>
          </div>
        )}

        {/* Suggest a plugin banner */}
        <div className="mt-12 bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xs">
          <div>
            <h4 className="text-base sm:text-lg font-bold text-slate-900">
              Нужен конкретный плагин или скрипт под вашу задачу?
            </h4>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl">
              Напишите мне через форму обратной связи или в Telegram @questions_arhitect. Если задача актуальна для коллег, я разработаю решение и выложу в каталог бесплатно!
            </p>
          </div>

          <a
            href="#feedback"
            className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold whitespace-nowrap transition-colors"
          >
            Предложить идею плагина
          </a>
        </div>

      </div>

      {/* Author Configuration Guide Modal */}
      <DataConfigGuideModal
        isOpen={guideModalOpen}
        onClose={() => setGuideModalOpen(false)}
      />
    </section>
  );
};
