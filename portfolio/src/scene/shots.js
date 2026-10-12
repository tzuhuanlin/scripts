// Camera "shots" — one per scroll section, in order.
// The overlay sections in ui/Overlay.jsx line up with these one-to-one.
// Room layout: back wall at z = -3, left wall at x = -4, desk top at y ≈ 0.78.
export const SCREEN = { position: [0, 1.22, -2.52], width: 1.04, height: 0.6 }

export const SHOTS = [
  { id: 'hero', position: [4.2, 3.2, 4.5], target: [-0.3, 1.0, -1.5], parallax: 0.4 },
  { id: 'about', position: [1.7, 1.75, 0.4], target: [1.3, 1.55, -3], parallax: 0.25 },
  { id: 'skills', position: [-0.4, 1.5, 0.6], target: [-3.8, 1.2, -2.0], parallax: 0.2 },
  // Close-up on the monitor: the screen fills the view and becomes interactive.
  // `fitWidth` pulls the camera back on narrow (portrait) viewports so the whole screen stays in view.
  { id: 'projects', position: [0, 1.22, -1.56], target: [0, 1.22, -2.52], parallax: 0, fitWidth: SCREEN.width + 0.12 },
  { id: 'contact', position: [1.0, 1.2, -1.3], target: [0.4, 0.8, -1.98], parallax: 0.1 },
]
