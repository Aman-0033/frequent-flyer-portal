/**
 * Security XSS Sanitization Utility
 * Ticket: ENG-163087
 *
 * Strips script tags, style tags, HTML tags, and dangerous javascript attributes
 * before committing user-supplied data to state or persistent storage.
 */
export function sanitizeInput(input) {
  if (typeof input !== 'string') {
    return input;
  }

  return input
    // Strip script blocks and their contents
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    // Strip style blocks and their contents
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
    // Strip all remaining HTML tags
    .replace(/<[^>]+>/g, '')
    // Strip remaining encoded or leftover bracket remnants
    .replace(/[<>]/g, '')
    .trim();
}

export default sanitizeInput;
