export function hasWebGL() {
  try {
    const canvas = document.createElement('canvas')
    return !!(canvas.getContext('webgl2') || canvas.getContext('webgl'))
  } catch {
    return false
  }
}

// A cheap heuristic: phones/tablets and low-core machines get a lighter scene.
export function getDeviceProfile() {
  const coarse = matchMedia('(pointer: coarse)').matches
  const lowCores = (navigator.hardwareConcurrency || 8) <= 4
  return {
    lite: coarse || lowCores,
    reducedMotion: matchMedia('(prefers-reduced-motion: reduce)').matches,
  }
}

// Day between 07:00 and 18:59 in the visitor's local time — drives the window and lighting.
// Preview either look with ?time=day or ?time=night.
export function isDay() {
  const forced = new URLSearchParams(location.search).get('time')
  if (forced) return forced !== 'night'
  const h = new Date().getHours()
  return h >= 7 && h < 19
}
