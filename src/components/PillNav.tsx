import { useState } from 'react'
import './PillNav.css'

export type PillNavItem = {
  label: string
  href: string
  eyebrow?: string
}

type PillNavProps = {
  items: PillNavItem[]
  activeHref: string
  mark?: string
  title?: string
  subtitle?: string
  onNavigate?: (href: string) => void
}

export default function PillNav({
  items,
  activeHref,
  mark = '90',
  title = '成长副本',
  subtitle = '30-60-90',
  onNavigate,
}: PillNavProps) {
  const [isOpen, setIsOpen] = useState(false)

  function handleNavigate(event: React.MouseEvent<HTMLAnchorElement>, href: string) {
    if (href.startsWith('#')) {
      event.preventDefault()
      onNavigate?.(href)
      setIsOpen(false)
    }
  }

  return (
    <div className="pill-nav-container">
      <nav className="pill-nav" aria-label="主要页面导航">
        <a className="pill-logo" href={items[0]?.href ?? '#home'} onClick={(event) => handleNavigate(event, items[0]?.href ?? '#home')}>
          <span className="pill-logo-mark">{mark}</span>
          <span className="pill-logo-copy">
            <strong>{title}</strong>
            <small>{subtitle}</small>
          </span>
        </a>

        <div className="pill-nav-items desktop-only">
          <ul className="pill-list" role="list">
            {items.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  className={`pill${activeHref === item.href ? ' is-active' : ''}`}
                  onClick={(event) => handleNavigate(event, item.href)}
                >
                  <span className="hover-circle" aria-hidden="true" />
                  <span className="label-stack">
                    <span className="pill-label">{item.label}</span>
                    <span className="pill-label-hover" aria-hidden="true">
                      {item.label}
                    </span>
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>

        <button className="mobile-menu-button mobile-only" type="button" onClick={() => setIsOpen((value) => !value)} aria-expanded={isOpen}>
          <span className="hamburger-line" />
          <span className="hamburger-line" />
        </button>
      </nav>

      <div className={`mobile-menu-popover mobile-only${isOpen ? ' is-open' : ''}`}>
        <ul className="mobile-menu-list">
          {items.map((item) => (
            <li key={item.href}>
              <a
                href={item.href}
                className={`mobile-menu-link${activeHref === item.href ? ' is-active' : ''}`}
                onClick={(event) => handleNavigate(event, item.href)}
              >
                <small>{item.eyebrow}</small>
                <span>{item.label}</span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
