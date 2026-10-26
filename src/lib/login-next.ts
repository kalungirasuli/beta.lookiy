/** Keep post-login navigation on this website, including backslash/control-character URL variants. */
export function loginNext(value: string | null, fallback = '/journeys') {
  if (!value || !value.startsWith('/') || /[\\\u0000-\u0020]/.test(value)) return fallback;
  try {
    const url = new URL(value, 'https://lookiy.invalid');
    return url.origin === 'https://lookiy.invalid' ? url.pathname + url.search + url.hash : fallback;
  } catch { return fallback; }
}
