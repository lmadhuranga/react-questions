import { Link } from 'react-router-dom'
import type { ReactNode } from 'react'

type LayoutProps = {
  children: ReactNode
}

export function Layout({ children }: LayoutProps) {
  return (
    <main className="app">
      <nav className="topbar">
        <div className="brand">JSONPlaceholder Admin</div>
        <div className="links">
          <Link to="/users">Users</Link>
          <Link to="/posts">Posts</Link>
        </div>
      </nav>
      <section className="panel">{children}</section>
    </main>
  )
}
