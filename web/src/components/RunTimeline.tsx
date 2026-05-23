import { Button, Tag } from '@lobehub/ui'
import { Box, Braces, FileText, GitBranch, Layers3, Terminal, X } from 'lucide-react'
import type { Run } from '../domain'
import { rightPanelItems, type RightPanelItemId } from '../rightPanelItems'

type Props = {
  run: Run | null
  runDetailsOpen: boolean
  rightPanelMenuOpen: boolean
  rightToolsOpen: boolean
  artifactOpen: boolean
  selectedPanelId: RightPanelItemId
  onSelectPanel: (panelId: RightPanelItemId) => void
  onCloseRunDetails: () => void
  onCloseRightTools: () => void
  onOpenArtifact: () => void
  onCloseArtifact: () => void
}

export function RunTimeline({
  run,
  runDetailsOpen,
  rightPanelMenuOpen,
  rightToolsOpen,
  artifactOpen,
  selectedPanelId,
  onSelectPanel,
  onCloseRunDetails,
  onCloseRightTools,
  onOpenArtifact,
  onCloseArtifact,
}: Props) {
  const selectedPanel = rightPanelItems.find((item) => item.id === selectedPanelId) ?? rightPanelItems[0]
  const SelectedIcon = selectedPanel.Icon

  return (
    <>
      <aside className={runDetailsOpen ? 'floating-rail open' : 'floating-rail'}>
        <div className="floating-head">
          <div>
            <strong>Run</strong>
            <span>{run?.model ?? '-'}</span>
          </div>
          <Button icon={<X size={14} />} onClick={onCloseRunDetails} size="small" />
        </div>

        <div className="rail-strip">
          <span>Status</span>
          <strong>{run?.status ?? 'idle'}</strong>
          <span>Context</span>
          <strong>{run?.context ?? '-'}</strong>
        </div>

        <div className="floating-section">
          <div className="rail-title">Timeline</div>
          <div className="timeline-list">
            {run?.events.map((event) => (
              <div key={event.id} className={`timeline-item ${event.status}`}>
                <span className="timeline-pin" />
                <div>
                  <div className="timeline-head">
                    <strong>{event.label}</strong>
                    <span>{event.time}</span>
                  </div>
                  <p>{event.detail}</p>
                  <code>{event.type}</code>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="floating-section">
          <div className="rail-title">Panel</div>
          <div className="panel-tabs">
            <Tag variant="filled"><Layers3 size={12} /> Context</Tag>
            <Tag variant="filled"><FileText size={12} /> Files</Tag>
            <Tag variant="filled"><Braces size={12} /> Events</Tag>
          </div>
          <button className="artifact-preview" onClick={onOpenArtifact}>
            <div className="artifact-icon"><Box size={17} /></div>
            <div>
              <strong>Workspace artifact</strong>
              <span>UI shell · mock</span>
            </div>
          </button>
          <div className="dispatch-preview">
            <GitBranch size={14} /> Dispatch placeholder
          </div>
        </div>
      </aside>

      <div className={rightPanelMenuOpen ? 'right-panel-menu open' : 'right-panel-menu'}>
        {rightPanelItems.map((item) => {
          const Icon = item.Icon
          return (
            <button
              className={item.id === selectedPanel.id ? 'right-panel-menu-item selected' : 'right-panel-menu-item'}
              key={item.id}
              onClick={() => onSelectPanel(item.id)}
            >
              <span className="right-panel-menu-label">
                <Icon size={15} strokeWidth={1.8} />
                {item.label}
              </span>
              {item.shortcut && <span className="right-panel-shortcut">{item.shortcut}</span>}
            </button>
          )
        })}
      </div>

      <aside className={rightToolsOpen ? 'right-tool-drawer open' : 'right-tool-drawer'}>
        <div className="artifact-drawer-head">
          <div>
            <strong>{selectedPanel.title}</strong>
            <span>Placeholder</span>
          </div>
          <Button icon={<X size={14} />} onClick={onCloseRightTools} size="small" />
        </div>
        <div className="right-panel-empty">
          <div className="right-panel-empty-icon">
            <SelectedIcon size={24} strokeWidth={1.7} />
          </div>
          <strong>{selectedPanel.title}</strong>
          <p>{selectedPanel.description}</p>
          <span>Coming soon</span>
        </div>
      </aside>

      <aside className={artifactOpen ? 'artifact-drawer open' : 'artifact-drawer'}>
        <div className="artifact-drawer-head">
          <div>
            <strong>Workspace artifact</strong>
            <span>Preview</span>
          </div>
          <Button icon={<X size={14} />} onClick={onCloseArtifact} size="small" />
        </div>
        <div className="artifact-stage">
          <pre className="artifact-code">{`$ loomi preview artifact

Panel: workspace shell
Mode: mock
Status: ready

The real browser / terminal / artifact runtime lands after M1.`}</pre>
          <div className="artifact-note">
            <Terminal size={15} /> Terminal / browser surface placeholder
          </div>
        </div>
      </aside>
    </>
  )
}
