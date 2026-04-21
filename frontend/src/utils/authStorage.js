const AUTH_TOKEN_KEY = "aifus.auth.token";
const AUTH_MODE_KEY = "aifus.auth.mode";
const LEGACY_TOKEN_KEY = "token";

const isBrowser = typeof window !== "undefined";

const safeRead = (storage, key) => {
  if (!isBrowser || !storage) {
    return null;
  }

  try {
    return storage.getItem(key);
  } catch (_error) {
    return null;
  }
};

const safeWrite = (storage, key, value) => {
  if (!isBrowser || !storage) {
    return;
  }

  try {
    storage.setItem(key, value);
  } catch (_error) {
    // Some mobile browsers/private modes block storage writes.
  }
};

const safeRemove = (storage, key) => {
  if (!isBrowser || !storage) {
    return;
  }

  try {
    storage.removeItem(key);
  } catch (_error) {
    // Ignore storage cleanup failures on restricted browsers.
  }
};

const getLocalToken = () =>
  isBrowser
    ? safeRead(window.localStorage, AUTH_TOKEN_KEY) ||
      safeRead(window.localStorage, LEGACY_TOKEN_KEY)
    : null;

const getSessionToken = () =>
  isBrowser
    ? safeRead(window.sessionStorage, AUTH_TOKEN_KEY) ||
      safeRead(window.sessionStorage, LEGACY_TOKEN_KEY)
    : null;

export const getAuthMode = () =>
  isBrowser ? safeRead(window.sessionStorage, AUTH_MODE_KEY) : null;

export const getStoredAuth = () => {
  if (!isBrowser) {
    return { token: null, mode: "none" };
  }

  const mode = getAuthMode();

  if (mode === "session") {
    return { token: getSessionToken(), mode };
  }

  if (mode === "local") {
    return { token: getLocalToken(), mode };
  }

  if (mode === "none") {
    return { token: null, mode };
  }

  const sessionToken = getSessionToken();
  if (sessionToken) {
    safeWrite(window.sessionStorage, AUTH_TOKEN_KEY, sessionToken);
    safeRemove(window.sessionStorage, LEGACY_TOKEN_KEY);
    safeWrite(window.sessionStorage, AUTH_MODE_KEY, "session");
    return { token: sessionToken, mode: "session" };
  }

  const localToken = getLocalToken();
  if (localToken) {
    safeWrite(window.localStorage, AUTH_TOKEN_KEY, localToken);
    safeRemove(window.localStorage, LEGACY_TOKEN_KEY);
    safeWrite(window.sessionStorage, AUTH_MODE_KEY, "local");
    return { token: localToken, mode: "local" };
  }

  return { token: null, mode: "none" };
};

export const saveAuthToken = (token, remember = false) => {
  if (!isBrowser) {
    return;
  }

  if (remember) {
    safeWrite(window.localStorage, AUTH_TOKEN_KEY, token);
    safeRemove(window.localStorage, LEGACY_TOKEN_KEY);
    safeRemove(window.sessionStorage, AUTH_TOKEN_KEY);
    safeRemove(window.sessionStorage, LEGACY_TOKEN_KEY);
    safeWrite(window.sessionStorage, AUTH_MODE_KEY, "local");
    return;
  }

  safeWrite(window.sessionStorage, AUTH_TOKEN_KEY, token);
  safeRemove(window.sessionStorage, LEGACY_TOKEN_KEY);
  safeWrite(window.sessionStorage, AUTH_MODE_KEY, "session");
};

export const clearStoredAuth = () => {
  if (!isBrowser) {
    return;
  }

  const mode = getAuthMode();

  if (mode === "local") {
    safeRemove(window.localStorage, AUTH_TOKEN_KEY);
    safeRemove(window.localStorage, LEGACY_TOKEN_KEY);
  }

  safeRemove(window.sessionStorage, AUTH_TOKEN_KEY);
  safeRemove(window.sessionStorage, LEGACY_TOKEN_KEY);
  safeWrite(window.sessionStorage, AUTH_MODE_KEY, "none");
};

export const clearInvalidStoredAuth = () => {
  if (!isBrowser) {
    return;
  }

  const mode = getAuthMode();

  if (mode === "local") {
    safeRemove(window.localStorage, AUTH_TOKEN_KEY);
    safeRemove(window.localStorage, LEGACY_TOKEN_KEY);
  }

  if (mode === "session") {
    safeRemove(window.sessionStorage, AUTH_TOKEN_KEY);
    safeRemove(window.sessionStorage, LEGACY_TOKEN_KEY);
  }

  if (!mode) {
    safeRemove(window.sessionStorage, AUTH_TOKEN_KEY);
    safeRemove(window.localStorage, LEGACY_TOKEN_KEY);
  }

  safeWrite(window.sessionStorage, AUTH_MODE_KEY, "none");
};

export const AUTH_STORAGE_KEY = AUTH_TOKEN_KEY;
