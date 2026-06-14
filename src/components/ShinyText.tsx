import type { CSSProperties } from 'react'
import './ShinyText.css'

type ShinyTextProps = {
  text: string
  className?: string
  speed?: number
  delay?: number
  color?: string
  shineColor?: string
  spread?: number
  pauseOnHover?: boolean
}

export default function ShinyText({
  text,
  className = '',
  speed = 2.8,
  delay = 0,
  color = 'rgba(255,247,232,0.62)',
  shineColor = '#fff7e8',
  spread = 110,
  pauseOnHover = true,
}: ShinyTextProps) {
  return (
    <span
      className={`shiny-text${pauseOnHover ? ' pause-on-hover' : ''} ${className}`}
      style={{
        '--shine-speed': `${speed}s`,
        '--shine-delay': `${delay}s`,
        '--shine-color': color,
        '--shine-highlight': shineColor,
        '--shine-spread': `${spread}deg`,
      } as CSSProperties}
    >
      {text}
    </span>
  )
}
