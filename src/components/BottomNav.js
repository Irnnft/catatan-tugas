'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navItems = [
  { href: '/', icon: 'task_alt', label: 'Daftar Tugas' },
  { href: '/tambah', icon: 'add', label: 'Tambah', isFab: true },
  { href: '/statistik', icon: 'analytics', label: 'Arsip & Statistik' },
]

export default function BottomNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 w-full z-50 pb-safe bg-surface/85 backdrop-blur-xl shadow-[0_-2px_12px_rgba(0,0,0,0.04)]">
      <div className="h-16 px-margin flex items-center justify-around">
        {navItems.map(item => {
          const isActive = pathname === item.href
          if (item.isFab) return (
            <Link
              key={item.href}
              href={item.href}
              className="min-w-[44px] min-h-[44px] -mt-5 flex flex-col items-center justify-center gap-0.5 group"
            >
              <div className="w-12 h-12 rounded-full bg-primary-container flex items-center justify-center shadow-[0_4px_12px_rgba(61,104,70,0.2)] text-on-primary group-hover:scale-105 transition-transform">
                <span className="material-symbols-outlined text-[28px]">add</span>
              </div>
              <span className={`font-label-sm text-label-sm transition-colors ${isActive ? 'text-primary' : 'text-on-surface-variant group-hover:text-primary'}`}>
                {item.label}
              </span>
            </Link>
          )
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`min-w-[44px] min-h-[44px] flex flex-col items-center justify-center gap-0.5 transition-colors ${isActive ? 'text-primary' : 'text-on-surface-variant hover:text-primary'}`}
            >
              <span
                className="material-symbols-outlined text-[22px]"
                style={isActive ? { fontVariationSettings: "'FILL' 1" } : {}}
              >
                {item.icon}
              </span>
              <span className="font-label-sm text-label-sm">{item.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
