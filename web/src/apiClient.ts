import type { Message, Run, Thread } from './domain'
import { messages, runs, threads } from './mockData'

let threadStore = [...threads]
let messageStore = [...messages]
let runStore = runs.map((run) => ({ ...run, events: [...run.events] }))

function cloneRun(run: Run): Run {
  return { ...run, events: [...run.events] }
}

export const apiClient = {
  async listThreads(): Promise<Thread[]> {
    return [...threadStore]
  },

  async getThreadMessages(threadId: string): Promise<Message[]> {
    return messageStore.filter((message) => message.threadId === threadId)
  },

  async getThreadRun(threadId: string): Promise<Run> {
    const run = runStore.find((item) => item.threadId === threadId)
    if (!run) throw new Error('Run not found')
    return cloneRun(run)
  },

  async getRunEvents(runId: string) {
    return runStore.find((run) => run.id === runId)?.events ?? []
  },

  async sendMessage(threadId: string, content: string): Promise<{ messages: Message[]; run: Run }> {
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    const userMessage: Message = {
      id: `msg-${Date.now()}`,
      threadId,
      role: 'user',
      content,
      createdAt: now,
    }
    const assistantMessage: Message = {
      id: `msg-${Date.now()}-assistant`,
      threadId,
      role: 'assistant',
      content: 'Queued. I will align the shell, update the run rail, and keep the workspace compact.',
      createdAt: now,
      toolCalls: [
        {
          id: `tool-${Date.now()}`,
          name: 'compose_workspace',
          status: 'running',
          summary: 'Updating mock workspace state.',
          input: content,
          output: 'Pending',
        },
      ],
    }
    messageStore = [...messageStore, userMessage, assistantMessage]

    const currentRun = runStore.find((run) => run.threadId === threadId)
    const run: Run = currentRun
      ? {
          ...currentRun,
          status: 'running',
          events: [
            ...currentRun.events,
            {
              id: `evt-${Date.now()}`,
              type: 'message.queued',
              label: 'Queued',
              detail: 'New message received',
              time: 'Now',
              status: 'running',
            },
          ],
        }
      : {
          id: `run-${Date.now()}`,
          threadId,
          status: 'running',
          model: 'Claude Sonnet',
          context: '12k / 128k',
          events: [],
        }
    runStore = runStore.map((item) => (item.threadId === threadId ? run : item))
    threadStore = threadStore.map((thread) => (thread.id === threadId ? { ...thread, status: 'running', updatedAt: 'Now' } : thread))

    return { messages: await this.getThreadMessages(threadId), run: cloneRun(run) }
  },

  async stopRun(runId: string): Promise<Run> {
    const run = runStore.find((item) => item.id === runId)
    if (!run) throw new Error('Run not found')
    const stopped: Run = {
      ...run,
      status: 'stopped',
      events: [
        ...run.events,
        {
          id: `evt-${Date.now()}`,
          type: 'run.stopped',
          label: 'Stopped',
          detail: 'Stopped by user',
          time: 'Now',
          status: 'stopped',
        },
      ],
    }
    runStore = runStore.map((item) => (item.id === runId ? stopped : item))
    threadStore = threadStore.map((thread) => (thread.id === stopped.threadId ? { ...thread, status: 'stopped' } : thread))
    return cloneRun(stopped)
  },
}
