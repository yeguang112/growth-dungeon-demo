import { useEffect, useRef } from 'react'
import type { CSSProperties } from 'react'
import './Waves.css'

type WavesProps = {
  lineColor?: string
  backgroundColor?: string
  waveSpeedX?: number
  waveSpeedY?: number
  waveAmpX?: number
  waveAmpY?: number
  xGap?: number
  yGap?: number
  friction?: number
  tension?: number
  maxCursorMove?: number
  style?: CSSProperties
  className?: string
}

type WavePoint = {
  x: number
  y: number
  wave: { x: number; y: number }
  cursor: { x: number; y: number; vx: number; vy: number }
}

type Bounds = {
  width: number
  height: number
  left: number
  top: number
}

type MouseState = {
  x: number
  y: number
  lx: number
  ly: number
  sx: number
  sy: number
  v: number
  vs: number
  a: number
  set: boolean
}

class Grad {
  x: number
  y: number
  z: number

  constructor(x: number, y: number, z: number) {
    this.x = x
    this.y = y
    this.z = z
  }

  dot2(x: number, y: number) {
    return this.x * x + this.y * y
  }
}

class Noise {
  grad3: Grad[]
  p: number[]
  perm: number[]
  gradP: Grad[]

  constructor(seed = 0) {
    this.grad3 = [
      new Grad(1, 1, 0),
      new Grad(-1, 1, 0),
      new Grad(1, -1, 0),
      new Grad(-1, -1, 0),
      new Grad(1, 0, 1),
      new Grad(-1, 0, 1),
      new Grad(1, 0, -1),
      new Grad(-1, 0, -1),
      new Grad(0, 1, 1),
      new Grad(0, -1, 1),
      new Grad(0, 1, -1),
      new Grad(0, -1, -1),
    ]
    this.p = [
      151, 160, 137, 91, 90, 15, 131, 13, 201, 95, 96, 53, 194, 233, 7, 225, 140, 36, 103, 30, 69,
      142, 8, 99, 37, 240, 21, 10, 23, 190, 6, 148, 247, 120, 234, 75, 0, 26, 197, 62, 94, 252, 219,
      203, 117, 35, 11, 32, 57, 177, 33, 88, 237, 149, 56, 87, 174, 20, 125, 136, 171, 168, 68, 175,
      74, 165, 71, 134, 139, 48, 27, 166, 77, 146, 158, 231, 83, 111, 229, 122, 60, 211, 133, 230,
      220, 105, 92, 41, 55, 46, 245, 40, 244, 102, 143, 54, 65, 25, 63, 161, 1, 216, 80, 73, 209,
      76, 132, 187, 208, 89, 18, 169, 200, 196, 135, 130, 116, 188, 159, 86, 164, 100, 109, 198,
      173, 186, 3, 64, 52, 217, 226, 250, 124, 123, 5, 202, 38, 147, 118, 126, 255, 82, 85, 212,
      207, 206, 59, 227, 47, 16, 58, 17, 182, 189, 28, 42, 223, 183, 170, 213, 119, 248, 152, 2, 44,
      154, 163, 70, 221, 153, 101, 155, 167, 43, 172, 9, 129, 22, 39, 253, 19, 98, 108, 110, 79,
      113, 224, 232, 178, 185, 112, 104, 218, 246, 97, 228, 251, 34, 242, 193, 238, 210, 144, 12,
      191, 179, 162, 241, 81, 51, 145, 235, 249, 14, 239, 107, 49, 192, 214, 31, 181, 199, 106,
      157, 184, 84, 204, 176, 115, 121, 50, 45, 127, 4, 150, 254, 138, 236, 205, 93, 222, 114, 67,
      29, 24, 72, 243, 141, 128, 195, 78, 66, 215, 61, 156, 180,
    ]
    this.perm = new Array(512)
    this.gradP = new Array(512)
    this.seed(seed)
  }

  seed(seed: number) {
    let nextSeed = seed
    if (nextSeed > 0 && nextSeed < 1) nextSeed *= 65536
    nextSeed = Math.floor(nextSeed)
    if (nextSeed < 256) nextSeed |= nextSeed << 8

    for (let i = 0; i < 256; i += 1) {
      const v = i & 1 ? this.p[i] ^ (nextSeed & 255) : this.p[i] ^ ((nextSeed >> 8) & 255)
      this.perm[i] = this.perm[i + 256] = v
      this.gradP[i] = this.gradP[i + 256] = this.grad3[v % 12]
    }
  }

