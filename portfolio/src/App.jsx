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
  const [simple, setSimple] = useState(() => !webgl || location.hash === '#simple')
  const wireframe = useKonami()

  useEffect(() => {
    const onHash = () => setSimple(!webgl || location.hash === '#simple')
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [webgl])

  if (simple) return <SimpleView canGo3D={webgl} />

  return (
    <>
      <Canvas
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
      <a className="skip-link" href="#simple">
        Skip to simple view
      </a>
      {wireframe && <div className="toast">↑↑↓↓←→←→BA — wireframe mode unlocked</div>}
    </>
  )
}
