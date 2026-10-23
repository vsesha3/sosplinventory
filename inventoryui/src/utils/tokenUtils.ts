// ── Auth storage ──────────────────────────────────────────────────────────────
// Token + user live in sessionStorage: they are cleared when the browser is closed,
// so the user must log in again (no silent auto-login with a stale JWT).

const TOKEN_KEY = 'token';
const USER_KEY  = 'user';

export const getToken = (): string | null => sessionStorage.getItem(TOKEN_KEY);

export const setAuth = (token: string, user?: unknown): void => {
  sessionStorage.setItem(TOKEN_KEY, token);
  if (user !== undefined) sessionStorage.setItem(USER_KEY, JSON.stringify(user));
};

export const getUser = <T = any>(): T | Record<string, never> => {
  try { return JSON.parse(sessionStorage.getItem(USER_KEY) || '{}'); }
  catch { return {}; }
};

// Clears session auth and any token left in localStorage by older builds
export const clearAuth = (): void => {
  sessionStorage.removeItem(TOKEN_KEY);
  sessionStorage.removeItem(USER_KEY);
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
};

// ── JWT helpers ───────────────────────────────────────────────────────────────

export const parseJwt = (token: string) => {
  try {
    // JWT payload is base64url — convert to base64 before atob
    const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
    const padded = base64 + '='.repeat((4 - (base64.length % 4)) % 4);
    return JSON.parse(atob(padded));
  } catch {
    return null;
  }
};

// Expiry time in ms, or null if the token has no readable `exp`
export const getTokenExpiry = (token: string): number | null => {
  const payload = parseJwt(token);
  return payload?.exp ? payload.exp * 1000 : null;
};

export const isTokenExpired = (token: string): boolean => {
  const expiry = getTokenExpiry(token);
  return expiry != null && Date.now() >= expiry;
};

// Token present and not expired (no `exp` → trusted until the API returns 401)
export const hasValidToken = (): boolean => {
  const token = getToken();
  return !!token && !isTokenExpired(token);
};

// Log out and send the user to the login page
export const redirectToLogin = (): void => {
  clearAuth();
  if (window.location.pathname !== '/login') window.location.href = '/login';
};
