import { CourseWaitlistEntry } from '../types';
import { sendFeedbackNotifications } from './notificationService';

const STORAGE_KEY_WAITLIST = 'archhub_course_waitlist_v1';

export const getCourseWaitlist = (courseId?: string): CourseWaitlistEntry[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_WAITLIST);
    if (!raw) return [];
    const list: CourseWaitlistEntry[] = JSON.parse(raw);
    if (courseId) {
      return list.filter((item) => item.courseId === courseId);
    }
    return list;
  } catch (e) {
    console.warn('Failed to load course waitlist:', e);
    return [];
  }
};

export const addCourseWaitlistEntry = async (
  courseId: string,
  courseTitle: string,
  email: string
): Promise<{ success: boolean; message: string; isDuplicate?: boolean }> => {
  const cleanEmail = email.trim().toLowerCase();
  
  // Basic email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(cleanEmail)) {
    return {
      success: false,
      message: 'Пожалуйста, укажите корректный адрес электронной почты'
    };
  }

  try {
    const currentList = getCourseWaitlist();
    
    // Check if already subscribed for this specific course
    const alreadyExists = currentList.some(
      (item) => item.courseId === courseId && item.email.toLowerCase() === cleanEmail
    );

    if (alreadyExists) {
      return {
        success: true,
        message: 'Вы уже в списке ожидания этого курса! Мы обязательно пришлем вам уведомление в день релиза.',
        isDuplicate: true
      };
    }

    const newEntry: CourseWaitlistEntry = {
      id: `waitlist-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      courseId,
      courseTitle,
      email: cleanEmail,
      date: new Date().toLocaleString('ru-RU')
    };

    currentList.unshift(newEntry);
    localStorage.setItem(STORAGE_KEY_WAITLIST, JSON.stringify(currentList.slice(0, 500)));

    // Send push notification to admin/author if channels are configured
    try {
      await sendFeedbackNotifications({
        id: newEntry.id,
        name: 'Предзапись на курс',
        contact: cleanEmail,
        topic: 'course_inquiry',
        software: courseTitle,
        message: `Новая регистрация в лист ожидания курса: "${courseTitle}". Email: ${cleanEmail}. При релизе курса отправить уведомление и промокод.`,
        date: newEntry.date
      });
    } catch (notifErr) {
      console.warn('Could not dispatch waitlist notification:', notifErr);
    }

    return {
      success: true,
      message: 'Вы успешно добавлены в лист ожидания! Мы отправим вам письмо в момент старта курса со скидкой раннего доступа.'
    };
  } catch (err) {
    console.error('Failed to save to course waitlist:', err);
    return {
      success: false,
      message: 'Произошла ошибка при сохранении. Попробуйте еще раз или напишите нам в Telegram.'
    };
  }
};

export const removeCourseWaitlistEntry = (id: string): CourseWaitlistEntry[] => {
  try {
    const current = getCourseWaitlist().filter((item) => item.id !== id);
    localStorage.setItem(STORAGE_KEY_WAITLIST, JSON.stringify(current));
    return current;
  } catch (e) {
    console.error('Failed to remove waitlist entry:', e);
    return [];
  }
};

export const clearCourseWaitlist = (courseId?: string): CourseWaitlistEntry[] => {
  try {
    if (courseId) {
      const remaining = getCourseWaitlist().filter((item) => item.courseId !== courseId);
      localStorage.setItem(STORAGE_KEY_WAITLIST, JSON.stringify(remaining));
      return remaining;
    }
    localStorage.removeItem(STORAGE_KEY_WAITLIST);
    return [];
  } catch (e) {
    console.error('Failed to clear course waitlist:', e);
    return [];
  }
};
