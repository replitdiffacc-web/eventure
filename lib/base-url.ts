// lib/base-url.ts
export function getBaseUrl() {
  // Prefer explicit public URL (set this in Render env)
  if (process.env.NEXT_PUBLIC_BASE_URL) return process.env.NEXT_PUBLIC_BASE_URL;

  // On Render containers, this var exists during SSR/route handlers
  if (process.env.RENDER_EXTERNAL_HOSTNAME) {
    return `https://${process.env.RENDER_EXTERNAL_HOSTNAME}`;
  }

  // In the browser, use relative URLs
  if (typeof window !== 'undefined') return '';

  // Local dev fallback
  return 'http://localhost:3000';
}
