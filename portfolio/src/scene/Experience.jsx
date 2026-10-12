import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { useFrame, useThree } from '@react-three/fiber'
import { ScrollControls, Scroll, useScroll, PerformanceMonitor } from '@react-three/drei'
import { EffectComposer, Bloom, Vignette, HueSaturation } from '@react-three/postprocessing'
import Room from './Room.jsx'
import Overlay from '../ui/Overlay.jsx'
import { SHOTS } from './shots.js'
import { isDay } from '../device.js'

export default function Experience({ device, wireframe }) {
  const [dpr, setDpr] = useState(null)
  const setDprState = useThree((s) => s.setDpr)
  useEffect(() => {
    if (dpr) setDprState(dpr)
  }, [dpr, setDprState])

  useWireframe(wireframe)
  const bg = isDay() ? '#f3ede4' : '#14161f'

  return (
    <>
      <color attach="background" args={[bg]} />
      <fog attach="fog" args={[bg, 12, 30]} />
      {/* Drop resolution if the frame rate struggles. */}
      <PerformanceMonitor onDecline={() => setDpr(1)} />
      <ScrollControls pages={SHOTS.length} damping={device.reducedMotion ? 0 : 0.2} style={{ zIndex: 1 }}>
        <CameraRig reducedMotion={device.reducedMotion} />
        <Room device={device} />
        <Scroll html style={{ width: '100%' }}>
          <Overlay />
        </Scroll>
      </ScrollControls>
      {!device.lite && (
        <EffectComposer multisampling={4}>
          <Bloom mipmapBlur luminanceThreshold={0.95} intensity={1.1} radius={0.8} />
          <HueSaturation saturation={0.12} />
          <Vignette offset={0.3} darkness={0.6} />
        </EffectComposer>
      )}
    </>
  )
}

const easeInOut = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)

// Moves the camera along the list of SHOTS as the page scrolls.
function CameraRig({ reducedMotion }) {
  const scroll = useScroll()
  const pos = useRef(new THREE.Vector3())
  const look = useRef(new THREE.Vector3())
  const lookCurrent = useRef(new THREE.Vector3().fromArray(SHOTS[0].target))
  const pointer = useRef(new THREE.Vector2())
  const tmp = useRef(new THREE.Vector3())

  useEffect(() => {
    const onMove = (e) => pointer.current.set((e.clientX / innerWidth) * 2 - 1, (e.clientY / innerHeight) * 2 - 1)
    window.addEventListener('pointermove', onMove)
    return () => window.removeEventListener('pointermove', onMove)
  }, [])

  useFrame(({ camera, size }, delta) => {
    const segments = SHOTS.length - 1
    const x = (Number.isFinite(scroll.offset) ? scroll.offset : 0) * segments
    const i = Math.min(Math.floor(x), segments - 1)
    const t = easeInOut(THREE.MathUtils.clamp(x - i, 0, 1))
    const a = SHOTS[i]
    const b = SHOTS[i + 1]

    const aspect = size.width / size.height
    shotPosition(a, camera.fov, aspect, pos.current).lerp(shotPosition(b, camera.fov, aspect, tmp.current), t)
    look.current.fromArray(a.target).lerp(tmp.current.fromArray(b.target), t)

    // Subtle mouse parallax; fades out on close-up shots so the screen stays still.
    const parallax = THREE.MathUtils.lerp(a.parallax ?? 0.3, b.parallax ?? 0.3, t)
    if (!reducedMotion) {
      pos.current.x += pointer.current.x * parallax
      pos.current.y -= pointer.current.y * parallax * 0.5
    }

    const k = reducedMotion ? 1 : 1 - Math.exp(-delta * 4)
    camera.position.lerp(pos.current, k)
    lookCurrent.current.lerp(look.current, k)
    camera.lookAt(lookCurrent.current)
  })
  return null
}

// A shot's camera position, pulled back along its view direction if `fitWidth` wouldn't fit horizontally.
function shotPosition(shot, fov, aspect, out) {
  out.fromArray(shot.position)
  if (!shot.fitWidth) return out
  const target = new THREE.Vector3().fromArray(shot.target)
  const dist = out.distanceTo(target)
  const needed = (shot.fitWidth / 2 / (Math.tan(THREE.MathUtils.degToRad(fov / 2)) * aspect)) * 1.04
  if (needed > dist) {
    out.sub(target).setLength(needed).add(target)
    out.y += (needed - dist) * 0.3 // rise a little to look over the chair
  }
  return out
}

function useWireframe(on) {
  const scene = useThree((s) => s.scene)
  useEffect(() => {
    scene.traverse((o) => {
      if (!o.material) return
      for (const m of [].concat(o.material)) if ('wireframe' in m) m.wireframe = on
    })
  }, [on, scene])
}
