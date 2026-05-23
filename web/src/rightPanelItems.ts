import { CheckSquare, Code2, Files, GitCompare, Play, SquareTerminal, type LucideIcon } from 'lucide-react'

export type RightPanelItemId = 'preview' | 'diff' | 'terminal' | 'files' | 'background-tasks' | 'plan'

export type RightPanelItem = {
  id: RightPanelItemId
  label: string
  shortcut?: string
  title: string
  description: string
  Icon: LucideIcon
}

export const rightPanelItems: RightPanelItem[] = [
  {
    id: 'preview',
    label: 'Preview',
    shortcut: '⇧ ⌘ P',
    title: 'Preview',
    description: 'Browser and artifact previews will appear here.',
    Icon: Play,
  },
  {
    id: 'diff',
    label: 'Diff',
    shortcut: '⇧ ⌘ D',
    title: 'Diff',
    description: 'Code changes and review surfaces will appear here.',
    Icon: GitCompare,
  },
  {
    id: 'terminal',
    label: 'Terminal',
    shortcut: '^ `',
    title: 'Terminal',
    description: 'Shell sessions will appear here once the runtime is wired.',
    Icon: SquareTerminal,
  },
  {
    id: 'files',
    label: 'Files',
    shortcut: '⇧ ⌘ F',
    title: 'Files',
    description: 'Workspace file navigation will appear here.',
    Icon: Files,
  },
  {
    id: 'background-tasks',
    label: 'Background tasks',
    title: 'Background tasks',
    description: 'Long-running jobs and agent tasks will appear here.',
    Icon: Code2,
  },
  {
    id: 'plan',
    label: 'Plan',
    title: 'Plan',
    description: 'Planning state and step progress will appear here.',
    Icon: CheckSquare,
  },
]
