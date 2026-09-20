import { ResourceItem, CourseTrack, SoftwareCategory } from '../types';
import { FREE_RESOURCES, COURSE_TRACKS } from '../data/mockData';
import { SITE_CONFIG } from '../config/siteConfig';

const STORAGE_KEY_PLUGINS = 'archhub_custom_plugins_v2';
const STORAGE_KEY_COURSES = 'archhub_custom_courses_v2';
const STORAGE_KEY_SHEET_URL = 'archhub_google_sheet_url_v2';
const STORAGE_KEY_LAST_SYNC = 'archhub_last_sync_time_v2';
const STORAGE_KEY_FLAGSHIP_PLUGIN = 'archhub_flagship_plugin_id_v2';

// Subscribers for real-time reactivity
type Listener = () => void;
const listeners: Set<Listener> = new Set();

export const subscribeToContentChanges = (listener: Listener) => {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
};

const notifyListeners = () => {
  listeners.forEach((fn) => {
    try {
      fn();
    } catch (e) {
      console.error('Error notifying listener:', e);
    }
  });
};

export const getStoredPlugins = (): ResourceItem[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_PLUGINS);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.warn('Could not read stored plugins:', err);
  }
  return [...FREE_RESOURCES];
};

export const getFlagshipPluginId = (): string | null => {
  try {
    return localStorage.getItem(STORAGE_KEY_FLAGSHIP_PLUGIN);
  } catch {
    return null;
  }
};

export const setFlagshipPluginId = (id: string | null) => {
  try {
    if (id) {
      localStorage.setItem(STORAGE_KEY_FLAGSHIP_PLUGIN, id);
    } else {
      localStorage.removeItem(STORAGE_KEY_FLAGSHIP_PLUGIN);
    }
    notifyListeners();
  } catch (err) {
    console.error('Could not save flagship plugin id:', err);
  }
};

export const getActiveFlagshipPlugin = (): ResourceItem | null => {
  const plugins = getStoredPlugins();
  if (plugins.length === 0) return null;

  const savedId = getFlagshipPluginId();
  if (savedId) {
    const found = plugins.find((p) => p.id === savedId);
    if (found) return found;
  }

  // Next check if any plugin has isPinnedFlagship === true
  const explicitlyPinned = plugins.find((p) => p.isPinnedFlagship);
  if (explicitlyPinned) return explicitlyPinned;

  // Otherwise return the first plugin in the catalog
  return plugins[0] || null;
};

export const saveStoredPlugins = (plugins: ResourceItem[]) => {
  try {
    localStorage.setItem(STORAGE_KEY_PLUGINS, JSON.stringify(plugins));
    notifyListeners();
  } catch (err) {
    console.error('Could not save plugins to localStorage:', err);
  }
};

export const getStoredCourses = (): CourseTrack[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_COURSES);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        const parsedCourses: CourseTrack[] = parsed.map((item) => {
          const defaultTrack = COURSE_TRACKS.find((c) => c.id === item.id);
          if (defaultTrack) {
            return {
              ...defaultTrack,
              ...item,
              fullCurriculum: item.fullCurriculum || defaultTrack.fullCurriculum,
              whatYouWillLearn: item.whatYouWillLearn || defaultTrack.whatYouWillLearn,
              portfolioImages: item.portfolioImages || defaultTrack.portfolioImages,
              targetWhoIsFor: item.targetWhoIsFor || defaultTrack.targetWhoIsFor,
              detailedDescription: item.detailedDescription || defaultTrack.detailedDescription,
              inDevelopment: item.inDevelopment !== undefined ? item.inDevelopment : defaultTrack.inDevelopment,
              developmentStatusNote: item.developmentStatusNote || defaultTrack.developmentStatusNote
            };
          }
          return item;
        });

        // Also check if new default courses exist in COURSE_TRACKS that are not in parsed
        const existingIds = new Set(parsedCourses.map((c) => c.id));
        const missingDefaults = COURSE_TRACKS.filter((c) => !existingIds.has(c.id));

        return [...parsedCourses, ...missingDefaults];
      }
    }
  } catch (err) {
    console.warn('Could not read stored courses:', err);
  }
  return [...COURSE_TRACKS];
};

export const saveStoredCourses = (courses: CourseTrack[]) => {
  try {
    localStorage.setItem(STORAGE_KEY_COURSES, JSON.stringify(courses));
    notifyListeners();
  } catch (err) {
    console.error('Could not save courses to localStorage:', err);
  }
};

