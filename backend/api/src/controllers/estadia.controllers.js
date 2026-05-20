const prisma = require("../data/prisma");

const cadastrar = async (req, res) => {
    try {
        const item = await prisma.estadia.create({
            data: req.body
        });
        res.status(201).json(item);
    } catch (error) {
        res.status(500).json({ erro: error.message });
    }
};

const listar = async (req, res) => {
    try {
        const lista = await prisma.estadia.findMany({
            include: {
                automovel: true
            }
        });
        res.status(200).json(lista);
    } catch (error) {
        res.status(500).json({ erro: error.message });
    }
};

const buscarPorId = async (req, res) => {
    const { id } = req.params;

    try {
        const item = await prisma.estadia.findUnique({
            where: {
                id: Number(id)
            },
            include: {
                automovel: true
            }
        });

        if (!item) {
            return res.status(404).json({ erro: "Estadia não encontrada." });
        }

        res.status(200).json(item);
    } catch (error) {
        res.status(500).json({ erro: error.message });
    }
};

const atualizar = async (req, res) => {
    const { id } = req.params;
    const dados = req.body;

    try {
        const estadiaAtual = await prisma.estadia.findUnique({
            where: {
                id: Number(id)
            }
        });

        if (!estadiaAtual) {
            return res.status(404).json({ erro: "Estadia não encontrada para atualização." });
        }

        if (dados.saida) {
            const entrada = new Date(estadiaAtual.entrada);
            const saida = new Date(dados.saida);

            const diferencaEmMS = saida - entrada;

            const horas = diferencaEmMS / (1000 * 60 * 60);

            dados.valorTotal = horas * estadiaAtual.valorHora;
        }

        const item = await prisma.estadia.update({
            where: {
                id: Number(id)
            },
            data: dados
        });

        res.status(200).json(item);
    } catch (error) {
        res.status(500).json({ erro: error.message });
    }
};

const excluir = async (req, res) => {
    const { id } = req.params;

    try {
        await prisma.estadia.delete({
            where: {
                id: Number(id)
            }
        });

        res.status(200).json({
            msg: "Excluído com sucesso"
        });
    } catch (error) {
        if (error.code === 'P2025') {
            return res.status(404).json({ erro: "Estadia não encontrada para exclusão." });
        }
        res.status(500).json({ erro: error.message });
    }
};

module.exports = {
    cadastrar,
    listar,
    buscarPorId,
    atualizar,
    excluir
};