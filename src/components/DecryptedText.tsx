import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import './DecryptedText.css'

type DecryptedTextProps = {
  text: string
  speed?: number
  maxIterations?: number
  sequential?: boolean
  revealDirection?: 'start' | 'end' | 'center'
  characters?: string
  className?: string
  parentClassName?: string
  encryptedClassName?: string
  animateOn?: 'view' | 'hover' | 'click'
}

function buildOrder(length: number, direction: 'start' | 'end' | 'center') {
  if (direction === 'end') return Array.from({ length }, (_, index) => length - index - 1)
  if (direction === 'center') {
    const middle = Math.floor(length / 2)
    const order: number[] = []
    for (let offset = 0; order.length < length; offset += 1) {
      const right = middle + offset
      const left = middle - offset - 1
      if (right < length) order.push(right)
      if (left >= 0) order.push(left)
    }
    return order
  }
  return Array.from({ length }, (_, index) => index)
}

export default function DecryptedText({
  text,
  speed = 42,
  maxIterations = 10,
  sequential = true,
  revealDirection = 'start',
  characters = 'AI90副本成长路径工具链任务证据ABCDEF1234567890',
  className = '',
  parentClassName = '',
  encryptedClassName = '',
  animateOn = 'view',
}: DecryptedTextProps) {
  const [displayText, setDisplayText] = useState(text)
  const [isAnimating, setIsAnimating] = useState(false)
  const [hasAnimated, setHasAnimated] = useState(false)
  const containerRef = useRef<HTMLSpanElement | null>(null)
  const intervalRef = useRef<number | null>(null)
  const orderRef = useRef<number[]>([])
  const pointerRef = useRef(0)
  const iterationRef = useRef(0)
  const revealedRef = useRef(new Set<number>())
  const charactersList = useMemo(() => Array.from(characters), [characters])

  const scramble = useCallback(
    (revealed: Set<number>) => {
      return Array.from(text)
        .map((character, index) => {
          if (character.trim() === '') return character
          if (revealed.has(index)) return character
          const nextIndex = Math.floor(Math.random() * charactersList.length)
          return charactersList[nextIndex] ?? character
        })
        .join('')
    },
    [charactersList, text],
  )

  const stop = useCallback(() => {
    if (intervalRef.current !== null) {
      window.clearInterval(intervalRef.current)
      intervalRef.current = null
    }
    setIsAnimating(false)
  }, [])

  const start = useCallback(() => {
    if (isAnimating) return
    stop()
    orderRef.current = buildOrder(text.length, revealDirection)
    pointerRef.current = 0
    iterationRef.current = 0
    revealedRef.current = new Set()
    setIsAnimating(true)

    intervalRef.current = window.setInterval(() => {
      if (sequential) {
        const next = orderRef.current[pointerRef.current]
        if (typeof next === 'number') {
          revealedRef.current.add(next)
          pointerRef.current += 1
          setDisplayText(scramble(revealedRef.current))
          return
        }
      } else if (iterationRef.current < maxIterations) {
        iterationRef.current += 1
        setDisplayText(scramble(revealedRef.current))
        return
      }

      setDisplayText(text)
      setHasAnimated(true)
      stop()
    }, speed)
  }, [isAnimating, maxIterations, revealDirection, scramble, sequential, speed, stop, text])

  useEffect(() => stop, [stop])

  useEffect(() => {
    if (animateOn !== 'view') return undefined
    const element = containerRef.current
    if (!element) return undefined

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) start()
      },
      { threshold: 0.35 },
    )

    observer.observe(element)
    return () => observer.disconnect()
  }, [animateOn, hasAnimated, start])

  const eventProps =
    animateOn === 'hover'
      ? { onMouseEnter: start, onFocus: start }
      : animateOn === 'click'
        ? { onClick: start }
        : {}

  return (
    <span className={`decrypted-text ${parentClassName}`} ref={containerRef} {...eventProps}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {Array.from(displayText).map((character, index) => {
          const revealed = character === text[index]
          return (
            <span className={revealed ? className : encryptedClassName} key={`${character}-${index}`}>
              {character}
            </span>
          )
        })}
      </span>
    </span>
  )
}
