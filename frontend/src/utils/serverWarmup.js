import { BACKEND_URL } from '../constants/config';

const WARMUP_TIMEOUT_MS = 12000;

export async function warmUpBackend(externalSignal) {
  const controller = new AbortController();
  const abortFromExternal = () => controller.abort();

  if (externalSignal) {
    if (externalSignal.aborted) return false;
    externalSignal.addEventListener('abort', abortFromExternal, { once: true });
  }

  const timer = setTimeout(() => controller.abort(), WARMUP_TIMEOUT_MS);

  try {
    const response = await fetch(`${BACKEND_URL}/room-state`, {
      method: 'GET',
      signal: controller.signal,
    });
    return response.ok;
  } catch (e) {
    const isCancel = e?.name === 'AbortError' || String(e?.message || '').toLowerCase().includes('cancel');
    if (!isCancel) {
      console.warn('[WARMUP] Sunucu on isitma istegi basarisiz:', e?.message ?? e);
    }
    return false;
  } finally {
    clearTimeout(timer);
    if (externalSignal) {
      externalSignal.removeEventListener('abort', abortFromExternal);
    }
  }
}
