import { Tag } from '@lobehub/ui'
import { CheckCircle2, Terminal } from 'lucide-react'
import type { ToolCall } from '../domain'

export function ToolCallCard({ toolCall }: { toolCall: ToolCall }) {
  return (
    <div className="tool-card">
      <div className="tool-card-header">
        <span><Terminal size={14} /> {toolCall.name}</span>
        <Tag variant="filled">{toolCall.status}</Tag>
      </div>
      <div className="tool-summary"><CheckCircle2 size={14} /> {toolCall.summary}</div>
      <div className="tool-grid">
        <div><span>Input</span>{toolCall.input}</div>
        <div><span>Output</span>{toolCall.output}</div>
      </div>
    </div>
  )
}
