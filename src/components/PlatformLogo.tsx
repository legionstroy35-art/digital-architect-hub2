import React from 'react';

export type PlatformType = 'telegram' | 'rutube' | 'vk' | 'dzen' | 'tenchat' | 'max' | 'boosty';

interface PlatformLogoProps {
  platform: PlatformType | string;
  size?: number;
  className?: string;
}

export const PlatformLogo: React.FC<PlatformLogoProps> = ({
  platform,
  size = 36,
  className = '',
}) => {
  switch (platform) {
    case 'telegram':
      return (
        <div
          className={`relative shrink-0 rounded-2xl flex items-center justify-center shadow-xs transition-transform ${className}`}
          style={{ width: size, height: size, backgroundColor: '#24A1DE' }}
        >
          <svg viewBox="0 0 24 24" className="w-[62%] h-[62%] fill-white" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.52 2.77-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .37z" />
          </svg>
        </div>
      );

    case 'rutube':
      return (
        <div
          className={`relative shrink-0 rounded-2xl flex items-center justify-center shadow-xs overflow-hidden ${className}`}
          style={{ width: size, height: size, backgroundColor: '#100943' }}
        >
          {/* Official Rutube Emblem with brand dark navy, red accent arc, and white R */}
          <svg viewBox="0 0 132 132" className="w-[72%] h-[72%]" xmlns="http://www.w3.org/2000/svg" fill="none">
            <path
              d="M132 66.0001C168.451 66.0001 198 36.4508 198 3.05176e-05C198 -36.4508 168.451 -66 132 -66C95.5492 -66 66 -36.4508 66 3.05176e-05C66 36.4508 95.5492 66.0001 132 66.0001Z"
              fill="#ED143B"
            />
            <path
              d="M81.5361 62.9865H42.5386V47.5547H81.5361C83.814 47.5547 85.3979 47.9518 86.1928 48.6451C86.9877 49.3385 87.4801 50.6245 87.4801 52.5031V58.0441C87.4801 60.0234 86.9877 61.3094 86.1928 62.0028C85.3979 62.6961 83.814 62.9925 81.5361 62.9925V62.9865ZM84.2115 33.0059H26V99H42.5386V77.5294H73.0176L87.4801 99H106L90.0546 77.4287C95.9333 76.5575 98.573 74.756 100.75 71.7869C102.927 68.8179 104.019 64.071 104.019 57.7359V52.7876C104.019 49.0303 103.621 46.0613 102.927 43.7857C102.233 41.51 101.047 39.5307 99.362 37.7528C97.5824 36.0698 95.6011 34.8845 93.2223 34.0904C90.8435 33.3971 87.8716 33 84.2115 33V33.0059Z"
              fill="#FFFFFF"
            />
          </svg>
        </div>
      );

    case 'vk':
      return (
        <div
          className={`relative shrink-0 rounded-2xl flex items-center justify-center shadow-xs ${className}`}
          style={{ width: size, height: size, backgroundColor: '#0077FF' }}
        >
          <svg viewBox="0 0 24 24" className="w-[62%] h-[62%] fill-white" xmlns="http://www.w3.org/2000/svg">
            <path d="M15.07 2H8.93C4.54 2 2 4.54 2 8.93v6.14C2 19.46 4.54 22 8.93 22h6.14c4.39 0 6.93-2.54 6.93-6.93V8.93C22 4.54 19.46 2 15.07 2zm3.38 13.88h-1.63c-.62 0-.81-.49-1.92-1.6-.97-.94-1.4-1.06-1.64-1.06-.34 0-.44.1-.44.57v1.47c0 .39-.13.62-1.15.62-1.7 0-3.58-1.03-4.9-2.94-1.99-2.83-2.53-4.96-2.53-5.4 0-.24.1-.47.57-.47h1.63c.42 0 .58.19.74.64.82 2.37 2.19 4.45 2.76 4.45.21 0 .31-.1.31-.64v-2.5c-.07-1.14-.66-1.24-.66-1.65 0-.2.17-.39.44-.39h2.56c.36 0 .49.19.49.61v3.38c0 .36.16.49.27.49.21 0 .39-.13.78-.52 1.25-1.4 2.14-3.54 2.14-3.54.12-.24.32-.42.74-.42h1.63c.49 0 .6.25.49.61-.2 0.94-2.19 3.75-2.29 3.91-.2.32-.28.46 0 .83.2.27.87.85 1.32 1.37.81.95 1.44 1.74 1.61 2.29.17.56-.09.84-.65.84z" />
          </svg>
        </div>
      );

    case 'dzen':
      return (
        <div
          className={`relative shrink-0 rounded-2xl flex items-center justify-center shadow-xs overflow-hidden ${className}`}
          style={{ width: size, height: size, backgroundColor: '#202022' }}
        >
          {/* Official 2024 Dzen four-pointed star in graphite tile */}
          <svg viewBox="0 0 168 168" className="w-[78%] h-[78%]" xmlns="http://www.w3.org/2000/svg" fill="none">
            <path
              d="M148.04 82.75C148.04 82.11 147.52 81.58 146.88 81.55C123.91 80.68 109.93 77.75 100.15 67.97C90.35 58.17 87.43 44.18 86.56 21.16C86.54 20.52 86.01 20 85.36 20H82.68C82.04 20 81.51 20.52 81.48 21.16C80.61 44.17 77.69 58.17 67.89 67.97C58.1 77.76 44.13 80.68 21.16 81.55C20.52 81.57 20 82.1 20 82.75V85.43C20 86.07 20.52 86.6 21.16 86.63C44.13 87.5 58.11 90.43 67.89 100.21C77.67 109.99 80.59 123.94 81.47 146.87C81.49 147.51 82.02 148.03 82.67 148.03H85.36C86 148.03 86.53 147.51 86.56 146.87C87.44 123.94 90.36 109.99 100.14 100.21C109.93 90.42 123.9 87.5 146.87 86.63C147.51 86.61 148.03 86.08 148.03 85.43V82.75H148.04Z"
              fill="#FFFFFF"
            />
          </svg>
        </div>
      );

    case 'tenchat':
      return (
        <div
          className={`relative shrink-0 rounded-2xl flex items-center justify-center shadow-xs ${className}`}
          style={{ width: size, height: size, backgroundColor: '#E11D48' }}
        >
          {/* TenChat TC emblem */}
          <span className="font-extrabold text-white font-mono tracking-tighter" style={{ fontSize: size * 0.42 }}>
            TC
          </span>
        </div>
      );

    case 'max':
      return (
        <div
          className={`relative shrink-0 rounded-2xl flex items-center justify-center shadow-xs overflow-hidden ${className}`}
          style={{
            width: size,
            height: size,
            background: 'linear-gradient(135deg, #471AFF 0%, #9500FF 100%)'
          }}
        >
          {/* Official MAX Messenger speech cloud emblem */}
          <svg viewBox="0 0 100 100" className="w-[68%] h-[68%]" xmlns="http://www.w3.org/2000/svg" fill="none">
            <path
              fill="#FFFFFF"
              fillRule="evenodd"
              clipRule="evenodd"
              d="M50.76 0c27.53 0 49.12 22.34 49.12 49.89S77.61 99.23 51.02 99.23c-9.43 0-14.01-1.33-21.37-6.54-.5-.36-1.2-.26-1.63.19-5.66 6.04-20.17 10.28-20.83 2.03C7.19 80.53 0 71.18 0 49.61 0 21.3 23.22 0 50.76 0m.77 24.55c-13.07-.68-23.26 8.39-25.51 22.58-1.86 11.75 1.44 26.07 4.26 26.8 1.2.3 4.08-1.9 6.18-3.88.4-.37.99-.44 1.45-.15 3.27 2 6.97 3.5 11.05 3.71 13.42.7 25.3-9.8 26-23.21.71-13.42-10.01-25.14-23.43-25.85"
            />
          </svg>
        </div>
      );

    case 'boosty':
      return (
        <div
          className={`relative shrink-0 rounded-2xl flex items-center justify-center shadow-xs overflow-hidden ${className}`}
          style={{ width: size, height: size, background: 'linear-gradient(135deg, #F97316 0%, #EA580C 100%)' }}
        >
          {/* Boosty bold B & lightning spark */}
          <svg viewBox="0 0 100 100" className="w-[66%] h-[66%]" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M 30 20 L 60 20 C 72 20 80 28 80 38 C 80 46 74 52 65 54 C 76 56 84 64 84 74 C 84 84 74 92 60 92 L 30 92 Z"
              fill="#FFFFFF"
            />
            <path d="M 42 32 L 56 32 C 62 32 66 36 66 40 C 66 45 62 48 56 48 L 42 48 Z" fill="#EA580C" />
            <path d="M 42 60 L 58 60 C 64 60 68 64 68 70 C 68 76 64 80 58 80 L 42 80 Z" fill="#EA580C" />
          </svg>
        </div>
      );

    default:
      return (
        <div
          className={`relative shrink-0 rounded-2xl flex items-center justify-center bg-blue-600 text-white font-bold ${className}`}
          style={{ width: size, height: size }}
        >
          <span className="text-xs font-mono">HUB</span>
        </div>
      );
  }
};
