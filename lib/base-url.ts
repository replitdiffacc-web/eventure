// lib/base-url.ts
export function getBaseUrl() {
  // Prefer explicit public URL if you set it in Render
  if (process.env.NEXT_PUBLIC_BASE_URL) return process.env.NEXT_PUBLIC_BASE_URL;

  // Render exposes this inside the container
  if (process.env.RENDER_EXTERNAL_HOSTNAME) {
    return `https://${process.env.RENDER_EXTERNAL_HOSTNAME}`;
  }

  // In the browser, just use relative paths
  if (typeof window !== 'undefined') return '';

  // Local dev fallback
  return 'http://localhost:3000';
}
