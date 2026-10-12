import { useMemo, useRef, useState } from 'react'
import * as THREE from 'three'
import { useFrame, useThree } from '@react-three/fiber'
import { Html, RoundedBox, ContactShadows, Sparkles, useCursor, useScroll } from '@react-three/drei'
import './toon.js'
import './SkyMaterial.js'
import Screen from '../ui/Screen.jsx'
import { SCREEN, SHOTS } from './shots.js'
import { skills, contact } from '../data.js'
import { isDay } from '../device.js'

// drei's <Html> would otherwise portal into the ScrollControls container and scroll away with the page.
function useCanvasPortal() {
  const gl = useThree((s) => s.gl)
  return useMemo(() => ({ current: gl.domElement.parentNode }), [gl])
}

const COLORS = {
  wall: '#e9e2d6',
  wallSide: '#ddd4c4',
  floor: '#b98a5e',
  wood: '#8a5a3b',
  woodDark: '#5c3a26',
  metal: '#2b2d33',
  accent: '#ff6b4a',
}

export default function Room({ device }) {
  const day = useMemo(isDay, [])
  const shadows = !device.lite

  return (
    <group>
      {/* Cool sky fill + warm key light: the warm/cool split is a big part of the painterly look. */}
      <hemisphereLight args={[day ? '#bfe0ff' : '#7b88c8', day ? '#a8825a' : '#2a2a3a', day ? 1.1 : 0.8]} />
      {/* Light streaming in through the window. */}
      <directionalLight
        position={[4, 5, -6]}
        intensity={day ? 2.6 : 0.5}
        color={day ? '#ffe2a8' : '#9fb3ff'}
        castShadow={shadows}
        shadow-mapSize={[1024, 1024]}
        shadow-camera-left={-5}
        shadow-camera-right={5}
        shadow-camera-top={5}
        shadow-camera-bottom={-5}
        shadow-bias={-0.0005}
      />
      <directionalLight position={[5, 6, 6]} intensity={day ? 0.6 : 0.15} />

      <Shell />
      <Window day={day} />
      <Poster />
      <Desk />
      <Monitor />
      <Keyboard />
      <Lamp day={day} />
      <Mug reducedMotion={device.reducedMotion} />
      <Plant />
      <Phone />
      <Chair />
      <Bookshelf />
      {/* Dust motes drifting in the light (fireflies at night) */}
      {!device.reducedMotion && (
        <Sparkles
          count={device.lite ? 30 : 70}
          scale={[3.5, 2.2, 2.5]}
          position={[1.2, 1.5, -1.6]}
          size={day ? 2.5 : 3.5}
          speed={0.25}
          color={day ? '#fff2c4' : '#b6ff9a'}
          opacity={0.8}
        />
      )}
      <ContactShadows position={[0, 0.002, 0]} scale={12} blur={2.5} opacity={0.35} far={3} />
    </group>
  )
}

/* ---------- Structure ---------- */

function Shell() {
  return (
    <group>
      <mesh rotation-x={-Math.PI / 2} position={[2, 0, 3]} receiveShadow>
        <planeGeometry args={[12, 12]} />
        <toonMaterial color={COLORS.floor} rim={0} />
      </mesh>
      {/* Floorboards: thin dark lines read as planks. */}
      {Array.from({ length: 23 }, (_, i) => (
        <mesh key={i} rotation-x={-Math.PI / 2} position={[-3.5 + i * 0.5, 0.001, 3]}>
          <planeGeometry args={[0.01, 12]} />
          <meshBasicMaterial color={COLORS.woodDark} transparent opacity={0.25} />
        </mesh>
      ))}
      <mesh position={[2, 3, -3]} receiveShadow>
        <planeGeometry args={[12, 6]} />
        <toonMaterial color={COLORS.wall} rim={0} />
      </mesh>
      <mesh position={[-4, 3, 3]} rotation-y={Math.PI / 2} receiveShadow>
        <planeGeometry args={[12, 6]} />
        <toonMaterial color={COLORS.wallSide} rim={0} />
      </mesh>
      {/* Skirting boards */}
      <mesh position={[2, 0.06, -2.99]}>
        <boxGeometry args={[12, 0.12, 0.02]} />
        <toonMaterial color="#f7f3ec" />
      </mesh>
      <mesh position={[-3.99, 0.06, 3]}>
        <boxGeometry args={[0.02, 0.12, 12]} />
        <toonMaterial color="#f7f3ec" />
      </mesh>
      {/* Rug */}
      <mesh rotation-x={-Math.PI / 2} position={[0, 0.004, -1.2]} receiveShadow>
        <circleGeometry args={[1.6, 48]} />
        <toonMaterial color="#3d5a80" rim={0} />
      </mesh>
      <mesh rotation-x={-Math.PI / 2} position={[0, 0.005, -1.2]}>
        <ringGeometry args={[1.35, 1.45, 48]} />
        <toonMaterial color="#e0fbfc" rim={0} />
      </mesh>
    </group>
  )
}

