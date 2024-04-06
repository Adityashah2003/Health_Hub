"use client"
import Nav from '@/components/Nav'
import './globals.css'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

const metadata = {
  title: 'Health Hub',
  description: 'Health and Wellness Ecommerce Store',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
          <Nav/>
          {children}
      </body>
    </html>
  )
}