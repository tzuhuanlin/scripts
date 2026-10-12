import { Suspense, useEffect, useMemo, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { Loader } from '@react-three/drei'
import Experience from './scene/Experience.jsx'
import SimpleView from './ui/SimpleView.jsx'
import { useKonami } from './ui/useKonami.js'
import { getDeviceProfile, hasWebGL } from './device.js'

export default function App() {
  const webgl = useMemo(hasWebGL, [])
  const device = useMemo(getDeviceProfile, [])
  // #simple deep-links straight to the simple view; after that the toggle is plain state, no navigation.
  const [simple, setSimple] = useState(() => !webgl || location.hash === '#simple')
  // Once the 3D scene has been shown, keep it mounted (paused and hidden) so returning to it is instant
  // and keeps its scroll position and scroll handling intact.
  const [started3D, setStarted3D] = useState(!simple)
  const wireframe = useKonami()

  const show3D = () => {
    setStarted3D(true)
    setSimple(false)
    setHash('')
  }
  const showSimple = () => {
    setSimple(true)
    setHash('#simple')
  }

  useEffect(() => {
    const onHash = () => (location.hash === '#simple' || !webgl ? setSimple(true) : show3D())
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [webgl])

  return (
    <>
      {started3D && (
        <div className="stage" hidden={simple}>
          <Canvas
            frameloop={simple ? 'never' : 'always'}
            shadows={!device.lite}
            dpr={device.lite ? 1 : [1, 2]}
            camera={{ fov: 45, near: 0.05, far: 60, position: [4.2, 3.2, 4.5] }}
            gl={{ antialias: true }}
          >
            <Suspense fallback={null}>
              <Experience device={device} wireframe={wireframe} />
            </Suspense>
          </Canvas>
          <Loader />
          <button type="button" className="skip-link" onClick={showSimple}>
            Skip to simple view
          </button>
          {wireframe && <div className="toast">↑↑↓↓←→←→BA — wireframe mode unlocked</div>}
        </div>
      )}
      {simple && <SimpleView canGo3D={webgl} onShow3D={show3D} />}
    </>
  )
}

// Keep the URL in sync without triggering navigation (some embeds treat hash links as page loads).
function setHash(hash) {
  try {
    history.replaceState(null, '', hash || location.pathname + location.search)
  } catch {
    /* sandboxed frames may refuse; the view still switches */
  }
}
