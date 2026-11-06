export function isValidUrl(v) {
  try { const u = new URL(v.trim()); return ['http:', 'https:'].includes(u.protocol) && u.hostname.includes('.') } catch { return false }
}
export const isValidEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim())
export const hostOf = (url) => { try { return new URL(url).hostname } catch { return url } }
export const formatDate = (iso) => new Date(iso).toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' })
export const inRange = (n, [min, max]) => n >= min && n <= max
export const scoreTone = (s) => (s >= 90 ? 'blu' : s >= 70 ? 'grn' : 'amb')
