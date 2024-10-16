const express = require('express');
const router = express.Router();
const controlador = require("../controllers/agendaControlador")

router.get("/nuevaagenda", controlador.nuevaAgenda);

module.exports = router;