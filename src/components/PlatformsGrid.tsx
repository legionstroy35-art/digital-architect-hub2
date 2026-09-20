import React from 'react';
import { ArrowUpRight, Send, HelpCircle, CheckCircle2, Users } from 'lucide-react';
import { PLATFORMS } from '../data/mockData';
import { PlatformLogo } from './PlatformLogo';

interface PlatformsGridProps {
  onOpenBoostyModal: () => void;
}

export const PlatformsGrid: React.FC<PlatformsGridProps> = ({ onOpenBoostyModal }) => {
  return (
    <section id="platforms" className="py-16 md:py-24 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-800 text-xs font-mono font-semibold mb-3">
            <Users className="w-3.5 h-3.5" />
            <span>[ОФИЦИАЛЬНЫЕ КАНАЛЫ СООБЩЕСТВА]</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-950 tracking-tight uppercase">
            Площадки Цифрового хаба архитектора
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-600 leading-relaxed">
            Подписывайтесь на площадки, где вам удобнее получать материалы. На всех открытых ресурсах видеоуроки и плагины публикуются бесплатно, а для углубленных мастер-классов и исходных файлов проектов работает клуб на Boosty.
          </p>
        </div>

        {/* Platforms Grid - Clean, balanced, responsive */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {PLATFORMS.map((platform) => {
            const isBoosty = platform.id === 'boosty';

            return (
              <div
                key={platform.id}
                className={`rounded-2xl p-5 sm:p-6 transition-all duration-300 flex flex-col justify-between border ${
                  isBoosty
                    ? 'bg-gradient-to-br from-orange-50/90 via-white to-amber-50/90 border-orange-300 shadow-md shadow-orange-100/60 relative overflow-hidden'
                    : 'bg-slate-50/70 hover:bg-white border-slate-200 hover:border-blue-400 hover:shadow-md'
                }`}
              >
                {isBoosty && (
                  <div className="absolute top-0 right-0 bg-gradient-to-l from-orange-500 to-amber-500 text-white text-[10px] font-mono font-bold uppercase tracking-wider py-1 px-3.5 rounded-bl-xl shadow-xs">
                    ЗАКРЫТЫЕ КУРСЫ
                  </div>
                )}

                <div>
                  {/* Top Bar: Branded Platform Logo, Category Badge, Counter */}
                  <div className="flex items-start justify-between gap-2 mb-4">
                    <div className="flex items-center gap-3">
                      <PlatformLogo platform={platform.iconType} size={42} />
                      <div>
                        <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
                          {platform.name}
                        </h3>
                        <span className="text-[11px] font-mono text-slate-500 block">
                          {platform.badge}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Subscriber Counter Tag */}
                  <div className="mb-3.5 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-800 text-xs font-mono font-bold shadow-2xs">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                    <span>{isBoosty ? 'Эксклюзивный доступ' : platform.subscribersFormatted}</span>
                  </div>

                  {/* Description */}
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-4">
                    {platform.description}
                  </p>

                  <div className="text-[11px] text-slate-400 font-mono mb-5 flex items-center gap-1.5">
                    <span className="font-semibold text-slate-500">Обновления:</span>
                    <span>{platform.frequency}</span>
                  </div>
                </div>

                {/* Bottom Action Button (NO ugly raw URLs shown!) */}
                <div className="pt-3 border-t border-slate-200/80">
                  {isBoosty ? (
                    <button
                      onClick={onOpenBoostyModal}
                      className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xs transition-transform active:scale-98"
                    >
                      <span>{platform.actionLabel || 'Узнать про курсы на Boosty'}</span>
                      <ArrowUpRight className="w-4 h-4" />
                    </button>
                  ) : (
                    <a
                      href={platform.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-2.5 px-4 rounded-xl bg-white hover:bg-blue-600 text-slate-800 hover:text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 border border-slate-300 hover:border-blue-600 transition-colors shadow-2xs group"
                    >
                      <span>{platform.actionLabel || 'Перейти на площадку'}</span>
                      <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-white transition-colors" />
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Direct Support / Q&A Banner (Telegram + Personal MAX alternative) */}
        <div className="mt-10 p-5 sm:p-7 rounded-2xl bg-gradient-to-r from-sky-50/90 via-indigo-50/70 to-purple-50/90 border border-sky-200/90 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5 shadow-xs">
          <div className="flex items-start sm:items-center gap-4">
            <div className="flex -space-x-2 shrink-0">
              <PlatformLogo platform="telegram" size={42} className="ring-2 ring-white z-10" />
              <PlatformLogo platform="max" size={42} className="ring-2 ring-white z-0" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-white text-slate-800 text-[10px] font-mono font-bold uppercase tracking-wider mb-1 border border-slate-200">
                <span>Прямая связь с автором</span>
              </div>
              <h4 className="text-sm sm:text-base font-bold text-slate-950">
                Возник вопрос по чертежам, плагинам или обучению?
              </h4>
              <p className="text-xs sm:text-sm text-slate-600 mt-0.5 max-w-xl">
                Задайте вопрос в Telegram-ветку или пишите напрямую в личный мессенджер <span className="font-bold text-indigo-700">MAX</span> — надежная альтернатива, если Telegram работает с перебоями.
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 w-full lg:w-auto shrink-0">
            <a
              href="https://max.ru/u/f9LHodD0cOICVBiVgh92-i02En0bEtu2tsI8r2UNqa0fLQoQe29YQgEF120"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 shadow-xs"
              title="Написать автору в MAX"
            >
              <PlatformLogo platform="max" size={18} />
              <span>Написать в личный MAX</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>

            <a
              href="https://t.me/questions_arhitect"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2.5 rounded-xl bg-white hover:bg-sky-50 text-sky-800 hover:text-sky-900 border border-sky-300 text-xs sm:text-sm font-bold transition-colors flex items-center justify-center gap-2 shadow-2xs"
              title="Вопросы в Telegram"
            >
              <Send className="w-3.5 h-3.5 text-sky-600" />
              <span>Вопрос в Telegram</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

      </div>
    </section>
  );
};
