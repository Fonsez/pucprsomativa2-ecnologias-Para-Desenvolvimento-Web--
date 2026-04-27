import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth, firebaseConfigurado } from '../services/firebase.js'

export default function Login() {
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [mensagem, setMensagem] = useState('')
  const [carregando, setCarregando] = useState(false)
  const navigate = useNavigate()

  async function acessarConta(evento) {
    evento.preventDefault()
    setMensagem('')

    if (!firebaseConfigurado) {
      setMensagem('Configure as variaveis do Firebase no arquivo .env para acessar.')
      return
    }

    setCarregando(true)

    try {
      await signInWithEmailAndPassword(auth, email, senha)
      navigate('/principal')
    } catch {
      setMensagem('Usuario nao cadastrado ou dados incorretos.')
    } finally {
      setCarregando(false)
    }
  }

  return (
    <main className="page">
      <section className="panel">
        <div className="page-header">
          <p className="eyebrow">PUCPR - Desenvolvimento Web</p>
          <h1>Login</h1>
          <p>Entre com os dados cadastrados no Firebase Authentication.</p>
        </div>

        <form className="form" onSubmit={acessarConta}>
          <label>
            E-mail
            <input
              type="email"
              value={email}
              onChange={(evento) => setEmail(evento.target.value)}
              placeholder="gabriel@email.com"
              required
            />
          </label>

          <label>
            Senha
            <input
              type="password"
              value={senha}
              onChange={(evento) => setSenha(evento.target.value)}
              placeholder="Digite sua senha"
              required
            />
          </label>

          {mensagem && <p className="message error">{mensagem}</p>}

          <button type="submit" disabled={carregando}>
            {carregando ? 'Acessando...' : 'Acessar pagina principal'}
          </button>
        </form>

        <p className="footer-text">
          Ainda nao possui conta? <Link to="/cadastro">Criar cadastro</Link>
        </p>
      </section>
    </main>
  )
}
