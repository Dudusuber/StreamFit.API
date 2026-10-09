# StreamFit API

API REST para gerenciamento de treinos e exercícios de uma academia digital.

## Tecnologias

* Node.js
* Express
* PostgreSQL
* Prisma ORM 7.8.0

## Instalação

Instale as dependências:

```bash
npm install
```

Configure o arquivo `.env` com a conexão do PostgreSQL.

## Banco de dados

Execute as migrations:

```bash
npx prisma migrate dev
```

Gere o Prisma Client:

```bash
npx prisma generate
```

## Executar o servidor

```bash
node server.js
```

O servidor será iniciado em:

```text
http://localhost:5000
```

## Rotas

* POST `/treinos`
* GET `/treinos`
* POST `/exercicios`
* GET `/exercicios`
* POST `/treinos/vincular`
* GET `/treinos/:id/exercicios`
* PUT `/treinos`
* DELETE `/treinos/:id/exercicios/:exercicioId`
* DELETE `/treinos/:id`

## Modelagem

O projeto utiliza um relacionamento N:N entre `Treino` e `Exercicio`, utilizando a tabela intermediária `TreinoExercicio`.
DATABASE_URL="postgresql://postgres:senai@localhost:5432/streamfit"
