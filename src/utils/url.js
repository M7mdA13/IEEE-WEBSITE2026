/**
 * Normalize a link saved from the dashboard into something safe to put in an
 * href. Admins routinely type "ieee.org" or "www.ieee.org" — without a scheme
 * the browser treats those as relative paths and navigates inside the site.
 *
 * Returns '' for anything unusable (empty, the legacy '#' placeholder, or a
 * non-http scheme such as javascript:) so callers can just do `if (url)`.
 */
export function normalizeUrl(value) {
  if (!value) return '';
  const trimmed = String(value).trim();
  if (!trimmed || trimmed === '#') return '';

  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  // Reject anything with a different scheme (javascript:, data:, mailto:, ...)
  if (/^[a-z][a-z0-9+.-]*:/i.test(trimmed)) return '';

  return `https://${trimmed}`;
}
