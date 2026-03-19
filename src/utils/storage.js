class StorageService {
  static PREFIX = 'satohash_'

  static set(key, value) {
    try {
      const serialized = JSON.stringify(value)
      // We purposefully let this bubble if storage is full/disabled
      window.localStorage.setItem(this.PREFIX + key, serialized)
    } catch (error) {
      console.warn('StorageService: Failed to save to localStorage', error)
    }
  }

  static get(key, defaultValue = null) {
    try {
      const item = window.localStorage.getItem(this.PREFIX + key)
      return item ? JSON.parse(item) : defaultValue
    } catch (error) {
      console.warn('StorageService: Failed to parse from localStorage', error)
      return defaultValue
    }
  }

  static remove(key) {
    try {
      window.localStorage.removeItem(this.PREFIX + key)
    } catch (error) {
      console.warn('StorageService: Failed to remove from localStorage', error)
    }
  }
}

export default StorageService
