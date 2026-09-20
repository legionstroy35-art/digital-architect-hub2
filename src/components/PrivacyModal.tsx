import React from 'react';
import { X, Shield } from 'lucide-react';

interface PrivacyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PrivacyModal: React.FC<PrivacyModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10">
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="relative w-full max-w-2xl max-h-[85vh] bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden flex flex-col z-10 animate-in fade-in">
        <div className="p-4 sm:p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-blue-600" />
            <h3 className="text-base sm:text-lg font-bold text-slate-900 font-mono">
              Политика конфиденциальности
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="overflow-y-auto p-5 sm:p-6 text-xs sm:text-sm text-slate-600 space-y-4 leading-relaxed font-sans">
          <p>
            Настоящая Политика обработки персональных данных составлена в соответствии с требованиями Федерального закона от 27.07.2006 № 152-ФЗ «О персональных данных» и определяет порядок обработки персональных данных при обращении через форму обратной связи образовательного и плагин-портала инженера.
          </p>

          <h4 className="font-bold text-slate-900 text-sm font-mono pt-2">
            1. Цели сбора информации
          </h4>
          <p>
            Персональные данные (имя, контакт в Telegram, адрес электронной почты) используются исключительно для ответов на ваши вопросы по программному обеспечению (Revit, AutoCAD, Archicad, Twinmotion), обсуждения идей новых плагинов и обратной связи по обучающим материалам.
          </p>

          <h4 className="font-bold text-slate-900 text-sm font-mono pt-2">
            2. Защита данных
          </h4>
          <p>
            Данные не передаются третьим лицам, не используются для навязчивых рассылок или спама. Все скачиваемые бесплатные плагины и материалы не собирают пользовательские данные и не требуют обязательной авторизации.
          </p>
        </div>

        <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition-colors"
          >
            Понятно
          </button>
        </div>
      </div>
    </div>
  );
};
