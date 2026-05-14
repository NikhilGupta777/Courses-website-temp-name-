const ALLOWED_LOGIN_CALLBACK_PREFIX = "/";

const ALLOWED_IMAGE_UPLOAD_FOLDERS = new Set([
  "avatars",
  "course-thumbnails",
  "lesson-resources",
  "thumbnails",
]);

export function sanitizeLoginCallbackUrl(value: string | null | undefined, fallback = "/dashboard") {
  if (!value) return fallback;

  try {
    const decoded = decodeURIComponent(value);
    if (
      decoded.startsWith(ALLOWED_LOGIN_CALLBACK_PREFIX) &&
      !decoded.startsWith("//") &&
      !decoded.includes("\\")
    ) {
      return decoded;
    }
  } catch {
    return fallback;
  }

  return fallback;
}

export function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export function parseAllowedImageUploadFolder(value: unknown) {
  if (typeof value !== "string") return "thumbnails";
  return ALLOWED_IMAGE_UPLOAD_FOLDERS.has(value) ? value : null;
}
