import { useEffect, useState } from 'react'

const CODE = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a']

// Easter egg: entering the Konami code toggles wireframe mode.
export function useKonami() {
  const [on, setOn] = useState(false)
  useEffect(() => {
    let i = 0
    const onKey = (e) => {
      i = e.key === CODE[i] ? i + 1 : e.key === CODE[0] ? 1 : 0
      if (i === CODE.length) {
        i = 0
        setOn((v) => !v)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])
  return on
}
