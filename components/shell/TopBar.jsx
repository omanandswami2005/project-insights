'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'

/** Sticky top bar. Logo left, links + theme toggle right. */
export default function TopBar({ recap, onLanguageChange }) {
  const [theme, setTheme] = useState('dark')
  const [lang, setLang] = useState('en')

  useEffect(() => {
    setTheme(document.documentElement.dataset.theme || 'dark')
    const savedLang = localStorage.getItem('lang') || 'en'
    setLang(savedLang)
    if (savedLang !== 'en' && onLanguageChange) {
      onLanguageChange(savedLang)
    }
  }, [onLanguageChange])

  function toggleTheme() {
    const next = theme === 'dark' ? 'light' : 'dark'
    document.documentElement.dataset.theme = next
    try {
      localStorage.setItem('theme', next)
    } catch {}
    setTheme(next)
  }

  function handleLangSelect(newLang) {
    setLang(newLang)
    try {
      localStorage.setItem('lang', newLang)
    } catch {}
    if (onLanguageChange) {
      onLanguageChange(newLang)
    }
  }

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-canvas/90 backdrop-blur-sm">
      <div className="mx-auto flex max-w-[1040px] items-center justify-between px-6 py-3.5 sm:px-8">
        <Link href="/" className="data text-[13px] font-semibold tracking-[0.02em]" data-agent-id="nav.home">
          project-insights
        </Link>

        <div className="flex items-center gap-3 sm:gap-4">
          {recap ? (
            <span className="data hidden max-w-[280px] truncate text-[11px] text-muted md:inline">
              {recap}
            </span>
          ) : null}
          <Link href="/#how-it-works" className="data text-[11px] text-muted hover:text-ink">
            how it works
          </Link>
          <a
            href="https://github.com/omanandswami2005/project-insights"
            target="_blank"
            rel="noreferrer"
            className="data text-[11px] text-muted hover:text-ink"
          >
            ↗ git
          </a>

          {/* Language Toggle */}
          <div className="flex items-center gap-1 border-l border-line pl-3">
            {['en', 'hi', 'mr'].map((l) => (
              <button
                key={l}
                onClick={() => handleLangSelect(l)}
                data-active={lang === l}
                data-agent-id={`topbar.language.${l}`}
                className="chip text-[10px] px-1.5 py-0.5 uppercase"
              >
                {l}
              </button>
            ))}
          </div>

          <button
            onClick={toggleTheme}
            className="chip"
            data-agent-id="nav.themeToggle"
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
          >
            {theme === 'dark' ? '☾ dark' : '☀ light'}
          </button>
        </div>
      </div>
    </header>
  )
}
