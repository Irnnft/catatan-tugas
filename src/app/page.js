'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import AppHeader from '@/components/AppHeader'
import BottomNav from '@/components/BottomNav'
import TaskCard from '@/components/TaskCard'
import { useTasks } from '@/hooks/useTasks'

const pageVariants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.22, ease: 'easeOut' } },
}

export default function HomePage() {
  const { tasks, ready, toggleDone, deleteTask } = useTasks()
  const [activeTab, setActiveTab] = useState('all')
  const [search, setSearch] = useState('')

  const indiv   = tasks.filter(t => t.type === 'individual').length
  const grp     = tasks.filter(t => t.type === 'group').length
  const done    = tasks.filter(t => t.status === 'completed').length

  const filtered = tasks
    .filter(t => activeTab === 'all' || t.type === activeTab)
    .filter(t => {
      if (!search) return true
      const q = search.toLowerCase()
      return (
        t.title?.toLowerCase().includes(q) ||
        t.subject?.toLowerCase().includes(q) ||
        t.dosen?.toLowerCase().includes(q)
      )
    })

  const tabs = [
    { key: 'all',        label: `Semua (${tasks.length})` },
    { key: 'individual', label: `👤 Mandiri (${indiv})` },
    { key: 'group',      label: `👥 Tim (${grp})` },
  ]

  if (!ready) return (
    <div className="flex items-center justify-center min-h-dvh bg-surface">
      <span className="material-symbols-outlined text-[40px] text-primary animate-spin">progress_activity</span>
    </div>
  )

  return (
    <div className="flex flex-col min-h-dvh bg-surface">
      <AppHeader />
      <motion.main
        className="flex flex-col w-full px-margin pt-20 pb-28"
        variants={pageVariants}
        initial="initial"
        animate="animate"
      >
        <div className="flex flex-col w-full gap-space-md">

          {/* Greeting */}
          <section className="flex flex-col gap-space-sm p-space-md rounded-xl bg-surface-container-lowest shadow-sm relative overflow-hidden">
            <div className="absolute -right-6 -bottom-6 w-24 h-24 rounded-full bg-primary-fixed/30 pointer-events-none blur-xl" />
            <div className="flex items-start justify-between">
              <div className="flex flex-col">
                <span className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface">Halo Mahasiswa! 👋</span>
                <span className="font-body-sm text-body-sm text-on-surface-variant">Yuk rapikan daftar target kuliahmu hari ini.</span>
              </div>
              <div className="flex items-center gap-1.5 px-space-sm py-1 rounded-full bg-primary-fixed/40 text-on-primary-container">
                <span className="material-symbols-outlined text-[14px]">smartphone</span>
                <span className="font-label-sm text-[11px]">HP Lokal</span>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-space-xs mt-space-xs">
              <div className="flex flex-col items-center justify-center py-2 px-1 rounded-lg bg-surface-container-low text-center">
                <span className="font-headline-sm text-headline-sm text-primary">{indiv}</span>
                <span className="font-label-sm text-[11px] text-on-surface-variant">Individu</span>
              </div>
              <div className="flex flex-col items-center justify-center py-2 px-1 rounded-lg bg-secondary-fixed/40 text-center">
                <span className="font-headline-sm text-headline-sm text-secondary">{grp}</span>
                <span className="font-label-sm text-[11px] text-on-secondary-container">Kelompok</span>
              </div>
              <div className="flex flex-col items-center justify-center py-2 px-1 rounded-lg bg-tertiary-fixed/60 text-center">
                <span className="font-headline-sm text-headline-sm text-tertiary">{done}</span>
                <span className="font-label-sm text-[11px] text-on-tertiary-container">Selesai</span>
              </div>
            </div>
          </section>

          {/* Filter */}
          <section className="flex flex-col gap-space-sm">
            <div className="grid grid-cols-3 p-1 rounded-xl bg-surface-container-high text-center">
              {tabs.map(tab => (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setActiveTab(tab.key)}
                  className={`py-1.5 px-2 rounded-lg font-label-md text-label-md transition-all ${
                    activeTab === tab.key
                      ? 'bg-surface-container-lowest text-primary shadow-sm'
                      : 'text-on-surface-variant hover:text-on-surface'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-space-xs px-3 py-2 bg-surface-container-lowest rounded-xl shadow-sm">
              <span className="material-symbols-outlined text-outline text-[18px]">search</span>
              <input
                className="w-full bg-transparent text-on-surface placeholder:text-outline text-body-sm font-body-sm focus:outline-none"
                placeholder="Cari matkul atau tugas..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
          </section>

          {/* Task List */}
          <section className="flex flex-col gap-space-md">
            <AnimatePresence mode="popLayout">
              {filtered.length === 0 ? (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex flex-col items-center justify-center py-16 gap-4"
                >
                  <div className="w-16 h-16 rounded-2xl bg-surface-container flex items-center justify-center">
                    <span className="material-symbols-outlined text-[36px] text-outline">inbox</span>
                  </div>
                  <div className="text-center">
                    <p className="font-headline-sm text-headline-sm text-on-surface">Belum ada tugas</p>
                    <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
                      Tekan tombol + untuk menambah tugas pertama
                    </p>
                  </div>
                </motion.div>
              ) : (
                filtered.map(task => (
                  <motion.div
                    key={task.id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.18 }}
                  >
                    <TaskCard task={task} onToggleDone={toggleDone} onDelete={deleteTask} />
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </section>

          {/* Privacy Note */}
          <section className="flex items-center gap-space-sm p-space-sm rounded-xl bg-surface-container-low text-on-surface-variant">
            <div className="w-8 h-8 rounded-lg bg-primary-fixed/40 flex items-center justify-center text-primary flex-shrink-0">
              <span className="material-symbols-outlined text-[18px]">verified_user</span>
            </div>
            <p className="font-body-sm text-[12px] leading-snug">
              <span className="font-semibold text-on-surface">Data Offline & Privat:</span>{' '}
              Tugas tersimpan langsung di browser HP kamu tanpa perlu akun atau koneksi internet.
            </p>
          </section>

        </div>
      </motion.main>
      <BottomNav />
    </div>
  )
}
