import { useEffect, useRef } from 'react'
import './TargetCursor.css'

type TargetCursorProps = {
  targetSelector?: string
}

export default function TargetCursor({ targetSelector = 'button, a, .cursor-target' }: TargetCursorProps) {
  const cursorRef = useRef<HTMLDivElement | null>(null)
  const rafRef = useRef(0)
  const stateRef = useRef({
    x: 0,
    y: 0,
    tx: 0,
    ty: 0,
    w: 28,
    h: 28,
    tw: 28,
    th: 28,
    active: false,
  })

  useEffect(() => {
    const isCoarsePointer = window.matchMedia('(pointer: coarse)').matches
    const cursor = cursorRef.current
    if (!cursor || isCoarsePointer) return undefined
    const cursorElement = cursor
    const state = stateRef.current
    state.x = window.innerWidth / 2
    state.y = window.innerHeight / 2
    state.tx = state.x
    state.ty = state.y

    function render() {
      state.x += (state.tx - state.x) * 0.22
      state.y += (state.ty - state.y) * 0.22
      state.w += (state.tw - state.w) * 0.22
      state.h += (state.th - state.h) * 0.22
      cursorElement.style.transform = `translate3d(${state.x - state.w / 2}px, ${state.y - state.h / 2}px, 0)`
      cursorElement.style.width = `${state.w}px`
      cursorElement.style.height = `${state.h}px`
      cursorElement.classList.toggle('is-targeting', state.active)
      rafRef.current = window.requestAnimationFrame(render)
    }

    function onPointerMove(event: PointerEvent) {
      const target = (event.target as Element | null)?.closest(targetSelector)
      const state = stateRef.current
      if (target) {
        const rect = target.getBoundingClientRect()
        state.tx = rect.left + rect.width / 2
        state.ty = rect.top + rect.height / 2
        state.tw = rect.width + 14
        state.th = rect.height + 14
        state.active = true
        return
      }

      state.tx = event.clientX
      state.ty = event.clientY
      state.tw = 28
      state.th = 28
      state.active = false
    }

    function onPointerDown() {
      cursorElement.classList.add('is-pressing')
    }

    function onPointerUp() {
      cursorElement.classList.remove('is-pressing')
    }

    rafRef.current = window.requestAnimationFrame(render)
    window.addEventListener('pointermove', onPointerMove, { passive: true })
    window.addEventListener('pointerdown', onPointerDown)
    window.addEventListener('pointerup', onPointerUp)

    return () => {
      window.cancelAnimationFrame(rafRef.current)
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('pointerdown', onPointerDown)
      window.removeEventListener('pointerup', onPointerUp)
    }
  }, [targetSelector])

  return (
    <div className="target-cursor" ref={cursorRef} aria-hidden="true">
      <span className="corner corner-tl" />
      <span className="corner corner-tr" />
      <span className="corner corner-br" />
      <span className="corner corner-bl" />
    </div>
  )
}
