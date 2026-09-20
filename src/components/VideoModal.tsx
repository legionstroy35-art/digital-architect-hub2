import React from 'react';
import { X, Play, ExternalLink, Video } from 'lucide-react';

interface VideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  videoUrl?: string;
  title: string;
}

export const VideoModal: React.FC<VideoModalProps> = ({ isOpen, onClose, videoUrl, title }) => {
  if (!isOpen || !videoUrl) return null;

  // Transform video URL to embed URL if possible
  const getEmbedUrl = (url: string): string | null => {
    try {
      // Rutube: https://rutube.ru/video/abc... or https://rutube.ru/play/embed/abc
      if (url.includes('rutube.ru')) {
        const match = url.match(/\/video\/([a-zA-Z0-9]+)/);
        if (match && match[1]) {
          return `https://rutube.ru/play/embed/${match[1]}/`;
        }
        if (url.includes('/play/embed/')) return url;
      }

      // YouTube: https://www.youtube.com/watch?v=abc or https://youtu.be/abc
      if (url.includes('youtube.com') || url.includes('youtu.be')) {
        const match = url.match(/(?:watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]+)/);
        if (match && match[1]) {
          return `https://www.youtube-nocookie.com/embed/${match[1]}?autoplay=1`;
        }
      }

      // VK Video embed check
      if (url.includes('vk.com/video_ext.php') || url.includes('vk.ru/video_ext.php')) {
        return url;
      }
    } catch {
      return null;
    }
    return null;
  };

  const embedUrl = getEmbedUrl(videoUrl);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 md:p-8">
      <div
        className="fixed inset-0 bg-slate-950/80 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="relative w-full max-w-4xl bg-slate-900 rounded-3xl border border-slate-700 shadow-2xl overflow-hidden z-10 flex flex-col animate-in fade-in zoom-in-95">
        {/* Top bar */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/90 text-white">
          <div className="flex items-center gap-2.5 truncate pr-2">
            <div className="w-8 h-8 rounded-lg bg-orange-500/20 text-orange-400 flex items-center justify-center shrink-0">
              <Video className="w-4 h-4" />
            </div>
            <div className="truncate">
              <span className="text-[10px] font-mono text-orange-400 font-bold uppercase block">
                ВИДЕОПРЕЗЕНТАЦИЯ КУРСА
              </span>
              <h3 className="text-sm sm:text-base font-bold text-white truncate">
                {title}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={videoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <span>Открыть в плеере</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Player Container */}
        <div className="relative w-full bg-black aspect-video flex items-center justify-center">
          {embedUrl ? (
            <iframe
              src={embedUrl}
              title={title}
              className="w-full h-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          ) : (
            <div className="p-8 text-center text-white max-w-md">
              <div className="w-16 h-16 rounded-2xl bg-orange-500/20 text-orange-400 mx-auto flex items-center justify-center mb-4">
                <Play className="w-8 h-8" />
              </div>
              <h4 className="text-base sm:text-lg font-bold mb-2">Видеопрезентация готова к просмотру</h4>
              <p className="text-xs sm:text-sm text-slate-300 mb-6">
                Плеер данного сервиса требует перехода для корректного воспроизведения в высоком качестве.
              </p>
              <a
                href={videoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-sm transition-all"
              >
                <span>Смотреть видеопрезентацию</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
