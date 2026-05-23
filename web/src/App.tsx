import { type CSSProperties, type PointerEvent, useState } from 'react'
import { ConfigProvider, ThemeProvider } from '@lobehub/ui'
import { AlertCircle, PanelLeft, PanelRight, Search } from 'lucide-react'
import { motion } from 'motion/react'
import type { RightPanelItemId } from './rightPanelItems'
import { ChatCanvas } from './components/ChatCanvas'
import { RunTimeline } from './components/RunTimeline'
import { ThreadSidebar } from './components/ThreadSidebar'
import { useWorkspaceState } from './state'

export default function App() {
  const [runDetailsOpen, setRunDetailsOpen] = useState(false)
  const [rightPanelMenuOpen, setRightPanelMenuOpen] = useState(false)
  const [rightPanelOpen, setRightPanelOpen] = useState(false)
  const [artifactOpen, setArtifactOpen] = useState(false)
  const [selectedRightPanelId, setSelectedRightPanelId] = useState<RightPanelItemId>('preview')
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [sidebarWidth, setSidebarWidth] = useState(292)
  const [theme, setTheme] = useState<'dark' | 'light'>('dark')
  const {
    threads,
    selectedThread,
    selectedThreadId,
    messages,
    run,
    loading,
    refresh,
    selectThread,
    sendMessage,
  } = useWorkspaceState()

  const workspaceStyle = { '--sidebar-width': `${sidebarWidth}px` } as CSSProperties
  const workspaceClass = [
    'workspace-grid',
    sidebarCollapsed ? 'sidebar-collapsed' : '',
    rightPanelOpen ? 'right-tools-open' : '',
  ].filter(Boolean).join(' ')

  const handleSidebarResize = (event: PointerEvent<HTMLDivElement>) => {
    const startX = event.clientX
    const startWidth = sidebarWidth
    event.currentTarget.setPointerCapture(event.pointerId)

    const handlePointerMove = (moveEvent: globalThis.PointerEvent) => {
      setSidebarWidth(Math.min(380, Math.max(248, startWidth + moveEvent.clientX - startX)))
    }

    const handlePointerUp = () => {
      window.removeEventListener('pointermove', handlePointerMove)
      window.removeEventListener('pointerup', handlePointerUp)
    }

    window.addEventListener('pointermove', handlePointerMove)
    window.addEventListener('pointerup', handlePointerUp)
  }

  return (
    <ConfigProvider motion={motion}>
      <ThemeProvider
        appearance={theme}
        customTheme={{
          primaryColor: 'purple',
          neutralColor: 'slate',
        }}
      >
        <div className="app-shell" data-theme={theme}>
          <main className={workspaceClass} style={workspaceStyle}>
            {!sidebarCollapsed && (
              <aside className="sidebar-shell glass-panel">
                <div className="sidebar-titlebar">
                  <button className="titlebar-button" aria-label="Collapse sidebar" onClick={() => setSidebarCollapsed(true)}>
                    <PanelLeft size={15} strokeWidth={1.7} />
                  </button>
                  <button className="titlebar-button" aria-label="Search">
                    <Search size={14} strokeWidth={1.65} />
                  </button>
                </div>
                <ThreadSidebar
                  collapsed={sidebarCollapsed}
                  threads={threads}
                  selectedThreadId={selectedThreadId}
                  run={run}
                  theme={theme}
                  onRefresh={() => void refresh()}
                  onSelectThread={selectThread}
                  onToggleTheme={() => setTheme((value) => value === 'dark' ? 'light' : 'dark')}
                />
              </aside>
            )}
            {!sidebarCollapsed && <div className="sidebar-resizer" role="separator" aria-orientation="vertical" onPointerDown={handleSidebarResize} />}
            <section className="main-region">
              <header className="main-titlebar">
                <div className="titlebar-left">
                  {sidebarCollapsed && (
                    <button className="titlebar-button" aria-label="Open sidebar" onClick={() => setSidebarCollapsed(false)}>
                      <PanelRight size={15} strokeWidth={1.7} />
                    </button>
                  )}
                </div>
                <div className="titlebar-center mode-tabs">
                  <button
                    className={selectedThread?.mode === 'chat' ? 'selected' : undefined}
                    onClick={() => {
                      const threadId = threads.find((thread) => thread.mode === 'chat')?.id
                      if (threadId) selectThread(threadId)
                    }}
                  >
                    Chat
                  </button>
                  <button
                    className={selectedThread?.mode === 'work' ? 'selected' : undefined}
                    onClick={() => {
                      const threadId = threads.find((thread) => thread.mode === 'work')?.id
                      if (threadId) selectThread(threadId)
                    }}
                  >
                    Work
                  </button>
                </div>
                <div className="titlebar-right">
                  <button
                    className="titlebar-button"
                    aria-label="Open run details"
                    onClick={() => {
                      setRunDetailsOpen((value) => !value)
                      setRightPanelMenuOpen(false)
                      setRightPanelOpen(false)
                    }}
                  >
                    <AlertCircle size={15} strokeWidth={1.7} />
                  </button>
                  <button
                    className="titlebar-button"
                    aria-label="Open right tools"
                    onClick={() => {
                      setRightPanelMenuOpen((value) => !value)
                      setRunDetailsOpen(false)
                      setArtifactOpen(false)
                    }}
                  >
                    <PanelRight size={15} strokeWidth={1.7} />
                  </button>
                </div>
              </header>
              <ChatCanvas
                sidebarCollapsed={sidebarCollapsed}
                thread={selectedThread}
                messages={messages}
                run={run}
                loading={loading}
                onSendMessage={(content) => void sendMessage(content)}
              />
            </section>
            <RunTimeline
              run={run}
              runDetailsOpen={runDetailsOpen}
              rightPanelMenuOpen={rightPanelMenuOpen}
              rightToolsOpen={rightPanelOpen}
              artifactOpen={artifactOpen}
              selectedPanelId={selectedRightPanelId}
              onSelectPanel={(panelId) => {
                setSelectedRightPanelId(panelId)
                setRightPanelOpen(true)
                setRightPanelMenuOpen(false)
                setRunDetailsOpen(false)
                setArtifactOpen(false)
              }}
              onCloseRunDetails={() => setRunDetailsOpen(false)}
              onCloseRightTools={() => setRightPanelOpen(false)}
              onOpenArtifact={() => {
                setArtifactOpen(true)
                setRightPanelOpen(false)
              }}
              onCloseArtifact={() => setArtifactOpen(false)}
            />
          </main>
        </div>
      </ThemeProvider>
    </ConfigProvider>
  )
}
