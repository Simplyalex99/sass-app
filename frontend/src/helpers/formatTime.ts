export const formatTime = (seconds: number) => {
  if (seconds < 60) {
    return `${seconds} second${seconds !== 1 ? 's' : ''}`
  } else if (seconds < 3600) {
    const minutes = (seconds / 60).toFixed(1)
    return `${minutes} minute${minutes !== '1.0' ? 's' : ''}`
  } else {
    const hours = (seconds / 3600).toFixed(1)
    return `${hours} hour${hours !== '1.0' ? 's' : ''}`
  }
}
