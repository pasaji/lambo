export const MINUTE     = 1000 * 60 // ms
export const HOUR       = 1000 * 60 * 60 // ms
export const DAY        = 1000 * 60 * 60 * 24 // ms
export const WEEK       = 1000 * 60 * 60 * 24 * 7 // ms

export function now() {
  return new Date().getTime()
}

export const timer = ({ loop = true, interval = 1000 }) => {
  let intervalId
  return {
    start: (cb) => {
      if (!intervalId) {
        clearInterval(intervalId)
      }
      intervalId = setInterval(() => {
        cb(now())
      }, interval)
    },
    stop: () => {
      clearInterval(intervalId)
    }
  }
}