  fade(t: number) {
    return t * t * t * (t * (t * 6 - 15) + 10)
  }

  lerp(a: number, b: number, t: number) {
    return (1 - t) * a + t * b
  }

  perlin2(xValue: number, yValue: number) {
    let x = xValue
    let y = yValue
    let X = Math.floor(x)
    let Y = Math.floor(y)
    x -= X
    y -= Y
    X &= 255
    Y &= 255

    const n00 = this.gradP[X + this.perm[Y]].dot2(x, y)
    const n01 = this.gradP[X + this.perm[Y + 1]].dot2(x, y - 1)
    const n10 = this.gradP[X + 1 + this.perm[Y]].dot2(x - 1, y)
    const n11 = this.gradP[X + 1 + this.perm[Y + 1]].dot2(x - 1, y - 1)
    const u = this.fade(x)

    return this.lerp(this.lerp(n00, n10, u), this.lerp(n01, n11, u), this.fade(y))
  }
}

function getMovedPoint(point: WavePoint, withCursor: boolean) {
  const x = point.x + point.wave.x + (withCursor ? point.cursor.x : 0)
  const y = point.y + point.wave.y + (withCursor ? point.cursor.y : 0)

  return { x: Math.round(x * 10) / 10, y: Math.round(y * 10) / 10 }
}

