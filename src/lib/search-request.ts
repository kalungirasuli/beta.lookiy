import { api } from './client-api';

export function newSearchSession() {
  if (globalThis.crypto?.randomUUID) return globalThis.crypto.randomUUID();
  const bytes = new Uint8Array(16);
  if (globalThis.crypto?.getRandomValues) globalThis.crypto.getRandomValues(bytes);
  else for (let i = 0; i < bytes.length; i++) bytes[i] = Math.floor(Math.random() * 256);
  bytes[6] = (bytes[6] & 15) | 64; bytes[8] = (bytes[8] & 63) | 128;
  const hex = Array.from(bytes, byte => byte.toString(16).padStart(2, '0')).join('');
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

/** Bound both response headers and body parsing, even if a transport stalls. */
export async function searchRequest<T>(path: string, signal: AbortSignal, timeoutMs = 8000): Promise<T> {
  const controller = new AbortController();
  let timer: ReturnType<typeof setTimeout> | undefined;
  let abort: () => void = () => {};
  const stopped = new Promise<never>((_, reject) => {
    abort = () => { controller.abort(); reject(new Error('Search cancelled.')); };
    signal.addEventListener('abort', abort, { once: true });
    timer = setTimeout(() => { controller.abort(); reject(new Error('Search took too long. Please retry.')); }, timeoutMs);
    if (signal.aborted) abort();
  });
  try {
    if (signal.aborted) return await stopped;
    return await Promise.race([api<T>(path, { signal: controller.signal }), stopped]);
  } finally { clearTimeout(timer); signal.removeEventListener('abort', abort); }
}
