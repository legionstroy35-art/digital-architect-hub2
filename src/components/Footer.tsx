import React, { useState } from 'react';
import { ArrowUp, Send, MessageSquare, Mail, Heart, ExternalLink, Copy, Check, Lock, ShieldCheck } from 'lucide-react';
import { PLATFORMS } from '../data/mockData';
import { HubLogo } from './HubLogo';

interface FooterProps {
  onOpenPrivacy: () => void;
  onOpenBoostyModal: () => void;
  onScrollToSection: (sectionId: string) => void;
  onOpenAdminModal?: (tab?: 'sheet' | 'plugins' | 'courses' | 'waitlist') => void;
  onOpenAdminLogin?: () => void;
  onAdminLogout?: () => void;
  isAdmin?: boolean;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenPrivacy,
  onOpenBoostyModal,
  onScrollToSection,
  onOpenAdminModal,
  onOpenAdminLogin,
  onAdminLogout,
  isAdmin = false,
}) => {
  const [copiedEmail, setCopiedEmail] = useState(false);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText('i@prolegionstroy.ru').then(() => {
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2500);
    }).catch(() => {
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2500);
    });
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-slate-950 text-slate-400 text-xs font-mono relative border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-16">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          
          {/* Brand & Manifesto (2 cols) */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <HubLogo size={48} variant="dark" />
              <div>
                <span className="font-extrabold text-base text-white font-mono tracking-tight block">
                  ЦИФРОВОЙ ХАБ <span className="text-blue-400">АРХИТЕКТОРА</span>
                </span>
                <span className="text-[11px] text-slate-400">
                  Digital Architect Hub // Плагины, скрипты & обучение
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-300 font-sans leading-relaxed max-w-sm">
              Официальный портал сообщества архитектора. Бесплатные плагины и скрипты для Revit, AutoCAD, Archicad и Twinmotion. Открытые уроки на Rutube, VK и в Telegram, закрытые углубленные курсы на Boosty.
            </p>

            <div className="pt-2 flex flex-col gap-2 font-sans text-xs">
              <div className="flex items-center gap-2 text-slate-300">
                <Mail className="w-4 h-4 text-blue-400 shrink-0" />
                <a
                  href="mailto:i@prolegionstroy.ru?subject=Вопрос%20автору%20ArchHub"
                  className="hover:text-white text-blue-300 transition-colors underline underline-offset-2"
                >
                  Почта: i@prolegionstroy.ru
                </a>
                <button
                  type="button"
                  onClick={handleCopyEmail}
                  className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
                  title="Скопировать почту"
                >
                  {copiedEmail ? (
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <Send className="w-4 h-4 text-sky-400 shrink-0" />
                <a href="https://t.me/DigitalArchitectHub" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors underline underline-offset-2">
                  Канал в Telegram: @DigitalArchitectHub
                </a>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <MessageSquare className="w-4 h-4 text-indigo-400 shrink-0" />
                <a href="https://max.ru/u/f9LHodD0cOICVBiVgh92-i02En0bEtu2tsI8r2UNqa0fLQoQe29YQgEF120" target="_blank" rel="noopener noreferrer" className="text-indigo-300 hover:text-white transition-colors underline underline-offset-2 font-medium">
                  Личный MAX автора (вопросы & ЛС)
                </a>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <MessageSquare className="w-4 h-4 text-sky-400 shrink-0" />
                <a href="https://t.me/questions_arhitect" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors underline underline-offset-2">
                  Вопросы в Telegram: @questions_arhitect
                </a>
              </div>
            </div>

            <div className="pt-1 flex items-center gap-2 text-xs text-slate-400 font-sans">
              <Heart className="w-3.5 h-3.5 text-red-400 fill-red-400" />
              <span>Создано для свободного развития проектировщиков и архитекторов</span>
            </div>
          </div>

          {/* Platforms Links */}
          <div>
            <h4 className="text-xs uppercase font-bold text-white tracking-wider mb-4">
              Официальные каналы
            </h4>
            <ul className="space-y-2.5 font-sans text-xs">
              <li>
                <a href="https://t.me/DigitalArchitectHub" target="_blank" rel="noopener noreferrer" className="hover:text-white text-sky-300 transition-colors flex items-center justify-between">
                  <span>Telegram Канал</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a href="https://t.me/questions_arhitect" target="_blank" rel="noopener noreferrer" className="hover:text-white text-sky-300 transition-colors flex items-center justify-between">
                  <span>Вопросы в Telegram</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a href="https://rutube.ru/channel/42238519" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors flex items-center justify-between">
                  <span>Rutube</span>
                  <span className="text-slate-500 font-mono text-[11px]">1 140 подп.</span>
                </a>
              </li>
              <li>
                <a href="https://vk.ru/arhhub" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors flex items-center justify-between">
                  <span>Канал ВКонтакте</span>
                  <span className="text-slate-500 font-mono text-[11px]">755 подп.</span>
                </a>
              </li>
              <li>
                <a href="https://vk.ru/im/channels/-236045401" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors flex items-center justify-between">
                  <span>Группа ВКонтакте</span>
                  <span className="text-slate-500 font-mono text-[11px]">369 уч.</span>
                </a>
              </li>
              <li>
                <a href="https://tenchat.ru/DigitalArchitectHub?ysclid=mu0ji84l39592717294" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors flex items-center justify-between">
                  <span>TenChat</span>
                  <span className="text-slate-500 font-mono text-[11px]">341 конт.</span>
                </a>
              </li>
              <li>
                <a href="https://dzen.ru/architectsdigitalhub" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors flex items-center justify-between">
                  <span>Дзен</span>
                  <span className="text-slate-500 font-mono text-[11px]">191 чит.</span>
                </a>
              </li>
              <li>
                <a href="https://max.ru/join/bAaUffiC5AwzniGlXzGmxiJzQJzusE76K7Zjf8FNOsY" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors flex items-center justify-between">
                  <span>Канал в MAX</span>
                  <span className="text-slate-500 font-mono text-[11px]">100 уч.</span>
                </a>
              </li>
              <li>
                <a href="https://max.ru/u/f9LHodD0cOICVBiVgh92-i02En0bEtu2tsI8r2UNqa0fLQoQe29YQgEF120" target="_blank" rel="noopener noreferrer" className="text-indigo-300 hover:text-white transition-colors flex items-center justify-between font-semibold">
                  <span>Личный MAX (ЛС)</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a href="https://boosty.to/architectdigitalhub?share=ios_blog_link" target="_blank" rel="noopener noreferrer" className="text-orange-400 hover:text-orange-300 transition-colors flex items-center justify-between font-semibold">
                  <span>Boosty (Курсы)</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
            </ul>
          </div>

          {/* Software covered */}
          <div>
            <h4 className="text-xs uppercase font-bold text-white tracking-wider mb-4">
              Программы
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-300 font-sans">
              <li>Autodesk Revit (BIM)</li>
              <li>AutoCAD (Рабочие чертежи)</li>
              <li>Archicad (Архитектура)</li>
              <li>Twinmotion (3D Рендер)</li>
              <li>Dynamo / Python (Скрипты)</li>
            </ul>
          </div>

          {/* Quick Nav */}
          <div>
            <h4 className="text-xs uppercase font-bold text-white tracking-wider mb-4">
              Разделы сайта
            </h4>
            <ul className="space-y-2.5 font-sans text-xs">
              <li>
                <button
                  onClick={() => onScrollToSection('downloads')}
                  className="hover:text-white transition-colors"
                >
                  Каталог плагинов
                </button>
              </li>
              <li>
                <button
                  onClick={() => onScrollToSection('courses')}
                  className="hover:text-white transition-colors"
                >
                  Обучение & Курсы
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenBoostyModal}
                  className="text-orange-400 hover:text-orange-300 transition-colors font-semibold"
                >
                  Boosty (Платные уроки)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onScrollToSection('philosophy')}
                  className="hover:text-white transition-colors"
                >
                  Почему это бесплатно?
                </button>
              </li>
              <li>
                <button
                  onClick={() => onScrollToSection('feedback')}
                  className="hover:text-white transition-colors"
                >
                  Предложить идею плагина
                </button>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <p>© {new Date().getFullYear()} Цифровой хаб архитектора (Digital Architect Hub). Все плагины распространяются свободно.</p>

          <div className="flex flex-wrap items-center gap-4 sm:gap-6">
            {isAdmin ? (
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 font-mono text-[10px] border border-amber-500/30">
                  <ShieldCheck className="w-3 h-3" />
                  <span>Режим автора</span>
                </span>
                {onOpenAdminModal && (
                  <button
                    onClick={() => onOpenAdminModal('sheet')}
                    className="hover:text-blue-300 text-blue-400 transition-colors flex items-center gap-1 underline underline-offset-4 font-semibold"
                    title="Управление плагинами, курсами и Google Таблицей"
                  >
                    <span>⚙️ Панель управления</span>
                  </button>
                )}
                {onAdminLogout && (
                  <button
                    onClick={onAdminLogout}
                    className="hover:text-rose-400 text-slate-400 transition-colors underline underline-offset-4 text-[10px]"
                    title="Выйти из режима автора на этом устройстве"
                  >
                    Выйти
                  </button>
                )}
              </div>
            ) : (
              onOpenAdminLogin && (
                <button
                  onClick={onOpenAdminLogin}
                  className="text-slate-600 hover:text-slate-400 transition-colors flex items-center gap-1 text-[11px]"
                  title="Вход для автора сайта (пароль 2026)"
                >
                  <Lock className="w-3 h-3" />
                  <span>Вход для автора</span>
                </button>
              )
            )}

            <button
              onClick={onOpenPrivacy}
              className="hover:text-slate-300 transition-colors underline underline-offset-4"
            >
              Политика конфиденциальности
            </button>

            <button
              onClick={scrollToTop}
              className="flex items-center gap-1.5 text-slate-400 hover:text-white transition-colors bg-slate-800 px-3 py-1.5 rounded-lg"
            >
              <span>Наверх</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
};
