'use client'
import { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { useTasks } from '@/hooks/useTasks'

const pageVariants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.22, ease: 'easeOut' } },
  exit: { opacity: 0, y: -12, transition: { duration: 0.15, ease: 'easeIn' } }
}

function DetailContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const id = searchParams.get('id')
  
  const { tasks, ready, updateTask, deleteTask } = useTasks()
  const [showConfirm, setShowConfirm] = useState(false)
  const [showEdit, setShowEdit] = useState(false)

  // Wait until tasks are loaded from localStorage
  if (!ready) return <div className="min-h-screen bg-surface flex items-center justify-center">Memuat...</div>

  const task = tasks.find(t => t.id === id)

  if (!task) {
    return (
      <div className="min-h-screen bg-surface flex flex-col items-center justify-center p-6 text-center">
        <span className="material-symbols-outlined text-[48px] text-on-surface-variant mb-4">error</span>
        <h2 className="font-headline-sm text-on-surface mb-2">Tugas tidak ditemukan</h2>
        <button onClick={() => router.replace('/')} className="px-6 py-2 bg-primary text-on-primary rounded-full font-label-lg">
          Kembali ke Daftar
        </button>
      </div>
    )
  }

  const isGroup = task.type === 'group'
  const isCompleted = task.status === 'completed'

  const handleToggleDone = () => {
    updateTask(task.id, { status: isCompleted ? 'pending' : 'completed' })
  }

  const handleDelete = () => {
    deleteTask(task.id)
    router.replace('/')
  }

  const shareTask = () => {
    if (navigator.share) {
      navigator.share({
        title: task.title,
        text: `Tugas: ${task.title}\nMatkul: ${task.matkul}\nTenggat: ${new Date(task.deadline).toLocaleString('id-ID')}`
      })
    }
  }

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="min-h-screen bg-surface text-on-surface selection:bg-primary/20"
    >
      <header className="fixed top-0 w-full z-50 pt-safe bg-surface/80 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
        <div className="h-16 px-margin flex items-center justify-between">
          <div className="flex items-center gap-space-sm">
            <button
              onClick={() => router.back()}
              className="min-w-[44px] min-h-[44px] -ml-2 rounded-xl flex items-center justify-center text-on-surface hover:bg-surface-container transition-colors"
            >
              <span className="material-symbols-outlined text-[22px]">arrow_back</span>
            </button>
            <h1 className="font-headline-sm text-headline-sm text-on-surface tracking-tight">Detail Tugas</h1>
          </div>
        </div>
      </header>

      <main className="pt-[calc(64px+env(safe-area-inset-top))] px-margin min-h-screen flex flex-col items-center">
        <div className="flex flex-col w-full pb-20 space-y-space-lg">

          {/* Top Actions */}
          <div className="flex items-center justify-end pt-space-xs">
            <div className="flex items-center gap-space-xs">
              <button onClick={shareTask} className="w-9 h-9 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant active:scale-95 transition-transform">
                <span className="material-symbols-outlined text-[19px]">share</span>
              </button>
              <button onClick={() => setShowEdit(true)} className="w-9 h-9 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant active:scale-95 transition-transform">
                <span className="material-symbols-outlined text-[19px]">edit</span>
              </button>
              <button onClick={() => setShowConfirm(true)} className="w-9 h-9 rounded-full bg-error-container/60 flex items-center justify-center text-error active:scale-95 transition-transform">
                <span className="material-symbols-outlined text-[19px]">delete</span>
              </button>
            </div>
          </div>

          {/* Badges */}
          <div className="flex flex-wrap gap-2">
            <div className={`px-3 py-1 rounded-lg flex items-center gap-1.5 font-label-sm text-[12px] ${
              isGroup ? 'bg-secondary-container text-on-secondary-container' : 'bg-primary-container text-on-primary-container'
            }`}>
              <span className="material-symbols-outlined text-[14px]">
                {isGroup ? 'groups' : 'person'}
              </span>
              {isGroup ? 'TUGAS KELOMPOK' : 'TUGAS MANDIRI'}
            </div>
            {task.type === 'practical' && (
              <div className="px-3 py-1 rounded-lg bg-tertiary-container text-on-tertiary-container flex items-center gap-1.5 font-label-sm text-[12px]">
                <span className="material-symbols-outlined text-[14px]">science</span>
                Praktikum / Coding
              </div>
            )}
          </div>

          {/* Titles */}
          <div className="flex flex-col gap-1">
            <h2 className="font-headline-md text-headline-md text-on-surface leading-tight">
              {task.title}
            </h2>
            <p className="font-body-lg text-body-lg text-on-surface-variant">
              {task.matkul}
            </p>
          </div>

          {/* Deadline Card */}
          <div className="p-4 rounded-2xl bg-secondary-container/40 border border-secondary-container/60 flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="material-symbols-outlined text-[20px]">schedule</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="font-label-md text-label-md text-on-surface-variant">Tenggat Pengumpulan</span>
              <span className="font-title-sm text-title-sm text-on-surface">
                {task.deadline ? new Date(task.deadline).toLocaleString('id-ID', {
                  weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
                  hour: '2-digit', minute: '2-digit'
                }) + ' WIB' : '-'}
              </span>
            </div>
          </div>

          {/* Academic Info */}
          <div className="flex flex-col gap-space-sm">
            <h3 className="font-title-md text-title-md text-on-surface flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-[20px]">school</span>
              Informasi Akademik
            </h3>
            
            <div className="grid grid-cols-1 gap-2">
              <div className="p-3 rounded-xl bg-surface-container-lowest border border-outline-variant flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center text-on-surface-variant">
                  <span className="material-symbols-outlined text-[18px]">person_check</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-label-sm text-label-sm text-on-surface-variant">Dosen Pengampu</span>
                  <span className="font-body-md text-body-md text-on-surface">{task.dosen || '-'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Actions Bottom */}
          <div className="flex gap-space-sm pt-space-md">
            <button
              onClick={() => window.open(`https://wa.me/?text=Tugas%20${task.matkul}:%20${task.title}`, '_blank')}
              className="flex-1 py-3 px-4 rounded-xl bg-secondary-container/50 text-on-secondary-container font-label-lg flex items-center justify-center gap-2 active:scale-95 transition-transform"
            >
              <span className="material-symbols-outlined text-[20px]">forum</span>
              Kirim ke WhatsApp
            </button>
            <button
              onClick={handleToggleDone}
              className={`flex-1 py-3 px-4 rounded-xl font-label-lg flex items-center justify-center gap-2 active:scale-95 transition-transform ${
                isCompleted 
                  ? 'bg-primary text-on-primary'
                  : 'bg-primary-container text-on-primary-container'
              }`}
            >
              <span className="material-symbols-outlined text-[20px]" style={isCompleted ? { fontVariationSettings: "'FILL' 1" } : {}}>
                {isCompleted ? 'check_box' : 'check_box_outline_blank'}
              </span>
              {isCompleted ? 'Tersimpan' : 'Tandai Selesai'}
            </button>
          </div>

        </div>
      </main>

      {/* Confirmation Modal */}
      <AnimatePresence>
        {showConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-scrim/40 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-sm bg-surface-container-highest rounded-[28px] p-6 shadow-elevation-3"
            >
              <div className="flex flex-col items-center text-center gap-4">
                <div className="w-12 h-12 rounded-full bg-error-container text-error flex items-center justify-center mb-1">
                  <span className="material-symbols-outlined text-[24px]">delete</span>
                </div>
                <h3 className="font-headline-sm text-on-surface">Hapus Tugas?</h3>
                <p className="font-body-md text-on-surface-variant">
                  Tugas ini akan dihapus secara permanen dan tidak bisa dikembalikan.
                </p>
                <div className="flex w-full gap-3 mt-4">
                  <button
                    onClick={() => setShowConfirm(false)}
                    className="flex-1 py-2.5 rounded-full font-label-lg text-on-surface hover:bg-surface-container transition-colors"
                  >
                    Batal
                  </button>
                  <button
                    onClick={handleDelete}
                    className="flex-1 py-2.5 rounded-full font-label-lg bg-error text-on-error hover:bg-error/90 transition-colors"
                  >
                    Hapus
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default function TaskDetail() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-surface flex items-center justify-center">Memuat...</div>}>
      <DetailContent />
    </Suspense>
  )
}
