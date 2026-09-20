import React, { useEffect, useRef, useState } from 'react';
import { Upload, RotateCcw } from 'lucide-react';

interface HubLogoProps {
  className?: string;
  size?: number;
  showText?: boolean;
  textPosition?: 'right' | 'bottom';
  variant?: 'light' | 'dark' | 'orange';
  customLogoSrc?: string;
  interactive?: boolean;
}

const STORAGE_KEY = 'arch_hub_custom_logo_data';
const LOGO_EVENT = 'arch_hub_logo_updated';

export const HubLogo: React.FC<HubLogoProps> = ({
  className = '',
  size = 46,
  showText = false,
  textPosition = 'right',
  variant = 'light',
  customLogoSrc,
  interactive = false,
}) => {
  const isDark = variant === 'dark';
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [logoSrc, setLogoSrc] = useState<string>(() => {
    if (customLogoSrc) return customLogoSrc;
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return saved;
    }
    return '/logo.svg';
  });
  const [hasCustomUploaded, setHasCustomUploaded] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return !!localStorage.getItem(STORAGE_KEY);
    }
    return false;
  });

  // Synchronize across all components when logo is updated
  useEffect(() => {
    const handleSync = () => {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        setLogoSrc(saved);
        setHasCustomUploaded(true);
      } else {
        setLogoSrc(customLogoSrc || '/logo.svg');
        setHasCustomUploaded(false);
      }
    };

    window.addEventListener(LOGO_EVENT, handleSync);
    window.addEventListener('storage', handleSync);
    return () => {
      window.removeEventListener(LOGO_EVENT, handleSync);
      window.removeEventListener('storage', handleSync);
    };
  }, [customLogoSrc]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (result) {
        try {
          localStorage.setItem(STORAGE_KEY, result);
          setLogoSrc(result);
          setHasCustomUploaded(true);
          window.dispatchEvent(new Event(LOGO_EVENT));
        } catch (err) {
          console.warn('Could not save logo to localStorage:', err);
          setLogoSrc(result);
        }
      }
    };
    reader.readAsDataURL(file);
  };

  const handleReset = (e: React.MouseEvent) => {
    e.stopPropagation();
    localStorage.removeItem(STORAGE_KEY);
    setLogoSrc(customLogoSrc || '/logo.svg');
    setHasCustomUploaded(false);
    window.dispatchEvent(new Event(LOGO_EVENT));
  };

  return (
    <div
      className={`inline-flex ${
        textPosition === 'bottom' ? 'flex-col items-center text-center' : 'items-center'
      } gap-3 ${className}`}
    >
      {/* Hidden file input for logo replacement */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileUpload}
        accept="image/png, image/jpeg, image/svg+xml, image/webp"
        className="hidden"
      />

      {/* Clean Monogram Logo image without blurry borders or awkward boxes */}
      <div
        className={`relative group shrink-0 flex items-center justify-center ${interactive ? 'cursor-pointer' : ''}`}
        style={{ width: size, height: size }}
        onClick={() => interactive && fileInputRef.current?.click()}
        title={interactive ? 'Нажмите, чтобы выбрать свой файл логотипа с устройства' : undefined}
      >
        <img
          src={logoSrc}
          alt="Логотип Цифровой Хаб Архитектора"
          className={`w-full h-full object-contain transition-transform duration-200 ${
            isDark && !hasCustomUploaded ? 'brightness-0 invert' : ''
          }`}
          onError={() => {
            if (logoSrc !== '/logo.svg') {
              setLogoSrc('/logo.svg');
            }
          }}
        />

        {/* Optional interactive badge if user hovers to replace */}
        {interactive && (
          <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 rounded-lg flex items-center justify-center gap-1 transition-opacity text-white backdrop-blur-[1px]">
            <Upload className="w-4 h-4" />
            {hasCustomUploaded && (
              <button
                type="button"
                onClick={handleReset}
                title="Сбросить к исходному вектору"
                className="p-1 hover:text-red-300"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        )}
      </div>

      {/* Brand Typography */}
      {showText && (
        <div className="flex flex-col text-left">
          <span
            className={`font-black tracking-tight leading-tight uppercase font-mono text-sm sm:text-base ${
              isDark ? 'text-white' : 'text-slate-900'
            }`}
          >
            ЦИФРОВОЙ ХАБ <span className="text-blue-600">АРХИТЕКТОРА</span>
          </span>
          <span
            className={`text-[11px] font-mono tracking-wide ${
              isDark ? 'text-slate-400' : 'text-slate-500'
            }`}
          >
            DIGITAL ARCHITECT HUB
          </span>
        </div>
      )}
    </div>
  );
};
