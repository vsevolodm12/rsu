import React from 'react'
import Footer from './Footer'
import ThemeToggle from './ThemeToggle'
import './Layout.css'

interface LayoutProps {
  children: React.ReactNode
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="layout">
      <div className="theme-toggle-container">
        <ThemeToggle />
      </div>
      <main className="layout-content">{children}</main>
      <Footer />
    </div>
  )
}

export default Layout


