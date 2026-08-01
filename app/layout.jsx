import { Geist, Geist_Mono, Schibsted_Grotesk } from 'next/font/google'
import './globals.css'

const geistSans = Geist({ subsets: ['latin'], variable: '--font-geist-sans' })
const geistMono = Geist_Mono({ subsets: ['latin'], variable: '--font-geist-mono' })

// Display face — headings only, used with restraint. docs/UI-SPEC.md §4.2
const schibsted = Schibsted_Grotesk({
  subsets: ['latin'],
  weight: ['600', '700'],
  variable: '--font-schibsted',
})

export const metadata = {
  title: 'project-insights — verified research copilot',
  description:
    'Turn an idea into a scoped, buildable project. Every repo, dataset and paper verified live — not recalled from memory.',
}

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${schibsted.variable}`}
    >
      <body className="min-h-screen bg-canvas text-ink antialiased">{children}</body>
    </html>
  )
}
