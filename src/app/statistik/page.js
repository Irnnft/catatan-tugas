'use client'
import { motion, AnimatePresence } from 'framer-motion'
import BottomNav from '@/components/BottomNav'
import { useTasks } from '@/hooks/useTasks'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

const pageVariants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.22, ease: 'easeOut' } },
}

export default function StatistikPage() {
  const router = useRouter()
  const { tasks, ready, updateTask, clearArchive } = useTasks()

  if (!ready) return <div className="min-h-dvh bg-surface" />

  const total = tasks.length
  const completedTasks = tasks.filter(t => t.status === 'completed')
  const done = completedTasks.length
  const pending = total - done
  const indiv = tasks.filter(t => t.type === 'individual').length
  const grp = tasks.filter(t => t.type === 'group').length
  const pct = total > 0 ? Math.round((done / total) * 100) : 0

  const bySubject = {}
  tasks.forEach(t => {
    const key = t.subject || 'Tanpa Mata Kuliah'
    if (!bySubject[key]) bySubject[key] = { total: 0, done: 0 }
    bySubject[key].total++
    if (t.status === 'completed') bySubject[key].done++
  })

  const unarchive = (id) => updateTask(id, { status: 'pending' })

  const handleClearArchive = () => {
    if (confirm('Hapus semua tugas yang sudah selesai dari arsip?')) {
      clearArchive()
    }
  }

  return (
    <div className="flex flex-col min-h-dvh bg-surface">
      <header className="fixed top-0 w-full z-50 pt-safe bg-surface/80 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
        <div className="h-20 px-margin flex items-center justify-between">
          <div className="flex items-center gap-space-sm">
            <div className="w-11 h-11 rounded-xl bg-secondary-fixed/50 flex items-center justify-center text-secondary">
              <span className="material-symbols-outlined text-[24px]">analytics</span>
            </div>
            <div className="flex flex-col">
              <span className="font-headline-sm text-headline-sm text-on-surface tracking-tight">Arsip & Statistik</span>
              <span className="font-label-sm text-[11px] text-on-surface-variant">Ringkasan progres semester</span>
            </div>
          </div>
        </div>
      </header>

      <motion.main
        className="flex flex-col relative w-full px-margin pt-20 pb-28"
        variants={pageVariants}
        initial="initial"
        animate="animate"
      >
        <div className="flex flex-col w-full gap-space-lg">
          {total === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <div className="w-16 h-16 rounded-2xl bg-surface-container flex items-center justify-center">
                <span className="material-symbols-outlined text-[36px] text-outline">insert_chart</span>
              </div>
              <div className="text-center">
                <p className="font-headline-sm text-headline-sm text-on-surface">Belum ada data statistik</p>
                <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">Tambah tugas terlebih dahulu untuk melihat statistik</p>
              </div>
              <Link href="/tambah" className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-on-primary font-label-md text-label-md">
                <span className="material-symbols-outlined text-[18px]">add</span> Tambah Tugas Pertama
              </Link>
            </div>
          ) : (
            <>
              {/* Ringkasan Utama */}
              <section className="flex flex-col gap-space-sm p-space-md rounded-xl bg-surface-container-lowest shadow-sm relative overflow-hidden">
                <div className="absolute -right-4 -top-4 w-20 h-20 rounded-full bg-primary-fixed/20 blur-xl pointer-events-none" />
                <div className="flex items-center gap-2 mb-1">
                  <span className="material-symbols-outlined text-primary text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>bar_chart</span>
                  <h2 className="font-headline-sm text-headline-sm text-on-surface">Ringkasan Semester</h2>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-label-sm text-label-sm text-on-surface-variant">Progress Keseluruhan</span>
                    <span className="font-label-sm text-label-sm text-primary font-bold">{pct}%</span>
                  </div>
                  <div className="w-full h-3 rounded-full bg-surface-container overflow-hidden">
                    <motion.div
                      className="h-full bg-primary rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 0.7, ease: 'easeOut' }}
                    />
                  </div>
                  <p className="font-body-sm text-[11px] text-on-surface-variant">{done} dari {total} tugas telah diselesaikan</p>
                </div>
              </section>

              {/* Grid Stats */}
              <div className="grid grid-cols-2 gap-space-sm">
                <div className="flex flex-col gap-1 p-space-md rounded-xl bg-surface-container-lowest shadow-sm">
                  <div className="w-8 h-8 rounded-lg bg-primary-fixed/50 flex items-center justify-center text-primary mb-1">
                    <span className="material-symbols-outlined text-[18px]">pending_actions</span>
                  </div>
                  <span className="font-headline-sm text-headline-sm text-on-surface">{pending}</span>
                  <span className="font-label-sm text-[12px] text-on-surface-variant">Belum Selesai</span>
                </div>
                <div className="flex flex-col gap-1 p-space-md rounded-xl bg-surface-container-lowest shadow-sm">
                  <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center text-primary mb-1">
                    <span className="material-symbols-outlined text-[18px]">done_all</span>
                  </div>
                  <span className="font-headline-sm text-headline-sm text-primary">{done}</span>
                  <span className="font-label-sm text-[12px] text-on-surface-variant">Telah Selesai</span>
                </div>
                <div className="flex flex-col gap-1 p-space-md rounded-xl bg-surface-container-lowest shadow-sm">
                  <div className="w-8 h-8 rounded-lg bg-surface-container-low flex items-center justify-center text-on-surface-variant mb-1">
                    <span className="material-symbols-outlined text-[18px]">person</span>
                  </div>
                  <span className="font-headline-sm text-headline-sm text-on-surface">{indiv}</span>
                  <span className="font-label-sm text-[12px] text-on-surface-variant">Tugas Individu</span>
                </div>
                <div className="flex flex-col gap-1 p-space-md rounded-xl bg-surface-container-lowest shadow-sm">
                  <div className="w-8 h-8 rounded-lg bg-secondary-fixed/40 flex items-center justify-center text-secondary mb-1">
                    <span className="material-symbols-outlined text-[18px]">groups</span>
                  </div>
                  <span className="font-headline-sm text-headline-sm text-secondary">{grp}</span>
                  <span className="font-label-sm text-[12px] text-on-secondary-container">Tugas Kelompok</span>
                </div>
              </div>

              {/* Per Mata Kuliah */}
              {Object.keys(bySubject).length > 0 && (
                <section className="flex flex-col gap-space-md p-space-md rounded-xl bg-surface-container-lowest shadow-sm">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>auto_stories</span>
                    <h2 className="font-headline-sm text-headline-sm text-on-surface">Progress per Mata Kuliah</h2>
                  </div>
                  <div className="flex flex-col gap-space-md">
                    {Object.entries(bySubject).map(([subj, data]) => {
                      const pctSubj = Math.round((data.done / data.total) * 100)
                      return (
                        <div key={subj} className="flex flex-col gap-1">
                          <div className="flex items-center justify-between">
                            <span className="font-label-sm text-label-sm text-on-surface truncate max-w-[65%]">{subj}</span>
                            <span className="font-label-sm text-[11px] text-on-surface-variant">{data.done}/{data.total} selesai</span>
                          </div>
                          <div className="w-full h-2 rounded-full bg-surface-container overflow-hidden">
                            <motion.div
                              className="h-full bg-primary rounded-full"
                              initial={{ width: 0 }}
                              animate={{ width: `${pctSubj}%` }}
                              transition={{ duration: 0.7, ease: 'easeOut' }}
                            />
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </section>
              )}

              {/* Arsip Tugas Selesai */}
              <section className="flex flex-col gap-space-md">
                <div className="flex items-center justify-between px-1">
                  <div className="flex items-center gap-space-xs">
                    <span className="material-symbols-outlined text-[20px] text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>inventory_2</span>
                    <h2 className="font-headline-sm text-headline-sm text-on-surface">Arsip Tugas Selesai</h2>
                  </div>
                  <span className="font-label-sm text-label-sm px-2 py-0.5 rounded-full bg-surface-container text-on-surface-variant">{completedTasks.length} tugas</span>
                </div>
                <div className="rounded-xl bg-surface-container-lowest shadow-sm p-space-sm space-y-2">
                  <AnimatePresence>
                    {completedTasks.length > 0 ? completedTasks.map(task => (
                      <motion.div
                        key={task.id}
                        layout
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="flex items-start gap-3 p-3 rounded-lg bg-surface-container-lowest"
                      >
                        <div className="w-8 h-8 rounded-lg bg-primary-fixed flex items-center justify-center text-primary flex-shrink-0 mt-0.5">
                          <span className="material-symbols-outlined text-[18px]">task_alt</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-label-md text-label-md text-on-surface font-semibold truncate">{task.title}</p>
                          <p className="font-body-sm text-[11px] text-on-surface-variant mt-0.5">{task.subject || '-'} • Tenggat {task.date || '-'}</p>
                        </div>
                        <button
                          onClick={() => unarchive(task.id)}
                          className="text-on-surface-variant hover:text-primary p-1 rounded-lg hover:bg-surface-container transition-colors"
                          title="Aktifkan kembali"
                        >
                          <span className="material-symbols-outlined text-[18px]">restart_alt</span>
                        </button>
                      </motion.div>
                    )) : (
                      <div className="py-8 text-center text-on-surface-variant font-body-sm text-body-sm">
                        Belum ada tugas yang selesai
                      </div>
                    )}
                  </AnimatePresence>
                  {completedTasks.length > 0 && (
                    <div className="pt-2">
                      <button
                        onClick={handleClearArchive}
                        className="w-full py-2.5 rounded-lg bg-error-container/40 hover:bg-error-container text-error font-label-md text-label-md flex items-center justify-center gap-2 transition-colors"
                      >
                        <span className="material-symbols-outlined text-[18px]">delete_sweep</span>
                        Hapus Semua Arsip
                      </button>
                    </div>
                  )}
                </div>
              </section>

              {/* Tip */}
              <section className="flex items-center gap-space-sm p-space-sm rounded-xl bg-surface-container-low text-on-surface-variant">
                <div className="w-8 h-8 rounded-lg bg-secondary-fixed/40 flex items-center justify-center text-secondary flex-shrink-0">
                  <span className="material-symbols-outlined text-[18px]">lightbulb</span>
                </div>
                <p className="font-body-sm text-[12px] leading-snug">
                  <span className="font-semibold text-on-surface">Tips:</span> Selesaikan tugas paling berat lebih dahulu untuk menjaga momentum belajar.
                </p>
              </section>
            </>
          )}
        </div>
      </motion.main>
      <BottomNav />
    </div>
  )
}
