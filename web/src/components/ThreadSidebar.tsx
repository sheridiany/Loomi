import { useState } from 'react'
import { ChevronRight, Clock3, FolderKanban, HelpCircle, LogOut, Moon, RefreshCw, Settings, Sun } from 'lucide-react'
import type { Run, Thread } from '../domain'

type Props = {
  collapsed: boolean
  threads: Thread[]
  selectedThreadId: string
  run: Run | null
  theme: 'dark' | 'light'
  onRefresh: () => void
  onSelectThread: (threadId: string) => void
  onToggleTheme: () => void
}

export function ThreadSidebar({
  collapsed,
  threads,
  selectedThreadId,
  run,
  theme,
  onRefresh,
  onSelectThread,
  onToggleTheme,
}: Props) {
  const [settingsOpen, setSettingsOpen] = useState(false)

  if (collapsed) return null

  return (
    <aside className="sidebar">
      <div className="sidebar-section nav-stack compact-nav">
        <button className="nav-item"><FolderKanban size={15} /> Projects</button>
        <button className="nav-item"><Clock3 size={15} /> Scheduled</button>
      </div>

      <div className="sidebar-divider" />

      <div className="sidebar-section">
        <div className="section-label">Threads</div>
        <div className="thread-list">
          {threads.map((thread) => (
            <button
              key={thread.id}
              className={thread.id === selectedThreadId ? 'thread-card selected' : 'thread-card'}
              onClick={() => onSelectThread(thread.id)}
            >
              <span className={`run-dot ${thread.status}`} />
              <span className="thread-title">{thread.title}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="sidebar-footer">
        <div className="run-compact">
          <span className={`run-dot ${run?.status ?? 'completed'}`} />
          <div>
            <strong>{run?.status ?? 'idle'}</strong>
            <span>{run?.model ?? 'Mock'}</span>
          </div>
        </div>
        <div className="settings-wrap">
          {settingsOpen && (
            <div className="settings-popover">
              <div className="settings-popover-title">设置</div>
              <button onClick={onToggleTheme}>
                <span>{theme === 'dark' ? '深色主题' : '浅色主题'}</span>
                {theme === 'dark' ? <Moon size={16} /> : <Sun size={16} />}
              </button>
              <button>
                <span>帮助与反馈</span>
                <HelpCircle size={15} />
              </button>
              <button onClick={onRefresh}>
                <span>检查更新</span>
                <RefreshCw size={15} />
              </button>
              <button className="settings-logout">
                <span>退出登录</span>
                <LogOut size={15} />
              </button>
              <button className="settings-user">
                <span className="settings-avatar">雪</span>
                <span>雪安</span>
                <ChevronRight size={16} />
              </button>
            </div>
          )}
          <button
            className={settingsOpen ? 'settings-entry open' : 'settings-entry'}
            aria-expanded={settingsOpen}
            aria-label="Settings"
            onClick={() => setSettingsOpen((value) => !value)}
          >
            <Settings size={15} /> Settings
          </button>
        </div>
      </div>
    </aside>
  )
}
