import Image from 'next/image'
import logo from './logo.jpg'

export default function AppHeader() {
  return (
    <header className="fixed top-0 w-full z-50 pt-safe bg-surface/80 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
      <div className="h-20 px-margin flex items-center justify-between">
        <div className="flex items-center gap-space-sm">
          <div className="w-11 h-11 rounded-xl bg-primary-fixed/60 flex items-center justify-center text-primary overflow-hidden">
            <Image src={logo} alt="Logo Aplikasi" className="w-full h-full object-cover" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-space-xs">
              <span className="font-headline-sm text-headline-sm text-on-surface tracking-tight">Kartu Tugas</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-primary-container inline-block" />
              <span className="font-label-sm text-[11px] text-on-surface-variant font-normal">Lokal (Tanpa Login)</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