let runtimeGoogleSheetUrl: string | null = null;

export const getStoredGoogleSheetUrl = (): string => {
  if (runtimeGoogleSheetUrl) return runtimeGoogleSheetUrl;
  try {
    return localStorage.getItem(STORAGE_KEY_SHEET_URL) || SITE_CONFIG.defaultGoogleSheetUrl || '';
  } catch {
    return SITE_CONFIG.defaultGoogleSheetUrl || '';
  }
};

export const setRuntimeGoogleSheetUrl = (url: string) => {
  runtimeGoogleSheetUrl = url.trim();
  saveStoredGoogleSheetUrl(url.trim());
};

export const saveStoredGoogleSheetUrl = (url: string) => {
  try {
    localStorage.setItem(STORAGE_KEY_SHEET_URL, url.trim());
  } catch (err) {
    console.error('Could not save Google Sheet URL:', err);
  }
};

export const getLastSyncTime = (): string | null => {
  try {
    return localStorage.getItem(STORAGE_KEY_LAST_SYNC);
  } catch {
    return null;
  }
};

export const resetContentToDefault = () => {
  try {
    localStorage.removeItem(STORAGE_KEY_PLUGINS);
    localStorage.removeItem(STORAGE_KEY_COURSES);
    localStorage.removeItem(STORAGE_KEY_SHEET_URL);
    localStorage.removeItem(STORAGE_KEY_LAST_SYNC);
    runtimeGoogleSheetUrl = null;
    notifyListeners();
  } catch (err) {
    console.error('Failed to reset content:', err);
  }
};

/**
 * Loads hosting config (/site-config.json) and/or hosting data (/site-data.json) if deployed on hosting
 */
export async function loadHostingConfigAndData(): Promise<{ sheetUrlFound: boolean; dataLoaded: boolean }> {
  let sheetUrlFound = false;
  let dataLoaded = false;

  // 1. Check for /site-config.json (allows setting sheet URL on hosting without rebuilding)
  try {
    const configResp = await fetch(`/site-config.json?_t=${Date.now()}`, { cache: 'no-cache' });
    if (configResp.ok) {
      const config = await configResp.json();
      if (config && typeof config.googleSheetUrl === 'string' && config.googleSheetUrl.trim()) {
        const url = config.googleSheetUrl.trim();
        runtimeGoogleSheetUrl = url;
        saveStoredGoogleSheetUrl(url);
        sheetUrlFound = true;
      }
    }
  } catch {
    // Standard if file is empty or unreachable
  }

  // 2. Check for /site-data.json (allows deploying manual edits directly to hosting as a static file)
  try {
    const dataResp = await fetch(`/site-data.json?_t=${Date.now()}`, { cache: 'no-cache' });
    if (dataResp.ok) {
      const data = await dataResp.json();
      if (data && Array.isArray(data.plugins) && data.plugins.length > 0) {
        const current = getStoredPlugins();
        const merged = [...current];
        for (const p of data.plugins) {
          const idx = merged.findIndex(
            (item) => item.title.toLowerCase().trim() === p.title.toLowerCase().trim()
          );
          if (idx >= 0) {
            merged[idx] = { ...merged[idx], ...p, id: merged[idx].id };
          } else {
            merged.push(p);
          }
        }
        saveStoredPlugins(merged);
        dataLoaded = true;
      }
      if (data && Array.isArray(data.courses) && data.courses.length > 0) {
        const current = getStoredCourses();
        const merged = [...current];
        for (const c of data.courses) {
          const idx = merged.findIndex(
            (item) => item.title.toLowerCase().trim() === c.title.toLowerCase().trim()
          );
          if (idx >= 0) {
            merged[idx] = { ...merged[idx], ...c, id: merged[idx].id };
          } else {
            merged.push(c);
          }
        }
        saveStoredCourses(merged);
        dataLoaded = true;
      }
    }
  } catch {
    // Standard if site-data.json is not present on hosting
  }

  return { sheetUrlFound, dataLoaded };
}

/**
 * Export current plugins and courses as site-data.json for hosting
 */
