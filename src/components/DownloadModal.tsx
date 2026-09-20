import React, { useState } from 'react';
import { X, Download, CheckCircle2, Play, ArrowUpRight, FileCode2, Sparkles, ExternalLink, Clock, Send, MessageSquare } from 'lucide-react';
import { ResourceItem } from '../types';
import { PlatformLogo } from './PlatformLogo';

interface DownloadModalProps {
  resource: ResourceItem | null;
  onClose: () => void;
}

export const DownloadModal: React.FC<DownloadModalProps> = ({ resource, onClose }) => {
  const [downloadStarted, setDownloadStarted] = useState(false);

  if (!resource) return null;

  const isInDev = !!resource.inDevelopment;

  const handleDownloadFile = () => {
    setDownloadStarted(true);

    if (resource.downloadUrl) {
      window.open(resource.downloadUrl, '_blank', 'noopener,noreferrer');
      return;
    }

    // Fallback template archive generator with instructions
    const content = `==================================================================
ЦИФРОВОЙ ХАБ АРХИТЕКТОРА (DIGITAL ARCHITECT HUB)
Файл: ${resource.title}
Программа: ${resource.softwareLabel} (${resource.version})
Формат: ${resource.fileFormat}
==================================================================

Благодарим за использование бесплатных материалов сообщества!

ОФИЦИАЛЬНЫЕ ПЛОЩАДКИ:
- Telegram-канал: https://t.me/DigitalArchitectHub
- Вопросы архитектору: https://t.me/questions_arhitect
- Видеоуроки на Rutube: https://rutube.ru/channel/42238519
- Сообщество ВКонтакте: https://vk.ru/arhhub
- Закрытые курсы Boosty: https://boosty.to/architectdigitalhub?share=ios_blog_link

ИНСТРУКЦИЯ ПО УСТАНОВКЕ:
1. Распакуйте архив в постоянную рабочую папку на диске.
2. Для AutoCAD (LISP-скрипты):
   - Введите команду АППЗАГР (_APPLOAD) в командной строке AutoCAD
   - Выберите скачанный файл .lsp и добавьте в «Автозагрузку»
3. Для динамических блоков .dwg:
   - Откройте файл напрямую или перетащите блок через Палитру компонентов (Ctrl+3 / Ctrl+2)

Желаем продуктивной работы и точных чертежей!
`;
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${resource.title.replace(/[\s«»]/g, '_')}_DIGITAL_HUB.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 md:p-8">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-lg bg-white rounded-3xl border border-slate-200 shadow-2xl overflow-hidden z-10 animate-in fade-in zoom-in-95">
        
        {/* Header */}
        <div
          className={`p-5 sm:p-6 border-b flex items-center justify-between ${
            isInDev ? 'bg-amber-50/90 border-amber-200' : 'bg-slate-50/80 border-slate-100'
          }`}
        >
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold ${
                isInDev ? 'bg-amber-100 text-amber-700' : 'bg-blue-50 text-blue-600'
              }`}
            >
              {isInDev ? <Clock className="w-5 h-5" /> : <FileCode2 className="w-5 h-5" />}
            </div>
            <div>
              <span
                className={`text-[11px] font-mono font-bold uppercase block ${
                  isInDev ? 'text-amber-700' : 'text-blue-700'
                }`}
              >
                {isInDev ? 'В РАЗРАБОТКЕ // СКОРО В РЕЛИЗЕ' : `${resource.softwareLabel} // ${resource.version}`}
              </span>
              <h3 className="text-sm sm:text-base font-bold text-slate-900 leading-snug">
                {resource.title}
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 sm:p-6 space-y-4">
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            {resource.description}
          </p>

          <div
            className={`p-4 rounded-2xl border text-xs space-y-2 ${
              isInDev ? 'bg-amber-50/50 border-amber-200' : 'bg-slate-50 border-slate-200'
            }`}
          >
            <div className="font-bold text-slate-900 font-mono uppercase text-[11px]">
              Параметры файла:
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Формат:</span>
              <span className="font-mono font-bold text-slate-800">{resource.fileFormat}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Размер:</span>
              <span className="font-mono font-bold text-slate-800">{resource.fileSize}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Доступ:</span>
              <span className="font-mono font-bold text-emerald-600">
                {isInDev ? 'Бесплатно в момент релиза' : '100% бесплатно для подписчиков'}
              </span>
            </div>
          </div>

          {/* Action Button */}
          <div className="space-y-2.5 pt-1">
            {isInDev ? (
              <div className="space-y-2">
                <a
                  href="https://t.me/DigitalArchitectHub"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md shadow-amber-500/20 transition-all active:scale-98"
                >
                  <Send className="w-4 h-4" />
                  <span>Получить файл первым в Telegram-канале</span>
                </a>
                <p className="text-[11px] text-center text-slate-500">
                  Релиз плагина состоится в нашем Telegram-канале @DigitalArchitectHub
                </p>
              </div>
            ) : (
              <>
                <button
                  onClick={handleDownloadFile}
                  className="w-full py-3.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md shadow-blue-600/20 transition-all active:scale-98"
                >
                  <Download className="w-4 h-4" />
                  <span>
                    {resource.downloadUrl
                      ? `Скачать с Яндекс.Диска (${resource.fileSize})`
                      : downloadStarted
                      ? 'Скачать файл еще раз'
                      : 'Скачать файл бесплатно'}
                  </span>
                  {resource.downloadUrl && <ExternalLink className="w-3.5 h-3.5 opacity-80" />}
                </button>

                {downloadStarted && (
                  <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Открыта ссылка на скачивание. Спасибо за использование материалов!</span>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Channels footer */}
          <div className="pt-4 border-t border-slate-100 bg-slate-50/70 -mx-5 -mb-5 sm:-mx-6 sm:-mb-6 p-4 sm:p-5 text-xs text-slate-600 space-y-2.5">
            <div className="flex items-center gap-1.5 font-bold text-slate-900 text-[11px] uppercase tracking-wider font-mono">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              <span>Официальные площадки для подписки:</span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <a
                href="https://t.me/DigitalArchitectHub"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-xl bg-white border border-slate-200 hover:border-blue-400 font-semibold text-slate-800 flex items-center gap-2 transition-colors shadow-2xs text-xs"
              >
                <PlatformLogo platform="telegram" size={24} />
                <span className="truncate">Telegram (280+)</span>
              </a>

              <a
                href="https://rutube.ru/channel/42238519"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-xl bg-white border border-slate-200 hover:border-blue-400 font-semibold text-slate-800 flex items-center gap-2 transition-colors shadow-2xs text-xs"
              >
                <PlatformLogo platform="rutube" size={24} />
                <span className="truncate">Rutube (1 140)</span>
              </a>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
