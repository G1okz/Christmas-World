import { BrowserRouter, Link, Route, Routes } from 'react-router-dom'
import './App.css'
import Login from './pages/Login'
import Register from './pages/Register'
import Home from './pages/Home'
import ForgotPassword from './pages/ForgotPassword'
import Navbar from './components/layout/Navbar'
import ProtectedRoute from './components/auth/ProtectedRoute'
import { AuthProvider } from './contexts/AuthContext'

function PrivateFeature({ title }: { title: string }) {
  return (
    <>
      <Navbar />
      <main className="status-page">
        <section className="status-card">
          <p className="eyebrow">Zona privada</p>
          <h1>{title}</h1>
          <p>Esta sección estará disponible en su fase de implementación.</p>
          <Link className="button button--outline" to="/">Volver al inicio</Link>
        </section>
      </main>
    </>
  )
}

function NotFound() {
  return (
    <>
      <Navbar />
      <main className="status-page">
        <section className="status-card">
          <h1>Página no encontrada</h1>
          <Link className="button button--outline" to="/">Volver al inicio</Link>
        </section>
      </main>
    </>
  )
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<Home />} path="/" />
          <Route element={<Login />} path="/login" />
          <Route element={<Register />} path="/register" />
          <Route element={<ForgotPassword />} path="/forgot-password" />
          <Route
            element={<ProtectedRoute><PrivateFeature title="Calendario de Adviento" /></ProtectedRoute>}
            path="/calendar"
          />
          <Route
            element={<ProtectedRoute><PrivateFeature title="Quiz navideño" /></ProtectedRoute>}
            path="/quiz"
          />
          <Route
            element={<ProtectedRoute><PrivateFeature title="Retos diarios" /></ProtectedRoute>}
            path="/challenges"
          />
          <Route
            element={<ProtectedRoute><PrivateFeature title="Mi progreso" /></ProtectedRoute>}
            path="/progress"
          />
          <Route element={<NotFound />} path="*" />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