function Window({ day }) {
  const sky = useRef()
  useFrame((_, delta) => sky.current && (sky.current.uniforms.uTime.value += delta))

  return (
    <group position={[2, 1.9, -2.98]}>
      <mesh>
        <planeGeometry args={[1.6, 1.2]} />
        <skyMaterial ref={sky} uniforms-uDay-value={day ? 1 : 0} />
      </mesh>
      {/* Frame + mullions */}
      {[
        [0, 0.62, 1.72, 0.06],
        [0, -0.62, 1.72, 0.06],
        [0.83, 0, 0.06, 1.3],
        [-0.83, 0, 0.06, 1.3],
        [0, 0, 0.04, 1.2],
        [0, 0, 1.6, 0.04],
      ].map(([x, y, w, h], i) => (
        <mesh key={i} position={[x, y, 0.02]} castShadow>
          <boxGeometry args={[w, h, 0.05]} />
          <toonMaterial color="#f7f3ec" />
        </mesh>
      ))}
      <mesh position={[0, -0.68, 0.08]}>
        <boxGeometry args={[1.85, 0.05, 0.18]} />
        <toonMaterial color="#f7f3ec" />
      </mesh>
    </group>
  )
}

function Poster() {
  return (
    <group position={[-2.1, 2.05, -2.98]}>
      <mesh>
        <boxGeometry args={[0.9, 1.2, 0.03]} />
        <toonMaterial color="#1d1f27" />
      </mesh>
      <mesh position={[0, 0, 0.02]}>
        <planeGeometry args={[0.78, 1.08]} />
        <toonMaterial color="#f4a261" />
      </mesh>
      {/* Bauhaus-ish shapes */}
      <mesh position={[0, 0.15, 0.025]}>
        <circleGeometry args={[0.24, 48]} />
        <toonMaterial color="#e63946" />
      </mesh>
      <mesh position={[-0.12, -0.28, 0.026]}>
        <planeGeometry args={[0.4, 0.22]} />
        <toonMaterial color="#264653" />
      </mesh>
      <mesh position={[0.18, -0.2, 0.027]} rotation-z={Math.PI / 4}>
        <planeGeometry args={[0.16, 0.16]} />
        <toonMaterial color="#e9c46a" />
      </mesh>
    </group>
  )
}

/* ---------- Desk setup ---------- */

function Desk() {
  const legs = [
    [-1.12, -2.72],
    [1.12, -2.72],
    [-1.12, -1.88],
    [1.12, -1.88],
  ]
  return (
    <group>
      <RoundedBox args={[2.4, 0.06, 1]} radius={0.02} position={[0, 0.75, -2.3]} castShadow receiveShadow>
        <toonMaterial color={COLORS.wood} />
      </RoundedBox>
      {legs.map(([x, z], i) => (
        <mesh key={i} position={[x, 0.36, z]} castShadow>
          <boxGeometry args={[0.05, 0.72, 0.05]} />
          <toonMaterial color={COLORS.metal} />
        </mesh>
      ))}
      {/* Desk mat */}
      <mesh position={[0.05, 0.781, -2.05]} rotation-x={-Math.PI / 2} receiveShadow>
        <planeGeometry args={[1.3, 0.45]} />
        <toonMaterial color="#22252d" rim={0} />
      </mesh>
    </group>
  )
}

