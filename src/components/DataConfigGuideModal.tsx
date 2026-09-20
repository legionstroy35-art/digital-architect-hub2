import React, { useState } from 'react';
import { X, Code2, Copy, Check, FileText, Link, Sparkles, FolderTree } from 'lucide-react';

interface DataConfigGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DataConfigGuideModal: React.FC<DataConfigGuideModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const exampleSnippet = `{
  id: 'my-custom-plugin',
  title: 'Плагин «Авто-Спецификация КЖ» для Revit',
  software: 'revit', // 'revit' | 'autocad' | 'archicad' | 'twinmotion' | 'scripts'
  softwareLabel: 'Revit',
  category: 'Плагин / Add-in',
  version: 'Revit 2021–2025',
  description: 'Здесь ваше описание плагина...',
  benefits: [
    'Экономит до 3 часов на листе',
    'Автоматический учет арматуры',
    'Соответствие ГОСТ'
  ],
  downloadsCount: 1420,
  fileSize: '4.8 MB',
  fileFormat: '.zip (Add-in + DLL)',
  isFree: true,
  downloadUrl: 'https://disk.yandex.ru/d/...', // ВАША ССЫЛКА НА СКАЧИВАНИЕ
  videoTutorialUrl: 'https://rutube.ru/channel/42238519' // ВАШ ВИДЕОУРОК
}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(exampleSnippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 md:p-8">
      <div
        className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="relative w-full max-w-2xl bg-white rounded-3xl border border-slate-200 shadow-2xl overflow-hidden z-10 max-h-[90vh] flex flex-col animate-in fade-in zoom-in-95">
        {/* Modal Header */}
        <div className="p-5 sm:p-6 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center">
              <Code2 className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] font-mono font-bold text-blue-600 uppercase block">
                ИНСТРУКЦИЯ ДЛЯ АВТОРА
              </span>
              <h3 className="text-base sm:text-lg font-bold text-slate-900">
                Как менять описание и ссылки в каталоге плагинов
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

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 text-slate-700 text-xs sm:text-sm font-sans leading-relaxed">
          
          {/* Step 1: File Location */}
          <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200">
            <div className="flex items-center gap-2 font-bold text-blue-950 mb-1">
              <FolderTree className="w-4 h-4 text-blue-600" />
              <span>Где находится файл с данными:</span>
            </div>
            <p className="text-xs text-blue-900">
              Все карточки плагинов, описания, ссылки и характеристики хранятся в одном файле:
            </p>
            <div className="mt-2 px-3 py-1.5 bg-white border border-blue-300 rounded-lg font-mono font-bold text-blue-800 text-xs inline-block">
              /src/data/mockData.ts
            </div>
            <p className="mt-2 text-xs text-blue-900">
              Ищите массив <code className="bg-blue-100 px-1 py-0.5 rounded font-mono font-bold">FREE_RESOURCES</code>.
            </p>
          </div>

          {/* Step 2: What Each Field Means */}
          <div className="space-y-3">
            <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <FileText className="w-4 h-4 text-slate-500" />
              <span>Основные поля карточки плагина:</span>
            </h4>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="font-mono font-bold text-blue-600 block">downloadUrl</span>
                <span className="text-slate-600">
                  Ваша прямая ссылка на скачивание (например, Яндекс Диск, Облако Mail.ru, Google Диск или ссылка на файл в Telegram).
                </span>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="font-mono font-bold text-blue-600 block">videoTutorialUrl</span>
                <span className="text-slate-600">
                  Ссылка на видеоурок с разбором работы плагина (на Rutube или ВКонтакте).
                </span>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="font-mono font-bold text-blue-600 block">title & description</span>
                <span className="text-slate-600">
                  Название плагина и понятное описание задачи, которую он решает.
                </span>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="font-mono font-bold text-blue-600 block">software</span>
                <span className="text-slate-600">
                  Категория для фильтра: <code className="font-mono text-slate-800">revit</code>, <code className="font-mono text-slate-800">autocad</code>, <code className="font-mono text-slate-800">archicad</code>, <code className="font-mono text-slate-800">twinmotion</code>, <code className="font-mono text-slate-800">scripts</code>.
                </span>
              </div>
            </div>
          </div>

          {/* Step 3: Copyable Code Example */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-900 text-xs font-mono uppercase">
                Пример структуры одного плагина:
              </span>
              <button
                onClick={handleCopy}
                className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs flex items-center gap-1 font-mono transition-colors"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Скопировано</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Скопировать шаблон</span>
                  </>
                )}
              </button>
            </div>

            <pre className="p-4 bg-slate-900 text-slate-200 rounded-2xl text-xs font-mono overflow-x-auto leading-relaxed">
              {exampleSnippet}
            </pre>
          </div>

          {/* Helpful prompt */}
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-2.5">
            <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <strong>Хотите добавить свои файлы прямо сейчас?</strong>
              <p className="mt-1">
                Вы можете просто написать мне в чат: <em>«Замени плагин 1: название такое-то, ссылка на Яндекс Диск такая-то, описание такое-то»</em>, и я сразу внесу все нужные ссылки и тексты в код!
              </p>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-colors"
          >
            Понятно, закрыть
          </button>
        </div>
      </div>
    </div>
  );
};
