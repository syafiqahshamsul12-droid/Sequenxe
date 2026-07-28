// Secure Frontend Admin Authentication Service
// Communicates with backend server endpoint for credential verification

export interface AdminUser {
  email: string;
  role: 'SUPER_ADMIN' | 'EDITOR';
  mfaVerified: boolean;
  expiresAt: number;
  csrfToken: string;
}

const TOKEN_KEY = 'sequenxe_admin_token_v1';
const USER_KEY = 'sequenxe_admin_user_v1';

export function getStoredAdminToken(): string | null {
  if (typeof window === 'undefined') return null;
  return sessionStorage.getItem(TOKEN_KEY);
}

export function getStoredAdminUser(): AdminUser | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = sessionStorage.getItem(USER_KEY);
    if (!raw) return null;
    const user: AdminUser = JSON.parse(raw);
    if (Date.now() > user.expiresAt) {
      clearAdminSession();
      return null;
    }
    return user;
  } catch {
    return null;
  }
}

export function clearAdminSession(): void {
  sessionStorage.removeItem(TOKEN_KEY);
  sessionStorage.removeItem(USER_KEY);
}

export async function loginAdminServer(email: string, passcode: string, mfaCode?: string): Promise<{
  success: boolean;
  user?: AdminUser;
  error?: string;
  retryAfterSeconds?: number;
}> {
  try {
    const response = await fetch('/api/admin/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password: passcode, mfaCode }),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.error || 'Authentication failed.',
        retryAfterSeconds: data.retryAfterSeconds,
      };
    }

    if (data.success && data.token && data.user) {
      sessionStorage.setItem(TOKEN_KEY, data.token);
      sessionStorage.setItem(USER_KEY, JSON.stringify(data.user));
      return {
        success: true,
        user: data.user,
      };
    }

    return {
      success: false,
      error: 'Unexpected server response.',
    };
  } catch (err: any) {
    return {
      success: false,
      error: 'Network or server error during login. Please ensure backend is active.',
    };
  }
}

export async function verifyAdminSession(): Promise<boolean> {
  const token = getStoredAdminToken();
  if (!token) return false;

  try {
    const response = await fetch('/api/admin/verify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      clearAdminSession();
      return false;
    }

    const data = await response.json();
    if (data.valid) {
      return true;
    } else {
      clearAdminSession();
      return false;
    }
  } catch {
    // If offline or dev mode fallback, keep current stored session if not expired
    const user = getStoredAdminUser();
    return !!user;
  }
}

export async function logoutAdminServer(): Promise<void> {
  const token = getStoredAdminToken();
  if (token) {
    try {
      await fetch('/api/admin/logout', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } catch {
      // Ignore network errors on logout
    }
  }
  clearAdminSession();
}
