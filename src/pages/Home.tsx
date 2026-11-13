import { Link } from 'react-router-dom'
import Navbar from '../components/layout/Navbar'
import { useAuth } from '../contexts/AuthContext'

export default function Home() {
  const { isAuthenticated } = useAuth()

  return (
    <>
      <Navbar />
      <main className="home-page">
        <section className="hero">
          <p className="eyebrow">Una Navidad para compartir</p>
          <h1>La magia de la Navidad comienza aquí.</h1>
          <p className="hero__description">
            Abre cada día, participa en retos y descubre cuánto espíritu
            navideño puedes reunir.
          </p>
          <Link className="button button--primary" to={isAuthenticated ? '/calendar' : '/register'}>
            {isAuthenticated ? 'Ir al calendario' : 'Empezar'}
          </Link>
        </section>
      </main>
    </>
  )
}
