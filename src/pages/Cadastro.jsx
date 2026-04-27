import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { doc, serverTimestamp, setDoc } from 'firebase/firestore'
import { auth, db, firebaseConfigurado } from '../services/firebase.js'

const estadoInicial = {
  email: '',
  senha: '',
  nome: '',
  sobrenome: '',
  dataNascimento: '',
}

export default function Cadastro() {
  const [formulario, setFormulario] = useState(estadoInicial)
  const [mensagem, setMensagem] = useState('')
  const [carregando, setCarregando] = useState(false)
  const navigate = useNavigate()

  function atualizarCampo(evento) {
    const { name, value } = evento.target
    setFormulario((dadosAtuais) => ({ ...dadosAtuais, [name]: value }))
  }

  async function cadastrarUsuario(evento) {
    evento.preventDefault()
    setMensagem('')

    if (!firebaseConfigurado) {
      setMensagem('Configure as variaveis do Firebase no arquivo .env para cadastrar.')
      return
    }

    setCarregando(true)

    try {
      const credencial = await createUserWithEmailAndPassword(
        auth,
        formulario.email,
        formulario.senha,
      )

      const uid = credencial.user.uid

      await setDoc(doc(db, 'usuarios', uid), {
        uid,
        email: formulario.email,
        nome: formulario.nome,
        sobrenome: formulario.sobrenome,
        dataNascimento: formulario.dataNascimento,
        criadoEm: serverTimestamp(),
      })

      navigate('/principal')
    } catch (erro) {
      if (erro.code === 'auth/email-already-in-use') {
        setMensagem('Este e-mail ja esta cadastrado.')
      } else if (erro.code === 'auth/weak-password') {
        setMensagem('A senha precisa ter pelo menos 6 caracteres.')
      } else {
        setMensagem('Nao foi possivel concluir o cadastro. Confira os dados.')
      }
    } finally {
      setCarregando(false)
    }
  }

  return (
    <main className="page">
      <section className="panel">
        <div className="page-header">
          <p className="eyebrow">PUCPR - Desenvolvimento Web</p>
          <h1>Cadastro de usuario</h1>
          <p>Crie uma conta usando e-mail e senha.</p>
        </div>

        <form className="form" onSubmit={cadastrarUsuario}>
          <label>
            E-mail
            <input
              name="email"
              type="email"
              value={formulario.email}
              onChange={atualizarCampo}
              placeholder="gabriel@email.com"
              required
            />
          </label>

          <label>
            Senha
            <input
              name="senha"
              type="password"
              value={formulario.senha}
              onChange={atualizarCampo}
              placeholder="Minimo 6 caracteres"
              minLength="6"
              required
            />
          </label>

          <label>
            Nome
            <input
              name="nome"
              type="text"
              value={formulario.nome}
              onChange={atualizarCampo}
              placeholder="Gabriel"
              required
            />
          </label>

          <label>
            Sobrenome
            <input
              name="sobrenome"
              type="text"
              value={formulario.sobrenome}
              onChange={atualizarCampo}
              placeholder="Fonseca"
              required
            />
          </label>

          <label>
            Data de nascimento
            <input
              name="dataNascimento"
              type="date"
              value={formulario.dataNascimento}
              onChange={atualizarCampo}
              required
            />
          </label>

          {mensagem && <p className="message error">{mensagem}</p>}

          <button type="submit" disabled={carregando}>
            {carregando ? 'Cadastrando...' : 'Cadastrar'}
          </button>
        </form>

        <p className="footer-text">
          Ja possui conta? <Link to="/login">Entrar</Link>
        </p>
      </section>
    </main>
  )
}
