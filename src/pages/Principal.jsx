import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'
import { auth, db, firebaseConfigurado } from '../services/firebase.js'

export default function Principal() {
  const [usuario, setUsuario] = useState(null)
  const [carregando, setCarregando] = useState(true)
  const [mensagem, setMensagem] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    if (!firebaseConfigurado) {
      setMensagem('Configure as variaveis do Firebase no arquivo .env para carregar os dados.')
      setCarregando(false)
      return undefined
    }

    const cancelarInscricao = onAuthStateChanged(auth, async (usuarioLogado) => {
      if (!usuarioLogado) {
        navigate('/login')
        return
      }

      try {
        const usuarioRef = doc(db, 'usuarios', usuarioLogado.uid)
        const usuarioSnap = await getDoc(usuarioRef)

        if (usuarioSnap.exists()) {
          setUsuario(usuarioSnap.data())
        } else {
          setMensagem('Cadastro encontrado no Auth, mas sem dados no Firestore.')
        }
      } catch {
        setMensagem('Nao foi possivel carregar os dados do usuario.')
      } finally {
        setCarregando(false)
      }
    })

    return cancelarInscricao
  }, [navigate])

  async function sair() {
    if (!firebaseConfigurado) {
      navigate('/login')
      return
    }

    await signOut(auth)
    navigate('/login')
  }

  function formatarData(data) {
    if (!data) return 'Nao informada'

    return new Intl.DateTimeFormat('pt-BR', {
      timeZone: 'UTC',
    }).format(new Date(`${data}T00:00:00`))
  }

  return (
    <main className="page">
      <section className="panel">
        <div className="page-header">
          <p className="eyebrow">Area principal</p>
          <h1>Dados do usuario</h1>
          <p>Informacoes carregadas do Firestore apos o login.</p>
        </div>

        {carregando && <p className="message">Carregando dados...</p>}
        {mensagem && <p className="message error">{mensagem}</p>}

        {usuario && (
          <div className="user-data">
            <div>
              <span>Nome</span>
              <strong>{usuario.nome}</strong>
            </div>
            <div>
              <span>Sobrenome</span>
              <strong>{usuario.sobrenome}</strong>
            </div>
            <div>
              <span>Data de nascimento</span>
              <strong>{formatarData(usuario.dataNascimento)}</strong>
            </div>
          </div>
        )}

        <div className="actions">
          <button type="button" onClick={sair}>
            Sair
          </button>
          <Link className="secondary-link" to="/cadastro">
            Novo cadastro
          </Link>
        </div>
      </section>
    </main>
  )
}
