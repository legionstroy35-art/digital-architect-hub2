import React, { useState, useEffect } from 'react';
import { Menu, X, ArrowUpRight, Download, Send, ExternalLink, MessageCircle } from 'lucide-react';
import { HubLogo } from './HubLogo';
import { PlatformLogo } from './PlatformLogo';

interface HeaderProps {
  onOpenBoostyModal: () => void;
  onScrollToSection: (sectionId: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenBoostyModal, onScrollToSection }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { id: 'downloads', label: 'Плагины' },
    { id: 'courses', label: 'Обучение' },
    { id: 'platforms', label: 'Площадки' },
    { id: 'philosophy', label: 'О проекте' },
    { id: 'feedback', label: 'Вопрос' },
  ];

  const handleNavClick = (id: string) => {
    setMobileMenuOpen(false);
    onScrollToSection(id);
  };

  const PERSONAL_MAX_URL = 'https://max.ru/u/f9LHodD0cOICVBiVgh92-i02En0bEtu2tsI8r2UNqa0fLQoQe29YQgEF120';

  return (
    <header
      id="main-header"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-xs py-2'
          : 'bg-white/90 backdrop-blur-sm border-b border-slate-200/60 py-2.5 sm:py-3'
      }`}
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-2 sm:gap-4">
          
          {/* Logo & Brand Identity */}
          <button
            onClick={() => handleNavClick('hero')}
            id="brand-logo"
            className="flex items-center gap-2 sm:gap-2.5 group text-left focus:outline-none shrink-0 min-w-0"
          >
            <HubLogo size={44} variant="light" />
            <div className="flex flex-col min-w-0">
              <span className="font-extrabold text-xs sm:text-sm md:text-base tracking-tight text-slate-900 font-mono leading-tight truncate">
                ЦИФРОВОЙ ХАБ <span className="text-blue-600">АРХИТЕКТОРА</span>
              </span>
              <span className="text-[10px] text-slate-500 font-mono tracking-wider truncate hidden xs:block">
                DIGITAL ARCHITECT HUB
              </span>
            </div>
          </button>

          {/* Desktop Nav (Visible on XL screens to guarantee zero crowding) */}
          <nav className="hidden xl:flex items-center gap-1 shrink-0">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.id)}
                className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-blue-600 hover:bg-slate-100/80 rounded-lg transition-colors"
              >
                {link.label}
              </button>
            ))}
          </nav>

          {/* Action CTAs (Strictly for Large screens >= 1024px) */}
          <div className="hidden lg:flex items-center gap-2 shrink-0">
            {/* Telegram Channel */}
            <a
              href="https://t.me/DigitalArchitectHub"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-700 text-xs font-semibold transition-colors flex items-center gap-1.5 border border-sky-200 shrink-0"
              title="Telegram-канал сообщества"
            >
              <Send className="w-3.5 h-3.5 text-sky-600" />
              <span>Telegram</span>
            </a>

            {/* Personal MAX Messenger - Direct chat with author */}
            <a
              href={PERSONAL_MAX_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-800 text-xs font-semibold transition-colors flex items-center gap-1.5 border border-indigo-200 shrink-0 shadow-2xs group"
              title="Написать автору в мессенджер MAX (личные сообщения — альтернатива Telegram)"
            >
              <PlatformLogo platform="max" size={18} />
              <span className="group-hover:text-indigo-900 font-medium">Личный MAX</span>
            </a>

            <button
              onClick={() => handleNavClick('downloads')}
              className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold transition-colors flex items-center gap-1.5 border border-slate-200 shrink-0"
            >
              <Download className="w-3.5 h-3.5 text-blue-600" />
              <span>Плагины</span>
            </button>

            <button
              id="header-boosty-btn"
              onClick={onOpenBoostyModal}
              className="relative group overflow-hidden rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white text-xs font-bold px-3.5 py-1.5 shadow-xs active:scale-95 flex items-center gap-1.5 transition-all shrink-0"
            >
              <span>Boosty</span>
              <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </button>
          </div>

          {/* Compact Tablet & Mobile Controls (< 1024px) */}
          <div className="flex items-center gap-1.5 sm:gap-2 lg:hidden shrink-0">
            {/* Direct Telegram icon */}
            <a
              href="https://t.me/DigitalArchitectHub"
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 sm:p-2 rounded-xl bg-sky-50 text-sky-600 border border-sky-200 shrink-0"
              title="Telegram канал"
              aria-label="Telegram канал"
            >
              <Send className="w-4 h-4" />
            </a>

            {/* Direct personal MAX icon */}
            <a
              href={PERSONAL_MAX_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1 sm:p-1.5 rounded-xl bg-indigo-50 border border-indigo-200 shrink-0 flex items-center justify-center"
              title="Написать автору в мессенджер MAX"
              aria-label="Личный MAX"
            >
              <PlatformLogo platform="max" size={22} />
            </a>

            <button
              onClick={onOpenBoostyModal}
              className="px-2.5 py-1.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold text-xs flex items-center gap-1 shrink-0 shadow-xs"
            >
              <span>Boosty</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 sm:p-2 rounded-xl bg-slate-100 border border-slate-200 text-slate-700 hover:text-slate-900 shrink-0"
              aria-label="Меню навигации"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>

        {/* Mobile Navigation Dropdown */}
        {mobileMenuOpen && (
          <div className="lg:hidden mt-2.5 pt-3 pb-4 border-t border-slate-200 bg-white rounded-2xl px-4 shadow-xl animate-in fade-in slide-in-from-top-2">
            <div className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <button
                  key={link.id}
                  onClick={() => handleNavClick(link.id)}
                  className="px-3 py-2.5 text-left text-xs sm:text-sm font-semibold text-slate-700 hover:text-blue-600 hover:bg-blue-50/60 rounded-xl transition-colors"
                >
                  {link.label}
                </button>
              ))}
            </div>

            <div className="mt-3 pt-3 border-t border-slate-100 flex flex-col gap-2">
              {/* Personal MAX direct chat recommendation for questions */}
              <a
                href={PERSONAL_MAX_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 px-3.5 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-950 font-bold text-xs flex items-center justify-between shadow-2xs"
              >
                <div className="flex items-center gap-2">
                  <PlatformLogo platform="max" size={24} />
                  <div className="text-left">
                    <span className="block font-bold">Личный контакт в MAX</span>
                    <span className="block text-[10px] text-indigo-700 font-normal">Написать автору напрямую (альтернатива TG)</span>
                  </div>
                </div>
                <ArrowUpRight className="w-4 h-4 text-indigo-600" />
              </a>

              <button
                onClick={() => handleNavClick('downloads')}
                className="w-full py-2.5 px-3 rounded-xl bg-blue-50 text-blue-700 font-bold text-xs flex items-center justify-center gap-1.5"
              >
                <Download className="w-4 h-4" />
                <span>Каталог бесплатных плагинов</span>
              </button>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <a
                  href="https://t.me/DigitalArchitectHub"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-2 px-3 rounded-xl bg-sky-50 text-sky-700 font-semibold text-center flex items-center justify-center gap-1.5 border border-sky-200"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Telegram</span>
                </a>
                <a
                  href="https://rutube.ru/channel/42238519"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-2 px-3 rounded-xl bg-slate-100 text-slate-800 font-semibold text-center flex items-center justify-center gap-1.5 border border-slate-200"
                >
                  <PlatformLogo platform="rutube" size={16} />
                  <span>Rutube</span>
                </a>
              </div>
            </div>
          </div>
        )}

      </div>
    </header>
  );
};