export function exportSiteDataJsonFile() {
  const data = {
    generatedAt: new Date().toISOString(),
    plugins: getStoredPlugins(),
    courses: getStoredCourses()
  };
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'site-data.json';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Export site-config.json with the provided or stored Google Sheet URL
 */
export function exportSiteConfigJsonFile(sheetUrl?: string) {
  const targetUrl = sheetUrl || getStoredGoogleSheetUrl();
  const config = {
    googleSheetUrl: targetUrl,
    autoRefreshIntervalSeconds: SITE_CONFIG.autoRefreshIntervalSeconds || 60,
    comment: "Положите этот файл в корень сайта на хостинге (рядом с index.html). Все посетители будут автоматически получать плагины из этой таблицы!"
  };
  const blob = new Blob([JSON.stringify(config, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'site-config.json';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// Simple CSV parser supporting quotes
function parseCSV(text: string): string[][] {
  const lines: string[][] = [];
  let row: string[] = [];
  let current = '';
  let insideQuote = false;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const nextChar = text[i + 1];

    if (char === '"') {
      if (insideQuote && nextChar === '"') {
        current += '"';
        i++;
      } else {
        insideQuote = !insideQuote;
      }
    } else if (char === ',' && !insideQuote) {
      row.push(current.trim());
      current = '';
    } else if ((char === '\r' || char === '\n') && !insideQuote) {
      if (char === '\r' && nextChar === '\n') i++;
      row.push(current.trim());
      if (row.some((cell) => cell.length > 0)) {
        lines.push(row);
      }
      row = [];
      current = '';
    } else {
      current += char;
    }
  }

  if (current.length > 0 || row.length > 0) {
    row.push(current.trim());
    if (row.some((cell) => cell.length > 0)) {
      lines.push(row);
    }
  }

  return lines;
}

export function extractGoogleSheetId(input: string): string | null {
  if (!input) return null;
  const match = input.match(/\/d\/([a-zA-Z0-9-_]+)/);
  if (match && match[1]) return match[1];
  // If user pasted pure ID directly:
  if (/^[a-zA-Z0-9-_]{20,}$/.test(input.trim())) {
    return input.trim();
  }
  return null;
}

/**
 * Fetch and parse a sheet by name or gid with anti-cache query param
 */
async function fetchSheetCSV(sheetId: string, sheetParam: string): Promise<string[][]> {
  // Anti-cache query parameter ensures neither browser nor CDN serves stale spreadsheet data
  const url = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:csv&${sheetParam}&_t=${Date.now()}`;
  const resp = await fetch(url, { cache: 'no-cache' });
  if (!resp.ok) {
    throw new Error(`Ошибка загрузки таблицы: HTTP ${resp.status}`);
  }
  const text = await resp.text();
  return parseCSV(text);
}

type ItemSoftware = 'revit' | 'autocad' | 'archicad' | 'twinmotion' | 'scripts';

/**
 * Normalizes software name into supported key
 */
function normalizeSoftware(val: string): { key: ItemSoftware; label: string } {
  const low = (val || '').toLowerCase().trim();
  if (low.includes('autocad') || low.includes('автокад') || low.includes('кад')) {
    return { key: 'autocad', label: 'AutoCAD' };
  }
  if (low.includes('revit') || low.includes('ревит')) {
    return { key: 'revit', label: 'Revit' };
  }
  if (low.includes('archi') || low.includes('архикад')) {
    return { key: 'archicad', label: 'Archicad' };
  }
  if (low.includes('twin') || low.includes('твин')) {
    return { key: 'twinmotion', label: 'Twinmotion' };
  }
  if (low.includes('dynamo') || low.includes('динамо') || low.includes('скрипт') || low.includes('script')) {
    return { key: 'scripts', label: 'Dynamo / Скрипты' };
  }
  return { key: 'autocad', label: val || 'AutoCAD' };
}

/**
 * Synchronize with Google Sheet
 */
export async function syncWithGoogleSheet(
  urlInput?: string,
  mode: 'merge' | 'replace' = 'merge'
): Promise<{
  success: boolean;
  message: string;
  pluginsCount: number;
  coursesCount: number;
}> {
  const targetUrl = urlInput || getStoredGoogleSheetUrl();
  const sheetId = extractGoogleSheetId(targetUrl);

  if (!sheetId) {
    return {
      success: false,
      message: 'Некорректная ссылка на Google Таблицу. Убедитесь, что ссылка содержит адрес вида https://docs.google.com/spreadsheets/d/...',
      pluginsCount: 0,
      coursesCount: 0
    };
  }

  try {
    let parsedPlugins: ResourceItem[] = [];
    let parsedCourses: CourseTrack[] = [];

    // Attempt 1: Fetch Sheet named "Плагины" or gid=0
    let pluginsRows: string[][] = [];
    try {
      pluginsRows = await fetchSheetCSV(sheetId, 'sheet=Плагины');
    } catch {
      // Fallback to sheet 1 (gid=0)
      pluginsRows = await fetchSheetCSV(sheetId, 'gid=0');
    }

    if (pluginsRows.length > 1) {
      // Skip header row
      for (let i = 1; i < pluginsRows.length; i++) {
        const row = pluginsRows[i];
        const title = row[0]?.trim();
        if (!title) continue;

        const softwareInfo = normalizeSoftware(row[1] || 'AutoCAD');
        const category = row[2]?.trim() || 'LISP-плагин';
        const version = row[3]?.trim() || 'AutoCAD (все версии)';
        const description = row[4]?.trim() || '';
        
        // Benefits can be columns 5, 6, 7 or separated by semicolon
        const benefits: string[] = [];
        if (row[5]) benefits.push(row[5].trim());
        if (row[6]) benefits.push(row[6].trim());
        if (row[7]) benefits.push(row[7].trim());

        const fileSize = row[8]?.trim() || '~10 KB';
        const fileFormat = row[9]?.trim() || '.lsp';
        const downloadUrl = row[10]?.trim() || '';
        const videoTutorialUrl = row[11]?.trim() || '';
        const inDevRaw = (row[12] || '').toLowerCase().trim();
        const inDevelopment = inDevRaw === 'да' || inDevRaw === 'yes' || inDevRaw === 'true' || inDevRaw === '1';

        parsedPlugins.push({
          id: `sheet-plugin-${i}-${Date.now().toString().slice(-4)}`,
          title,
          software: softwareInfo.key,
          softwareLabel: softwareInfo.label,
          category,
          version,
          description,
          benefits: benefits.length > 0 ? benefits : ['Ускорение работы', 'Готовое решение для проекта', 'Проверенная надежность'],
          downloadsCount: Math.floor(Math.random() * 500) + 800,
          fileSize,
          fileFormat,
          isFree: true,
          downloadUrl: downloadUrl || undefined,
          videoTutorialUrl: videoTutorialUrl || undefined,
          inDevelopment
        });
      }
    }

    // Attempt 2: Fetch Sheet named "Курсы" or gid=1
    let coursesRows: string[][] = [];
    try {
      coursesRows = await fetchSheetCSV(sheetId, 'sheet=Курсы');
    } catch {
      // If no tab "Курсы", try gid=1
      try {
        coursesRows = await fetchSheetCSV(sheetId, 'gid=1');
      } catch {
        // Leave courses unchanged if not found
      }
    }

    if (coursesRows.length > 1) {
      for (let j = 1; j < coursesRows.length; j++) {
        const row = coursesRows[j];
        const title = row[0]?.trim();
        if (!title) continue;

        const softwareInfo = normalizeSoftware(row[1] || 'Revit');
        const targetAudience = row[2]?.trim() || 'Начинающие';
        const duration = row[3]?.trim() || '20 часов';
        const lessonsCount = row[4]?.trim() || '20 уроков';
        const description = row[5]?.trim() || '';

        // Modules from columns 6, 7, 8, 9 or split by newline/semicolon
        const modules: string[] = [];
        if (row[6]) modules.push(row[6].trim());
        if (row[7]) modules.push(row[7].trim());
        if (row[8]) modules.push(row[8].trim());
        if (row[9]) modules.push(row[9].trim());

        const videoPresentationUrl = row[10]?.trim() || '';
        const customCourseUrl = row[11]?.trim() || '';
        const bannerImage = row[12]?.trim() || 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=800&q=80';
        const freeVideosPlatform = row[13]?.trim() || 'Уроки на Rutube, VK и Telegram';

        parsedCourses.push({
          id: `sheet-course-${j}-${Date.now().toString().slice(-4)}`,
          title,
          software: softwareInfo.key as any,
          softwareLabel: softwareInfo.label,
          targetAudience,
          duration,
          lessonsCount,
          description,
          modules: modules.length > 0 ? modules : ['Модуль 1: Базовые инструменты', 'Модуль 2: Практика на реальном проекте'],
          freeVideosPlatform,
          boostyExclusiveUrl: customCourseUrl || 'https://boosty.to/architectdigitalhub?share=ios_blog_link',
          bannerImage,
          videoPresentationUrl: videoPresentationUrl || undefined,
          customCourseUrl: customCourseUrl || undefined
        });
      }
    }

    if (parsedPlugins.length > 0) {
      if (mode === 'merge') {
        const current = getStoredPlugins();
        const merged = [...current];
        for (const newItem of parsedPlugins) {
          const idx = merged.findIndex(
            (p) => p.title.toLowerCase().trim() === newItem.title.toLowerCase().trim()
          );
          if (idx >= 0) {
            merged[idx] = { ...merged[idx], ...newItem, id: merged[idx].id };
          } else {
            merged.push(newItem);
          }
        }
        saveStoredPlugins(merged);
      } else {
        saveStoredPlugins(parsedPlugins);
      }
    }

    if (parsedCourses.length > 0) {
      if (mode === 'merge') {
        const current = getStoredCourses();
        const merged = [...current];
        for (const newItem of parsedCourses) {
          const idx = merged.findIndex(
            (c) => c.title.toLowerCase().trim() === newItem.title.toLowerCase().trim()
          );
          if (idx >= 0) {
            merged[idx] = { ...merged[idx], ...newItem, id: merged[idx].id };
          } else {
            merged.push(newItem);
          }
        }
        saveStoredCourses(merged);
      } else {
        saveStoredCourses(parsedCourses);
      }
    }

    saveStoredGoogleSheetUrl(targetUrl);
    localStorage.setItem(STORAGE_KEY_LAST_SYNC, new Date().toLocaleString('ru-RU'));

    return {
      success: true,
      message: `Успешно загружено! Плагинов: ${parsedPlugins.length}, Курсов: ${parsedCourses.length} (Режим: ${mode === 'merge' ? 'объединение' : 'полная замена'})`,
      pluginsCount: parsedPlugins.length,
      coursesCount: parsedCourses.length
    };
  } catch (error: any) {
    console.error('Google Sheet sync error:', error);
    return {
      success: false,
      message: `Не удалось синхронизировать: ${error.message || 'Проверьте, открыт ли доступ к таблице по ссылке ("Все, у кого есть ссылка - Читатель")'}`,
      pluginsCount: 0,
      coursesCount: 0
    };
  }
}

/**
 * Generate all current plugins formatted as TSV for pasting into Google Sheets (Ctrl+V)
 */
export function getPluginsAsSheetTSV(): string {
  const plugins = getStoredPlugins();
  const header = [
    'Название плагина',
    'Программа (AutoCAD / Revit / Archicad / Twinmotion / Dynamo)',
    'Категория',
    'Версия софта',
    'Краткое описание',
    'Преимущество 1',
    'Преимущество 2',
    'Преимущество 3',
    'Размер файла',
    'Формат файла',
    'Ссылка на скачивание (Яндекс/Google/DropBox)',
    'Ссылка на видеоурок (Rutube/VK)',
    'В разработке? (Да/Нет)'
  ].join('\t');

  const rows = plugins.map((p) => [
    p.title,
    p.softwareLabel || p.software,
    p.category,
    p.version,
    p.description.replace(/[\r\n]+/g, ' '),
    p.benefits[0] || '',
    p.benefits[1] || '',
    p.benefits[2] || '',
    p.fileSize,
    p.fileFormat,
    p.downloadUrl || '',
    p.videoTutorialUrl || '',
    p.inDevelopment ? 'Да' : 'Нет'
  ].join('\t'));

  return [header, ...rows].join('\n');
}

/**
 * Generate all current courses formatted as TSV for pasting into Google Sheets
 */
export function getCoursesAsSheetTSV(): string {
  const courses = getStoredCourses();
  const header = [
    'Название курса',
    'Программа',
    'Уровень',
    'Длительность',
    'Количество уроков',
    'Краткое описание',
    'Модуль 1',
    'Модуль 2',
    'Модуль 3',
    'Модуль 4',
    'Видео-презентация',
    'Ссылка на Boosty / Обучение',
    'Ссылка на обложку (баннер)',
    'Где смотреть бесплатные уроки'
  ].join('\t');

  const rows = courses.map((c) => [
    c.title,
    c.softwareLabel || c.software,
    c.targetAudience,
    c.duration,
    c.lessonsCount,
    c.description.replace(/[\r\n]+/g, ' '),
    c.modules[0] || '',
    c.modules[1] || '',
    c.modules[2] || '',
    c.modules[3] || '',
    c.videoPresentationUrl || '',
    c.boostyExclusiveUrl || c.customCourseUrl || '',
    c.bannerImage || '',
    c.freeVideosPlatform
  ].join('\t'));

  return [header, ...rows].join('\n');
}
