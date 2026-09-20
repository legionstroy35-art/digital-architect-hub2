import React, { useState } from 'react';
import { Mail, Send, Check, Copy, Sparkles, MessageSquare, HelpCircle, GraduationCap, Briefcase, ExternalLink, ArrowUpRight } from 'lucide-react';
import { PlatformLogo } from './PlatformLogo';

export const FeedbackAndRequestForm: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState<string>('Идея нового плагина');

  const EMAIL = 'i@prolegionstroy.ru';
  const TELEGRAM_URL = 'https://t.me/questions_arhitect';
  const MAX_URL = 'https://max.ru/u/f9LHodD0cOICVBiVgh92-i02En0bEtu2tsI8r2UNqa0fLQoQe29YQgEF120';

  const topics = [
    {
      id: 'plugin',
      title: 'Есть идея нового плагина',
      desc: 'Не хватает удобной кнопки или скрипта в Revit, AutoCAD или Archicad? Опишите задачу — полезные решения реализую бесплатно.',
      icon: Sparkles,
      color: 'text-amber-500 bg-amber-50 border-amber-200',
      subject: 'Идея нового плагина для ArchHub'
    },
    {
      id: 'software',
      title: 'Вопрос по программе',
      desc: 'Трудности с семействами, шаблонами видов, ведомостями, Dynamo-скриптами или экспортом в Twinmotion.',
      icon: HelpCircle,
      color: 'text-blue-500 bg-blue-50 border-blue-200',
      subject: 'Вопрос по программе (Revit/AutoCAD/Archicad)'
    },
    {
      id: 'courses',
      title: 'Вопрос по обучению и Boosty',
      desc: 'Уточнить детали углубленных курсов, подписку на закрытые материалы или формат индивидуальных консультаций.',
      icon: GraduationCap,
      color: 'text-purple-500 bg-purple-50 border-purple-200',
      subject: 'Вопрос по курсам и обучению на Boosty'
    },
    {
      id: 'coop',
      title: 'Сотрудничество и проекты',
      desc: 'Разработка плагинов под требования проектного бюро, внедрение BIM-стандартов или совместные образовательные проекты.',
      icon: Briefcase,
      color: 'text-emerald-500 bg-emerald-50 border-emerald-200',
      subject: 'Предложение о сотрудничестве с ArchHub'
    }
  ];

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(EMAIL).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }).catch(() => {
      // Fallback
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  const getMailtoUrl = (subject?: string) => {
    const s = encodeURIComponent(subject || `Вопрос автору ArchHub: ${selectedTopic}`);
    return `mailto:${EMAIL}?subject=${s}`;
  };

  return (
    <section id="feedback" className="py-16 md:py-20 bg-white border-b border-slate-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-800 text-xs font-mono font-semibold mb-3">
            <MessageSquare className="w-3.5 h-3.5 text-blue-600" />
            <span>[ПРЯМАЯ СВЯЗЬ БЕЗ РЕГИСТРАЦИИ]</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-950 tracking-tight">
            Предложить идею плагина или задать вопрос
          </h2>
          <p className="text-sm sm:text-base text-slate-600 mt-3 leading-relaxed">
            Никаких сложных форм и сторонних сервисов. Вы можете написать напрямую автору в Telegram, мессенджер MAX или на электронную почту. Я читаю все обращения и открыт к идеям новых полезных инструментов.
          </p>
        </div>

        {/* What to write about: Example Topic Cards */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-mono uppercase font-bold text-slate-500 tracking-wider">
              Примеры тем для обращения:
            </span>
            <span className="text-[11px] font-mono text-slate-400 hidden sm:inline">
              Кликните тему, чтобы сразу открыть письмо
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
            {topics.map((t) => {
              const Icon = t.icon;
              return (
                <a
                  key={t.id}
                  href={getMailtoUrl(t.subject)}
                  onClick={() => setSelectedTopic(t.title)}
                  className="group p-4 rounded-2xl border border-slate-200 bg-slate-50/70 hover:bg-white hover:border-blue-300 hover:shadow-sm transition-all text-left flex flex-col justify-between"
                  title={`Написать по теме: ${t.title}`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2.5">
                      <div className={`w-8 h-8 rounded-xl border flex items-center justify-center ${t.color}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600 transition-colors" />
                    </div>
                    <h3 className="font-bold text-slate-900 text-xs sm:text-sm group-hover:text-blue-600 transition-colors">
                      {t.title}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                      {t.desc}
                    </p>
                  </div>
                  <div className="mt-3 pt-2.5 border-t border-slate-200/60 flex items-center gap-1 text-[11px] text-blue-600 font-semibold">
                    <Mail className="w-3 h-3" />
                    <span>Написать по этой теме</span>
                  </div>
                </a>
              );
            })}
          </div>
        </div>

        {/* 3 Main Direct Channels (Cards) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          
          {/* Channel 1: Email */}
          <div className="bg-slate-50 rounded-2xl border border-slate-200 p-5 sm:p-6 flex flex-col justify-between hover:border-blue-300 hover:shadow-2xs transition-all">
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-2xs">
                  <Mail className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-blue-100/80 text-blue-800 font-semibold">
                  Почта
                </span>
              </div>
              <h3 className="font-bold text-base text-slate-900">
                Электронная почта
              </h3>
              <p className="text-xs text-slate-500 mt-1 mb-3">
                Для подробных описаний плагинов, вложений файлов и скриншотов
              </p>
              <div className="bg-white border border-slate-200 rounded-xl p-2.5 flex items-center justify-between mb-4">
                <span className="font-mono text-xs font-bold text-slate-800 truncate select-all">
                  {EMAIL}
                </span>
                <button
                  type="button"
                  onClick={handleCopyEmail}
                  className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition-colors shrink-0 ml-1"
                  title="Скопировать адрес почты"
                >
                  {copied ? (
                    <Check className="w-4 h-4 text-emerald-600" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <a
                href={getMailtoUrl()}
                className="w-full py-2.5 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-2xs text-center"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>Написать на почту</span>
              </a>
              <button
                type="button"
                onClick={handleCopyEmail}
                className="w-full py-2 px-3 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-emerald-700 font-bold">Скопировано!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-slate-500" />
                    <span>Скопировать адрес</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Channel 2: Telegram */}
          <div className="bg-slate-50 rounded-2xl border border-slate-200 p-5 sm:p-6 flex flex-col justify-between hover:border-sky-300 hover:shadow-2xs transition-all">
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-sky-500 text-white flex items-center justify-center shadow-2xs">
                  <PlatformLogo platform="telegram" size={24} />
                </div>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-sky-100 text-sky-800 font-semibold">
                  Telegram
                </span>
              </div>
              <h3 className="font-bold text-base text-slate-900">
                Telegram вопросы
              </h3>
              <p className="text-xs text-slate-500 mt-1 mb-3">
                Прямой чат для быстрых вопросов по скриптам, плагинам и обучению
              </p>
              <div className="bg-white border border-slate-200 rounded-xl p-2.5 mb-4">
                <span className="font-mono text-xs font-bold text-slate-800">
                  @questions_arhitect
                </span>
              </div>
            </div>

            <a
              href={TELEGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="py-2.5 px-3 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-2xs text-center"
            >
              <span>Написать в Telegram</span>
              <Send className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Channel 3: MAX */}
          <div className="bg-slate-50 rounded-2xl border border-slate-200 p-5 sm:p-6 flex flex-col justify-between hover:border-indigo-300 hover:shadow-2xs transition-all">
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-2xs">
                  <PlatformLogo platform="max" size={24} />
                </div>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-indigo-100 text-indigo-800 font-semibold">
                  Мессенджер MAX
                </span>
              </div>
              <h3 className="font-bold text-base text-slate-900">
                Личный MAX автора
              </h3>
              <p className="text-xs text-slate-500 mt-1 mb-3">
                Надёжная связь, если Telegram заблокирован или требуется альтернативный канал
              </p>
              <div className="bg-white border border-slate-200 rounded-xl p-2.5 mb-4">
                <span className="font-mono text-xs font-bold text-slate-800">
                  Личный профиль автора в MAX
                </span>
              </div>
            </div>

            <a
              href={MAX_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="py-2.5 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-2xs text-center"
            >
              <PlatformLogo platform="max" size={14} />
              <span>Открыть в MAX</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          </div>

        </div>

        {/* Bottom Quick Bar ("Быстрый вопрос автору напрямую") */}
        <div className="p-4 sm:p-5 rounded-2xl bg-slate-900 text-white flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex -space-x-1.5 shrink-0">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center ring-2 ring-slate-900">
                <Mail className="w-4 h-4 text-white" />
              </div>
              <PlatformLogo platform="telegram" size={32} className="ring-2 ring-slate-900" />
              <PlatformLogo platform="max" size={32} className="ring-2 ring-slate-900" />
            </div>
            <div>
              <span className="text-xs sm:text-sm font-bold text-white block">
                Быстрый вопрос автору напрямую
              </span>
              <span className="text-[11px] text-slate-400">
                Telegram, мессенджер MAX или почта <strong className="text-slate-200">{EMAIL}</strong>
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto shrink-0">
            {/* Direct Email Link */}
            <a
              href={getMailtoUrl()}
              className="py-2 px-3 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-colors shrink-0 flex items-center gap-1.5 shadow-2xs"
              title="Открыть почтовый клиент"
            >
              <Mail className="w-3.5 h-3.5" />
              <span>Написать на почту</span>
            </a>

            {/* Copy Email Button */}
            <button
              type="button"
              onClick={handleCopyEmail}
              className="py-2 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors shrink-0 flex items-center gap-1.5 border border-slate-700"
              title="Скопировать почту"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-300">Скопировано!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Скопировать почту</span>
                </>
              )}
            </button>

            {/* TG */}
            <a
              href={TELEGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="py-2 px-3 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold transition-colors shrink-0 flex items-center gap-1 shadow-2xs"
              title="Вопрос в Telegram"
            >
              <span>Чат в TG</span>
              <Send className="w-3 h-3" />
            </a>

            {/* MAX */}
            <a
              href={MAX_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="py-2 px-3 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-colors shrink-0 flex items-center gap-1 shadow-2xs"
              title="Личные сообщения в MAX"
            >
              <PlatformLogo platform="max" size={14} />
              <span>Личный MAX</span>
              <ArrowUpRight className="w-3 h-3" />
            </a>
          </div>
        </div>

      </div>
    </section>
  );
};
