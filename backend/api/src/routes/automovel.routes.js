const express = require("express");
const router = express.Router();

const {
    cadastrar,
    listar,
    buscarPorPlaca,
    atualizar,
    excluir
} = require("../controllers/automovel.controllers");

router.post("/cadastrar", cadastrar);
router.get("/listar", listar);
router.get("/buscar/:placa", buscarPorPlaca);
router.put("/atualizar/:placa", atualizar);
router.delete("/excluir/:placa", excluir);

module.exports = router;
