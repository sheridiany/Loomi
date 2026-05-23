import { describe, expect, test } from 'bun:test'
import { rightPanelItems } from './rightPanelItems'

describe('rightPanelItems', () => {
  test('defines the Claude Code-style placeholder panels in menu order', () => {
    expect(rightPanelItems.map((item) => item.id)).toEqual([
      'preview',
      'diff',
      'terminal',
      'files',
      'background-tasks',
      'plan',
    ])
  })

  test('keeps the run details panel separate from tool placeholders', () => {
    expect(rightPanelItems.some((item) => item.id === 'run-details')).toBe(false)
  })
})
