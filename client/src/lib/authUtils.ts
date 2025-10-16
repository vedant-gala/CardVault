// Auth utility functions (from blueprint: javascript_log_in_with_replit)
export function isUnauthorizedError(error: Error): boolean {
  return /^401: .*Unauthorized/.test(error.message);
}
