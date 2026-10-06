'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { useTasks } from '@/hooks/useTasks'

const pageVariants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.22, ease: 'easeOut' } },
}

export default function DetailPage({ params }) {
  const router = useRouter()
  const { tasks, ready, toggleDone, toggleSubtask, deleteTask, updateTask } = useTasks()
  const [showConfirm, setShowConfirm] = useState(false)
  const [showEdit, setShowEdit] = useState(false)
  const [copied, setCopied] = useState(false)

  // Edit form state
  const [editForm, setEditForm] = useState({})

  if (!ready) return <div className="min-h-dvh bg-surface" />

  const task = tasks.find(t => t.id === params.id)
  if (!task) {
    return (
      <div className="flex flex-col items-center justify-center min-h-dvh bg-surface gap-4">
        <p className="font-headline-sm text-on-surface">Tugas tidak ditemukan</p>
        <button onClick={() => router.push('/')} className="text-primary font-label-md">Kembali ke Beranda</button>
      </div>
    )
  }

  const isGroup = task.type === 'group'
  const isCompleted = task.status === 'completed'
  const subs = task.subtasks || []
  const doneSubs = task.completedSubtasks || []
  const pct = subs.length > 0 ? Math.round((doneSubs.length / subs.length) * 100) : 0
  const fileSlug = ((task.subject || 'TUGAS').toUpperCase().replace(/[^A-Z0-9]/g, '_').substring(0, 12)) + '_' + (isGroup ? 'KELOMPOK' : 'MANDIRI')

  const copyFileName = () => {
    const text = fileSlug + '.pdf'
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }).catch(() => alert('Nama file: ' + text))
  }

  const shareTask = () => {
    const text = `📚 Pengingat Tugas\n*${task.title}*\nMata Kuliah: ${task.subject || '-'}\nTenggat: ${task.date || '-'} pukul ${task.time || '23:59'} WIB\nFormat: ${task.format || '-'}`
    if (navigator.share) navigator.share({ title: task.title, text })
    else window.open('https://api.whatsapp.com/send?text=' + encodeURIComponent(text), '_blank')
  }

  const openEdit = () => {
    setEditForm({
      title: task.title || '',
      subject: task.subject || '',
      date: task.date || '',
      time: task.time || '23:59',
      dosen: task.dosen || '',
      link: task.link || '',
      catatan: task.catatan || '',
    })
    setShowEdit(true)
  }

  const saveEdit = () => {
    updateTask(task.id, editForm)
    setShowEdit(false)
  }

  const handleDelete = () => {
    deleteTask(task.id)
    setShowConfirm(false)
    router.push('/')
  }

  return (
    <div className="flex flex-col min-h-dvh bg-surface">
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

      <motion.main
        className="flex flex-col relative w-full px-margin pt-20 pb-safe"
        variants={pageVariants}
        initial="initial"
        animate="animate"
      >
        <div className="flex flex-col w-full pb-20 space-y-space-lg">

          {/* Top Actions */}
          <div className="flex items-center justify-end pt-space-xs">
            <div className="flex items-center gap-space-xs">
              <button onClick={shareTask} className="w-9 h-9 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant active:scale-95 transition-transform">
                <span className="material-symbols-outlined text-[19px]">share</span>
              </button>
              <button onClick={openEdit} className="w-9 h-9 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant active:scale-95 transition-transform">
                <span className="material-symbols-outlined text-[19px]">edit</span>
              </button>
              <button onClick={() => setShowConfirm(true)} className="w-9 h-9 rounded-full bg-error-container flex items-center justify-center text-on-error-container active:scale-95 transition-transform">
                <span className="material-symbols-outlined text-[19px]">delete</span>
              </button>
            </div>
          </div>

          {/* Badges */}
          <div className="flex flex-wrap items-center gap-space-xs">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary-container text-on-secondary-container font-label-sm text-label-sm">
              <span className="material-symbols-outlined text-[15px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                {isGroup ? 'groups' : 'person'}
              </span>
              {isGroup ? 'TUGAS KELOMPOK' : 'TUGAS MANDIRI'}
            </span>
            {task.kelas && (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-surface-container-high text-on-surface-variant font-label-sm text-label-sm">
                <span className="material-symbols-outlined text-[15px]">school</span>{task.kelas}
              </span>
            )}
            {task.format && (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-tertiary-fixed text-on-tertiary-fixed-variant font-label-sm text-label-sm">
                <span className="material-symbols-outlined text-[15px]">article</span>{task.format}
              </span>
            )}
          </div>

          {/* Main Info */}
          <div className="rounded-xl bg-surface-container-lowest p-space-md shadow-md space-y-space-md">
            <div>
              <h2 className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface leading-snug">{task.title}</h2>
              {task.catatan && <p className="font-body-md text-body-md text-on-surface-variant mt-1">{task.catatan}</p>}
            </div>
            {task.date && (
              <div className="flex items-center gap-space-sm px-3.5 py-2.5 rounded-lg bg-tertiary-fixed text-on-tertiary-fixed">
                <span className="material-symbols-outlined text-[22px] text-tertiary" style={{ fontVariationSettings: "'FILL' 1" }}>timer</span>
                <div className="flex flex-col">
                  <span className="font-label-sm text-label-sm font-semibold">Tenggat Pengumpulan</span>
                  <span className="font-body-sm text-body-sm text-on-tertiary-fixed-variant">{task.date} • {task.time || '23:59'} WIB</span>
                </div>
              </div>
            )}
          </div>

          {/* Members */}
          {isGroup && task.members?.length > 0 && (
            <div className="space-y-space-sm">
              <div className="flex items-center justify-between px-1">
                <div className="flex items-center gap-space-xs">
                  <span className="material-symbols-outlined text-[20px] text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>diversity_3</span>
                  <h3 className="font-headline-sm text-headline-sm text-on-surface">Anggota Kelompok & Peran</h3>
                </div>
                <span className="font-label-sm text-label-sm px-2 py-0.5 rounded-full bg-surface-container text-on-surface-variant">{task.members.length} Mahasiswa</span>
              </div>
              <div className="rounded-xl bg-surface-container-lowest p-space-sm shadow-sm space-y-2">
                {task.members.map((m, i) => {
                  const initials = m.split(' ').slice(0, 2).map(n => n[0]).join('').toUpperCase()
                  const colors = ['bg-primary-fixed text-on-primary-fixed', 'bg-secondary-fixed text-on-secondary-fixed', 'bg-tertiary-fixed text-on-tertiary-fixed', 'bg-surface-container text-on-surface-variant']
                  return (
                    <div key={i} className={`flex items-center gap-space-sm p-2.5 rounded-lg ${i === 0 ? 'bg-surface-container-low' : 'bg-surface-bright'}`}>
                      <div className={`relative w-10 h-10 rounded-full ${colors[i % 4]} flex-shrink-0 flex items-center justify-center font-label-md font-bold`}>
                        {initials}
                        {i === 0 && <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-primary rounded-full flex items-center justify-center"><span className="material-symbols-outlined text-[10px] text-on-primary">star</span></span>}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <p className="font-label-md text-label-md text-on-surface font-semibold truncate">{m}</p>
                          {i === 0 && <span className="px-1.5 py-0.5 rounded bg-primary text-on-primary font-label-sm text-[10px] uppercase">Ketua</span>}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Akademik */}
          {(task.dosen || task.kelas) && (
            <div className="space-y-space-sm">
              <div className="flex items-center gap-space-xs px-1">
                <span className="material-symbols-outlined text-[20px] text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>menu_book</span>
                <h3 className="font-headline-sm text-headline-sm text-on-surface">Informasi Akademik</h3>
              </div>
              <div className="rounded-xl bg-surface-container-lowest p-space-md shadow-sm space-y-3">
                {task.dosen && (
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center text-primary flex-shrink-0"><span className="material-symbols-outlined text-[20px]">badge</span></div>
                    <div><p className="font-label-sm text-label-sm text-on-surface-variant">Dosen Pengampu</p><p className="font-label-md text-label-md text-on-surface font-medium">{task.dosen}</p></div>
                  </div>
                )}
                {task.kelas && (
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center text-secondary flex-shrink-0"><span className="material-symbols-outlined text-[20px]">meeting_room</span></div>
                    <div><p className="font-label-sm text-label-sm text-on-surface-variant">Kelas</p><p className="font-label-md text-label-md text-on-surface font-medium">{task.kelas}</p></div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Subtasks */}
          {subs.length > 0 && (
            <div className="space-y-space-sm">
              <div className="flex items-center justify-between px-1">
                <div className="flex items-center gap-space-xs">
                  <span className="material-symbols-outlined text-[20px] text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>checklist</span>
                  <h3 className="font-headline-sm text-headline-sm text-on-surface">Ceklis Instruksi Tugas</h3>
                </div>
                <span className="font-label-sm text-label-sm text-primary font-semibold">{doneSubs.length} dari {subs.length} Selesai</span>
              </div>
              <div className="rounded-xl bg-surface-container-lowest p-space-md shadow-sm space-y-space-md">
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <span className="font-label-sm text-label-sm text-on-surface-variant font-medium">Progres Pengerjaan</span>
                    <span className="font-label-sm text-label-sm text-primary font-bold">{pct}% Siap</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-surface-container overflow-hidden">
                    <motion.div
                      className="h-full bg-primary rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 0.5, ease: 'easeOut' }}
                    />
                  </div>
                </div>
                <div className="space-y-2.5">
                  {subs.map((st, i) => {
                    const done = doneSubs.includes(i)
                    return (
                      <label key={i} className="flex items-start gap-3 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={done}
                          onChange={() => toggleSubtask(task.id, i)}
                          className="mt-0.5 w-5 h-5 rounded accent-primary cursor-pointer"
                        />
                        <span className={`font-body-md text-body-md flex-1 leading-tight transition-colors ${done ? 'line-through text-on-surface-variant' : 'text-on-surface'}`}>
                          {st}
                        </span>
                      </label>
                    )
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Pengumpulan */}
          <div className="space-y-space-sm">
            <div className="flex items-center gap-space-xs px-1">
              <span className="material-symbols-outlined text-[20px] text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>cloud_upload</span>
              <h3 className="font-headline-sm text-headline-sm text-on-surface">Pengumpulan Resmi</h3>
            </div>
            <div className="rounded-xl bg-surface-container-lowest p-space-md shadow-sm space-y-space-md">
              <div className="space-y-1.5">
                <span className="font-label-sm text-label-sm text-on-surface-variant">Standar Penamaan Berkas:</span>
                <div
                  onClick={copyFileName}
                  className="flex items-center justify-between p-3 rounded-lg bg-surface-container-low cursor-pointer active:bg-surface-container transition-colors"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="material-symbols-outlined text-primary text-[20px]">description</span>
                    <span className="font-label-md text-label-md font-semibold text-on-surface truncate">{fileSlug}.pdf</span>
                  </div>
                  <span className="font-label-sm text-label-sm text-primary flex items-center gap-1 flex-shrink-0">
                    <span className="material-symbols-outlined text-[16px]">{copied ? 'done' : 'content_copy'}</span>
                    {copied ? 'Tersalin!' : 'Salin'}
                  </span>
                </div>
              </div>
              <a
                href={task.link || 'https://classroom.google.com'}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-primary text-on-primary font-headline-sm text-headline-sm font-semibold shadow-md active:scale-[0.99] transition-transform text-center"
              >
                <span>Buka Tautan Pengumpulan</span>
                <span className="material-symbols-outlined text-[20px]">north_east</span>
              </a>
            </div>
          </div>
        </div>
      </motion.main>

      {/* Sticky Bottom Actions */}
      <div className="fixed bottom-0 left-0 w-full z-40 pb-safe">
        <div className="px-margin pb-2 pt-4 bg-gradient-to-t from-surface via-surface to-transparent">
          <div className="rounded-xl bg-surface-container-lowest/95 backdrop-blur-md p-space-sm shadow-xl flex items-center gap-space-sm border border-surface-container-high">
            <button onClick={shareTask} className="flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg bg-secondary-container text-on-secondary-container font-label-md text-label-md active:scale-95 transition-transform">
              <span className="material-symbols-outlined text-[18px]">chat</span>
              <span className="truncate">Kirim ke WhatsApp</span>
            </button>
            <button
              onClick={() => toggleDone(task.id)}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg font-label-md text-label-md active:scale-95 transition-transform ${isCompleted ? 'bg-primary-container text-on-primary-container' : 'bg-surface-container text-on-surface'}`}
            >
              <span className="material-symbols-outlined text-[18px]">{isCompleted ? 'check_circle' : 'task_alt'}</span>
              <span className="truncate">{isCompleted ? 'Sudah Selesai' : 'Tandai Selesai'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Modals */}
      <AnimatePresence>
        {showConfirm && (
          <div className="fixed inset-0 z-[200] flex items-end justify-center">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-on-surface/40 backdrop-blur-sm"
              onClick={() => setShowConfirm(false)}
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="relative w-full max-w-md bg-surface rounded-t-2xl p-6 space-y-4 shadow-2xl"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-error-container flex items-center justify-center text-error flex-shrink-0">
                  <span className="material-symbols-outlined text-[22px]">delete_forever</span>
                </div>
                <div>
                  <p className="font-headline-sm text-headline-sm text-on-surface">Hapus Tugas?</p>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">Tindakan ini tidak bisa dibatalkan.</p>
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button onClick={() => setShowConfirm(false)} className="flex-1 py-3 rounded-xl bg-surface-container text-on-surface font-label-md text-label-md transition-colors hover:bg-surface-container-high">Batal</button>
                <button onClick={handleDelete} className="flex-1 py-3 rounded-xl bg-error text-on-error font-label-md text-label-md transition-colors">Hapus</button>
              </div>
            </motion.div>
          </div>
        )}

        {showEdit && (
          <div className="fixed inset-0 z-[200] flex items-end justify-center">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-on-surface/40 backdrop-blur-sm"
              onClick={() => setShowEdit(false)}
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="relative w-full max-w-md bg-surface rounded-t-2xl p-6 space-y-4 shadow-2xl max-h-[85dvh] overflow-y-auto flex flex-col"
            >
              <div className="flex items-center justify-between shrink-0 pb-2">
                <p className="font-headline-sm text-headline-sm text-on-surface">Edit Tugas</p>
                <button onClick={() => setShowEdit(false)} className="w-8 h-8 flex items-center justify-center text-on-surface-variant hover:text-on-surface rounded-full">
                  <span className="material-symbols-outlined text-[20px]">close</span>
                </button>
              </div>
              <div className="flex flex-col gap-space-md overflow-y-auto pb-4">
                <div className="flex flex-col gap-1.5">
                  <label className="font-label-sm text-label-sm text-on-surface-variant font-medium">Judul Tugas</label>
                  <input value={editForm.title} onChange={e => setEditForm(p => ({ ...p, title: e.target.value }))} className="w-full rounded-lg bg-surface-container-low px-3 py-2.5 text-on-surface font-body-sm text-body-sm focus:outline-none" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="font-label-sm text-label-sm text-on-surface-variant font-medium">Mata Kuliah</label>
                  <input value={editForm.subject} onChange={e => setEditForm(p => ({ ...p, subject: e.target.value }))} className="w-full rounded-lg bg-surface-container-low px-3 py-2.5 text-on-surface font-body-sm text-body-sm focus:outline-none" />
                </div>
                <div className="grid grid-cols-2 gap-space-sm">
                  <div className="flex flex-col gap-1.5">
                    <label className="font-label-sm text-label-sm text-on-surface-variant font-medium">Tanggal Tenggat</label>
                    <input type="date" value={editForm.date} onChange={e => setEditForm(p => ({ ...p, date: e.target.value }))} className="w-full rounded-lg bg-surface-container-low px-3 py-2.5 text-on-surface font-body-sm text-body-sm focus:outline-none" />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="font-label-sm text-label-sm text-on-surface-variant font-medium">Jam</label>
                    <input type="time" value={editForm.time} onChange={e => setEditForm(p => ({ ...p, time: e.target.value }))} className="w-full rounded-lg bg-surface-container-low px-3 py-2.5 text-on-surface font-body-sm text-body-sm focus:outline-none" />
                  </div>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="font-label-sm text-label-sm text-on-surface-variant font-medium">Dosen Pengampu</label>
                  <input value={editForm.dosen} onChange={e => setEditForm(p => ({ ...p, dosen: e.target.value }))} className="w-full rounded-lg bg-surface-container-low px-3 py-2.5 text-on-surface font-body-sm text-body-sm focus:outline-none" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="font-label-sm text-label-sm text-on-surface-variant font-medium">Tautan Pengumpulan</label>
                  <input type="url" value={editForm.link} onChange={e => setEditForm(p => ({ ...p, link: e.target.value }))} className="w-full rounded-lg bg-surface-container-low px-3 py-2.5 text-on-surface font-body-sm text-body-sm focus:outline-none" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="font-label-sm text-label-sm text-on-surface-variant font-medium">Catatan</label>
                  <textarea rows={3} value={editForm.catatan} onChange={e => setEditForm(p => ({ ...p, catatan: e.target.value }))} className="w-full rounded-lg bg-surface-container-low px-3 py-2.5 text-on-surface font-body-sm text-body-sm focus:outline-none resize-none" />
                </div>
              </div>
              <button onClick={saveEdit} className="w-full shrink-0 py-3 rounded-xl bg-primary text-on-primary font-label-md text-label-md">Simpan Perubahan</button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  )
}
