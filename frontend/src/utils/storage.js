/**
 * Safe localStorage utilities that guard against "undefined", "null", or malformed JSON
 */

export function getStoredJSON(key, fallback = {}) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw || raw === "undefined" || raw === "null") {
      return fallback;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.warn(`[Storage] Failed to parse key "${key}":`, err);
    return fallback;
  }
}

export function setStoredJSON(key, value) {
  try {
    if (value === undefined || value === null) {
      localStorage.removeItem(key);
    } else {
      localStorage.setItem(key, JSON.stringify(value));
    }
  } catch (err) {
    console.error(`[Storage] Failed to set key "${key}":`, err);
  }
}
