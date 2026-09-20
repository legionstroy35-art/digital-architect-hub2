// Admin authentication service
const STORAGE_KEY_ADMIN_LOGGED_IN = 'archhub_is_admin_logged_in_v1';
const STORAGE_KEY_ADMIN_PASSWORD = 'archhub_admin_password_v1';
const DEFAULT_PASSWORD = '2026';

type AuthListener = (isLoggedIn: boolean) => void;
const listeners: Set<AuthListener> = new Set();

export const subscribeToAdminAuth = (listener: AuthListener) => {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
};

const notifyListeners = (isLoggedIn: boolean) => {
  listeners.forEach((fn) => {
    try {
      fn(isLoggedIn);
    } catch (e) {
      console.error('Error in auth listener:', e);
    }
  });
};

export const getAdminPassword = (): string => {
  try {
    const custom = localStorage.getItem(STORAGE_KEY_ADMIN_PASSWORD);
    if (custom && custom.trim().length > 0) {
      return custom.trim();
    }
  } catch (e) {
    console.warn('Could not read admin password:', e);
  }
  return DEFAULT_PASSWORD;
};

export const setAdminPassword = (newPassword: string): boolean => {
  try {
    if (!newPassword || newPassword.trim().length < 3) {
      return false;
    }
    localStorage.setItem(STORAGE_KEY_ADMIN_PASSWORD, newPassword.trim());
    return true;
  } catch (e) {
    console.error('Could not save new admin password:', e);
    return false;
  }
};

export const isAdminLoggedIn = (): boolean => {
  try {
    return localStorage.getItem(STORAGE_KEY_ADMIN_LOGGED_IN) === 'true';
  } catch {
    return false;
  }
};

export const loginAdmin = (passwordAttempt: string): boolean => {
  const currentPassword = getAdminPassword();
  if (passwordAttempt.trim() === currentPassword) {
    try {
      localStorage.setItem(STORAGE_KEY_ADMIN_LOGGED_IN, 'true');
    } catch (e) {
      console.error('Could not store admin login state:', e);
    }
    notifyListeners(true);
    return true;
  }
  return false;
};

export const logoutAdmin = () => {
  try {
    localStorage.removeItem(STORAGE_KEY_ADMIN_LOGGED_IN);
  } catch (e) {
    console.error('Could not clear admin login state:', e);
  }
  notifyListeners(false);
};
