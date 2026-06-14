import { useEffect, useRef, useState } from 'react'
import './ScrollFloat.css'

type ScrollFloatProps = {
  text: string
  as?: 'h1' | 'h2' | 'p'
  className?: string
}

export default function ScrollFloat({ text, as = 'h1', className = '' }: ScrollFloatProps) {
  const ref = useRef<HTMLElement | null>(null)
  const [isVisible, setIsVisible] = useState(false)
  const Tag = as

  useEffect(() => {
    const element = ref.current
    if (!element) return undefined

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting)
      },
      { threshold: 0.35 },
    )

    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  return (
    <Tag
      ref={(node) => {
        ref.current = node
      }}
      className={`scroll-float${isVisible ? ' is-visible' : ''} ${className}`}
      aria-label={text}
    >
      {Array.from(text).map((character, index) => (
        <span aria-hidden="true" style={{ transitionDelay: `${Math.min(index * 18, 520)}ms` }} key={`${character}-${index}`}>
          {character === ' ' ? '\u00A0' : character}
        </span>
      ))}
    </Tag>
  )
}
