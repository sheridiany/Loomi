import { readFileSync } from 'node:fs'
import { describe, expect, test } from 'bun:test'

const appSource = readFileSync(new URL('./App.tsx', import.meta.url), 'utf8')

describe('App titlebar controls', () => {
  test('keeps run details and right tools as separate controls', () => {
    expect(appSource).toContain('aria-label="Open run details"')
    expect(appSource).toContain('aria-label="Open right tools"')
  })

  test('opens the right tools menu separately from the expanded right panel', () => {
    expect(appSource).toContain('rightPanelMenuOpen')
    expect(appSource).toContain('setRightPanelMenuOpen((value) => !value)')
    expect(appSource).toContain('setRightPanelOpen(true)')
  })
})
