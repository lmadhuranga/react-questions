import './App.css'
import { Navigate, Route, Routes } from 'react-router-dom'
import { UsersPage } from './pages/users/UsersPage'
import { UserDetailPage } from './pages/users/UserDetailPage'
import { UserEditPage } from './pages/users/UserEditPage'
import { PostsPage } from './pages/posts/PostsPage'
import { PostDetailPage } from './pages/posts/PostDetailPage'
import { PostEditPage } from './pages/posts/PostEditPage'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/users" replace />} />
      <Route path="/users" element={<UsersPage />} />
      <Route path="/users/:id" element={<UserDetailPage />} />
      <Route path="/users/edit/:id" element={<UserEditPage />} />
      <Route path="/posts" element={<PostsPage />} />
      <Route path="/posts/:id" element={<PostDetailPage />} />
      <Route path="/posts/edit/:id" element={<PostEditPage />} />
    </Routes>
  )
}

export default App
