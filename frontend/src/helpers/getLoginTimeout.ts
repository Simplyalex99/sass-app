const MAX_TIMEOUT_IN_SECONDS = 16384
export const getLoginTimeout = (attempts: number) => {
  return Math.min(2 ** attempts, MAX_TIMEOUT_IN_SECONDS) // Exponential backoff, max 60s 60000
}
