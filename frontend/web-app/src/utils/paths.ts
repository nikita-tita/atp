/**
 * Utility function to get the correct public path for assets
 * Works both in development and production (including GitHub Pages)
 */
export function getPublicPath(path: string): string {
  // Remove leading slash if present
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;

  // In Vite, import.meta.env.BASE_URL contains the base path
  const base = import.meta.env.BASE_URL;

  // Combine base with the path
  return `${base}${cleanPath}`;
}
