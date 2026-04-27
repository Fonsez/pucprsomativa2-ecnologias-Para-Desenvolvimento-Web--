# Trabalho PUCPR - Tecnologias Para Desenvolvimento Web

Aluno: Gabriel Fonseca

Aplicacao em React com tres paginas usando React Router Dom, Firebase Authentication e Firestore.

## O que o projeto faz

- Cadastro com e-mail, senha, nome, sobrenome e data de nascimento.
- Criacao do usuario no Firebase Authentication com provedor e-mail/senha.
- Gravacao dos dados extras no Firestore, incluindo o UID do usuario.
- Login validando e-mail e senha no Firebase Authentication.
- Pagina principal mostrando nome, sobrenome e data de nascimento do usuario logado.

## Como rodar

Instale as dependencias:

```bash
npm install
```

Crie um arquivo `.env` seguindo o modelo do `.env.example` e preencha com as credenciais do seu projeto Firebase.

Depois rode:

```bash
npm run dev
```

## Firebase

No Firebase Console, ative:

- Authentication com o provedor E-mail/senha.
- Cloud Firestore.

Os dados dos usuarios ficam na colecao `usuarios`, usando o UID como id do documento.

## Build

```bash
npm run build
```

O build final sera gerado na pasta `dist`.

## Deploy

Uma opcao simples e usar a Vercel:

```bash
npm run build
npm install -g vercel
vercel login
vercel --prod
```

Na Vercel, cadastre as mesmas variaveis do arquivo `.env.example` em Project Settings > Environment Variables.

Tambem da para usar o Firebase Hosting:

```bash
npm install -g firebase-tools
firebase login
npm run build
firebase deploy --project seu-projeto
```
