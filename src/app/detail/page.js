'use client'
import { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { useTasks } from '@/hooks/useTasks'

const pageVariants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.22, ease: 'easeOut' } },
}

function DetailContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const id = searchParams.get('id')

  const { tasks, ready, toggleDone, toggleSubtask, deleteTask, updateTask } = useTasks()
  const [showConfirm, setShowConfirm] = useState(false)
  const [showEdit, setShowEdit] = useState(false)
  const [copied, setCopied] = useState(false)
  const [editForm, setEditForm] = useState({})
  const [editSubs, setEditSubs] = useState([])

  if (!ready) return <div className="min-h-dvh bg-surface" />

  const task = tasks.find(t => t.id === id)
  if (!task) {
    return (
      <div className="flex flex-col items-center justify-center min-h-dvh bg-surface gap-3 px-margin">
        <span className="material-symbols-outlined text-[40px] text-outline">search_off</span>
        <p className="font-headline-sm text-on-surface text-center">Tugas tidak ditemukan</p>
        <button onClick={() => router.push('/')} className="px-4 py-2 bg-primary text-on-primary rounded-full font-label-md text-label-md">
          Kembali ke Beranda
        </button>
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
    const text = `📚 *${task.title}*\nMatkul: ${task.subject || '-'}\nTenggat: ${task.date || '-'} • ${task.time || '23:59'} WIB\nFormat: ${task.format || '-'}`
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
    setEditSubs([...(task.subtasks || [])])
    setShowEdit(true)
  }

  const saveEdit = () => {
    updateTask(task.id, { ...editForm, subtasks: editSubs.filter(s => s.trim()) })
    setShowEdit(false)
  }

  const handleDelete = () => {
    deleteTask(task.id)
    setShowConfirm(false)
    router.push('/')
  }

  return (
    <div className="flex flex-col min-h-dvh bg-surface">
      {/* Header */}
      <header className="fixed top-0 w-full z-40 pt-safe bg-surface/80 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
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
          <div className="flex items-center gap-1">
            <button onClick={openEdit} className="w-9 h-9 rounded-full flex items-center justify-center text-on-surface-variant hover:bg-surface-container transition-colors">
              <span className="material-symbols-outlined text-[19px]">edit</span>
            </button>
            <button onClick={() => setShowConfirm(true)} className="w-9 h-9 rounded-full flex items-center justify-center text-error hover:bg-error-container/50 transition-colors">
              <span className="material-symbols-outlined text-[19px]">delete</span>
            </button>
          </div>
        </div>
      </header>

      <motion.main
        className="flex flex-col w-full px-margin pt-20 pb-6"
        variants={pageVariants}
        initial="initial"
        animate="animate"
      >
        <div className="flex flex-col gap-space-md">

          {/* Info Utama */}
          <section className="flex flex-col gap-space-sm p-space-md rounded-xl bg-surface-container-lowest shadow-sm">
            {/* Badges */}
            <div className="flex flex-wrap items-center gap-1.5">
              <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-label-sm text-[11px] ${isGroup ? 'bg-secondary-fixed/50 text-on-secondary-fixed-variant' : 'bg-primary-fixed/60 text-on-primary-fixed-variant'}`}>
                <span className="material-symbols-outlined text-[13px]">{isGroup ? 'groups' : 'person'}</span>
                {isGroup ? 'Tugas Kelompok' : 'Tugas Mandiri'}
              </span>
              {task.format && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-tertiary-fixed text-on-tertiary-fixed-variant font-label-sm text-[11px]">
                  <span className="material-symbols-outlined text-[13px]">article</span>
                  {task.format}
                </span>
              )}
              {isCompleted && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-primary-fixed text-on-primary-fixed-variant font-label-sm text-[11px]">
                  <span className="material-symbols-outlined text-[13px]">task_alt</span>
                  Selesai
                </span>
              )}
            </div>

            {/* Judul & Matkul */}
            <div className="flex flex-col gap-0.5">
              {task.subject && (
                <span className={`font-label-sm text-[12px] font-semibold uppercase tracking-wider ${isGroup ? 'text-secondary' : 'text-primary'}`}>
                  {task.subject}
                </span>
              )}
              <h2 className={`font-headline-md text-headline-md text-on-surface leading-tight ${isCompleted ? 'line-through text-outline' : ''}`}>
                {task.title}
              </h2>
            </div>

            {task.catatan && (
              <p className="font-body-sm text-body-sm text-on-surface-variant leading-snug">{task.catatan}</p>
            )}
          </section>

          {/* Tenggat & Info Akademik */}
          <section className="flex flex-col gap-2">
            {task.date && (
              <div className={`flex items-center gap-space-sm px-3.5 py-2.5 rounded-xl ${isCompleted ? 'bg-surface-container-low' : 'bg-tertiary-fixed text-on-tertiary-fixed'}`}>
                <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                  {isCompleted ? 'event_available' : 'timer'}
                </span>
                <div className="flex flex-col">
                  <span className="font-label-sm text-label-sm text-[11px] font-semibold opacity-70">Tenggat Pengumpulan</span>
                  <span className="font-body-sm text-body-sm font-medium">{task.date} • {task.time || '23:59'} WIB</span>
                </div>
              </div>
            )}

            {task.dosen && (
              <div className="flex items-center gap-space-sm px-3.5 py-2.5 rounded-xl bg-surface-container-lowest shadow-sm border border-outline-variant/30">
                <span className="material-symbols-outlined text-[18px] text-on-surface-variant">school</span>
                <div className="flex flex-col">
                  <span className="font-label-sm text-[11px] text-on-surface-variant">Dosen Pengampu</span>
                  <span className="font-body-sm text-body-sm text-on-surface">{task.dosen}</span>
                </div>
              </div>
            )}
          </section>

          {/* Anggota Kelompok */}
          {isGroup && task.members?.length > 0 && (
            <section className="flex flex-col gap-space-sm">
              <div className="flex items-center justify-between px-1">
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[18px] text-secondary">diversity_3</span>
                  <h3 className="font-headline-sm text-headline-sm text-on-surface">Anggota Kelompok</h3>
                </div>
                <span className="font-label-sm text-[11px] px-2 py-0.5 rounded-full bg-surface-container text-on-surface-variant">
                  {task.members.length} Orang
                </span>
              </div>

              <div className="rounded-xl bg-surface-container-lowest shadow-sm overflow-hidden">
                {task.members.map((m, i) => {
                  const initials = m.split(' ').slice(0, 2).map(n => n[0]).join('').toUpperCase()
                  const isLeader = i === 0
                  const colors = ['bg-primary-fixed text-on-primary-fixed', 'bg-secondary-fixed text-on-secondary-fixed', 'bg-tertiary-fixed text-on-tertiary-fixed', 'bg-surface-container-high text-on-surface']
                  return (
                    <div key={i} className={`flex items-center gap-space-sm p-3 ${i > 0 ? 'border-t border-outline-variant/20' : ''}`}>
                      <div className={`relative w-8 h-8 rounded-full ${colors[i % 4]} flex-shrink-0 flex items-center justify-center font-label-sm text-[12px] font-bold`}>
                        {initials}
                        {isLeader && (
                          <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-primary rounded-full flex items-center justify-center border-[1.5px] border-surface-container-lowest">
                            <span className="material-symbols-outlined text-[9px] text-on-primary">star</span>
                          </span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0 flex items-center justify-between">
                        <span className="font-body-sm text-body-sm text-on-surface truncate">{m}</span>
                        {isLeader && (
                          <span className="ml-2 px-1.5 py-0.5 rounded bg-primary text-on-primary font-label-sm text-[10px] shrink-0">Ketua</span>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </section>
          )}

          {/* Poin Pengerjaan / Subtask */}
          {subs.length > 0 && (
            <section className="flex flex-col gap-space-sm">
              <div className="flex items-center justify-between px-1">
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[18px] text-primary">checklist</span>
                  <h3 className="font-headline-sm text-headline-sm text-on-surface">Poin Pengerjaan</h3>
                </div>
                <span className="font-label-sm text-[11px] px-2 py-0.5 rounded-full bg-primary-fixed/50 text-on-primary-fixed-variant">
                  {doneSubs.length}/{subs.length} Selesai
                </span>
              </div>

              <div className="rounded-xl bg-surface-container-lowest shadow-sm p-space-md flex flex-col gap-space-sm">
                {/* Progress Bar */}
                <div className="flex flex-col gap-1">
                  <div className="flex justify-between">
                    <span className="font-label-sm text-[11px] text-on-surface-variant">Progres</span>
                    <span className="font-label-sm text-[11px] text-primary font-semibold">{pct}%</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-surface-container overflow-hidden">
                    <motion.div
                      className="h-full bg-primary rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 0.4, ease: 'easeOut' }}
                    />
                  </div>
                </div>

                {/* Ceklis */}
                <div className="flex flex-col gap-2 pt-1">
                  {subs.map((st, i) => {
                    const done = doneSubs.includes(i)
                    return (
                      <label key={i} className="flex items-start gap-2.5 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={done}
                          onChange={() => toggleSubtask(task.id, i)}
                          className="mt-0.5 w-4 h-4 rounded accent-primary cursor-pointer shrink-0"
                        />
                        <span className={`font-body-sm text-body-sm leading-snug transition-colors ${done ? 'line-through text-on-surface-variant' : 'text-on-surface'}`}>
                          {st}
                        </span>
                      </label>
                    )
                  })}
                </div>
              </div>
            </section>
          )}

          {/* Pengumpulan */}
          <section className="flex flex-col gap-space-sm">
            <div className="flex items-center gap-1.5 px-1">
              <span className="material-symbols-outlined text-[18px] text-on-surface-variant">cloud_upload</span>
              <h3 className="font-headline-sm text-headline-sm text-on-surface">Pengumpulan Berkas</h3>
            </div>

            <div className="rounded-xl bg-surface-container-lowest shadow-sm p-space-md flex flex-col gap-space-sm">
              <div className="flex flex-col gap-1">
                <span className="font-label-sm text-[11px] text-on-surface-variant">Saran nama berkas:</span>
                <div
                  onClick={copyFileName}
                  className="flex items-center justify-between p-2.5 rounded-lg bg-surface-container-low cursor-pointer active:bg-surface-container transition-colors"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="material-symbols-outlined text-[18px] text-primary">description</span>
                    <span className="font-label-md text-label-md text-on-surface truncate">{fileSlug}.pdf</span>
                  </div>
                  <div className="flex items-center gap-1 text-primary font-label-sm text-[11px] shrink-0 ml-2">
                    <span className="material-symbols-outlined text-[15px]">{copied ? 'done' : 'content_copy'}</span>
                    {copied ? 'Tersalin!' : 'Salin'}
                  </div>
                </div>
              </div>

              <a
                href={task.link || 'https://classroom.google.com'}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-1.5 py-3 px-4 rounded-xl bg-primary text-on-primary font-label-lg text-label-lg font-semibold shadow-sm active:scale-[0.98] transition-transform"
              >
                <span>Buka Tautan Pengumpulan</span>
                <span className="material-symbols-outlined text-[18px]">north_east</span>
              </a>
            </div>
          </section>

        </div>
      </motion.main>



      {/* Modal Konfirmasi Hapus */}
      <AnimatePresence>
        {showConfirm && (
          <div className="fixed inset-0 z-[200] flex items-end justify-center">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-scrim/40 backdrop-blur-sm"
              onClick={() => setShowConfirm(false)}
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="relative w-full bg-surface rounded-t-2xl p-space-md shadow-2xl"
            >
              <div className="flex items-center gap-space-sm mb-space-md">
                <div className="w-10 h-10 rounded-full bg-error-container flex items-center justify-center text-error flex-shrink-0">
                  <span className="material-symbols-outlined text-[22px]">delete_forever</span>
                </div>
                <div>
                  <p className="font-headline-sm text-headline-sm text-on-surface">Hapus Tugas?</p>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">Tindakan ini tidak bisa dibatalkan.</p>
                </div>
              </div>
              <div className="flex gap-space-sm">
                <button onClick={() => setShowConfirm(false)} className="flex-1 py-3 rounded-xl bg-surface-container text-on-surface font-label-md text-label-md">Batal</button>
                <button onClick={handleDelete} className="flex-1 py-3 rounded-xl bg-error text-on-error font-label-md text-label-md">Hapus</button>
              </div>
            </motion.div>
          </div>
        )}

        {/* Modal Edit */}
        {showEdit && (
          <div className="fixed inset-0 z-[200] flex items-end justify-center">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-scrim/40 backdrop-blur-sm"
              onClick={() => setShowEdit(false)}
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="relative w-full bg-surface rounded-t-2xl p-space-md shadow-2xl max-h-[85dvh] flex flex-col"
            >
              <div className="flex items-center justify-between mb-space-md shrink-0">
                <p className="font-headline-sm text-headline-sm text-on-surface">Edit Tugas</p>
                <button onClick={() => setShowEdit(false)} className="w-8 h-8 flex items-center justify-center text-on-surface-variant rounded-full hover:bg-surface-container">
                  <span className="material-symbols-outlined text-[20px]">close</span>
                </button>
              </div>
              <div className="flex flex-col gap-space-md overflow-y-auto pb-4">
                {[
                  { label: 'Judul Tugas', key: 'title', type: 'text' },
                  { label: 'Mata Kuliah', key: 'subject', type: 'text' },
                  { label: 'Dosen Pengampu', key: 'dosen', type: 'text' },
                  { label: 'Tautan Pengumpulan', key: 'link', type: 'url' },
                ].map(({ label, key, type }) => (
                  <div key={key} className="flex flex-col gap-1">
                    <label className="font-label-sm text-label-sm text-on-surface-variant">{label}</label>
                    <input
                      type={type}
                      value={editForm[key] || ''}
                      onChange={e => setEditForm(p => ({ ...p, [key]: e.target.value }))}
                      className="w-full rounded-lg bg-surface-container-low px-3 py-2.5 text-on-surface font-body-sm text-body-sm focus:outline-none focus:bg-surface-container-lowest transition-colors"
                    />
                  </div>
                ))}
                <div className="grid grid-cols-2 gap-space-sm">
                  <div className="flex flex-col gap-1">
                    <label className="font-label-sm text-label-sm text-on-surface-variant">Tanggal</label>
                    <input type="date" value={editForm.date || ''} onChange={e => setEditForm(p => ({ ...p, date: e.target.value }))} className="w-full rounded-lg bg-surface-container-low px-3 py-2.5 text-on-surface font-body-sm text-body-sm focus:outline-none" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="font-label-sm text-label-sm text-on-surface-variant">Jam</label>
                    <input type="time" value={editForm.time || ''} onChange={e => setEditForm(p => ({ ...p, time: e.target.value }))} className="w-full rounded-lg bg-surface-container-low px-3 py-2.5 text-on-surface font-body-sm text-body-sm focus:outline-none" />
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="font-label-sm text-label-sm text-on-surface-variant">Catatan</label>
                  <textarea rows={3} value={editForm.catatan || ''} onChange={e => setEditForm(p => ({ ...p, catatan: e.target.value }))} className="w-full rounded-lg bg-surface-container-low px-3 py-2.5 text-on-surface font-body-sm text-body-sm focus:outline-none resize-none" />
                </div>

                {/* Edit Poin Pengerjaan */}
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between">
                    <label className="font-label-sm text-label-sm text-on-surface-variant">Poin Pengerjaan</label>
                    <button
                      type="button"
                      onClick={() => setEditSubs(p => [...p, ''])}
                      className="flex items-center gap-0.5 text-primary font-label-sm text-[11px] hover:opacity-80"
                    >
                      <span className="material-symbols-outlined text-[15px]">add</span>
                      Tambah
                    </button>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    {editSubs.map((st, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-[16px] text-on-surface-variant shrink-0">drag_indicator</span>
                        <input
                          value={st}
                          onChange={e => setEditSubs(p => p.map((s, idx) => idx === i ? e.target.value : s))}
                          placeholder={`Poin ${i + 1}...`}
                          className="flex-1 rounded-lg bg-surface-container-low px-3 py-2 text-on-surface font-body-sm text-body-sm focus:outline-none focus:bg-surface-container-lowest transition-colors"
                        />
                        <button
                          type="button"
                          onClick={() => setEditSubs(p => p.filter((_, idx) => idx !== i))}
                          className="w-7 h-7 flex items-center justify-center rounded-md text-outline hover:text-error hover:bg-error-container/40 transition-colors shrink-0"
                        >
                          <span className="material-symbols-outlined text-[16px]">delete</span>
                        </button>
                      </div>
                    ))}
                    {editSubs.length === 0 && (
                      <p className="font-body-sm text-[12px] text-on-surface-variant/60 text-center py-2">
                        Belum ada poin pengerjaan
                      </p>
                    )}
                  </div>
                </div>
              </div>
              <button onClick={saveEdit} className="w-full shrink-0 flex items-center justify-center gap-1.5 py-3 rounded-xl bg-primary text-on-primary font-label-lg text-label-lg font-semibold shadow-sm active:scale-[0.98] transition-transform mt-2">
                Simpan Perubahan
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function DetailPage() {
  return (
    <Suspense fallback={<div className="min-h-dvh bg-surface" />}>
      <DetailContent />
    </Suspense>
  )
}
