import { useCallback, useEffect, useMemo, useState } from 'react'
import { apiClient } from './apiClient'
import type { Message, Run, Thread } from './domain'

export function useWorkspaceState() {
  const [threads, setThreads] = useState<Thread[]>([])
  const [selectedThreadId, setSelectedThreadId] = useState('thread-brief')
  const [messages, setMessages] = useState<Message[]>([])
  const [run, setRun] = useState<Run | null>(null)
  const [loading, setLoading] = useState(true)

  const selectedThread = useMemo(
    () => threads.find((thread) => thread.id === selectedThreadId) ?? null,
    [selectedThreadId, threads],
  )

  const refresh = useCallback(async (threadId = selectedThreadId) => {
    setLoading(true)
    const [nextThreads, nextMessages, nextRun] = await Promise.all([
      apiClient.listThreads(),
      apiClient.getThreadMessages(threadId),
      apiClient.getThreadRun(threadId),
    ])
    setThreads(nextThreads)
    setMessages(nextMessages)
    setRun(nextRun)
    setLoading(false)
  }, [selectedThreadId])

  useEffect(() => {
    void refresh(selectedThreadId)
  }, [refresh, selectedThreadId])

  const selectThread = useCallback((threadId: string) => {
    setSelectedThreadId(threadId)
  }, [])

  const sendMessage = useCallback(async (content: string) => {
    const trimmed = content.trim()
    if (!trimmed) return
    const result = await apiClient.sendMessage(selectedThreadId, trimmed)
    setMessages(result.messages)
    setRun(result.run)
    setThreads(await apiClient.listThreads())
  }, [selectedThreadId])

  const stopRun = useCallback(async () => {
    if (!run || run.status !== 'running') return
    setRun(await apiClient.stopRun(run.id))
    setThreads(await apiClient.listThreads())
  }, [run])

  return {
    threads,
    selectedThread,
    selectedThreadId,
    messages,
    run,
    loading,
    refresh,
    selectThread,
    sendMessage,
    stopRun,
  }
}