function Monitor() {
  const scroll = useScroll()
  const [active, setActive] = useState(false)
  const projectsIndex = SHOTS.findIndex((s) => s.id === 'projects')
  const [sx, sy, sz] = SCREEN.position
  const portal = useCanvasPortal()

  // The screen only takes clicks while the camera is zoomed in on it.
  useFrame(() => {
    const near = Math.abs(scroll.offset * (SHOTS.length - 1) - projectsIndex) < 0.3
    if (near !== active) setActive(near)
  })

  // Screen size in CSS px; distanceFactor maps px → world units (width * df / 400).
  const pxWidth = 832
  const df = (SCREEN.width * 400) / pxWidth

  return (
    <group>
      {/* Stand */}
      <mesh position={[sx, 0.79, sz - 0.12]} castShadow>
        <boxGeometry args={[0.32, 0.02, 0.22]} />
        <toonMaterial color={COLORS.metal} />
      </mesh>
      <mesh position={[sx, 0.95, sz - 0.14]} castShadow>
        <boxGeometry args={[0.06, 0.34, 0.03]} />
        <toonMaterial color={COLORS.metal} />
      </mesh>
      {/* Bezel */}
      <RoundedBox args={[SCREEN.width + 0.06, SCREEN.height + 0.06, 0.04]} radius={0.015} position={[sx, sy, sz - 0.03]} castShadow>
        <toonMaterial color="#111216" />
      </RoundedBox>
      {/* Panel glow behind the HTML so the screen lights up in bloom */}
      <mesh position={[sx, sy, sz - 0.009]}>
        <planeGeometry args={[SCREEN.width, SCREEN.height]} />
        <meshBasicMaterial color="#0e1220" />
      </mesh>
      {/* Power LED */}
      <mesh position={[sx + SCREEN.width / 2 - 0.02, sy - SCREEN.height / 2 - 0.018, sz - 0.008]}>
        <circleGeometry args={[0.004, 12]} />
        <meshBasicMaterial color={[0.4, 3, 1]} toneMapped={false} />
      </mesh>
      <Html
        transform
        portal={portal}
        position={[sx, sy, sz]}
        distanceFactor={df}
        // Sit below the text panels until zoomed in, then come to the front so it can be clicked.
        zIndexRange={active ? [100, 50] : [0, 0]}
        style={{ pointerEvents: active ? 'auto' : 'none' }}
        // Let the wheel keep scrolling the page while the cursor is over the screen.
        onWheel={(e) => (scroll.el.scrollTop += e.deltaY)}
      >
        <Screen width={pxWidth} height={Math.round((pxWidth * SCREEN.height) / SCREEN.width)} active={active} />
      </Html>
    </group>
  )
}

function Keyboard() {
  const ref = useRef()
  const cols = 14
  const rows = 4
  // One InstancedMesh draws every key in a single draw call.
  const setup = (mesh) => {
    if (!mesh) return
    ref.current = mesh
    const m = new THREE.Matrix4()
    let i = 0
    for (let r = 0; r < rows; r++)
      for (let c = 0; c < cols; c++) {
        m.setPosition(-0.325 + c * 0.05, 0.808, -2.12 + r * 0.05)
        mesh.setMatrixAt(i++, m)
      }
    mesh.instanceMatrix.needsUpdate = true
  }
  return (
    <group>
      <RoundedBox args={[0.74, 0.02, 0.24]} radius={0.008} position={[0, 0.793, -2.045]} castShadow>
        <toonMaterial color="#2c2f38" />
      </RoundedBox>
      <instancedMesh ref={setup} args={[undefined, undefined, cols * rows]} castShadow>
        <boxGeometry args={[0.04, 0.012, 0.04]} />
        <toonMaterial color="#e8e4dc" />
      </instancedMesh>
      {/* Mouse */}
      <mesh position={[0.52, 0.8, -2.12]} scale={[0.6, 0.35, 1]} castShadow>
        <sphereGeometry args={[0.05, 24, 16]} />
        <toonMaterial color="#e8e4dc" />
      </mesh>
    </group>
  )
}

function Lamp({ day }) {
  return (
    <group position={[-0.9, 0.78, -2.6]}>
      <mesh castShadow>
        <cylinderGeometry args={[0.1, 0.12, 0.03, 32]} />
        <toonMaterial color={COLORS.accent} />
      </mesh>
      <mesh position={[0.06, 0.22, 0.04]} rotation-z={-0.35} castShadow>
        <cylinderGeometry args={[0.012, 0.012, 0.46]} />
        <toonMaterial color={COLORS.metal} />
      </mesh>
      <group position={[0.17, 0.44, 0.1]} rotation={[0.5, 0, -0.9]}>
        <mesh castShadow>
          <coneGeometry args={[0.1, 0.16, 32, 1, true]} />
          <toonMaterial color={COLORS.accent} side={THREE.DoubleSide} />
        </mesh>
        <mesh position={[0, -0.04, 0]}>
          <sphereGeometry args={[0.035, 16, 16]} />
          <meshBasicMaterial color={[4, 3, 1.8]} toneMapped={false} />
        </mesh>
      </group>
      <pointLight position={[0.3, 0.3, 0.2]} intensity={day ? 0.6 : 3} distance={3} decay={2} color="#ffcf8a" />
    </group>
  )
}