export default function Waves({
  lineColor = 'rgba(255,255,255,0.18)',
  backgroundColor = 'transparent',
  waveSpeedX = 0.0125,
  waveSpeedY = 0.005,
  waveAmpX = 32,
  waveAmpY = 16,
  xGap = 10,
  yGap = 32,
  friction = 0.925,
  tension = 0.005,
  maxCursorMove = 100,
  style = {},
  className = '',
}: WavesProps) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null)
  const boundingRef = useRef<Bounds>({ width: 0, height: 0, left: 0, top: 0 })
  const noiseRef = useRef(new Noise(0.42))
  const linesRef = useRef<WavePoint[][]>([])
  const mouseRef = useRef<MouseState>({
    x: -10,
    y: 0,
    lx: 0,
    ly: 0,
    sx: 0,
    sy: 0,
    v: 0,
    vs: 0,
    a: 0,
    set: false,
  })
  const configRef = useRef({
    lineColor,
    waveSpeedX,
    waveSpeedY,
    waveAmpX,
    waveAmpY,
    friction,
    tension,
    maxCursorMove,
    xGap,
    yGap,
  })
  const frameIdRef = useRef(0)

  useEffect(() => {
    configRef.current = {
      lineColor,
      waveSpeedX,
      waveSpeedY,
      waveAmpX,
      waveAmpY,
      friction,
      tension,
      maxCursorMove,
      xGap,
      yGap,
    }
  }, [friction, lineColor, maxCursorMove, tension, waveAmpX, waveAmpY, waveSpeedX, waveSpeedY, xGap, yGap])

  useEffect(() => {
    const canvas = canvasRef.current
    const container = containerRef.current
    if (!canvas || !container) return undefined

    const context = canvas.getContext('2d')
    if (!context) return undefined
    ctxRef.current = context

    function setSize() {
      if (!container || !canvas) return
      boundingRef.current = container.getBoundingClientRect()
      canvas.width = boundingRef.current.width
      canvas.height = boundingRef.current.height
    }

    function setLines() {
      const { width, height } = boundingRef.current
      linesRef.current = []
      const oWidth = width + 200
      const oHeight = height + 30
      const { xGap: currentXGap, yGap: currentYGap } = configRef.current
      const totalLines = Math.ceil(oWidth / currentXGap)
      const totalPoints = Math.ceil(oHeight / currentYGap)
      const xStart = (width - currentXGap * totalLines) / 2
      const yStart = (height - currentYGap * totalPoints) / 2

      for (let i = 0; i <= totalLines; i += 1) {
        const points: WavePoint[] = []
        for (let j = 0; j <= totalPoints; j += 1) {
          points.push({
            x: xStart + currentXGap * i,
            y: yStart + currentYGap * j,
            wave: { x: 0, y: 0 },
            cursor: { x: 0, y: 0, vx: 0, vy: 0 },
          })
        }
        linesRef.current.push(points)
      }
    }

    function movePoints(time: number) {
      const lines = linesRef.current
      const mouse = mouseRef.current
      const noise = noiseRef.current
      const {
        waveSpeedX: currentSpeedX,
        waveSpeedY: currentSpeedY,
        waveAmpX: currentAmpX,
        waveAmpY: currentAmpY,
        friction: currentFriction,
        tension: currentTension,
        maxCursorMove: currentMaxCursorMove,
      } = configRef.current

      lines.forEach((points) => {
        points.forEach((point) => {
          const move = noise.perlin2((point.x + time * currentSpeedX) * 0.002, (point.y + time * currentSpeedY) * 0.0015) * 12
          point.wave.x = Math.cos(move) * currentAmpX
          point.wave.y = Math.sin(move) * currentAmpY

          const dx = point.x - mouse.sx
          const dy = point.y - mouse.sy
          const dist = Math.hypot(dx, dy)
          const length = Math.max(175, mouse.vs)

          if (dist < length) {
            const strength = 1 - dist / length
            const force = Math.cos(dist * 0.001) * strength
            point.cursor.vx += Math.cos(mouse.a) * force * length * mouse.vs * 0.00065
            point.cursor.vy += Math.sin(mouse.a) * force * length * mouse.vs * 0.00065
          }

          point.cursor.vx += (0 - point.cursor.x) * currentTension
          point.cursor.vy += (0 - point.cursor.y) * currentTension
          point.cursor.vx *= currentFriction
          point.cursor.vy *= currentFriction
          point.cursor.x += point.cursor.vx * 2
          point.cursor.y += point.cursor.vy * 2
          point.cursor.x = Math.min(currentMaxCursorMove, Math.max(-currentMaxCursorMove, point.cursor.x))
          point.cursor.y = Math.min(currentMaxCursorMove, Math.max(-currentMaxCursorMove, point.cursor.y))
        })
      })
    }

    function drawLines() {
      const { width, height } = boundingRef.current
      const context = ctxRef.current
      if (!context) return

      context.clearRect(0, 0, width, height)
      context.beginPath()
      context.strokeStyle = configRef.current.lineColor
      linesRef.current.forEach((points) => {
        let currentPoint = getMovedPoint(points[0], false)
        context.moveTo(currentPoint.x, currentPoint.y)

        points.forEach((point, index) => {
          const isLast = index === points.length - 1
          currentPoint = getMovedPoint(point, !isLast)
          const nextPoint = getMovedPoint(points[index + 1] || points[points.length - 1], !isLast)
          context.lineTo(currentPoint.x, currentPoint.y)
          if (isLast) context.moveTo(nextPoint.x, nextPoint.y)
        })
      })
      context.stroke()
    }

    function tick(time: number) {
      const mouse = mouseRef.current
      mouse.sx += (mouse.x - mouse.sx) * 0.1
      mouse.sy += (mouse.y - mouse.sy) * 0.1

      const dx = mouse.x - mouse.lx
      const dy = mouse.y - mouse.ly
      const distance = Math.hypot(dx, dy)
      mouse.v = distance
      mouse.vs += (distance - mouse.vs) * 0.1
      mouse.vs = Math.min(100, mouse.vs)
      mouse.lx = mouse.x
      mouse.ly = mouse.y
      mouse.a = Math.atan2(dy, dx)

      movePoints(time)
      drawLines()
      frameIdRef.current = requestAnimationFrame(tick)
    }

    function onResize() {
      setSize()
      setLines()
    }

    function updateMouse(x: number, y: number) {
      const mouse = mouseRef.current
      const bounds = boundingRef.current
      mouse.x = x - bounds.left
      mouse.y = y - bounds.top
      if (!mouse.set) {
        mouse.sx = mouse.x
        mouse.sy = mouse.y
        mouse.lx = mouse.x
        mouse.ly = mouse.y
        mouse.set = true
      }
    }

    function onMouseMove(event: MouseEvent) {
      updateMouse(event.clientX, event.clientY)
    }

    function onTouchMove(event: TouchEvent) {
      const touch = event.touches[0]
      if (touch) updateMouse(touch.clientX, touch.clientY)
    }

    setSize()
    setLines()
    frameIdRef.current = requestAnimationFrame(tick)
    window.addEventListener('resize', onResize)
    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('touchmove', onTouchMove, { passive: true })

    return () => {
      window.removeEventListener('resize', onResize)
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('touchmove', onTouchMove)
      cancelAnimationFrame(frameIdRef.current)
    }
  }, [])

  return (
    <div ref={containerRef} className={`waves ${className}`} style={{ backgroundColor, ...style }}>
      <canvas ref={canvasRef} className="waves-canvas" />
    </div>
  )
}
