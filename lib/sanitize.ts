import DOMPurify from "isomorphic-dompurify";

/**
 * Strip ALL HTML tags and trim.
 * Use for: name, title, company, issuer, credentialId, location, bio, etc.
 */
export function sanitizeText(input: string): string {
  // Fast path: strip tags with regex (no DOM needed for plain text)
  return input.replace(/<[^>]*>/g, "").trim();
}

/**
 * Allow a safe subset of formatting HTML.
 * Use for: job descriptions coming from webhooks/external sources.
 */
export function sanitizeHtml(input: string): string {
  return DOMPurify.sanitize(input, {
    ALLOWED_TAGS: ["p", "br", "ul", "ol", "li", "strong", "em", "h2", "h3"],
    ALLOWED_ATTR: [],
  }).trim();
}
