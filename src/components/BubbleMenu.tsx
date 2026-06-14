import { useState } from 'react'
import type { CSSProperties, MouseEvent } from 'react'
import './BubbleMenu.css'

type BubbleMenuItem = {
  label: string
  href: string
  hint: string
  rotation?: number
  color?: string
}

type BubbleMenuProps = {
  items: BubbleMenuItem[]
  onNavigate: (href: string) => void
}

export default function BubbleMenu({ items, onNavigate }: BubbleMenuProps) {
  const [isOpen, setIsOpen] = useState(false)

  function handleNavigate(event: MouseEvent<HTMLAnchorElement>, href: string) {
    event.preventDefault()
    onNavigate(href)
    setIsOpen(false)
  }

  return (
    <>
      <nav className="bubble-menu" aria-label="快捷操作">
        <button className={`bubble toggle-bubble${isOpen ? ' open' : ''}`} type="button" onClick={() => setIsOpen((value) => !value)} aria-expanded={isOpen}>
          <span className="menu-line" />
          <span className="menu-line short" />
        </button>
        <div className="bubble logo-bubble">
          <strong>Quest Dock</strong>
        </div>
      </nav>

      <div className={`bubble-menu-items${isOpen ? ' open' : ''}`} aria-hidden={!isOpen}>
        <ul>
          {items.map((item, index) => (
            <li key={item.href} style={{ '--delay': `${index * 58}ms` } as CSSProperties}>
              <a
                href={item.href}
                onClick={(event) => handleNavigate(event, item.href)}
                style={{ '--item-rot': `${item.rotation ?? 0}deg`, '--hover-bg': item.color ?? '#f5d17a' } as CSSProperties}
              >
                <span>{item.label}</span>
                <small>{item.hint}</small>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </>
  )
}
