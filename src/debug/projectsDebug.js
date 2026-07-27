export function getImgDiagnostics(value) {
  const isString = typeof value === 'string'
  const trimmed = isString ? value.trim() : ''
  return {
    rawType: value === null ? 'null' : typeof value,
    isString,
    trimmed,
    trimmedLength: trimmed.length,
    isValidUrl: /^https?:\/\//i.test(trimmed),
  }
}

