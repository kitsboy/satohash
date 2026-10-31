import '@testing-library/jest-dom'

// Node >=22 defines a global `localStorage` that is undefined unless
// --localstorage-file is passed; vitest then delegates window.localStorage to it,
// so every storage-backed test dies on `Cannot read properties of undefined`.
// Install the real in-memory Storage the browser contract promises. Environment
// shim only — it changes nothing the app or the tests assert.
function installStorage(name) {
  if (typeof globalThis[name] !== 'undefined') return
  let data = new Map()
  const storage = {
    get length() {
      return data.size
    },
    clear() {
      data = new Map()
    },
    getItem(k) {
      return data.has(k) ? data.get(k) : null
    },
    key(i) {
      const keys = Array.from(data.keys())
      return i >= 0 && i < keys.length ? keys[i] : null
    },
    removeItem(k) {
      data.delete(k)
    },
    setItem(k, v) {
      data.set(k, String(v))
    }
  }
  Object.defineProperty(globalThis, name, { configurable: true, enumerable: true, value: storage })
}
installStorage('localStorage')
installStorage('sessionStorage')
