import React, { useState, useEffect } from 'react';
import {
  X,
  FileSpreadsheet,
  Plus,
  Trash2,
  Edit2,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Link,
  Video,
  Download,
  Upload,
  Lock,
  Unlock,
  Sparkles,
  ExternalLink,
  Copy,
  Layers,
  GraduationCap,
  RotateCcw,
  Check,
  Eye,
  Clock,
  MessageSquare,
  Bell,
  Send,
  Image as ImageIcon,
  Users,
  Mail,
  FileDown,
  Star,
  LogOut,
  KeyRound
} from 'lucide-react';
import { ResourceItem, CourseTrack, SoftwareCategory, NotificationSettings, CoursePortfolioItem, CourseWaitlistEntry } from '../types';
import {
  isAdminLoggedIn,
  loginAdmin,
  logoutAdmin,
  getAdminPassword,
  setAdminPassword
} from '../services/adminAuth';
import {
  getStoredPlugins,
  saveStoredPlugins,
  getStoredCourses,
  saveStoredCourses,
  getStoredGoogleSheetUrl,
  saveStoredGoogleSheetUrl,
  getLastSyncTime,
  syncWithGoogleSheet,
  resetContentToDefault,
  getFlagshipPluginId,
  setFlagshipPluginId
} from '../services/contentManager';
import {
  getNotificationSettings,
  saveNotificationSettings,
  sendTestNotification
} from '../services/notificationService';
import {
  getCourseWaitlist,
  removeCourseWaitlistEntry,
  clearCourseWaitlist
} from '../services/courseWaitlistService';

interface AdminContentModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: 'sheet' | 'plugins' | 'courses' | 'backup' | 'requests' | 'notifications' | 'waitlist';
}

const DEFAULT_PIN = '2026';

