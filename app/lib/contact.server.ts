// Server-only helpers for the /contact form action: input validation,
// sanitization, in-memory IP rate limit. The mail transport itself stays in
// the route for now; once we move to Resend it will live here too.

const SPAM_WORDS = [
  "crypto",
  "bitcoin",
  "casino",
  "viagra",
  "forex",
  "investment",
  "lottery",
  "prize",
  "winner",
].join("|")

const SPAM_REGEX = new RegExp(`\\b(${SPAM_WORDS})\\b`, "i")
const URL_REGEX = /\b(?:https?|ftp):\/\/|www\./g
const EMAIL_REGEX = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/
const EMAIL_DETECT_REGEX = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g

export function isValidEmail(email: string) {
  return EMAIL_REGEX.test(email)
}

export function sanitizeInput(input: string) {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;")
}

export function validateMessage(message: string) {
  if (message.length < 10 || message.length > 1000) return false
  if (message.includes("http") || message.includes("www.")) return false
  if (SPAM_REGEX.test(message)) return false
  if ((message.match(URL_REGEX) || []).length > 0) return false
  if ((message.match(EMAIL_DETECT_REGEX) || []).length > 1) return false
  return true
}

// In-memory rate limit. Per-IP, sliding window of 1 hour, 5 submissions max.
// Survives only within a single serverless instance — adequate against the
// mass-spam pattern but not a hard guarantee. For a stronger ceiling, switch
// to Vercel KV or move the mail send behind a third-party (Resend) that
// enforces its own quota.
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000
const RATE_LIMIT_MAX = 5
const submissionsByIp = new Map<string, number[]>()

export function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for")
  if (forwarded) return forwarded.split(",")[0].trim()
  const real = request.headers.get("x-real-ip")
  if (real) return real
  return "unknown"
}

export function checkRateLimit(ip: string): boolean {
  const now = Date.now()
  const cutoff = now - RATE_LIMIT_WINDOW_MS
  const recent = (submissionsByIp.get(ip) ?? []).filter((t) => t > cutoff)
  if (recent.length >= RATE_LIMIT_MAX) {
    submissionsByIp.set(ip, recent)
    return false
  }
  recent.push(now)
  submissionsByIp.set(ip, recent)
  return true
}