function Mug({ reducedMotion }) {
  const puffs = useRef([])
  useFrame(({ clock }) => {
    if (reducedMotion) return
    puffs.current.forEach((p, i) => {
      if (!p) return
      const t = (clock.elapsedTime * 0.35 + i / 4) % 1
      p.position.set(Math.sin(t * 6 + i) * 0.015, 0.14 + t * 0.25, 0)
      p.scale.setScalar(0.4 + t * 0.9)
      p.material.opacity = Math.sin(t * Math.PI) * 0.35
    })
  })
  return (
    <group position={[0.85, 0.78, -2.05]}>
      <mesh position={[0, 0.06, 0]} castShadow>
        <cylinderGeometry args={[0.045, 0.04, 0.12, 32]} />
        <toonMaterial color="#f1faee" />
      </mesh>
      <mesh position={[0, 0.115, 0]} rotation-x={-Math.PI / 2}>
        <circleGeometry args={[0.04, 32]} />
        <toonMaterial color="#4a2c1d" />
      </mesh>
      <mesh position={[0.045, 0.06, 0]} rotation-z={-Math.PI / 2}>
        <torusGeometry args={[0.028, 0.008, 12, 24, Math.PI]} />
        <toonMaterial color="#f1faee" />
      </mesh>
      {[0, 1, 2, 3].map((i) => (
        <mesh key={i} ref={(el) => (puffs.current[i] = el)} position={[0, 0.2 + i * 0.05, 0]}>
          <sphereGeometry args={[0.025, 12, 12]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={reducedMotion ? 0.15 : 0} depthWrite={false} />
        </mesh>
      ))}
    </group>
  )
}

function Plant() {
  const leaves = useMemo(
    () =>
      Array.from({ length: 9 }, (_, i) => {
        const a = (i / 9) * Math.PI * 2
        return { a, tilt: 0.5 + (i % 3) * 0.2, h: 0.18 + (i % 4) * 0.04 }
      }),
    [],
  )
  return (
    <group position={[1.0, 0.78, -2.6]}>
      <mesh position={[0, 0.07, 0]} castShadow>
        <cylinderGeometry args={[0.08, 0.06, 0.14, 24]} />
        <toonMaterial color="#c97b57" />
      </mesh>
      {leaves.map(({ a, tilt, h }, i) => (
        <mesh key={i} position={[Math.cos(a) * 0.03, 0.14 + h / 2, Math.sin(a) * 0.03]} rotation={[Math.sin(a) * tilt, 0, -Math.cos(a) * tilt]} castShadow>
          <coneGeometry args={[0.025, h, 6]} />
          <toonMaterial color={i % 2 ? '#3a7d44' : '#56a05f'} flatShading />
        </mesh>
      ))}
    </group>
  )
}

function Phone() {
  const portal = useCanvasPortal()
  const [hovered, setHovered] = useState(false)
  useCursor(hovered)
  return (
    <group
      position={[0.52, 0.785, -1.93]}
      rotation-y={-0.3}
      onPointerOver={(e) => (e.stopPropagation(), setHovered(true))}
      onPointerOut={() => setHovered(false)}
      onClick={() => (location.href = `mailto:${contact.email}`)}
    >
      <RoundedBox args={[0.09, 0.012, 0.18]} radius={0.005} castShadow>
        <toonMaterial color="#15161a" />
      </RoundedBox>
      <mesh position={[0, 0.0065, 0]} rotation-x={-Math.PI / 2}>
        <planeGeometry args={[0.08, 0.165]} />
        <meshBasicMaterial color={hovered ? [0.6, 1.6, 2.2] : [0.25, 0.7, 1.1]} toneMapped={false} />
      </mesh>
      <Html transform portal={portal} position={[0, 0.008, 0]} rotation-x={-Math.PI / 2} distanceFactor={0.1} pointerEvents="none">
        <div className="phone-screen">
          <span>📨</span>
          <b>Say hi</b>
        </div>
      </Html>
    </group>
  )
}

function Chair() {
  return (
    <group position={[0.05, 0, -1.25]} rotation-y={0.25}>
      <mesh position={[0, 0.48, 0]} castShadow>
        <cylinderGeometry args={[0.26, 0.26, 0.06, 32]} />
        <toonMaterial color="#3d405b" />
      </mesh>
      <mesh position={[0, 0.25, 0]} castShadow>
        <cylinderGeometry args={[0.025, 0.025, 0.45]} />
        <toonMaterial color={COLORS.metal} />
      </mesh>
      {[0, 1, 2, 3, 4].map((i) => {
        const a = (i / 5) * Math.PI * 2
        return (
          <mesh key={i} position={[Math.cos(a) * 0.14, 0.04, Math.sin(a) * 0.14]} rotation-y={-a}>
            <boxGeometry args={[0.28, 0.03, 0.04]} />
            <toonMaterial color={COLORS.metal} />
          </mesh>
        )
      })}
      <RoundedBox args={[0.5, 0.55, 0.06]} radius={0.03} position={[0, 0.82, 0.24]} rotation-x={-0.12} castShadow>
        <toonMaterial color="#3d405b" />
      </RoundedBox>
    </group>
  )
}

/* ---------- Bookshelf: one book per skill ---------- */

function Bookshelf() {
  const shelfYs = [0.05, 0.6, 1.15, 1.7, 2.25]
  const depth = 0.38
  const length = 1.6

  // Pack books onto the middle shelves.
  const books = useMemo(() => {
    const out = []
    let shelf = 1
    let z = -length / 2 + 0.08
    skills.forEach((s, i) => {
      const w = 0.07 + ((i * 37) % 5) * 0.012
      const h = 0.34 + ((i * 53) % 4) * 0.035
      if (i === Math.ceil(skills.length / 2) || z + w > length / 2 - 0.08) {
        shelf++
        z = -length / 2 + 0.08
      }
      out.push({ ...s, z: z + w / 2, y: shelfYs[shelf] + 0.02 + h / 2, w, h, lean: i % 6 === 5 ? 0.15 : 0 })
      z += w + 0.012
    })
    return out
  }, [])

  return (
    <group position={[-3.78, 0, -1.2]}>
      {shelfYs.map((y, i) => (
        <mesh key={i} position={[0, y, 0]} castShadow receiveShadow>
          <boxGeometry args={[depth, 0.04, length]} />
          <toonMaterial color={COLORS.wood} />
        </mesh>
      ))}
      {[-1, 1].map((s) => (
        <mesh key={s} position={[0, 1.15, (s * length) / 2]} castShadow>
          <boxGeometry args={[depth, 2.3, 0.04]} />
          <toonMaterial color={COLORS.woodDark} />
        </mesh>
      ))}
      {/* Picture light so the books read at night */}
      <pointLight position={[0.8, 2.1, 0]} intensity={1.5} distance={3} color="#ffe2b8" />
      {books.map((b) => (
        <Book key={b.name} {...b} />
      ))}
      {/* A little globe on the top shelf */}
      <mesh position={[0, 2.38, 0.4]} castShadow>
        <sphereGeometry args={[0.1, 24, 24]} />
        <toonMaterial color="#4f9dde" />
      </mesh>
    </group>
  )
}

function Book({ name, color, z, y, w, h, lean }) {
  const ref = useRef()
  const portal = useCanvasPortal()
  const [hovered, setHovered] = useState(false)
  useCursor(hovered)
  useFrame((_, delta) => {
    // Hovered books slide out toward the viewer.
    const target = hovered ? 0.12 : 0
    ref.current.position.x = THREE.MathUtils.damp(ref.current.position.x, target, 10, delta)
  })
  return (
    <group position={[0, y, z]} rotation-x={lean}>
      <mesh
        ref={ref}
        castShadow
        onPointerOver={(e) => (e.stopPropagation(), setHovered(true))}
        onPointerOut={() => setHovered(false)}
      >
        <boxGeometry args={[0.28, h, w]} />
        <toonMaterial color={color} />
        {hovered && (
          <Html portal={portal} position={[0.2, h / 2 + 0.06, 0]} center className="book-label">
            {name}
          </Html>
        )}
      </mesh>
    </group>
  )
}