export const AdminContentModal: React.FC<AdminContentModalProps> = ({
  isOpen,
  onClose,
  defaultTab = 'sheet'
}) => {
  const [activeTab, setActiveTab] = useState<'sheet' | 'plugins' | 'courses' | 'backup' | 'requests' | 'notifications' | 'waitlist'>(defaultTab);
  
  // Auth PIN state
  const [isUnlocked, setIsUnlocked] = useState(() => isAdminLoggedIn());
  const [enteredPin, setEnteredPin] = useState('');
  const [pinError, setPinError] = useState(false);
  const [customPasswordInput, setCustomPasswordInput] = useState('');
  const [passwordChangeFeedback, setPasswordChangeFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Content state
  const [plugins, setPlugins] = useState<ResourceItem[]>([]);
  const [courses, setCourses] = useState<CourseTrack[]>([]);
  const [sheetUrl, setSheetUrl] = useState('');
  const [lastSync, setLastSync] = useState<string | null>(null);
  const [submissions, setSubmissions] = useState<any[]>([]);

  // Waitlist state
  const [waitlistEntries, setWaitlistEntries] = useState<CourseWaitlistEntry[]>([]);
  const [waitlistFilter, setWaitlistFilter] = useState<string>('all');
  const [copiedWaitlistEmails, setCopiedWaitlistEmails] = useState(false);

  // Notification settings state
  const [notifSettings, setNotifSettings] = useState<NotificationSettings>(getNotificationSettings());
  const [notifSavedToast, setNotifSavedToast] = useState(false);
  const [testSending, setTestSending] = useState<'telegram' | 'email' | 'max' | null>(null);
  const [testResult, setTestResult] = useState<{ type: 'telegram' | 'email' | 'max'; success: boolean; message: string } | null>(null);

  // Sync loading & messages
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncStatus, setSyncStatus] = useState<{ type: 'success' | 'error' | null; message: string }>({
    type: null,
    message: ''
  });

  // Editing state for Plugin
  const [editingPlugin, setEditingPlugin] = useState<ResourceItem | null>(null);
  const [isNewPlugin, setIsNewPlugin] = useState(false);
  const [flagshipPluginId, setFlagshipPluginIdState] = useState<string | null>(() => getFlagshipPluginId());

  // Editing state for Course
  const [editingCourse, setEditingCourse] = useState<CourseTrack | null>(null);
  const [isNewCourse, setIsNewCourse] = useState(false);

  // Copied toast
  const [copiedTemplate, setCopiedTemplate] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setPlugins(getStoredPlugins());
      setCourses(getStoredCourses());
      setSheetUrl(getStoredGoogleSheetUrl());
      setLastSync(getLastSyncTime());
      setWaitlistEntries(getCourseWaitlist());
      setFlagshipPluginIdState(getFlagshipPluginId());
      try {
        const raw = localStorage.getItem('archhub_feedback_submissions');
        setSubmissions(raw ? JSON.parse(raw) : []);
      } catch {
        setSubmissions([]);
      }
      setActiveTab(defaultTab);
      setIsUnlocked(isAdminLoggedIn());
      setPinError(false);
      setEnteredPin('');
      setPasswordChangeFeedback(null);
    }
  }, [isOpen, defaultTab]);

  if (!isOpen) return null;

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    const success = loginAdmin(enteredPin);
    if (success) {
      setIsUnlocked(true);
      setPinError(false);
      setEnteredPin('');
    } else {
      setPinError(true);
    }
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customPasswordInput.trim() || customPasswordInput.trim().length < 3) {
      setPasswordChangeFeedback({
        type: 'error',
        message: 'Пароль должен быть длиной не менее 3 символов'
      });
      return;
    }
    const ok = setAdminPassword(customPasswordInput.trim());
    if (ok) {
      setPasswordChangeFeedback({
        type: 'success',
        message: `Новый пароль «${customPasswordInput.trim()}» успешно установлен!`
      });
      setCustomPasswordInput('');
    } else {
      setPasswordChangeFeedback({
        type: 'error',
        message: 'Ошибка при сохранении пароля'
      });
    }
  };

  const handleSyncGoogleSheet = async () => {
    setIsSyncing(true);
    setSyncStatus({ type: null, message: '' });

    const res = await syncWithGoogleSheet(sheetUrl);
    setIsSyncing(false);

    if (res.success) {
      setSyncStatus({ type: 'success', message: res.message });
      setPlugins(getStoredPlugins());
      setCourses(getStoredCourses());
      setLastSync(new Date().toLocaleString('ru-RU'));
    } else {
      setSyncStatus({ type: 'error', message: res.message });
    }
  };

  // PLUGIN ACTIONS
  const handleSavePlugin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPlugin) return;

    let updated: ResourceItem[];
    if (isNewPlugin) {
      updated = [editingPlugin, ...plugins];
    } else {
      updated = plugins.map((p) => (p.id === editingPlugin.id ? editingPlugin : p));
    }

    setPlugins(updated);
    saveStoredPlugins(updated);
    setEditingPlugin(null);
    setIsNewPlugin(false);
  };

  const handleDeletePlugin = (id: string) => {
    if (window.confirm('Удалить этот материал из каталога?')) {
      const updated = plugins.filter((p) => p.id !== id);
      setPlugins(updated);
      saveStoredPlugins(updated);
      if (flagshipPluginId === id) {
        setFlagshipPluginId(null);
        setFlagshipPluginIdState(null);
      }
    }
  };

  const handleToggleFlagship = (pluginId: string) => {
    if (flagshipPluginId === pluginId) {
      setFlagshipPluginId(null);
      setFlagshipPluginIdState(null);
    } else {
      setFlagshipPluginId(pluginId);
      setFlagshipPluginIdState(pluginId);
    }
  };

  const handleOpenNewPlugin = () => {
    setIsNewPlugin(true);
    setEditingPlugin({
      id: `plugin-${Date.now()}`,
      title: '',
      software: 'autocad',
      softwareLabel: 'AutoCAD',
      category: 'LISP-плагин',
      version: 'AutoCAD (все версии)',
      description: '',
      benefits: ['Ускорение черчения в 3 раза', 'Простая установка в один клик', 'Точный результат без ошибок'],
      downloadsCount: 100,
      fileSize: '~10 KB',
      fileFormat: '.lsp (LISP-скрипт)',
      isFree: true,
      downloadUrl: '',
      videoTutorialUrl: 'https://rutube.ru/channel/42238519',
      inDevelopment: false
    });
  };

  // COURSE ACTIONS
  const handleSaveCourse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCourse) return;

    let updated: CourseTrack[];
    if (isNewCourse) {
      updated = [...courses, editingCourse];
    } else {
      updated = courses.map((c) => (c.id === editingCourse.id ? editingCourse : c));
    }

    setCourses(updated);
    saveStoredCourses(updated);
    setEditingCourse(null);
    setIsNewCourse(false);
  };

  const handleDeleteCourse = (id: string) => {
    if (window.confirm('Удалить этот курс?')) {
      const updated = courses.filter((c) => c.id !== id);
      setCourses(updated);
      saveStoredCourses(updated);
    }
  };

  const handleOpenNewCourse = () => {
    setIsNewCourse(true);
    setEditingCourse({
      id: `course-${Date.now()}`,
      title: '',
      software: 'revit',
      softwareLabel: 'Autodesk Revit',
      targetAudience: 'Начинающие',
      duration: '16 академических часов',
      lessonsCount: '20 уроков',
      description: '',
      detailedDescription: '',
      inDevelopment: false,
      developmentStatusNote: '',
      whatYouWillLearn: [
        'Понимание логики работы и структуры программы',
        'Быстрое создание проектной документации по ГОСТ',
        'Автоматизация рутинных задач'
      ],
      targetWhoIsFor: [
        'Архитекторы и проектировщики',
        'Студенты профильных вузов'
      ],
      portfolioImages: [],
      modules: [
        'Модуль 1: Базовые инструменты и интерфейс',
        'Модуль 2: Моделирование основных конструкций',
        'Модуль 3: Оформление рабочих чертежей и спецификации'
      ],
      freeVideosPlatform: 'Базовые уроки на Rutube, VK и Telegram',
      boostyExclusiveUrl: 'https://boosty.to/architectdigitalhub?share=ios_blog_link',
      bannerImage: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=800&q=80',
      videoPresentationUrl: '',
      customCourseUrl: ''
    });
  };

  const handleCourseImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editingCourse) return;

    // Check size limit: 5MB max
    if (file.size > 5 * 1024 * 1024) {
      alert('Размер файла превышает 5 МБ. Пожалуйста, выберите изображение меньшего размера.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      setEditingCourse({
        ...editingCourse,
        bannerImage: dataUrl
      });
    };
    reader.readAsDataURL(file);
  };

  // PORTFOLIO IMAGES FOR DETAILED COURSE PAGE
  const handleAddPortfolioImage = () => {
    if (!editingCourse) return;
    const current = editingCourse.portfolioImages || [];
    setEditingCourse({
      ...editingCourse,
      portfolioImages: [
        ...current,
        {
          title: `Пример проекта ${current.length + 1}`,
          url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
          caption: 'Рабочий чертеж / 3D визуализация',
          tag: 'Рабочий чертеж'
        }
      ]
    });
  };

  const handleUpdatePortfolioImage = (index: number, field: keyof CoursePortfolioItem, value: string) => {
    if (!editingCourse) return;
    const list = [...(editingCourse.portfolioImages || [])];
    if (list[index]) {
      list[index] = { ...list[index], [field]: value };
      setEditingCourse({ ...editingCourse, portfolioImages: list });
    }
  };

  const handlePortfolioImageUpload = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editingCourse) return;
    if (file.size > 5 * 1024 * 1024) {
      alert('Размер файла превышает 5 МБ.');
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      handleUpdatePortfolioImage(index, 'url', dataUrl);
    };
    reader.readAsDataURL(file);
  };

  const handleRemovePortfolioImage = (index: number) => {
    if (!editingCourse) return;
    const list = (editingCourse.portfolioImages || []).filter((_, i) => i !== index);
    setEditingCourse({ ...editingCourse, portfolioImages: list });
  };

  // WAITLIST MANAGEMENT
  const handleDeleteWaitlistEntry = (id: string) => {
    if (window.confirm('Удалить эту запись из листа ожидания?')) {
      const updated = removeCourseWaitlistEntry(id);
      setWaitlistEntries(updated);
    }
  };

  const handleClearWaitlist = () => {
    if (window.confirm('Вы уверены, что хотите полностью очистить лист ожидания?')) {
      clearCourseWaitlist();
      setWaitlistEntries([]);
    }
  };

  const handleCopyWaitlistEmails = () => {
    const filtered = waitlistFilter === 'all'
      ? waitlistEntries
      : waitlistEntries.filter((w) => w.courseId === waitlistFilter);
    const emails = Array.from(new Set(filtered.map((w) => w.email))).join(', ');
    if (!emails) {
      alert('Список email пуст.');
      return;
    }
    navigator.clipboard.writeText(emails);
    setCopiedWaitlistEmails(true);
    setTimeout(() => setCopiedWaitlistEmails(false), 2500);
  };

  const handleExportWaitlistCSV = () => {
    const filtered = waitlistFilter === 'all'
      ? waitlistEntries
      : waitlistEntries.filter((w) => w.courseId === waitlistFilter);
    if (filtered.length === 0) {
      alert('Лист ожидания пуст.');
      return;
    }
    const headers = 'Курс,ID Курса,Email,Дата регистрации\n';
    const rows = filtered
      .map((w) => `"${w.courseTitle.replace(/"/g, '""')}","${w.courseId}","${w.email}","${w.createdAt}"`)
      .join('\n');
    const blob = new Blob(['\uFEFF' + headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `waitlist_courses_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleSaveNotifSettings = (e: React.FormEvent) => {
    e.preventDefault();
    saveNotificationSettings(notifSettings);
    setNotifSavedToast(true);
    setTimeout(() => setNotifSavedToast(false), 3000);
  };

  const handleTestNotif = async (type: 'telegram' | 'email' | 'max') => {
    setTestSending(type);
    setTestResult(null);
    const res = await sendTestNotification(type);
    setTestSending(null);
    setTestResult({ type, success: res.success, message: res.message });
  };

  // BACKUP & RESET
  const handleExportJSON = () => {
    const data = {
      plugins,
      courses,
      googleSheetUrl: sheetUrl,
      exportedAt: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `archdigitalhub-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        if (json.plugins && Array.isArray(json.plugins)) {
          setPlugins(json.plugins);
          saveStoredPlugins(json.plugins);
        }
        if (json.courses && Array.isArray(json.courses)) {
          setCourses(json.courses);
          saveStoredCourses(json.courses);
        }
        if (json.googleSheetUrl) {
          setSheetUrl(json.googleSheetUrl);
          saveStoredGoogleSheetUrl(json.googleSheetUrl);
        }
        alert('Данные успешно импортированы!');
      } catch (err) {
        alert('Ошибка при чтении файла JSON. Проверьте формат.');
      }
    };
    reader.readAsText(file);
  };

  const handleResetDefaults = () => {
    if (window.confirm('Сбросить все плагины и курсы к исходным материалам сайта? Ваши ручные изменения будут удалены.')) {
      resetContentToDefault();
      setPlugins(getStoredPlugins());
      setCourses(getStoredCourses());
      setSheetUrl('');
      setLastSync(null);
      alert('Данные успешно сброшены к стандартным!');
    }
  };

  const handleCopySheetTemplate = () => {
    const templateText = `ВКЛАДКА 1 (назовите «Плагины»):
Колонки (строка 1):
Название | Программа | Категория | Версия | Описание | Преимущество 1 | Преимущество 2 | Преимущество 3 | Размер | Формат | Ссылка на скачивание | Ссылка на видео | В разработке (да/нет)

ВКЛАДКА 2 (назовите «Курсы»):
Колонки (строка 1):
Название | Программа | Уровень | Длительность | Количество уроков | Описание | Модуль 1 | Модуль 2 | Модуль 3 | Модуль 4 | Ссылка на видео-презентацию | Ссылка на курс | Фото обложки | Формат доступа`;
    
    navigator.clipboard.writeText(templateText);
    setCopiedTemplate(true);
    setTimeout(() => setCopiedTemplate(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 md:p-8">
      <div
        className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="relative w-full max-w-4xl bg-white rounded-3xl border border-slate-200 shadow-2xl overflow-hidden z-10 max-h-[92vh] flex flex-col animate-in fade-in zoom-in-95">
        
        {/* Top Header */}
        <div className="p-5 sm:p-6 border-b border-slate-200 flex items-center justify-between bg-slate-50/90">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] font-mono font-bold text-blue-600 uppercase block">
                ПАНЕЛЬ АДМИНИСТРАТОРА // ARCHDIGITALHUB
              </span>
              <h3 className="text-base sm:text-lg font-bold text-slate-900">
                Управление плагинами, курсами и Google Таблицей
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isUnlocked && (
              <button
                type="button"
                onClick={() => {
                  logoutAdmin();
                  setIsUnlocked(false);
                  onClose();
                }}
                className="px-3 py-1.5 rounded-xl bg-slate-200/80 hover:bg-rose-100 text-slate-600 hover:text-rose-700 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                title="Выйти из режима администратора на этом устройстве"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Выйти из админки</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="w-9 h-9 rounded-xl bg-slate-200/80 hover:bg-slate-300 text-slate-700 flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* PIN Authentication Gate */}
        {!isUnlocked ? (
          <div className="p-8 sm:p-12 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
              <Lock className="w-8 h-8" />
            </div>
            <h4 className="text-lg sm:text-xl font-bold text-slate-900 mb-2">
              Вход в режим администратора
            </h4>
            <p className="text-xs sm:text-sm text-slate-600 max-w-sm mb-6 leading-relaxed">
              Введите пароль администратора для редактирования сайта. Исходный пароль: <strong className="text-blue-600 font-mono">2026</strong>
            </p>

            <form onSubmit={handleUnlock} className="w-full max-w-xs space-y-3">
              <input
                type="password"
                value={enteredPin}
                onChange={(e) => {
                  setEnteredPin(e.target.value);
                  setPinError(false);
                }}
                placeholder="Введите пароль (2026)"
                className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-center text-base font-mono tracking-widest outline-none"
                autoFocus
              />

              {pinError && (
                <p className="text-xs text-rose-600 font-medium">Неверный пароль. Попробуйте 2026</p>
              )}

              <button
                type="submit"
                className="w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm transition-colors shadow-xs cursor-pointer"
              >
                Войти в панель управления
              </button>
            </form>
          </div>
        ) : (
          <>
            {/* Nav Tabs */}
            <div className="flex border-b border-slate-200 bg-slate-100/60 px-4 sm:px-6 gap-2 sm:gap-4 overflow-x-auto">
              <button
                onClick={() => {
                  setActiveTab('sheet');
                  setEditingPlugin(null);
                  setEditingCourse(null);
                }}
                className={`py-3 px-3 text-xs sm:text-sm font-bold border-b-2 flex items-center gap-2 transition-colors whitespace-nowrap ${
                  activeTab === 'sheet'
                    ? 'border-blue-600 text-blue-700'
                    : 'border-transparent text-slate-600 hover:text-slate-900'
                }`}
              >
                <FileSpreadsheet className="w-4 h-4" />
                <span>Google Таблица</span>
              </button>

              <button
                onClick={() => {
                  setActiveTab('plugins');
                  setEditingCourse(null);
                }}
                className={`py-3 px-3 text-xs sm:text-sm font-bold border-b-2 flex items-center gap-2 transition-colors whitespace-nowrap ${
                  activeTab === 'plugins'
                    ? 'border-blue-600 text-blue-700'
                    : 'border-transparent text-slate-600 hover:text-slate-900'
                }`}
              >
                <Layers className="w-4 h-4" />
                <span>Плагины ({plugins.length})</span>
              </button>

              <button
                onClick={() => {
                  setActiveTab('courses');
                  setEditingPlugin(null);
                }}
                className={`py-3 px-3 text-xs sm:text-sm font-bold border-b-2 flex items-center gap-2 transition-colors whitespace-nowrap ${
                  activeTab === 'courses'
                    ? 'border-blue-600 text-blue-700'
                    : 'border-transparent text-slate-600 hover:text-slate-900'
                }`}
              >
                <GraduationCap className="w-4 h-4" />
                <span>Курсы ({courses.length})</span>
              </button>

              <button
                onClick={() => {
                  setActiveTab('backup');
                  setEditingPlugin(null);
                  setEditingCourse(null);
                }}
                className={`py-3 px-3 text-xs sm:text-sm font-bold border-b-2 flex items-center gap-2 transition-colors whitespace-nowrap ${
                  activeTab === 'backup'
                    ? 'border-blue-600 text-blue-700'
                    : 'border-transparent text-slate-600 hover:text-slate-900'
                }`}
              >
                <RotateCcw className="w-4 h-4" />
                <span>Резервная копия</span>
              </button>

              <button
                onClick={() => {
                  setActiveTab('requests');
                  setEditingPlugin(null);
                  setEditingCourse(null);
                }}
                className={`py-3 px-3 text-xs sm:text-sm font-bold border-b-2 flex items-center gap-2 transition-colors whitespace-nowrap ${
                  activeTab === 'requests'
                    ? 'border-blue-600 text-blue-700'
                    : 'border-transparent text-slate-600 hover:text-slate-900'
                }`}
              >
                <MessageSquare className="w-4 h-4" />
                <span>Заявки ({submissions.length})</span>
              </button>

              <button
                onClick={() => {
                  setActiveTab('waitlist');
                  setEditingPlugin(null);
                  setEditingCourse(null);
                }}
                className={`py-3 px-3 text-xs sm:text-sm font-bold border-b-2 flex items-center gap-2 transition-colors whitespace-nowrap ${
                  activeTab === 'waitlist'
                    ? 'border-blue-600 text-blue-700'
                    : 'border-transparent text-slate-600 hover:text-slate-900'
                }`}
              >
                <Users className="w-4 h-4" />
                <span>Лист ожидания ({waitlistEntries.length})</span>
                {waitlistEntries.length > 0 && (
                  <span className="px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[10px] font-bold">
                    {waitlistEntries.length}
                  </span>
                )}
              </button>

              <button
                onClick={() => {
                  setActiveTab('notifications');
                  setEditingPlugin(null);
                  setEditingCourse(null);
                }}
                className={`py-3 px-3 text-xs sm:text-sm font-bold border-b-2 flex items-center gap-2 transition-colors whitespace-nowrap ${
                  activeTab === 'notifications'
                    ? 'border-blue-600 text-blue-700'
                    : 'border-transparent text-slate-600 hover:text-slate-900'
                }`}
              >
                <Bell className="w-4 h-4" />
                <span>Уведомления</span>
                {(notifSettings.telegramEnabled || notifSettings.emailEnabled || notifSettings.maxWebhookEnabled) && (
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                )}
              </button>
            </div>

            {/* Scrollable Content Body */}
            <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-6">

              {/* TAB 1: GOOGLE SHEETS SYNC */}
              {activeTab === 'sheet' && (
                <div className="space-y-6">
                  <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 sm:p-5">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0 mt-0.5">
                        <Sparkles className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-sm sm:text-base font-bold text-emerald-950">
                          Ведение сайта прямо из Google Таблицы со смартфона
                        </h4>
                        <p className="mt-1 text-xs sm:text-sm text-emerald-800 leading-relaxed">
                          Вы можете открыть Google Таблицу на телефоне или компьютере, дописать строчку с новым плагином или ссылкой на курс — и сайт мгновенно подтянет эти данные без переписывания программного кода!
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Sync Form */}
                  <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-xs space-y-4">
                    <label className="block text-xs font-mono font-bold text-slate-700 uppercase">
                      Ссылка на вашу Google Таблицу:
                    </label>
                    <div className="flex flex-col sm:flex-row gap-2">
                      <input
                        type="url"
                        value={sheetUrl}
                        onChange={(e) => setSheetUrl(e.target.value)}
                        placeholder="https://docs.google.com/spreadsheets/d/1abc.../edit"
                        className="flex-1 px-4 py-3 rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-xs sm:text-sm outline-none"
                      />
                      <button
                        onClick={handleSyncGoogleSheet}
                        disabled={isSyncing || !sheetUrl}
                        className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xs transition-colors"
                      >
                        <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
                        <span>{isSyncing ? 'Синхронизация...' : 'Синхронизировать'}</span>
                      </button>
                    </div>

                    {lastSync && (
                      <p className="text-[11px] font-mono text-slate-500 flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-blue-600" />
                        <span>Последняя успешная синхронизация: {lastSync}</span>
                      </p>
                    )}

                    {syncStatus.type === 'success' && (
                      <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>{syncStatus.message}</span>
                      </div>
                    )}

                    {syncStatus.type === 'error' && (
                      <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                        <span>{syncStatus.message}</span>
                      </div>
                    )}
                  </div>

                  {/* Step-by-step instruction */}
                  <div className="border border-slate-200 rounded-2xl p-5 sm:p-6 bg-slate-50/50 space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-bold text-slate-900 uppercase font-mono">
                        Инструкция: как создать и подключить таблицу за 2 минуты
                      </h4>
                      <button
                        onClick={handleCopySheetTemplate}
                        className="text-xs text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-1.5 py-1 px-2.5 rounded-lg bg-blue-50 border border-blue-200 transition-colors"
                      >
                        {copiedTemplate ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedTemplate ? 'Структура скопирована!' : 'Скопировать названия колонок'}</span>
                      </button>
                    </div>

                    <ol className="list-decimal list-inside space-y-2 text-xs sm:text-sm text-slate-700 leading-relaxed">
                      <li>
                        Зайдите на <a href="https://sheets.new" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline font-semibold">sheets.new</a> и создайте новую Google Таблицу на вашем Google Диске.
                      </li>
                      <li>
                        Переименуйте первый лист в <strong className="font-mono text-blue-700">«Плагины»</strong>, а второй созданный лист в <strong className="font-mono text-blue-700">«Курсы»</strong>.
                      </li>
                      <li>
                        В первой строке вставьте названия колонок (нажмите кнопку выше <em>«Скопировать названия колонок»</em> для образца).
                      </li>
                      <li>
                        Нажмите в правом верхнем углу таблицы кнопку <strong>«Настройки доступа»</strong> (Share) → выберите <strong>«Все, у кого есть ссылка»</strong> → уровень <strong>«Читатель»</strong>.
                      </li>
                      <li>
                        Скопируйте ссылку на таблицу, вставьте в поле выше и нажмите <strong>«Синхронизировать»</strong>!
                      </li>
                    </ol>
                  </div>
                </div>
              )}

              {/* TAB 2: PLUGINS MANAGEMENT */}
              {activeTab === 'plugins' && (
                <div className="space-y-4">
                  {!editingPlugin ? (
                    <>
                      {/* Flagship quick info banner */}
                      <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200/90 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0 border border-amber-200">
                            <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
                          </div>
                          <div>
                            <div className="font-bold text-amber-950 text-sm flex items-center gap-1.5">
                              <span>Флагманский плагин месяца на главном экране</span>
                              {flagshipPluginId ? (
                                <span className="px-2 py-0.5 rounded-full bg-amber-200/80 text-amber-900 text-[10px] font-mono font-bold">
                                  Закреплен вручную
                                </span>
                              ) : (
                                <span className="px-2 py-0.5 rounded-full bg-slate-200/80 text-slate-700 text-[10px] font-mono font-bold">
                                  Автоматически (первый в списке)
                                </span>
                              )}
                            </div>
                            <div className="text-amber-800 text-xs mt-0.5">
                              {flagshipPluginId ? (
                                <>
                                  Сейчас на баннере Hero отображается: <strong className="text-amber-950">{plugins.find((p) => p.id === flagshipPluginId)?.title || 'Выбранный плагин'}</strong>
                                </>
                              ) : (
                                <>
                                  По умолчанию показывается: <strong className="text-amber-950">{plugins[0]?.title || 'Нет плагинов'}</strong>. Нажмите кнопку <strong>⭐ Сделать флагманом</strong> у любого плагина ниже, чтобы закрепить именно его.
                                </>
                              )}
                            </div>
                          </div>
                        </div>

                        {flagshipPluginId && (
                          <button
                            type="button"
                            onClick={() => handleToggleFlagship(flagshipPluginId)}
                            className="self-start sm:self-auto px-3.5 py-1.5 rounded-xl bg-white hover:bg-amber-100 text-amber-900 border border-amber-300 font-bold text-xs transition-colors shrink-0 flex items-center gap-1.5 shadow-2xs cursor-pointer"
                          >
                            <RotateCcw className="w-3.5 h-3.5 text-amber-700" />
                            <span>Сбросить ручной выбор</span>
                          </button>
                        )}
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-sm sm:text-base font-bold text-slate-900">
                            Все плагины и материалы ({plugins.length})
                          </h4>
                          <p className="text-xs text-slate-500">
                            Вы можете мгновенно редактировать, удалять, закреплять флагман или добавлять новые инструменты прямо здесь
                          </p>
                        </div>
                        <button
                          onClick={handleOpenNewPlugin}
                          className="py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition-colors"
                        >
                          <Plus className="w-4 h-4" />
                          <span>Добавить плагин</span>
                        </button>
                      </div>

                      <div className="divide-y divide-slate-200 border border-slate-200 rounded-2xl overflow-hidden bg-white">
                        {plugins.map((plugin) => {
                          const isExplicitFlagship = flagshipPluginId === plugin.id;
                          const isAutoFlagship = !flagshipPluginId && plugins[0]?.id === plugin.id;
                          const isCurrentHeroFlagship = isExplicitFlagship || isAutoFlagship;

                          return (
                            <div
                              key={plugin.id}
                              className={`p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors ${
                                isExplicitFlagship ? 'bg-amber-50/40' : 'hover:bg-slate-50'
                              }`}
                            >
                              <div className="space-y-1">
                                <div className="flex flex-wrap items-center gap-2">
                                  <span className="text-[10px] font-mono font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                                    {plugin.softwareLabel}
                                  </span>
                                  {plugin.inDevelopment && (
                                    <span className="text-[10px] font-mono font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded border border-amber-200">
                                      В разработке
                                    </span>
                                  )}
                                  {isExplicitFlagship && (
                                    <span className="text-[10px] font-mono font-bold text-amber-900 bg-amber-100 px-2 py-0.5 rounded border border-amber-300 flex items-center gap-1 shadow-2xs">
                                      <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                                      ⭐ Закрепленный флагман
                                    </span>
                                  )}
                                  {isAutoFlagship && (
                                    <span className="text-[10px] font-mono font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded border border-slate-300 flex items-center gap-1">
                                      <Star className="w-3 h-3 text-slate-400" />
                                      Флагман на главном (авто)
                                    </span>
                                  )}
                                  <span className="text-[11px] font-mono text-slate-400">
                                    {plugin.version}
                                  </span>
                                </div>
                                <h5 className="text-sm font-bold text-slate-900">{plugin.title}</h5>
                                <p className="text-xs text-slate-500 line-clamp-1">{plugin.description}</p>
                              </div>

                              <div className="flex items-center gap-2 shrink-0">
                                <button
                                  type="button"
                                  onClick={() => handleToggleFlagship(plugin.id)}
                                  className={`p-2 sm:px-3 sm:py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                                    isExplicitFlagship
                                      ? 'bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300 font-bold shadow-2xs'
                                      : 'bg-slate-100 hover:bg-amber-50 hover:text-amber-800 text-slate-700 border border-slate-200'
                                  }`}
                                  title={
                                    isExplicitFlagship
                                      ? 'Нажмите, чтобы открепить (будет показываться первый в списке)'
                                      : 'Закрепить этот плагин как флагман месяца на главном экране'
                                  }
                                >
                                  <Star className={`w-3.5 h-3.5 ${isExplicitFlagship ? 'fill-amber-500 text-amber-500' : 'text-slate-400'}`} />
                                  <span>{isExplicitFlagship ? 'Открепить флагман' : 'Сделать флагманом'}</span>
                                </button>

                                <button
                                  onClick={() => {
                                    setIsNewPlugin(false);
                                    setEditingPlugin(plugin);
                                  }}
                                  className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1 transition-colors"
                                  title="Редактировать плагин"
                                >
                                  <Edit2 className="w-3.5 h-3.5" />
                                  <span className="hidden sm:inline">Изменить</span>
                                </button>
                                <button
                                  onClick={() => handleDeletePlugin(plugin.id)}
                                  className="p-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-semibold flex items-center gap-1 transition-colors"
                                  title="Удалить плагин"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </>
                  ) : (
                    /* Plugin Edit/Create Form */
                    <form onSubmit={handleSavePlugin} className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-xs space-y-4">
                      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                        <h4 className="text-base font-bold text-slate-900">
                          {isNewPlugin ? 'Добавление нового плагина' : 'Редактирование плагина'}
                        </h4>
                        <button
                          type="button"
                          onClick={() => setEditingPlugin(null)}
                          className="text-xs text-slate-500 hover:text-slate-800"
                        >
                          Отмена
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-mono font-semibold text-slate-700 mb-1">
                            Название плагина:
                          </label>
                          <input
                            type="text"
                            required
                            value={editingPlugin.title}
                            onChange={(e) => setEditingPlugin({ ...editingPlugin, title: e.target.value })}
                            placeholder="Плагин «Автослои» для AutoCAD"
                            className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs outline-none focus:border-blue-500"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-mono font-semibold text-slate-700 mb-1">
                            Программа (софт):
                          </label>
                          <select
                            value={editingPlugin.software}
                            onChange={(e) => {
                              const sw = e.target.value as SoftwareCategory;
                              const labels: Record<string, string> = {
                                autocad: 'AutoCAD',
                                revit: 'Revit',
                                archicad: 'Archicad',
                                twinmotion: 'Twinmotion',
                                scripts: 'Dynamo / Revit'
                              };
                              setEditingPlugin({
                                ...editingPlugin,
                                software: sw,
                                softwareLabel: labels[sw] || 'AutoCAD'
                              });
                            }}
                            className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs outline-none focus:border-blue-500 bg-white"
                          >
                            <option value="autocad">AutoCAD</option>
                            <option value="revit">Autodesk Revit</option>
                            <option value="archicad">Archicad</option>
                            <option value="twinmotion">Twinmotion</option>
                            <option value="scripts">Dynamo / Скрипты</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-xs font-mono font-semibold text-slate-700 mb-1">
                            Категория (формат блока):
                          </label>
                          <input
                            type="text"
                            value={editingPlugin.category}
                            onChange={(e) => setEditingPlugin({ ...editingPlugin, category: e.target.value })}
                            placeholder="LISP-плагин / Динамический блок"
                            className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs outline-none focus:border-blue-500"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-mono font-semibold text-slate-700 mb-1">
                            Совместимые версии:
                          </label>
                          <input
                            type="text"
                            value={editingPlugin.version}
                            onChange={(e) => setEditingPlugin({ ...editingPlugin, version: e.target.value })}
                            placeholder="AutoCAD (все версии) / Revit 2021-2025"
                            className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs outline-none focus:border-blue-500"
                          />
                        </div>

                        <div className="sm:col-span-2">
                          <label className="block text-xs font-mono font-semibold text-slate-700 mb-1">
                            Подробное описание:
                          </label>
                          <textarea
                            rows={3}
                            required
                            value={editingPlugin.description}
                            onChange={(e) => setEditingPlugin({ ...editingPlugin, description: e.target.value })}
                            placeholder="Что делает плагин, какие проблемы черчения решает..."
                            className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs outline-none focus:border-blue-500"
                          />
                        </div>

                        {/* Benefits */}
                        <div className="sm:col-span-2 space-y-2">
                          <label className="block text-xs font-mono font-semibold text-slate-700">
                            3 ключевых преимущества:
                          </label>
                          {[0, 1, 2].map((idx) => (
                            <input
                              key={idx}
                              type="text"
                              value={editingPlugin.benefits[idx] || ''}
                              onChange={(e) => {
                                const newB = [...editingPlugin.benefits];
                                newB[idx] = e.target.value;
                                setEditingPlugin({ ...editingPlugin, benefits: newB });
                              }}
                              placeholder={`Преимущество ${idx + 1}`}
                              className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs outline-none focus:border-blue-500"
                            />
                          ))}
                        </div>

                        <div>
                          <label className="block text-xs font-mono font-semibold text-slate-700 mb-1">
                            Ссылка на Яндекс.Диск / Облако (скачивание):
                          </label>
                          <input
                            type="url"
                            value={editingPlugin.downloadUrl || ''}
                            onChange={(e) => setEditingPlugin({ ...editingPlugin, downloadUrl: e.target.value })}
                            placeholder="https://disk.yandex.ru/d/..."
                            className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs outline-none focus:border-blue-500"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-mono font-semibold text-slate-700 mb-1">
                            Ссылка на видеоинструкцию (Rutube, VK):
                          </label>
                          <input
                            type="url"
                            value={editingPlugin.videoTutorialUrl || ''}
                            onChange={(e) => setEditingPlugin({ ...editingPlugin, videoTutorialUrl: e.target.value })}
                            placeholder="https://rutube.ru/video/..."
                            className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs outline-none focus:border-blue-500"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-mono font-semibold text-slate-700 mb-1">
                            Размер файла:
                          </label>
                          <input
                            type="text"
                            value={editingPlugin.fileSize}
                            onChange={(e) => setEditingPlugin({ ...editingPlugin, fileSize: e.target.value })}
                            placeholder="~10 KB / 5 MB"
                            className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs outline-none focus:border-blue-500"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-mono font-semibold text-slate-700 mb-1">
                            Формат:
                          </label>
                          <input
                            type="text"
                            value={editingPlugin.fileFormat}
                            onChange={(e) => setEditingPlugin({ ...editingPlugin, fileFormat: e.target.value })}
                            placeholder=".lsp (LISP-скрипт) / .dwg"
                            className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs outline-none focus:border-blue-500"
                          />
                        </div>

                        <div className="sm:col-span-2 flex items-center gap-2 pt-2">
                          <input
                            type="checkbox"
                            id="inDevCheckbox"
                            checked={!!editingPlugin.inDevelopment}
                            onChange={(e) => setEditingPlugin({ ...editingPlugin, inDevelopment: e.target.checked })}
                            className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300"
                          />
                          <label htmlFor="inDevCheckbox" className="text-xs font-medium text-slate-800">
                            Плагин находится в разработке (подсветка карточки «В разработке», кнопка анонса в Telegram)
                          </label>
                        </div>

                        <div className="sm:col-span-2 flex items-center gap-2 pt-2 border-t border-slate-100">
                          <input
                            type="checkbox"
                            id="flagshipFormCheckbox"
                            checked={flagshipPluginId === editingPlugin.id}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setFlagshipPluginId(editingPlugin.id);
                                setFlagshipPluginIdState(editingPlugin.id);
                              } else {
                                if (flagshipPluginId === editingPlugin.id) {
                                  setFlagshipPluginId(null);
                                  setFlagshipPluginIdState(null);
                                }
                              }
                            }}
                            className="w-4 h-4 rounded text-amber-600 focus:ring-amber-500 border-slate-300 cursor-pointer"
                          />
                          <label htmlFor="flagshipFormCheckbox" className="text-xs font-bold text-slate-900 flex items-center gap-1.5 cursor-pointer">
                            <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
                            <span>Закрепить этот плагин на главном экране (⭐ Флагманский плагин месяца в блоке Hero)</span>
                          </label>
                        </div>
                      </div>

                      <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
                        <button
                          type="button"
                          onClick={() => setEditingPlugin(null)}
                          className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-colors"
                        >
                          Отмена
                        </button>
                        <button
                          type="submit"
                          className="px-6 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition-colors shadow-xs"
                        >
                          Сохранить плагин
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              )}

              {/* TAB 3: COURSES MANAGEMENT */}
              {activeTab === 'courses' && (
                <div className="space-y-4">
                  {!editingCourse ? (
                    <>
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-sm sm:text-base font-bold text-slate-900">
                            Все курсы ({courses.length})
                          </h4>
                          <p className="text-xs text-slate-500">
                            Добавляйте фото, описание, ссылки на видеопрезентацию и страницы курсов
                          </p>
                        </div>
                        <button
                          onClick={handleOpenNewCourse}
                          className="py-2.5 px-4 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition-colors"
                        >
                          <Plus className="w-4 h-4" />
                          <span>Добавить курс</span>
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {courses.map((course) => (
                          <div
                            key={course.id}
                            className="border border-slate-200 rounded-2xl overflow-hidden bg-white flex flex-col justify-between hover:shadow-xs transition-all"
                          >
                            <div className="relative h-28 bg-slate-800 overflow-hidden">
                              <img
                                src={course.bannerImage}
                                alt={course.title}
                                className="w-full h-full object-cover opacity-60"
                                referrerPolicy="no-referrer"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
                              <div className="absolute top-2 left-2 flex gap-1.5">
                                <span className="px-2 py-0.5 rounded bg-blue-600/90 text-white text-[10px] font-mono font-bold">
                                  {course.softwareLabel}
                                </span>
                                {course.videoPresentationUrl && (
                                  <span className="px-2 py-0.5 rounded bg-orange-500/90 text-white text-[10px] font-mono font-bold flex items-center gap-1">
                                    <Video className="w-2.5 h-2.5" />
                                    Видеопрезентация
                                  </span>
                                )}
                              </div>
                              <div className="absolute bottom-2 left-2 right-2 text-white text-xs font-bold truncate">
                                {course.title}
                              </div>
                            </div>

                            <div className="p-4 space-y-2 flex-1">
                              <p className="text-xs text-slate-600 line-clamp-2">
                                {course.description}
                              </p>
                              <div className="text-[11px] font-mono text-slate-500 flex justify-between">
                                <span>{course.duration}</span>
                                <span>{course.lessonsCount}</span>
                              </div>
                            </div>

                            <div className="p-3 border-t border-slate-100 flex items-center justify-between bg-slate-50/50">
                              <span className="text-[11px] font-mono text-emerald-700 font-semibold truncate max-w-[160px]">
                                {course.targetAudience}
                              </span>
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => {
                                    setIsNewCourse(false);
                                    setEditingCourse(course);
                                  }}
                                  className="p-1.5 rounded-lg bg-white border border-slate-200 hover:border-blue-400 text-slate-700 text-xs font-semibold flex items-center gap-1 transition-colors"
                                >
                                  <Edit2 className="w-3.5 h-3.5" />
                                  <span>Изменить</span>
                                </button>
                                <button
                                  onClick={() => handleDeleteCourse(course.id)}
                                  className="p-1.5 rounded-lg bg-white border border-slate-200 hover:border-rose-400 text-rose-600 text-xs font-semibold flex items-center gap-1 transition-colors"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </>
                  ) : (
                    /* Course Edit/Create Form */
                    <form onSubmit={handleSaveCourse} className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-xs space-y-4">
                      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                        <h4 className="text-base font-bold text-slate-900">
                          {isNewCourse ? 'Добавление нового курса' : 'Редактирование курса'}
                        </h4>
                        <button
                          type="button"
                          onClick={() => setEditingCourse(null)}
                          className="text-xs text-slate-500 hover:text-slate-800"
                        >
                          Отмена
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="sm:col-span-2">
                          <label className="block text-xs font-mono font-semibold text-slate-700 mb-1">
                            Название курса:
                          </label>
                          <input
                            type="text"
                            required
                            value={editingCourse.title}
                            onChange={(e) => setEditingCourse({ ...editingCourse, title: e.target.value })}
                            placeholder="Revit: От базовых стен до готового рабочего альбома"
                            className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs outline-none focus:border-blue-500"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-mono font-semibold text-slate-700 mb-1">
                            Программа (софт):
                          </label>
                          <input
                            type="text"
                            required
                            value={editingCourse.softwareLabel}
                            onChange={(e) => setEditingCourse({ ...editingCourse, softwareLabel: e.target.value })}
                            placeholder="Autodesk Revit / AutoCAD / Archicad"
                            className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs outline-none focus:border-blue-500"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-mono font-semibold text-slate-700 mb-1">
                            Уровень аудитории:
                          </label>
                          <input
                            type="text"
                            value={editingCourse.targetAudience}
                            onChange={(e) => setEditingCourse({ ...editingCourse, targetAudience: e.target.value })}
                            placeholder="Начинающие / Продолжающие / Комплексный"
                            className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs outline-none focus:border-blue-500"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-mono font-semibold text-slate-700 mb-1">
                            Длительность:
                          </label>
                          <input
                            type="text"
                            value={editingCourse.duration}
                            onChange={(e) => setEditingCourse({ ...editingCourse, duration: e.target.value })}
                            placeholder="24 академических часа"
                            className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs outline-none focus:border-blue-500"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-mono font-semibold text-slate-700 mb-1">
                            Количество уроков:
                          </label>
                          <input
                            type="text"
                            value={editingCourse.lessonsCount}
                            onChange={(e) => setEditingCourse({ ...editingCourse, lessonsCount: e.target.value })}
                            placeholder="32 подробных урока"
                            className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs outline-none focus:border-blue-500"
                          />
                        </div>

                        <div className="sm:col-span-2">
                          <label className="block text-xs font-mono font-semibold text-slate-700 mb-1">
                            Описание курса:
                          </label>
                          <textarea
                            rows={3}
                            required
                            value={editingCourse.description}
                            onChange={(e) => setEditingCourse({ ...editingCourse, description: e.target.value })}
                            placeholder="Чему научится студент, какие реальные кейсы разбираются..."
                            className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs outline-none focus:border-blue-500"
                          />
                        </div>

                        {/* Modules (Curriculum Program) */}
                        <div className="sm:col-span-2 space-y-2 p-3.5 bg-slate-50 border border-slate-200 rounded-2xl">
                          <div className="flex items-center justify-between">
                            <label className="text-xs font-mono font-bold text-slate-800 flex items-center gap-1.5">
                              <Layers className="w-3.5 h-3.5 text-blue-600" />
                              <span>Программа курса по модулям ({editingCourse.modules.length}):</span>
                            </label>
                            <span className="text-[11px] font-mono text-slate-500">
                              Поддерживает неограниченно модулей (1, 2, 3.. 20+)
                            </span>
                          </div>

                          <div className="space-y-2">
                            {editingCourse.modules.map((mod, idx) => (
                              <div key={idx} className="flex items-center gap-2">
                                <span className="w-8 h-7 rounded-md bg-slate-800 font-mono font-bold text-[11px] text-white flex items-center justify-center shrink-0">
                                  {idx + 1}
                                </span>
                                <input
                                  type="text"
                                  value={mod}
                                  onChange={(e) => {
                                    const newMods = [...editingCourse.modules];
                                    newMods[idx] = e.target.value;
                                    setEditingCourse({ ...editingCourse, modules: newMods });
                                  }}
                                  placeholder={`Модуль ${idx + 1}: например, Горячие клавиши и настройка интерфейса`}
                                  className="flex-1 px-3 py-1.5 rounded-lg border border-slate-300 bg-white text-xs outline-none focus:border-blue-500"
                                />
                                <button
                                  type="button"
                                  onClick={() => {
                                    const newMods = editingCourse.modules.filter((_, i) => i !== idx);
                                    setEditingCourse({ ...editingCourse, modules: newMods });
                                  }}
                                  className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                                  title="Удалить модуль"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            ))}
                          </div>

                          <button
                            type="button"
                            onClick={() => {
                              setEditingCourse({
                                ...editingCourse,
                                modules: [...editingCourse.modules, `Модуль ${editingCourse.modules.length + 1}: Название темы`]
                              });
                            }}
                            className="text-xs text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-1 mt-2 pt-1 cursor-pointer"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            <span>Добавить модуль {editingCourse.modules.length + 1}</span>
                          </button>
                        </div>

                        {/* Video Presentation URL */}
                        <div>
                          <label className="block text-xs font-mono font-semibold text-slate-700 mb-1">
                            Ссылка на видеопрезентацию (Rutube, VK, YouTube):
                          </label>
                          <input
                            type="url"
                            value={editingCourse.videoPresentationUrl || ''}
                            onChange={(e) => setEditingCourse({ ...editingCourse, videoPresentationUrl: e.target.value })}
                            placeholder="https://rutube.ru/video/..."
                            className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs outline-none focus:border-blue-500"
                          />
                          <span className="text-[10px] text-slate-400">
                            В карточке курса появится кнопка «Смотреть видеопрезентацию»
                          </span>
                        </div>

                        {/* Banner Image with Direct Upload & URL */}
                        <div className="sm:col-span-2 bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
                          <div className="flex items-center justify-between">
                            <label className="text-xs font-mono font-bold text-slate-800 flex items-center gap-1.5">
                              <ImageIcon className="w-3.5 h-3.5 text-blue-600" />
                              <span>Фотография / обложка курса:</span>
                            </label>
                            <span className="text-[11px] font-mono text-slate-500">
                              Рекомендуется 16:9 (1200×675 px)
                            </span>
                          </div>

                          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                            <label className="py-2 px-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs flex items-center gap-2 cursor-pointer transition-colors shadow-2xs shrink-0">
                              <Upload className="w-3.5 h-3.5" />
                              <span>Выбрать фото с устройства</span>
                              <input
                                type="file"
                                accept="image/*"
                                onChange={handleCourseImageFileChange}
                                className="hidden"
                              />
                            </label>

                            <span className="text-xs text-slate-400 font-mono">или вставьте URL:</span>

                            <input
                              type="url"
                              value={editingCourse.bannerImage}
                              onChange={(e) => setEditingCourse({ ...editingCourse, bannerImage: e.target.value })}
                              placeholder="https://archdigitalhub.ru/images/course.jpg или ссылка из сети"
                              className="flex-1 w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs outline-none focus:border-blue-500 bg-white"
                            />
                          </div>

                          {editingCourse.bannerImage && (
                            <div className="flex items-center gap-3 pt-1">
                              <div className="w-24 h-14 rounded-lg overflow-hidden border border-slate-200 bg-slate-100 shrink-0">
                                <img
                                  src={editingCourse.bannerImage}
                                  alt="Предпросмотр обложки"
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    (e.target as HTMLElement).style.display = 'none';
                                  }}
                                />
                              </div>
                              <div className="text-[11px] text-slate-600 space-y-0.5">
                                <span className="font-semibold text-emerald-700 block">✓ Обложка загружена и активна</span>
                                <span className="text-slate-500 block">При выборе этого курса на сайте данное фото будет крупно отображаться внизу страницы.</span>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Direct Course Link / Boosty */}
                        <div>
                          <label className="block text-xs font-mono font-semibold text-slate-700 mb-1">
                            Ссылка на страницу курса (Boosty или ваш сайт):
                          </label>
                          <input
                            type="url"
                            value={editingCourse.customCourseUrl || editingCourse.boostyExclusiveUrl}
                            onChange={(e) =>
                              setEditingCourse({
                                ...editingCourse,
                                customCourseUrl: e.target.value,
                                boostyExclusiveUrl: e.target.value
                              })
                            }
                            placeholder="https://boosty.to/architectdigitalhub?..."
                            className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs outline-none focus:border-blue-500"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-mono font-semibold text-slate-700 mb-1">
                            Текст плашки доступа:
                          </label>
                          <input
                            type="text"
                            value={editingCourse.freeVideosPlatform}
                            onChange={(e) => setEditingCourse({ ...editingCourse, freeVideosPlatform: e.target.value })}
                            placeholder="Базовые уроки на Rutube, VK и Telegram"
                            className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs outline-none focus:border-blue-500"
                          />
                        </div>

                        {/* STATUS: IN DEVELOPMENT & WAITLIST TOGGLE */}
                        <div className="sm:col-span-2 p-4 rounded-2xl bg-amber-50/80 border border-amber-200 space-y-3">
                          <div className="flex items-center justify-between">
                            <div>
                              <label className="text-xs font-bold text-amber-950 flex items-center gap-2 cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={!!editingCourse.inDevelopment}
                                  onChange={(e) =>
                                    setEditingCourse({
                                      ...editingCourse,
                                      inDevelopment: e.target.checked
                                    })
                                  }
                                  className="w-4 h-4 rounded text-amber-600 focus:ring-amber-500"
                                />
                                <span>Курс находится в разработке (открыть предзапись)</span>
                              </label>
                              <p className="text-[11px] text-amber-800 mt-1 pl-6">
                                Если включено, в карточке курса и на его отдельной странице появится плашка «В разработке», а вместо прямой покупки будет доступна форма предзаписи (сбор email в лист ожидания).
                              </p>
                            </div>
                          </div>

                          {editingCourse.inDevelopment && (
                            <div className="pt-2 border-t border-amber-200/70 pl-6 space-y-2">
                              <label className="block text-xs font-mono font-semibold text-amber-900">
                                Текст статуса разработки для студентов:
                              </label>
                              <input
                                type="text"
                                value={editingCourse.developmentStatusNote || ''}
                                onChange={(e) =>
                                  setEditingCourse({
                                    ...editingCourse,
                                    developmentStatusNote: e.target.value
                                  })
                                }
                                placeholder="Запись уроков идет полным ходом. Релиз запланирован на весну 2026."
                                className="w-full px-3 py-2 rounded-lg border border-amber-300 bg-white text-xs outline-none focus:border-amber-600 text-slate-800"
                              />
                            </div>
                          )}
                        </div>

                        {/* DETAILED DESCRIPTION FOR SEPARATE COURSE PAGE */}
                        <div className="sm:col-span-2 space-y-1">
                          <label className="block text-xs font-mono font-semibold text-slate-700">
                            Развернутое описание курса (для отдельной страницы):
                          </label>
                          <textarea
                            rows={4}
                            value={editingCourse.detailedDescription || ''}
                            onChange={(e) =>
                              setEditingCourse({
                                ...editingCourse,
                                detailedDescription: e.target.value
                              })
                            }
                            placeholder="Подробный текст о методике преподавания, ключевых преимуществах и практических навыках, которые получит студент..."
                            className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs outline-none focus:border-blue-500 leading-relaxed"
                          />
                        </div>

                        {/* WHAT YOU WILL LEARN (NUMBERED ITEMS 1, 2, 3, 4, 5, 6, 7...) */}
                        <div className="sm:col-span-2 p-4 rounded-2xl bg-blue-50/50 border border-blue-200/80 space-y-3">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                            <div>
                              <label className="text-xs font-mono font-bold text-slate-800 flex items-center gap-1.5">
                                <GraduationCap className="w-3.5 h-3.5 text-blue-600" />
                                <span>Чему вы научитесь на курсе (пункты 1, 2, 3...):</span>
                              </label>
                              <p className="text-[11px] text-slate-500 mt-0.5">
                                Добавляйте столько пунктов, сколько нужно — каждый отображается отдельным пронумерованным блоком.
                              </p>
                            </div>
                            <button
                              type="button"
                              onClick={() => {
                                const current = editingCourse.whatYouWillLearn || [];
                                setEditingCourse({
                                  ...editingCourse,
                                  whatYouWillLearn: [...current, '']
                                });
                              }}
                              className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs flex items-center gap-1.5 transition-colors shrink-0 shadow-2xs cursor-pointer"
                            >
                              <Plus className="w-3.5 h-3.5" />
                              <span>Добавить пункт {(editingCourse.whatYouWillLearn || []).length + 1}</span>
                            </button>
                          </div>

                          <div className="space-y-2">
                            {(editingCourse.whatYouWillLearn || []).map((point, pIdx) => (
                              <div key={pIdx} className="flex items-center gap-2">
                                <span className="w-7 h-7 rounded-lg bg-blue-600 font-mono font-extrabold text-xs text-white flex items-center justify-center shrink-0 shadow-2xs">
                                  {pIdx + 1}
                                </span>
                                <input
                                  type="text"
                                  value={point}
                                  onChange={(e) => {
                                    const current = [...(editingCourse.whatYouWillLearn || [])];
                                    current[pIdx] = e.target.value;
                                    setEditingCourse({
                                      ...editingCourse,
                                      whatYouWillLearn: current
                                    });
                                  }}
                                  placeholder={`Навык ${pIdx + 1}: например, Создавать рабочую документацию по ГОСТ`}
                                  className="flex-1 px-3 py-1.5 rounded-lg border border-slate-300 bg-white text-xs outline-none focus:border-blue-500"
                                />
                                <button
                                  type="button"
                                  onClick={() => {
                                    const current = (editingCourse.whatYouWillLearn || []).filter((_, i) => i !== pIdx);
                                    setEditingCourse({
                                      ...editingCourse,
                                      whatYouWillLearn: current
                                    });
                                  }}
                                  className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                                  title="Удалить пункт"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            ))}

                            {(!editingCourse.whatYouWillLearn || editingCourse.whatYouWillLearn.length === 0) && (
                              <div className="p-3 rounded-xl border border-dashed border-blue-300 bg-white/70 text-center text-xs text-slate-500">
                                Нажмите кнопку «Добавить пункт 1», чтобы добавить первый результат обучения.
                              </div>
                            )}
                          </div>
                        </div>

                        {/* PORTFOLIO & WORK EXAMPLES GALLERY MANAGER */}
                        <div className="sm:col-span-2 p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="text-xs font-mono font-bold text-slate-900 flex items-center gap-1.5">
                                <ImageIcon className="w-4 h-4 text-blue-600" />
                                <span>Галерея примеров работ студентов и чертежей ({editingCourse.portfolioImages?.length || 0})</span>
                              </h4>
                              <p className="text-[11px] text-slate-500">
                                Студенты смогут просматривать полноразмерные чертежи, схемы и рендеры в лайтбоксе на отдельной странице курса.
                              </p>
                            </div>
                            <button
                              type="button"
                              onClick={handleAddPortfolioImage}
                              className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs flex items-center gap-1.5 transition-colors shadow-2xs"
                            >
                              <Plus className="w-3.5 h-3.5" />
                              <span>Добавить работу</span>
                            </button>
                          </div>

                          {(!editingCourse.portfolioImages || editingCourse.portfolioImages.length === 0) ? (
                            <div className="p-4 rounded-xl border border-dashed border-slate-300 text-center text-xs text-slate-500">
                              В галерее курса пока нет примеров. Нажмите «Добавить работу», чтобы загрузить чертежи или рендеры.
                            </div>
                          ) : (
                            <div className="space-y-3">
                              {editingCourse.portfolioImages.map((img, idx) => (
                                <div
                                  key={idx}
                                  className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row gap-3 items-start sm:items-center"
                                >
                                  <div className="w-20 h-14 rounded-lg overflow-hidden bg-slate-100 border border-slate-200 shrink-0 relative group">
                                    <img
                                      src={img.url}
                                      alt={img.title}
                                      className="w-full h-full object-cover"
                                      referrerPolicy="no-referrer"
                                    />
                                    <label className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center cursor-pointer transition-opacity text-white text-[10px] font-bold text-center p-1">
                                      <span>Заменить</span>
                                      <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => handlePortfolioImageUpload(idx, e)}
                                        className="hidden"
                                      />
                                    </label>
                                  </div>

                                  <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-2 w-full">
                                    <input
                                      type="text"
                                      value={img.title}
                                      onChange={(e) => handleUpdatePortfolioImage(idx, 'title', e.target.value)}
                                      placeholder="Название чертежа / проекта"
                                      className="px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs outline-none focus:border-blue-500"
                                    />
                                    <input
                                      type="text"
                                      value={img.caption || ''}
                                      onChange={(e) => handleUpdatePortfolioImage(idx, 'caption', e.target.value)}
                                      placeholder="Краткое описание"
                                      className="px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs outline-none focus:border-blue-500"
                                    />
                                    <div className="flex gap-2">
                                      <input
                                        type="text"
                                        value={img.tag || ''}
                                        onChange={(e) => handleUpdatePortfolioImage(idx, 'tag', e.target.value)}
                                        placeholder="Тег (напр. Чертеж АР)"
                                        className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs outline-none focus:border-blue-500"
                                      />
                                      <button
                                        type="button"
                                        onClick={() => handleRemovePortfolioImage(idx)}
                                        className="px-2 py-1.5 rounded-lg text-rose-500 hover:bg-rose-50 hover:text-rose-700 transition-colors shrink-0"
                                        title="Удалить"
                                      >
                                        <Trash2 className="w-4 h-4" />
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
                        <button
                          type="button"
                          onClick={() => setEditingCourse(null)}
                          className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-colors"
                        >
                          Отмена
                        </button>
                        <button
                          type="submit"
                          className="px-6 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs transition-colors shadow-xs"
                        >
                          Сохранить курс
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              )}

              {/* TAB 4: BACKUP & RESET */}
              {activeTab === 'backup' && (
                <div className="space-y-6">
                  <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-xs space-y-4">
                    <h4 className="text-sm font-bold text-slate-900 uppercase font-mono">
                      Экспорт и сохранение копии
                    </h4>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      Скачайте файл со всеми вашими текущими плагинами и курсами на свой компьютер или телефон, чтобы восстановить их в любой момент при очистке браузера или смене устройства.
                    </p>
                    <div className="flex flex-wrap gap-3">
                      <button
                        onClick={handleExportJSON}
                        className="py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-xs transition-colors"
                      >
                        <Download className="w-4 h-4" />
                        <span>Скачать резервную копию (JSON)</span>
                      </button>

                      <label className="py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs sm:text-sm flex items-center gap-2 cursor-pointer transition-colors border border-slate-200">
                        <Upload className="w-4 h-4 text-blue-600" />
                        <span>Восстановить из файла JSON</span>
                        <input
                          type="file"
                          accept=".json"
                          onChange={handleImportJSON}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>

                  {/* ADMIN PASSWORD CARD */}
                  <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-xs space-y-4">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                        <KeyRound className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-slate-900 uppercase font-mono">
                          Пароль администратора
                        </h4>
                        <p className="text-[11px] text-slate-500">
                          Защищает вход в админку и скрывает кнопки управления от посетителей сайта
                        </p>
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed">
                      Текущий пароль по умолчанию: <strong className="font-mono text-slate-900">2026</strong>. Если вы хотите изменить его перед выгрузкой сайта на хостинг, введите новый пароль ниже.
                    </p>

                    <form onSubmit={handleChangePassword} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                      <input
                        type="text"
                        value={customPasswordInput}
                        onChange={(e) => {
                          setCustomPasswordInput(e.target.value);
                          if (passwordChangeFeedback) setPasswordChangeFeedback(null);
                        }}
                        placeholder="Введите новый пароль (например, 2026)"
                        className="px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-mono outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 flex-1 max-w-sm"
                      />
                      <button
                        type="submit"
                        className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-xs shrink-0"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Установить пароль</span>
                      </button>
                    </form>

                    {passwordChangeFeedback && (
                      <div
                        className={`p-3 rounded-xl text-xs flex items-center gap-2 animate-in fade-in ${
                          passwordChangeFeedback.type === 'success'
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                            : 'bg-rose-50 text-rose-800 border border-rose-200'
                        }`}
                      >
                        {passwordChangeFeedback.type === 'success' ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        ) : (
                          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                        )}
                        <span>{passwordChangeFeedback.message}</span>
                      </div>
                    )}
                  </div>

                  <div className="bg-rose-50 border border-rose-200 rounded-2xl p-5 sm:p-6 space-y-3">
                    <h4 className="text-sm font-bold text-rose-950 uppercase font-mono flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-rose-600" />
                      <span>Сброс к заводским данным</span>
                    </h4>
                    <p className="text-xs sm:text-sm text-rose-800 leading-relaxed">
                      Удаляет все локальные изменения и восстанавливает оригинальный список из 5 плагинов AutoCAD и базовых курсов.
                    </p>
                    <button
                      onClick={handleResetDefaults}
                      className="py-2.5 px-4 rounded-xl bg-white hover:bg-rose-100 text-rose-700 border border-rose-300 font-bold text-xs transition-colors shadow-2xs"
                    >
                      Сбросить к исходным материалам
                    </button>
                  </div>
                </div>
              )}

              {/* TAB 5: SUBMISSIONS & IDEAS */}
              {activeTab === 'requests' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm sm:text-base font-bold text-slate-900">
                        Входящие заявки и идеи плагинов ({submissions.length})
                      </h4>
                      <p className="text-xs text-slate-500">
                        Сообщения, отправленные посетителями через форму обратной связи на сайте
                      </p>
                    </div>

                    {submissions.length > 0 && (
                      <button
                        onClick={() => {
                          if (window.confirm('Очистить историю всех полученных заявок?')) {
                            localStorage.removeItem('archhub_feedback_submissions');
                            setSubmissions([]);
                          }
                        }}
                        className="text-xs text-rose-600 hover:text-rose-700 font-semibold px-3 py-1.5 rounded-lg bg-rose-50 border border-rose-200 transition-colors"
                      >
                        Очистить историю
                      </button>
                    )}
                  </div>

                  {submissions.length === 0 ? (
                    <div className="p-10 border border-dashed border-slate-300 rounded-2xl text-center text-slate-500 space-y-2">
                      <MessageSquare className="w-8 h-8 mx-auto text-slate-400" />
                      <p className="text-sm font-semibold">Новых заявок пока нет</p>
                      <p className="text-xs text-slate-400">
                        Когда пользователь заполнит форму обратной связи на сайте, сообщение мгновенно появится здесь
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {submissions.map((sub) => (
                        <div
                          key={sub.id}
                          className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-2xs space-y-3"
                        >
                          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-2">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-sm text-slate-900">{sub.name}</span>
                              <span className="text-xs font-mono text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                                {sub.contact}
                              </span>
                            </div>
                            <span className="text-[11px] font-mono text-slate-400">{sub.date}</span>
                          </div>

                          <div className="text-xs text-slate-700 leading-relaxed whitespace-pre-wrap bg-slate-50 p-3 rounded-xl border border-slate-150">
                            {sub.message}
                          </div>

                          <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 pt-1">
                            <span>Тема: {sub.topic === 'plugin_idea' ? '💡 Идея плагина' : sub.topic === 'question' ? '❓ Вопрос' : '🎓 Курс'} | Софт: {sub.software}</span>
                            <div className="flex items-center gap-2">
                              {sub.contact && sub.contact.startsWith('@') && (
                                <a
                                  href={`https://t.me/${sub.contact.replace('@', '')}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-600 hover:text-blue-700 font-semibold underline"
                                >
                                  Открыть в Telegram
                                </a>
                              )}
                              <button
                                onClick={() => {
                                  const updated = submissions.filter((s) => s.id !== sub.id);
                                  setSubmissions(updated);
                                  localStorage.setItem('archhub_feedback_submissions', JSON.stringify(updated));
                                }}
                                className="text-rose-500 hover:text-rose-700 font-semibold"
                              >
                                Удалить
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* TAB: WAITLIST (PRE-REGISTRATIONS FOR COURSES IN DEVELOPMENT) */}
              {activeTab === 'waitlist' && (
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h4 className="text-base font-bold text-slate-900 flex items-center gap-2">
                        <Users className="w-5 h-5 text-amber-600" />
                        <span>Лист ожидания и предзаписи на курсы ({waitlistEntries.length})</span>
                      </h4>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Студенты, которые подписались на уведомление о выходе курсов, находящихся в разработке.
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        onClick={handleCopyWaitlistEmails}
                        disabled={waitlistEntries.length === 0}
                        className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-2 shadow-2xs transition-colors disabled:opacity-40 disabled:pointer-events-none"
                        title="Скопировать все email через запятую"
                      >
                        {copiedWaitlistEmails ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-300" />
                            <span>Email скопированы!</span>
                          </>
                        ) : (
                          <>
                            <Mail className="w-3.5 h-3.5" />
                            <span>Скопировать все Email</span>
                          </>
                        )}
                      </button>

                      <button
                        onClick={handleExportWaitlistCSV}
                        disabled={waitlistEntries.length === 0}
                        className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs flex items-center gap-1.5 transition-colors border border-slate-200 disabled:opacity-40 disabled:pointer-events-none"
                        title="Скачать таблицу CSV"
                      >
                        <FileDown className="w-3.5 h-3.5 text-slate-600" />
                        <span>Экспорт CSV</span>
                      </button>

                      {waitlistEntries.length > 0 && (
                        <button
                          onClick={handleClearWaitlist}
                          className="px-3 py-2 rounded-xl text-rose-600 hover:bg-rose-50 text-xs font-semibold transition-colors border border-rose-200"
                        >
                          Очистить список
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Filter by course if more than 1 course has signups */}
                  {courses.length > 0 && (
                    <div className="flex items-center gap-2 p-3 bg-white rounded-xl border border-slate-200 text-xs">
                      <span className="font-mono text-slate-500 font-semibold">Фильтр по курсу:</span>
                      <select
                        value={waitlistFilter}
                        onChange={(e) => setWaitlistFilter(e.target.value)}
                        className="px-2 py-1 rounded-lg border border-slate-300 bg-slate-50 text-slate-800 font-medium outline-none focus:border-blue-500 text-xs"
                      >
                        <option value="all">Все курсы ({waitlistEntries.length})</option>
                        {courses.map((c) => {
                          const count = waitlistEntries.filter((w) => w.courseId === c.id).length;
                          return (
                            <option key={c.id} value={c.id}>
                              {c.title.split(':')[0]} ({count})
                            </option>
                          );
                        })}
                      </select>
                    </div>
                  )}

                  {/* List / Table */}
                  {(() => {
                    const filtered = waitlistFilter === 'all'
                      ? waitlistEntries
                      : waitlistEntries.filter((w) => w.courseId === waitlistFilter);

                    if (filtered.length === 0) {
                      return (
                        <div className="p-8 bg-white rounded-2xl border border-slate-200 text-center space-y-3">
                          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
                            <Users className="w-6 h-6" />
                          </div>
                          <h5 className="font-bold text-slate-900 text-sm">
                            {waitlistEntries.length === 0
                              ? 'В листе ожидания пока нет записей'
                              : 'По выбранному курсу нет подписок'}
                          </h5>
                          <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
                            Когда в курсе включена галочка «Курс в разработке», на сайте и на отдельной странице курса появляется форма предзаписи. Студенты вводят свои email, чтобы получить уведомление о старте курса и промокод на скидку.
                          </p>
                        </div>
                      );
                    }

                    return (
                      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs">
                        <div className="overflow-x-auto">
                          <table className="w-full text-left border-collapse">
                            <thead>
                              <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-mono uppercase text-slate-500 font-semibold">
                                <th className="p-3 pl-4">Курс</th>
                                <th className="p-3">Email студента</th>
                                <th className="p-3">Дата подписки</th>
                                <th className="p-3 pr-4 text-right">Действие</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 text-xs text-slate-800">
                              {filtered.map((item) => (
                                <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                                  <td className="p-3 pl-4 font-semibold text-slate-900">
                                    <div className="flex items-center gap-2">
                                      <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0"></span>
                                      <span>{item.courseTitle}</span>
                                    </div>
                                  </td>
                                  <td className="p-3 font-mono text-blue-700 font-medium">
                                    <div className="flex items-center gap-1.5">
                                      <span>{item.email}</span>
                                      <button
                                        onClick={() => {
                                          navigator.clipboard.writeText(item.email);
                                          alert(`Email ${item.email} скопирован в буфер`);
                                        }}
                                        className="text-slate-400 hover:text-slate-700 p-0.5"
                                        title="Скопировать email"
                                      >
                                        <Mail className="w-3 h-3" />
                                      </button>
                                    </div>
                                  </td>
                                  <td className="p-3 text-slate-500 font-mono text-[11px]">
                                    {item.createdAt}
                                  </td>
                                  <td className="p-3 pr-4 text-right">
                                    <button
                                      onClick={() => handleDeleteWaitlistEntry(item.id)}
                                      className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 hover:text-rose-700 transition-colors"
                                      title="Удалить запись"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              )}

              {/* TAB 6: NOTIFICATIONS (TELEGRAM, EMAIL, MAX) */}
              {activeTab === 'notifications' && (
                <form onSubmit={handleSaveNotifSettings} className="space-y-6">
                  <div>
                    <h4 className="text-base font-bold text-slate-900 flex items-center gap-2">
                      <Bell className="w-5 h-5 text-blue-600" />
                      <span>Настройка мгновенных уведомлений о заявках с сайта</span>
                    </h4>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                      Когда посетитель сайта отправляет вопрос или идею плагина, сайт мгновенно отправит вам пуш-уведомление на телефон в Telegram, письмо на почту или в мессенджер MAX.
                    </p>
                  </div>

                  {/* Toast on save */}
                  {notifSavedToast && (
                    <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-semibold flex items-center gap-2 shadow-2xs">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Настройки уведомлений успешно сохранены! Теперь сайт будет отправлять уведомления.</span>
                    </div>
                  )}

                  {/* Test Result Toast */}
                  {testResult && (
                    <div
                      className={`p-3.5 rounded-xl text-xs font-semibold flex items-center gap-2 shadow-2xs ${
                        testResult.success
                          ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
                          : 'bg-rose-50 border border-rose-200 text-rose-800'
                      }`}
                    >
                      {testResult.success ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      ) : (
                        <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                      )}
                      <span>{testResult.message}</span>
                    </div>
                  )}

                  {/* 1. TELEGRAM (RECOMMENDED) */}
                  <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-sky-500 text-white flex items-center justify-center font-bold text-xs shadow-2xs">
                          TG
                        </div>
                        <div>
                          <h5 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                            <span>Telegram-бот на телефон</span>
                            <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-sky-100 text-sky-800 font-semibold">
                              Рекомендуется
                            </span>
                          </h5>
                          <p className="text-[11px] text-slate-500">
                            Мгновенный звуковой пуш на смартфон при каждой отправке формы
                          </p>
                        </div>
                      </div>

                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={notifSettings.telegramEnabled}
                          onChange={(e) =>
                            setNotifSettings({ ...notifSettings, telegramEnabled: e.target.checked })
                          }
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-sky-500"></div>
                      </label>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                      <div>
                        <label className="block text-xs font-mono font-semibold text-slate-700 mb-1">
                          Токен Telegram-бота (от @BotFather):
                        </label>
                        <input
                          type="text"
                          value={notifSettings.telegramBotToken}
                          onChange={(e) =>
                            setNotifSettings({ ...notifSettings, telegramBotToken: e.target.value })
                          }
                          placeholder="7123456789:AAHkL7z..."
                          className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs font-mono outline-none focus:border-sky-500"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-mono font-semibold text-slate-700 mb-1">
                          Ваш Telegram Chat ID:
                        </label>
                        <input
                          type="text"
                          value={notifSettings.telegramChatId}
                          onChange={(e) =>
                            setNotifSettings({ ...notifSettings, telegramChatId: e.target.value })
                          }
                          placeholder="123456789 или @ваш_канал"
                          className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs font-mono outline-none focus:border-sky-500"
                        />
                      </div>
                    </div>

                    {/* How to get Telegram credentials */}
                    <div className="bg-sky-50 border border-sky-100 rounded-xl p-3 text-[11px] text-sky-900 space-y-1">
                      <p className="font-bold flex items-center gap-1">
                        <Sparkles className="w-3.5 h-3.5 text-sky-600" />
                        <span>Как настроить бота за 2 минуты (бесплатно):</span>
                      </p>
                      <ol className="list-decimal list-inside space-y-0.5 text-sky-800">
                        <li>Откройте в Telegram бота <a href="https://t.me/BotFather" target="_blank" rel="noreferrer" className="font-bold underline">@BotFather</a>, отправьте команду <code className="bg-white/80 px-1 rounded">/newbot</code>, задайте имя и скопируйте полученный HTTP API Token.</li>
                        <li>Откройте вашего нового бота в Telegram и нажмите кнопку <b>START</b> (это обязательно, чтобы бот имел право писать вам).</li>
                        <li>Узнайте свой Chat ID у бота <a href="https://t.me/userinfobot" target="_blank" rel="noreferrer" className="font-bold underline">@userinfobot</a> (строка Id) и вставьте в поле выше.</li>
                      </ol>
                    </div>

                    <div className="flex justify-end pt-1">
                      <button
                        type="button"
                        disabled={testSending === 'telegram' || !notifSettings.telegramBotToken}
                        onClick={() => handleTestNotif('telegram')}
                        className="py-2 px-3.5 rounded-lg bg-sky-50 hover:bg-sky-100 text-sky-700 border border-sky-200 text-xs font-bold flex items-center gap-1.5 transition-colors disabled:opacity-50"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>{testSending === 'telegram' ? 'Отправка...' : 'Отправить тестовое в Telegram'}</span>
                      </button>
                    </div>
                  </div>

                  {/* 2. EMAIL (Web3Forms) */}
                  <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold text-xs shadow-2xs">
                          @
                        </div>
                        <div>
                          <h5 className="font-bold text-sm text-slate-900">
                            Уведомления на электронную почту (Email)
                          </h5>
                          <p className="text-[11px] text-slate-500">
                            Письмо со всеми данными заявки придет на ваш e-mail (например legionstroy35@gmail.com)
                          </p>
                        </div>
                      </div>

                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={notifSettings.emailEnabled}
                          onChange={(e) =>
                            setNotifSettings({ ...notifSettings, emailEnabled: e.target.checked })
                          }
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                      </label>
                    </div>

                    <div>
                      <label className="block text-xs font-mono font-semibold text-slate-700 mb-1">
                        Ключ доступа Web3Forms (Access Key):
                      </label>
                      <input
                        type="text"
                        value={notifSettings.web3FormsKey}
                        onChange={(e) =>
                          setNotifSettings({ ...notifSettings, web3FormsKey: e.target.value })
                        }
                        placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs font-mono outline-none focus:border-emerald-500"
                      />
                      <p className="text-[11px] text-slate-500 mt-1">
                        Чтобы получать письма бесплатно и без настройки почтового сервера, введите свою почту на сайте{' '}
                        <a
                          href="https://web3forms.com"
                          target="_blank"
                          rel="noreferrer"
                          className="text-emerald-700 font-bold underline"
                        >
                          web3forms.com
                        </a>{' '}
                        — вам сразу придет бесплатный ключ (Access Key).
                      </p>
                    </div>

                    <div className="flex justify-end pt-1">
                      <button
                        type="button"
                        disabled={testSending === 'email' || !notifSettings.web3FormsKey}
                        onClick={() => handleTestNotif('email')}
                        className="py-2 px-3.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-bold flex items-center gap-1.5 transition-colors disabled:opacity-50"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>{testSending === 'email' ? 'Отправка...' : 'Отправить тестовое письмо на Email'}</span>
                      </button>
                    </div>
                  </div>

                  {/* 3. MESSENGER MAX / WEBHOOK */}
                  <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-xs shadow-2xs">
                          MAX
                        </div>
                        <div>
                          <h5 className="font-bold text-sm text-slate-900">
                            Мессенджер MAX / Входящий Webhook
                          </h5>
                          <p className="text-[11px] text-slate-500">
                            Отправка JSON данных на входящий вебхук в чат или корпоративную систему
                          </p>
                        </div>
                      </div>

                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={notifSettings.maxWebhookEnabled}
                          onChange={(e) =>
                            setNotifSettings({ ...notifSettings, maxWebhookEnabled: e.target.checked })
                          }
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>

                    <div>
                      <label className="block text-xs font-mono font-semibold text-slate-700 mb-1">
                        URL входящего вебхука MAX (Webhook URL):
                      </label>
                      <input
                        type="url"
                        value={notifSettings.maxWebhookUrl}
                        onChange={(e) =>
                          setNotifSettings({ ...notifSettings, maxWebhookUrl: e.target.value })
                        }
                        placeholder="https://api.max.ru/webhook/... или ваш адрес"
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs font-mono outline-none focus:border-blue-500"
                      />
                    </div>

                    <div className="flex justify-end pt-1">
                      <button
                        type="button"
                        disabled={testSending === 'max' || !notifSettings.maxWebhookUrl}
                        onClick={() => handleTestNotif('max')}
                        className="py-2 px-3.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 text-xs font-bold flex items-center gap-1.5 transition-colors disabled:opacity-50"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>{testSending === 'max' ? 'Отправка...' : 'Проверить вебхук MAX'}</span>
                      </button>
                    </div>
                  </div>

                  {/* Save button */}
                  <div className="flex items-center justify-between pt-2 border-t border-slate-200">
                    <span className="text-xs text-slate-500">
                      Нажмите «Сохранить», чтобы изменения вступили в силу
                    </span>

                    <button
                      type="submit"
                      className="py-2.5 px-6 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-xs transition-colors"
                    >
                      <Check className="w-4 h-4" />
                      <span>Сохранить настройки уведомлений</span>
                    </button>
                  </div>
                </form>
              )}

            </div>
          </>
        )}

      </div>
    </div>
  );
};
