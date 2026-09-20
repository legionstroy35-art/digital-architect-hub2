import { NotificationSettings, FeedbackSubmission } from '../types';

const NOTIF_STORAGE_KEY = 'archhub_notification_settings';

export const DEFAULT_NOTIF_SETTINGS: NotificationSettings = {
  telegramEnabled: false,
  telegramBotToken: '',
  telegramChatId: '',
  emailEnabled: false,
  web3FormsKey: '',
  targetEmail: '',
  maxWebhookEnabled: false,
  maxWebhookUrl: ''
};

export function getNotificationSettings(): NotificationSettings {
  try {
    const raw = localStorage.getItem(NOTIF_STORAGE_KEY);
    if (!raw) return DEFAULT_NOTIF_SETTINGS;
    return { ...DEFAULT_NOTIF_SETTINGS, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_NOTIF_SETTINGS;
  }
}

export function saveNotificationSettings(settings: NotificationSettings): void {
  localStorage.setItem(NOTIF_STORAGE_KEY, JSON.stringify(settings));
}

/**
 * Sends notifications to configured channels (Telegram, Email, MAX webhook)
 */
export async function sendFeedbackNotifications(submission: FeedbackSubmission): Promise<{
  telegram: boolean;
  email: boolean;
  max: boolean;
}> {
  const settings = getNotificationSettings();
  const results = { telegram: false, email: false, max: false };

  // 1. TELEGRAM
  if (settings.telegramEnabled && settings.telegramBotToken && settings.telegramChatId) {
    try {
      const text = `🔔 *Новая заявка с сайта ArchHub!*\n\n` +
        `👤 *Имя:* ${submission.name || 'Не указано'}\n` +
        `📱 *Контакт:* ${submission.contact}\n` +
        `🛠 *Программа:* ${submission.software}\n` +
        `🏷 *Тема:* ${submission.topic === 'plugin_idea' ? '💡 Идея плагина' : submission.topic === 'question' ? '❓ Вопрос' : '🎓 Курс'}\n` +
        `📅 *Дата:* ${submission.date}\n\n` +
        `💬 *Сообщение:*\n${submission.message}`;

      const res = await fetch(`https://api.telegram.org/bot${settings.telegramBotToken.trim()}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: settings.telegramChatId.trim(),
          text,
          parse_mode: 'Markdown'
        })
      });

      if (res.ok) results.telegram = true;
    } catch (err) {
      console.warn('Telegram notification failed:', err);
    }
  }

  // 2. EMAIL (Web3Forms free relay)
  if (settings.emailEnabled && settings.web3FormsKey) {
    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json'
        },
        body: JSON.stringify({
          access_key: settings.web3FormsKey.trim(),
          subject: `[ArchHub] Новое сообщение от ${submission.name} (${submission.software})`,
          from_name: 'ArchHub Сайт',
          name: submission.name,
          contact: submission.contact,
          software: submission.software,
          topic: submission.topic,
          message: submission.message,
          date: submission.date
        })
      });

      if (res.ok) results.email = true;
    } catch (err) {
      console.warn('Email notification failed:', err);
    }
  }

  // 3. MAX / CUSTOM WEBHOOK
  if (settings.maxWebhookEnabled && settings.maxWebhookUrl) {
    try {
      const res = await fetch(settings.maxWebhookUrl.trim(), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event: 'new_feedback',
          author: submission.name,
          contact: submission.contact,
          software: submission.software,
          text: submission.message,
          timestamp: submission.date
        })
      });

      if (res.ok) results.max = true;
    } catch (err) {
      console.warn('MAX webhook notification failed:', err);
    }
  }

  return results;
}

/**
 * Send a test notification to verify credentials
 */
export async function sendTestNotification(type: 'telegram' | 'email' | 'max'): Promise<{
  success: boolean;
  message: string;
}> {
  const settings = getNotificationSettings();

  if (type === 'telegram') {
    if (!settings.telegramBotToken || !settings.telegramChatId) {
      return { success: false, message: 'Укажите Token бота и Chat ID Telegram' };
    }
    try {
      const res = await fetch(`https://api.telegram.org/bot${settings.telegramBotToken.trim()}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: settings.telegramChatId.trim(),
          text: '✅ *Тестовое уведомление ArchHub*\n\nВаш Telegram-бот успешно подключен к сайту! Сюда будут приходить все входящие заявки и идеи плагинов.',
          parse_mode: 'Markdown'
        })
      });
      const data = await res.json();
      if (res.ok && data.ok) {
        return { success: true, message: 'Тестовое сообщение успешно доставлено в ваш Telegram!' };
      } else {
        return { success: false, message: `Ошибка Telegram: ${data.description || 'Проверьте токен и ID'}` };
      }
    } catch (e: any) {
      return { success: false, message: `Сетевая ошибка: ${e?.message || 'Не удалось отправить'}` };
    }
  }

  if (type === 'email') {
    if (!settings.web3FormsKey) {
      return { success: false, message: 'Укажите бесплатный ключ доступа Web3Forms' };
    }
    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json'
        },
        body: JSON.stringify({
          access_key: settings.web3FormsKey.trim(),
          subject: '[ArchHub] Тестовое уведомление на почту',
          from_name: 'ArchHub',
          message: 'Поздравляем! Форма сайта успешно настроена на отправку уведомлений на вашу почту.'
        })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        return { success: true, message: 'Тестовое письмо успешно отправлено на вашу почту!' };
      } else {
        return { success: false, message: `Ошибка Web3Forms: ${data.message || 'Проверьте ключ'}` };
      }
    } catch (e: any) {
      return { success: false, message: `Сетевая ошибка: ${e?.message || 'Не удалось отправить'}` };
    }
  }

  if (type === 'max') {
    if (!settings.maxWebhookUrl) {
      return { success: false, message: 'Укажите URL вебхука мессенджера MAX' };
    }
    try {
      const res = await fetch(settings.maxWebhookUrl.trim(), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event: 'test_notification',
          text: '✅ Тестовое уведомление с сайта ArchHub в мессенджер MAX'
        })
      });
      if (res.ok) {
        return { success: true, message: 'Тестовый вебхук успешно отправлен!' };
      } else {
        return { success: false, message: `Сервер MAX вернул статус ${res.status}` };
      }
    } catch (e: any) {
      return { success: false, message: `Сетевая ошибка: ${e?.message || 'Не удалось отправить'}` };
    }
  }

  return { success: false, message: 'Неизвестный тип' };
}
