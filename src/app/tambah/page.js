'use client'
import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import AppHeader from '@/components/AppHeader'
import BottomNav from '@/components/BottomNav'
import { useTasks } from '@/hooks/useTasks'

const FORMATS = [
  { label: 'Makalah',             icon: 'description' },
  { label: 'Resume',              icon: 'assignment' },
  { label: 'Tulisan Tangan',      icon: 'draw' },
  { label: 'Diketik (PDF)',       icon: 'picture_as_pdf' },
  { label: 'Presentasi / Slide',  icon: 'slideshow' },
  { label: 'Praktikum / Coding',  icon: 'terminal' },
]

const pageVariants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.22, ease: 'easeOut' } },
}

export default function TambahPage() {
  const router    = useRouter()
  const { addTask } = useTasks()
  const [tipe, setTipe]           = useState('individu')
  const [format, setFormat]       = useState('Makalah')
  const [subtasks, setSubtasks]   = useState([])
  const [showToast, setShowToast] = useState(false)
  const formRef = useRef(null)

  const addSubtask = () => setSubtasks(prev => [...prev, ''])
  const removeSubtask = (i) => setSubtasks(prev => prev.filter((_, idx) => idx !== i))
  const updateSubtask = (i, val) => setSubtasks(prev => prev.map((s, idx) => idx === i ? val : s))

  const setQuickDeadline = (type) => {
    const d = new Date()
    if (type === 'besok') d.setDate(d.getDate() + 1)
    else if (type === 'minggu-depan') d.setDate(d.getDate() + 7)
    const dateInput = formRef.current?.querySelector('#deadline-date')
    if (dateInput) dateInput.value = d.toISOString().split('T')[0]
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const f = formRef.current
    const isGroup = tipe === 'kelompok'
    const anggotaRaw = f.querySelector('#anggota-kelompok')?.value || ''
    addTask({
      title:    f.querySelector('#judul-tugas').value.trim(),
      subject:  f.querySelector('#mata-kuliah').value.trim(),
      kelas:    '',
      dosen:    f.querySelector('#dosen').value.trim(),
      date:     f.querySelector('#deadline-date').value,
      time:     f.querySelector('#deadline-time').value,
      type:     isGroup ? 'group' : 'individual',
      format,
      status:   'pending',
      kelompok: isGroup ? f.querySelector('#nama-kelompok').value.trim() : '',
      members:  isGroup ? anggotaRaw.split(',').map(s=>s.trim()).filter(Boolean) : [],
      link:     f.querySelector('#tautan-pengumpulan').value.trim(),
      catatan:  f.querySelector('#catatan-tugas').value.trim(),
      subtasks: subtasks.filter(Boolean),
      completedSubtasks: [],
    })
    setShowToast(true)
    setTimeout(() => { setShowToast(false); router.push('/') }, 2200)
  }

  const resetForm = () => {
    if (!confirm('Reset semua isian formulir?')) return
    formRef.current?.reset()
    setTipe('individu')
    setFormat('Makalah')
    setSubtasks([])
  }

  return (
    <div className="flex flex-col min-h-dvh bg-surface">
      <AppHeader />
      <motion.main
        className="flex flex-col w-full px-margin pt-20 pb-28"
        variants={pageVariants}
        initial="initial"
        animate="animate"
      >
        <div className="flex flex-col w-full gap-space-lg">

          {/* Banner */}
          <div className="flex flex-col gap-space-xs relative overflow-hidden rounded-xl bg-surface-container-low p-space-md shadow-sm">
            <div className="flex items-start justify-between">
              <div className="flex flex-col gap-1">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-primary-fixed/50 text-on-primary-fixed-variant w-fit">
                  <span className="material-symbols-outlined text-[14px]">edit_note</span>
                  <span className="font-label-sm text-label-sm font-semibold">Lembar Catatan Baru</span>
                </div>
                <h1 className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface tracking-tight mt-1">Tambah Kartu Tugas</h1>
                <p className="font-body-sm text-body-sm text-on-surface-variant">Catat detail tugas agar terorganisir rapi di HP</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-secondary-fixed/50 flex items-center justify-center text-secondary shrink-0">
                <span className="material-symbols-outlined text-[24px]">bookmark_add</span>
              </div>
            </div>
            <div className="mt-2 pt-2 flex items-center gap-2 text-on-surface-variant font-body-sm text-[11px]">
              <span className="material-symbols-outlined text-primary text-[16px]">eco</span>
              <span>Fokus satu per satu, luangkan istirahat yang cukup.</span>
            </div>
          </div>

          <form ref={formRef} autoComplete="off" className="flex flex-col gap-space-lg" onSubmit={handleSubmit}>

            {/* Tipe */}
            <div className="flex flex-col gap-space-sm">
              <div className="flex items-center justify-between">
                <label className="font-label-md text-label-md text-on-surface font-semibold flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-primary text-[18px]">hub</span>
                  Tipe Kolaborasi Tugas
                </label>
                <span className="font-label-sm text-label-sm text-primary font-medium">Wajib diisi</span>
              </div>
              <div className="grid grid-cols-2 gap-space-sm">
                {[
                  { val: 'individu', emoji: '👤', label: 'Tugas Mandiri', sub: 'Dikerjakan mandiri tanpa kelompok' },
                  { val: 'kelompok', emoji: '👥', label: 'Tugas Tim',    sub: 'Dikerjakan bersama rekan sekelas' },
                ].map(opt => (
                  <label
                    key={opt.val}
                    onClick={() => setTipe(opt.val)}
                    className={`relative flex flex-col p-3 rounded-xl shadow-sm cursor-pointer transition-all duration-200 ${
                      tipe === opt.val ? 'bg-surface-container-low' : 'bg-surface-container-lowest opacity-80'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xl">{opt.emoji}</span>
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
                        tipe === opt.val
                          ? (opt.val === 'individu' ? 'bg-primary text-on-primary' : 'bg-secondary text-on-secondary')
                          : 'bg-surface-container text-transparent'
                      }`}>
                        <span className="material-symbols-outlined text-[14px]">check</span>
                      </div>
                    </div>
                    <span className="font-headline-sm text-on-surface text-[15px] font-semibold">{opt.label}</span>
                    <span className="font-body-sm text-body-sm text-on-surface-variant mt-0.5 leading-snug">{opt.sub}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Detail Akademik */}
            <div className="flex flex-col gap-space-md p-space-md rounded-xl bg-surface-container-lowest shadow-sm">
              <div className="flex items-center gap-2 pb-1">
                <div className="w-7 h-7 rounded-lg bg-primary-fixed/40 flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined text-[18px]">menu_book</span>
                </div>
                <span className="font-headline-sm text-headline-sm text-on-surface">Detail Akademik</span>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="font-label-sm text-label-sm text-on-surface-variant font-medium" htmlFor="judul-tugas">Judul Tugas / Proyek</label>
                <input id="judul-tugas" required placeholder="misal: Makalah Analisis Algoritma Greedy" className="w-full rounded-lg bg-surface-container-low px-3.5 py-3 text-on-surface placeholder:text-on-surface-variant/60 font-body-md text-body-md focus:outline-none focus:bg-surface-container-lowest transition-colors" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="font-label-sm text-label-sm text-on-surface-variant font-medium" htmlFor="mata-kuliah">Mata Kuliah</label>
                <input id="mata-kuliah" placeholder="misal: Desain Algoritma" className="w-full rounded-lg bg-surface-container-low px-3 py-3 text-on-surface placeholder:text-on-surface-variant/60 font-body-md text-body-md focus:outline-none focus:bg-surface-container-lowest" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="font-label-sm text-label-sm text-on-surface-variant font-medium" htmlFor="dosen">Dosen Pengampu</label>
                <div className="relative flex items-center">
                  <span className="material-symbols-outlined absolute left-3 text-on-surface-variant text-[18px]">school</span>
                  <input id="dosen" placeholder="misal: Dr. Ir. Hendra Gunawan, M.T." className="w-full rounded-lg bg-surface-container-low pl-10 pr-3 py-3 text-on-surface placeholder:text-on-surface-variant/60 font-body-md text-body-md focus:outline-none focus:bg-surface-container-lowest" />
                </div>
              </div>

              {/* Kelompok detail */}
              <AnimatePresence>
                {tipe === 'kelompok' && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="flex flex-col gap-space-sm pt-2 bg-secondary-fixed/20 p-3 rounded-lg overflow-hidden"
                  >
                    <div className="flex items-center gap-1.5 text-on-secondary-fixed">
                      <span className="material-symbols-outlined text-[18px]">diversity_3</span>
                      <span className="font-label-md text-label-md font-semibold">Konfigurasi Anggota Tim</span>
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="font-label-sm text-label-sm text-on-secondary-fixed-variant" htmlFor="nama-kelompok">Nomor / Nama Kelompok</label>
                      <input id="nama-kelompok" placeholder="misal: Kelompok 4 (Turing)" className="w-full rounded-lg bg-surface-container-lowest px-3 py-2.5 text-on-surface placeholder:text-on-surface-variant/50 font-body-sm text-body-sm focus:outline-none" />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="font-label-sm text-label-sm text-on-secondary-fixed-variant" htmlFor="anggota-kelompok">Daftar Anggota Tim (Pisahkan koma)</label>
                      <input id="anggota-kelompok" placeholder="misal: Radit, Aisyah, Farhan, Saya" className="w-full rounded-lg bg-surface-container-lowest px-3 py-2.5 text-on-surface placeholder:text-on-surface-variant/50 font-body-sm text-body-sm focus:outline-none" />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Format */}
            <div className="flex flex-col gap-space-sm">
              <div className="flex items-center justify-between">
                <label className="font-label-md text-label-md text-on-surface font-semibold flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-primary text-[18px]">snippet_folder</span>
                  Format Berkas / Hasil
                </label>
                <span className="font-label-sm text-label-sm text-on-surface-variant">Terpilih: {format}</span>
              </div>
              <div className="flex gap-2 overflow-x-auto pb-1 -mx-margin px-margin">
                {FORMATS.map(f => (
                  <button
                    key={f.label}
                    type="button"
                    onClick={() => setFormat(f.label)}
                    className={`shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-xl shadow-sm transition-all duration-150 active:scale-95 ${
                      format === f.label
                        ? 'bg-primary text-on-primary'
                        : 'bg-surface-container-lowest text-on-surface'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[16px]">{f.icon}</span>
                    <span className="font-label-sm text-label-sm">{f.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Poin Pengerjaan */}
            <div className="flex flex-col gap-space-sm p-space-md rounded-xl bg-surface-container-lowest shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-tertiary-fixed/60 flex items-center justify-center text-tertiary">
                    <span className="material-symbols-outlined text-[18px]">checklist</span>
                  </div>
                  <div>
                    <h2 className="font-headline-sm text-on-surface text-[15px]">Poin Pengerjaan</h2>
                    <p className="font-body-sm text-[11px] text-on-surface-variant">Bagi tugas menjadi langkah-langkah terukur</p>
                  </div>
                </div>
                <span className="font-label-sm text-label-sm px-2 py-0.5 rounded-full bg-surface-container text-on-surface-variant">
                  {subtasks.length} poin
                </span>
              </div>
              <AnimatePresence>
                {subtasks.map((st, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="flex items-center gap-2.5 p-2 rounded-lg bg-surface-container-low"
                  >
                    <span className="material-symbols-outlined text-primary text-[18px]">drag_indicator</span>
                    <span className="w-5 h-5 rounded-md bg-surface-container-lowest flex items-center justify-center text-[11px] font-bold text-on-surface-variant">{i+1}</span>
                    <input
                      type="text"
                      placeholder="Tulis langkah pengerjaan..."
                      value={st}
                      onChange={e => updateSubtask(i, e.target.value)}
                      className="flex-1 bg-transparent text-on-surface font-body-sm text-body-sm focus:outline-none"
                    />
                    <button type="button" onClick={() => removeSubtask(i)} className="w-7 h-7 rounded-md flex items-center justify-center text-outline hover:text-error hover:bg-error-container/40 transition-colors">
                      <span className="material-symbols-outlined text-[18px]">delete</span>
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>
              <button type="button" onClick={addSubtask} className="w-full py-2.5 px-3 rounded-lg bg-surface-container-low/70 hover:bg-surface-container-high text-primary font-label-md text-label-md flex items-center justify-center gap-2 transition-colors">
                <span className="material-symbols-outlined text-[18px]">add_task</span>
                + Tambah Poin Pengerjaan
              </button>
            </div>

            {/* Tenggat */}
            <div className="flex flex-col gap-space-md p-space-md rounded-xl bg-surface-container-lowest shadow-sm">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-error-container/70 flex items-center justify-center text-error">
                  <span className="material-symbols-outlined text-[18px]">alarm</span>
                </div>
                <span className="font-headline-sm text-headline-sm text-on-surface">Tenggat &amp; Penyerahan</span>
              </div>
              <div className="grid grid-cols-2 gap-space-sm">
                <div className="flex flex-col gap-1.5">
                  <label className="font-label-sm text-label-sm text-on-surface-variant font-medium" htmlFor="deadline-date">Tanggal</label>
                  <div className="relative flex items-center">
                    <span className="material-symbols-outlined absolute left-3 text-on-surface-variant text-[16px] pointer-events-none">calendar_today</span>
                    <input id="deadline-date" type="date" className="w-full rounded-lg bg-surface-container-low pl-9 pr-2 py-2.5 text-on-surface font-body-sm text-body-sm focus:outline-none" />
                  </div>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="font-label-sm text-label-sm text-on-surface-variant font-medium" htmlFor="deadline-time">Jam Batas (WIB)</label>
                  <div className="relative flex items-center">
                    <span className="material-symbols-outlined absolute left-3 text-on-surface-variant text-[16px] pointer-events-none">schedule</span>
                    <input id="deadline-time" type="time" defaultValue="23:59" className="w-full rounded-lg bg-surface-container-low pl-9 pr-2 py-2.5 text-on-surface font-body-sm text-body-sm focus:outline-none" />
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5">
                <span className="font-body-sm text-[11px] text-on-surface-variant shrink-0">Pilihan cepat:</span>
                {[
                  { key: 'hari-ini',     label: 'Hari Ini' },
                  { key: 'besok',        label: 'Besok Malam' },
                  { key: 'minggu-depan', label: 'Minggu Depan' },
                ].map(q => (
                  <button key={q.key} type="button" onClick={() => setQuickDeadline(q.key)} className="px-2 py-1 rounded bg-surface-container-low hover:bg-surface-container text-on-surface-variant font-label-sm text-[11px] shrink-0">
                    {q.label}
                  </button>
                ))}
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="font-label-sm text-label-sm text-on-surface-variant font-medium" htmlFor="tautan-pengumpulan">Tautan Pengumpulan</label>
                <div className="relative flex items-center">
                  <span className="material-symbols-outlined absolute left-3 text-on-surface-variant text-[18px]">link</span>
                  <input id="tautan-pengumpulan" type="url" placeholder="https://classroom.google.com/..." className="w-full rounded-lg bg-surface-container-low pl-10 pr-3 py-3 text-on-surface placeholder:text-on-surface-variant/60 font-body-sm text-body-sm focus:outline-none focus:bg-surface-container-lowest" />
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <label className="font-label-sm text-label-sm text-on-surface-variant font-medium" htmlFor="catatan-tugas">Catatan Format &amp; Aturan Khusus</label>
                  <span className="font-label-sm text-[11px] text-on-surface-variant/70">Opsional</span>
                </div>
                <textarea id="catatan-tugas" rows={3} placeholder="Contoh: Font TNR 12pt, spasi 1.5" className="w-full rounded-lg bg-surface-container-low p-3 text-on-surface placeholder:text-on-surface-variant/60 font-body-sm text-body-sm focus:outline-none focus:bg-surface-container-lowest resize-none" />
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-space-sm pt-2">
              <button type="submit" className="w-full py-3.5 px-space-md rounded-xl bg-primary hover:bg-primary-container text-on-primary font-headline-sm text-headline-sm flex items-center justify-center gap-2 shadow-md transition-all active:scale-[0.98]">
                <span className="material-symbols-outlined text-[20px]">task_alt</span>
                Simpan Kartu Tugas
              </button>
              <button type="button" onClick={resetForm} className="w-full py-2.5 px-space-md rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface-variant font-label-md text-label-md flex items-center justify-center gap-1.5 transition-colors">
                <span className="material-symbols-outlined text-[18px]">restart_alt</span>
                Reset Formulir
              </button>
              <div className="flex items-center justify-center gap-1.5 py-1 text-on-surface-variant/80">
                <span className="material-symbols-outlined text-primary text-[15px]">save</span>
                <span className="font-label-sm text-[11px]">Tersimpan otomatis di browser HP Anda.</span>
              </div>
            </div>
          </form>
        </div>
      </motion.main>

      {/* Toast */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: -80 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -80 }}
            className="fixed top-24 left-4 right-4 z-[100] flex items-center gap-3 p-3.5 rounded-xl bg-primary text-on-primary shadow-xl"
          >
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[20px]">check_circle</span>
            </div>
            <div className="flex flex-col flex-1">
              <span className="font-label-md text-label-md font-semibold">Tugas Berhasil Disimpan!</span>
              <span className="font-body-sm text-[11px] opacity-90">Kartu tugas baru siap dipantau di beranda.</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <BottomNav />
    </div>
  )
}
