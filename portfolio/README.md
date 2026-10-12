# 3D Portfolio

An interactive portfolio built with **React Three Fiber**. Visitors scroll through a cozy 3D desk scene and the
camera glides from shot to shot: hero → about (the window) → skills (the bookshelf) → projects (zooms into the
monitor, which becomes a clickable mini desktop) → contact (the phone).

Everything in the room is built from code, so there are no model files to download and it loads fast.

## Features

- **Scroll-driven camera** with eased transitions between shots, plus subtle mouse parallax
- **Interactive monitor**: real HTML rendered on the 3D screen, with project list and detail views
- **Bookshelf of skills**: one book per skill, and hovering pulls it off the shelf
- **Live day/night window** based on the visitor's local time (preview with `?time=day` / `?time=night`)
- **Clickable phone** that opens your email
- Bloom and vignette post-processing, soft shadows, and instanced keyboard keys
- **Easter egg**: type the Konami code (↑↑↓↓←→←→BA) for wireframe mode
- **Built for everyone**:
  - "Skip to simple view" link (`#simple`), a plain HTML version that is also used when WebGL is unavailable
  - Lighter rendering on phones and low-core devices, and automatic resolution drop when the frame rate struggles
  - Respects `prefers-reduced-motion`
  - On portrait screens the camera pulls back so the whole monitor fits

## Make it yours

Edit **`src/data.js`** to change your name, bio, skills, projects, and contact links. The 3D scene and the simple
view both read from that file.

To change the camera path, edit `src/scene/shots.js`. Each entry is one scroll section, and the panels in
`src/ui/Overlay.jsx` line up with the shots one-to-one.

## Develop

```bash
cd portfolio
npm install
npm run dev       # http://localhost:5173
npm run build     # outputs to dist/
npm run preview   # serve the production build
```

`vite.config.js` uses `base: './'`, so `dist/` can be deployed as-is to GitHub Pages, Netlify, Vercel, or any static host.

## Structure

```
src/
  data.js              ← your content
  App.jsx              canvas, loader, simple-view switch, Konami toggle
  device.js            WebGL / device-tier / day-night helpers
  scene/
    Experience.jsx     scroll controls, camera rig, post-processing
    shots.js           camera positions for each section
    Room.jsx           the room and every prop in it
  ui/
    Overlay.jsx        text panels that scroll over the scene
    Screen.jsx         the desktop shown on the 3D monitor
    SimpleView.jsx     accessible non-3D version
```

## Ideas for next steps

- Model the room in Blender, bake its lighting, and load it as a Draco-compressed glTF
- Show your real GitHub contribution graph as a 3D skyline on the shelf
- Add ambient lo-fi audio with an on/off toggle
