import type { CSSProperties, FormEventHandler, PointerEvent, ReactNode } from 'react'
import './SpotlightSurface.css'

type SpotlightSurfaceProps = {
  children: ReactNode
  className?: string
  as?: 'div' | 'form'
  onSubmit?: FormEventHandler<HTMLFormElement>
}

type SpotlightStyle = CSSProperties & {
  '--spot-x': string
  '--spot-y': string
}

export default function SpotlightSurface({ children, className = '', as = 'div', onSubmit }: SpotlightSurfaceProps) {
  function handlePointerMove(event: PointerEvent<HTMLElement>) {
    const rect = event.currentTarget.getBoundingClientRect()
    event.currentTarget.style.setProperty('--spot-x', `${event.clientX - rect.left}px`)
    event.currentTarget.style.setProperty('--spot-y', `${event.clientY - rect.top}px`)
  }

  const style = { '--spot-x': '50%', '--spot-y': '50%' } as SpotlightStyle

  if (as === 'form') {
    return (
      <form className={`spotlight-surface ${className}`} style={style} onPointerMove={handlePointerMove} onSubmit={onSubmit}>
        {children}
      </form>
    )
  }

  return (
    <div className={`spotlight-surface ${className}`} style={style} onPointerMove={handlePointerMove}>
      {children}
    </div>
  )
}
