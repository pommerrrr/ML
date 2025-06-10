import type { Metadata } from 'next'
import { Inter_Tight } from 'next/font/google'
import './globals.css'
import { cn } from '@/lib/utils'
import { Providers } from './providers'

const fontSans = Inter_Tight({
  subsets: ['latin'],
  variable: '--font-sans',
})

export const metadata: Metadata = {
  title: 'Análise Mercado Livre - Sistema de Análise de Produtos',
  description: 'Sistema para analisar produtos mais vendidos no Mercado Livre e calcular margem de lucro ideal',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={cn(
        'min-h-screen bg-background font-sans antialiased',
        fontSans.variable
      )}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}