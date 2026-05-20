const express = require("express");
const router = express.Router();

const {
    cadastrar,
    listar,
    atualizar,
    excluir,
    buscarPorId
} = require("../controllers/estadia.controllers");

router.post("/cadastrar", cadastrar);
router.get("/listar", listar);
router.get("/buscar/:id", buscarPorId);
router.put("/atualizar/:id", atualizar);
router.delete("/excluir/:id", excluir);

module.exports = router;
