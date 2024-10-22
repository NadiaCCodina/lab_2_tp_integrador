const express = require('express');
const router = express.Router();
const controlador = require("../controllers/medicoControlador")

router.get("/medico/vista", controlador.vistaCrearMedico);
router.post("/medico", controlador.guardar)
router.get("/medico/lista",controlador.mostrar)

router.get("/medico/edit", controlador.vistaActualizarMedico);
router.post("/medico/actualizar", controlador.actualizar)

module.exports= router;