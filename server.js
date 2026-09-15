import express from "express";
import pkg from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import "dotenv/config";

const { PrismaClient } = pkg;
const { Pool } = pg;

const pool = new Pool({
    connectionString: process.env.DATABASE_URL
});

const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const app = express();

app.use(express.json());

const PORT = 5000;

app.post("/treinos", async (req, res) => {
    try {
        const { nome, objetivo } = req.body;

        const treino = await prisma.treino.create({
            data: {
                nome,
                objetivo
            }
        });

        res.status(201).json(treino);
    } catch (error) {
        res.status(500).json({
            erro: "Erro ao cadastrar treino"
        });
    }
});

app.get("/treinos", async (req, res) => {
    try {
        const treinos = await prisma.treino.findMany({
            include: {
                exercicios: {
                    include: {
                        exercicio: true
                    }
                }
            }
        });

        res.json(treinos);
    } catch (error) {
        res.status(500).json({
            erro: "Erro ao listar treinos"
        });
    }
});

app.post("/exercicios", async (req, res) => {
    try {
        const { nome, grupoMuscular } = req.body;

        const exercicio = await prisma.exercicio.create({
            data: {
                nome,
                grupoMuscular
            }
        });

        res.status(201).json(exercicio);
    } catch (error) {
        res.status(500).json({
            erro: "Erro ao cadastrar exercício"
        });
    }
});

app.get("/exercicios", async (req, res) => {
    try {
        const exercicios = await prisma.exercicio.findMany();

        res.json(exercicios);
    } catch (error) {
        res.status(500).json({
            erro: "Erro ao listar exercícios"
        });
    }
});

app.post("/treinos/vincular", async (req, res) => {
    try {
        const { treinoId, exercicioId } = req.body;

        const vinculo = await prisma.treinoExercicio.create({
            data: {
                treinoId: Number(treinoId),
                exercicioId: Number(exercicioId)
            }
        });

        res.status(201).json(vinculo);
    } catch (error) {
        res.status(500).json({
            erro: "Erro ao vincular exercício ao treino"
        });
    }
});

app.get("/treinos/:id/exercicios", async (req, res) => {
    try {
        const treinoId = Number(req.params.id);

        const exercicios = await prisma.treinoExercicio.findMany({
            where: {
                treinoId
            },
            include: {
                exercicio: true
            }
        });

        res.json(exercicios);
    } catch (error) {
        res.status(500).json({
            erro: "Erro ao listar exercícios do treino"
        });
    }
});

app.put("/treinos", async (req, res) => {
    try {
        const { id, nome, objetivo } = req.body;

        const treino = await prisma.treino.update({
            where: {
                id: Number(id)
            },
            data: {
                nome,
                objetivo
            }
        });

        res.json(treino);
    } catch (error) {
        res.status(500).json({
            erro: "Erro ao atualizar treino"
        });
    }
});

app.delete("/treinos/:id/exercicios/:exercicioId", async (req, res) => {
    try {
        const treinoId = Number(req.params.id);
        const exercicioId = Number(req.params.exercicioId);

        await prisma.treinoExercicio.deleteMany({
            where: {
                treinoId,
                exercicioId
            }
        });

        res.json({
            mensagem: "Exercício desvinculado com sucesso"
        });
    } catch (error) {
        res.status(500).json({
            erro: "Erro ao desvincular exercício"
        });
    }
});

app.delete("/treinos/:id", async (req, res) => {
    try {
        const id = Number(req.params.id);

        await prisma.treinoExercicio.deleteMany({
            where: {
                treinoId: id
            }
        });

        await prisma.treino.delete({
            where: {
                id
            }
        });

        res.json({
            mensagem: "Treino deletado com sucesso"
        });
    } catch (error) {
        res.status(500).json({
            erro: "Erro ao deletar treino"
        });
    }
});

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});

/*
{
    "nome": "Treino de Peito e Triceps",
    "objetivo": "Hipertrofia"
}
    
{
    "nome": "Supino Reto",
    "grupoMuscular": "Peito"
}

{
    "treinoId": 1,
    "exercicioId": 1
}
*/
