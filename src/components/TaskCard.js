'use client'
import Link from 'next/link'

export default function TaskCard({ task, onToggleDone, onDelete }) {
  const isGroup     = task.type === 'group'
  const isCompleted = task.status === 'completed'
  const isUrgent    = task.status === 'urgent'

  const typeBadge = isGroup ? (
    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-secondary-fixed/50 text-on-secondary-fixed-variant font-label-sm text-[11px]">
      <span className="material-symbols-outlined text-[14px]">groups</span>
      Tugas Kelompok{task.members?.length ? ` • ${task.members.length} Orang` : ''}
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-primary-fixed/60 text-on-primary-fixed-variant font-label-sm text-[11px]">
      <span className="material-symbols-outlined text-[14px]">person</span>
      Tugas Mandiri
    </span>
  )

  const dateBadge = isCompleted ? (
    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-primary-fixed text-on-primary-fixed-variant font-label-sm text-[11px]">
      <span className="material-symbols-outlined text-[13px]">task_alt</span>
      Selesai
    </span>
  ) : isUrgent ? (
    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-tertiary-fixed text-on-tertiary-container font-label-sm text-[11px] font-semibold">
      <span className="material-symbols-outlined text-[13px]">alarm</span>
      Mendesak • {task.date}
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-surface-container text-on-surface-variant font-label-sm text-[11px]">
      <span className="material-symbols-outlined text-[13px]">calendar_today</span>
      {task.date || 'Belum ada tenggat'}
    </span>
  )

  const subjectColor = isCompleted ? 'text-outline' : isGroup ? 'text-secondary' : 'text-primary'

  return (
    <article className={`flex flex-col p-space-md rounded-xl shadow-sm gap-space-sm transition-all ${isCompleted ? 'bg-surface-container-lowest/80 opacity-90' : 'bg-surface-container-lowest'}`}>
      <Link href={`/detail/${task.id}`} className="flex flex-col gap-space-sm">
        <div className="flex items-center justify-between">
          {typeBadge}
          {dateBadge}
        </div>
        <div className="flex flex-col">
          <span className={`font-label-sm text-[12px] ${subjectColor} font-semibold uppercase tracking-wider`}>
            {task.subject || ''}
          </span>
          <h3 className={`font-headline-sm text-headline-sm text-on-surface mt-0.5 ${isCompleted ? 'line-through text-outline' : ''}`}>
            {task.title}
          </h3>
        </div>
        {task.format && (
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="px-2 py-0.5 rounded bg-surface-container text-on-surface-variant font-label-sm text-[11px]">
              {task.format}
            </span>
          </div>
        )}
        {isGroup && task.members?.length > 0 && (
          <div className="flex items-center gap-2 py-1.5 px-2.5 rounded-lg bg-surface-container-low">
            <span className="material-symbols-outlined text-secondary text-[16px]">group</span>
            <span className="font-body-sm text-[12px] text-on-surface truncate">{task.members.join(', ')}</span>
          </div>
        )}
      </Link>
      <div className="flex items-center justify-between pt-1">
        <div className="flex items-center gap-1.5 text-on-surface-variant">
          <span className="material-symbols-outlined text-[15px]">school</span>
          <span className="font-body-sm text-[12px] truncate max-w-[140px]">{task.dosen || 'Dosen Pengampu'}</span>
        </div>
        <div className="flex items-center gap-2">
          {isCompleted && (
            <button
              onClick={() => { if(confirm('Hapus tugas yang sudah selesai ini secara permanen?')) onDelete(task.id) }}
              className="w-8 h-8 flex items-center justify-center rounded-lg bg-error-container/60 hover:bg-error-container text-error transition-colors"
              title="Hapus Tugas"
              type="button"
            >
              <span className="material-symbols-outlined text-[16px]">delete</span>
            </button>
          )}
          <button
            onClick={() => onToggleDone(task.id)}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg font-label-sm text-[12px] transition-colors ${
              isCompleted
                ? 'bg-primary text-on-primary'
                : 'bg-primary-fixed/40 hover:bg-primary-fixed text-primary'
            }`}
            type="button"
          >
            <span className="material-symbols-outlined text-[16px]" style={isCompleted ? { fontVariationSettings: "'FILL' 1" } : {}}>
              {isCompleted ? 'check_box' : 'check_box_outline_blank'}
            </span>
            {isCompleted ? 'Tersimpan' : 'Tandai Selesai'}
          </button>
        </div>
      </div>
    </article>
  )
}
