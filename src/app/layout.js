import './globals.css'
import logo from '@/components/logo.jpg'

export const metadata = {
  title: 'Kartu Tugas Planner',
  description: 'Aplikasi pencatat tugas kuliah offline, tanpa login, tersimpan di HP.',
  icons: [{ rel: 'icon', url: logo.src }],
}

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body className="bg-surface font-body-md text-on-surface selection:bg-primary-fixed">
        {children}
      </body>
    </html>
  )
}
