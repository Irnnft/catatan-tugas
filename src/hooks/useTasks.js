'use client'
import { useState, useEffect, useCallback } from 'react'

const KEY = 'kartututas_v2'

export function useTasks() {
  const [tasks, setTasks] = useState([])
  const [ready, setReady] = useState(false)

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem(KEY) || '[]')
      setTasks(stored)
    } catch {
      setTasks([])
    }
    setReady(true)
  }, [])

  const persist = useCallback((updated) => {
    setTasks(updated)
    localStorage.setItem(KEY, JSON.stringify(updated))
  }, [])

  const addTask = useCallback((task) => {
    persist([{ ...task, id: 'task_' + Date.now() }, ...tasks])
  }, [tasks, persist])

  const updateTask = useCallback((id, patch) => {
    persist(tasks.map(t => t.id === id ? { ...t, ...patch } : t))
  }, [tasks, persist])

  const deleteTask = useCallback((id) => {
    persist(tasks.filter(t => t.id !== id))
  }, [tasks, persist])

  const toggleDone = useCallback((id) => {
    persist(tasks.map(t =>
      t.id === id ? { ...t, status: t.status === 'completed' ? 'pending' : 'completed' } : t
    ))
  }, [tasks, persist])

  const toggleSubtask = useCallback((taskId, index) => {
    persist(tasks.map(t => {
      if (t.id !== taskId) return t
      const done = t.completedSubtasks || []
      const updated = done.includes(index)
        ? done.filter(i => i !== index)
        : [...done, index]
      return { ...t, completedSubtasks: updated }
    }))
  }, [tasks, persist])

  const clearArchive = useCallback(() => {
    persist(tasks.filter(t => t.status !== 'completed'))
  }, [tasks, persist])

  return { tasks, ready, addTask, updateTask, deleteTask, toggleDone, toggleSubtask, clearArchive }
}
