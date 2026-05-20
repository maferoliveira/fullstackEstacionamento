const prisma = require("../data/prisma");

const cadastrar = async (req, res) => {
    try {
        if (req.body.placa) {
            req.body.placa = req.body.placa.toUpperCase().trim();
        }

        const item = await prisma.automovel.create({
            data: req.body
        });

        res.status(201).json(item);
    } catch (error) {
        if (error.code === 'P2002') {
            return res.status(400).json({ erro: "Já existe um automóvel cadastrado com esta placa." });
        }
        res.status(500).json({ erro: error.message });
    }
};

const listar = async (req, res) => {
    try {
        const lista = await prisma.automovel.findMany({
            include: {
                estadias: true
            }
        });

        res.status(200).json(lista);
    } catch (error) {
        res.status(500).json({ erro: error.message });
    }
};

const buscarPorPlaca = async (req, res) => {
    const { placa } = req.params;

    try {
        const item = await prisma.automovel.findUnique({
            where: {
                placa: placa.toUpperCase().trim()
            },
            include: {
                estadias: true
            }
        });

        if (!item) {
            return res.status(404).json({ erro: "Automóvel não encontrado." });
        }

        res.status(200).json(item);
    } catch (error) {
        res.status(500).json({ erro: error.message });
    }
};

const atualizar = async (req, res) => {
    const { placa } = req.params;

    try {
        const item = await prisma.automovel.update({
            where: {
                placa: placa.toUpperCase().trim()
            },
            data: req.body
        });

        res.status(200).json(item);
    } catch (error) {
        if (error.code === 'P2025') {
            return res.status(404).json({ erro: "Automóvel não encontrado para atualização." });
        }
        res.status(500).json({ erro: error.message });
    }
};

const excluir = async (req, res) => {
    const { placa } = req.params;

    try {
        await prisma.automovel.delete({
            where: {
                placa: placa.toUpperCase().trim()
            }
        });

        res.status(200).json({
            msg: "Excluído com sucesso"
        });
    } catch (error) {
        if (error.code === 'P2025') {
            return res.status(404).json({ erro: "Automóvel não encontrado para exclusão." });
        }
        if (error.code === 'P2003') {
            return res.status(400).json({ 
                erro: "Não é possível excluir este automóvel porque ele possui histórico de estadias ativas ou finalizadas." 
            });
        }
        res.status(500).json({ erro: error.message });
    }
};

module.exports = {
    cadastrar,
    listar,
    buscarPorPlaca,
    atualizar,
    excluir
};