import React, { useEffect, useState, useRef } from 'react';
import { X, ArrowUpRight, CheckCircle2, Move } from 'lucide-react';
import { PlatformLogo } from './PlatformLogo';

interface BoostyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BoostyModal: React.FC<BoostyModalProps> = ({ isOpen, onClose }) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragRef = useRef<{ startX: number; startY: number; initX: number; initY: number } | null>(null);

  // Close on Escape & Lock body scroll
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      setPosition({ x: 0, y: 0 }); // Center on open
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  // Handle Dragging
  const handlePointerDown = (e: React.PointerEvent) => {
    // Only allow dragging from header element itself (not buttons)
    if ((e.target as HTMLElement).closest('button') || (e.target as HTMLElement).closest('a')) {
      return;
    }
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    setIsDragging(true);
    dragRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      initX: position.x,
      initY: position.y,
    };
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging || !dragRef.current) return;
    const deltaX = e.clientX - dragRef.current.startX;
    const deltaY = e.clientY - dragRef.current.startY;
    setPosition({
      x: dragRef.current.initX + deltaX,
      y: dragRef.current.initY + deltaY,
    });
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (isDragging) {
      try {
        (e.target as HTMLElement).releasePointerCapture(e.pointerId);
      } catch {
        // Safe catch
      }
      setIsDragging(false);
      dragRef.current = null;
    }
  };

  if (!isOpen) return null;

  const BOOSTY_URL = 'https://boosty.to/architectdigitalhub?share=ios_blog_link';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Movable Dialog Window */}
      <div
        style={{
          transform: `translate3d(${position.x}px, ${position.y}px, 0)`,
        }}
        className="relative w-full max-w-[420px] max-h-[88vh] bg-white rounded-2xl sm:rounded-3xl border border-orange-200/90 shadow-2xl flex flex-col overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-150"
      >
        {/* Draggable Header */}
        <div
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          className="bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 text-white p-4 sm:p-5 select-none cursor-grab active:cursor-grabbing shrink-0 relative"
          title="Зажмите и перетаскивайте окно"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-3.5 right-3.5 p-1.5 rounded-full bg-black/15 hover:bg-black/30 text-white transition-colors cursor-pointer"
            aria-label="Закрыть окно"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-2 mb-2">
            <PlatformLogo platform="boosty" size={20} />
            <span className="text-[10px] font-mono uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-black/20 inline-block">
              Клуб Boosty
            </span>
            <span className="text-[10px] text-orange-100 font-mono hidden sm:inline-flex items-center gap-1 opacity-80">
              <Move className="w-3 h-3" /> можно двигать
            </span>
          </div>

          <h3 className="text-base sm:text-lg font-extrabold tracking-tight leading-snug pr-6">
            Закрытые материалы и поддержка автора
          </h3>
          <p className="text-xs text-orange-100 mt-1 leading-relaxed line-clamp-2">
            Все базовые видеоуроки на Rutube и VK остаются 100% бесплатными.
          </p>
        </div>

        {/* Scrollable Content Body */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-3.5 flex-1 text-slate-800 text-xs">
          <div className="text-[11px] font-mono uppercase text-slate-400 font-bold tracking-wider">
            Что открывает подписка:
          </div>

          <div className="space-y-2.5">
            <div className="flex items-start gap-2.5 p-2.5 bg-orange-50/70 border border-orange-200/80 rounded-xl">
              <CheckCircle2 className="w-4 h-4 text-orange-600 shrink-0 mt-0.5" />
              <div className="leading-snug">
                <strong>Исходники моделей и семейств:</strong> Полные файлы .rvt, настроенные семейства, шаблоны и DWG-узлы для работы.
              </div>
            </div>

            <div className="flex items-start gap-2.5 p-2.5 bg-orange-50/70 border border-orange-200/80 rounded-xl">
              <CheckCircle2 className="w-4 h-4 text-orange-600 shrink-0 mt-0.5" />
              <div className="leading-snug">
                <strong>Углубленные разборы:</strong> Проектирование узлов, армирование, тонкости спецификаций и визы в Twinmotion.
              </div>
            </div>

            <div className="flex items-start gap-2.5 p-2.5 bg-orange-50/70 border border-orange-200/80 rounded-xl">
              <CheckCircle2 className="w-4 h-4 text-orange-600 shrink-0 mt-0.5" />
              <div className="leading-snug">
                <strong>Прямая поддержка:</strong> Закрытый чат для вопросов и помощь в решении сложных ошибок в чертежах.
              </div>
            </div>
          </div>
        </div>

        {/* Sticky/Fixed Footer Action */}
        <div className="p-4 sm:p-5 pt-3 border-t border-slate-100 bg-slate-50/80 shrink-0">
          <a
            href={BOOSTY_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm transition-all"
          >
            <span>Перейти на Boosty</span>
            <ArrowUpRight className="w-4 h-4" />
          </a>

          <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono mt-2.5 px-1">
            <span>Отмена в 1 клик</span>
            <button
              onClick={onClose}
              className="text-slate-500 hover:text-slate-800 underline transition-colors"
            >
              Закрыть
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

