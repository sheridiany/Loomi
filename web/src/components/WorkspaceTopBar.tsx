import { Button, Tag } from '@lobehub/ui'
import { CircleDot, RefreshCw, Square } from 'lucide-react'
import type { Run, Thread } from '../domain'

type Props = {
  thread: Thread | null
  run: Run | null
  onRefresh: () => void
  onStop: () => void
}

export function WorkspaceTopBar({ thread, run, onRefresh, onStop }: Props) {
  const running = run?.status === 'running'

  return (
    <header className="topbar glass-panel">
      <div className="topbar-title">
        <div>
          <div className="topbar-name">Loomi</div>
          <div className="topbar-subtitle">{thread?.project ?? 'Workspace'} / {thread?.title ?? 'Untitled'}</div>
        </div>
      </div>

      <div className="topbar-actions">
        <Tag className="status-tag" variant="filled">
          <CircleDot size={12} /> {run?.status ?? 'idle'}
        </Tag>
        <Tag className="status-tag" variant="filled">{run?.model ?? 'Mock'}</Tag>
        <Button icon={<RefreshCw size={14} />} onClick={onRefresh} size="small">Refresh</Button>
        <Button disabled={!running} icon={<Square size={13} />} onClick={onStop} size="small" type={running ? 'primary' : 'default'}>
          Stop
        </Button>
      </div>
    </header>
  )
}
