import { useEffect, useRef } from 'react'
import type { CSSProperties } from 'react'
import './MagnetLines.css'

type MagnetLinesProps = {
  rows?: number
  columns?: number
  containerSize?: string
  lineColor?: string
  lineWidth?: string
  lineHeight?: string
  baseAngle?: number
  className?: string
  style?: CSSProperties
}

type LineStyle = CSSProperties & {
  '--rotate': string
}

export default function MagnetLines({
  rows = 9,
  columns = 9,
  containerSize = '80vmin',
  lineColor = '#efefef',
  lineWidth = '1vmin',
  lineHeight = '6vmin',
  baseAngle = -10,
  className = '',
  style = {},
}: MagnetLinesProps) {
  const containerRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return undefined

    const items = container.querySelectorAll<HTMLSpanElement>('span')

    const onPointerMove = (pointer: PointerEvent | { x: number; y: number }) => {
      items.forEach((item) => {
        const rect = item.getBoundingClientRect()
        const centerX = rect.x + rect.width / 2
        const centerY = rect.y + rect.height / 2
        const b = pointer.x - centerX
        const a = pointer.y - centerY
        const c = Math.sqrt(a * a + b * b) || 1
        const rotation = ((Math.acos(b / c) * 180) / Math.PI) * (pointer.y > centerY ? 1 : -1)
        item.style.setProperty('--rotate', `${rotation}deg`)
      })
    }

    window.addEventListener('pointermove', onPointerMove)

    if (items.length) {
      const middleIndex = Math.floor(items.length / 2)
      const rect = items[middleIndex].getBoundingClientRect()
      onPointerMove({ x: rect.x, y: rect.y })
    }

    return () => window.removeEventListener('pointermove', onPointerMove)
  }, [columns, rows])

  return (
    <div
      ref={containerRef}
      className={`magnet-lines ${className}`}
      style={{
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
        gridTemplateRows: `repeat(${rows}, 1fr)`,
        width: containerSize,
        height: containerSize,
        ...style,
      }}
      aria-hidden="true"
    >
      {Array.from({ length: rows * columns }, (_, index) => (
        <span
          key={index}
          style={
            {
              '--rotate': `${baseAngle}deg`,
              backgroundColor: lineColor,
              width: lineWidth,
              height: lineHeight,
            } as LineStyle
          }
        />
      ))}
    </div>
  )
}
