import OpenTimestamps from 'opentimestamps'

export const loadOtsFile = (buffer) => {
  try {
    return OpenTimestamps.DetachedTimestampFile.deserialize(buffer)
  } catch (e) {
    throw new Error('Invalid OTS file format.')
  }
}

const VERIFY_BASE_URL = 'https://satohash.giveabit.io'

export async function stampWithTimeout(detached, calendarUrls, timeoutMs = 30000) {
  let timer
  const timeoutPromise = new Promise((_, reject) => {
    timer = setTimeout(() => reject(new Error('OTS stamp timed out after 30s')), timeoutMs)
  })
  try {
    await Promise.race([OpenTimestamps.stamp(detached, calendarUrls), timeoutPromise])
  } finally {
    clearTimeout(timer)
  }
}
