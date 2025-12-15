import './App.css'
import { Navigate, Route, Routes } from 'react-router-dom'
import { UsersPage } from './pages/users/UsersPage'
import { UserDetailPage } from './pages/users/UserDetailPage'
import { UserEditPage } from './pages/users/UserEditPage'
import { PostsPage } from './pages/posts/PostsPage'
import { PostDetailPage } from './pages/posts/PostDetailPage'
import { PostEditPage } from './pages/posts/PostEditPage'
import { LoginPage } from './pages/auth/LoginPage'
import { ProtectedRoute } from './components/ProtectedRoute'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/users" replace />} />
      <Route path="/users" element={<ProtectedRoute><UsersPage /></ProtectedRoute>} />
      <Route path="/users/:id" element={<ProtectedRoute><UserDetailPage /></ProtectedRoute>} />
      <Route path="/users/edit/:id" element={<ProtectedRoute><UserEditPage /></ProtectedRoute>} />
      <Route path="/posts" element={<ProtectedRoute><PostsPage /></ProtectedRoute>} />
      <Route path="/posts/:id" element={<ProtectedRoute><PostDetailPage /></ProtectedRoute>} />
      <Route path="/posts/edit/:id" element={<ProtectedRoute><PostEditPage /></ProtectedRoute>} />
      <Route path="/login" element={<LoginPage />} />
    </Routes>
  )
}

export default App
