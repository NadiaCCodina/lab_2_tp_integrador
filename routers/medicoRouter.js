const express = require('express');
const router = express.Router();
const controlador = require("../controllers/medicoControlador")

router.get("/medico/vista", controlador.vistaCrearMedico);
router.post("/medico", controlador.guardar)
router.get("/medico/lista",controlador.mostrar)

router.post("/medico/edit/:dni", controlador.vistaActualizarMedico);
router.post("/medico/actualizar", controlador.actualizar)
router.post("/medico/busqueda/nombre",controlador.mostrarPorNombre)
router.post("/medico/busqueda/dni",controlador.mostrarPorDni)
router.post("/medico/desactivar/:dni",controlador.desactivar)
router.post("/medico/activar/:dni",controlador.activar)

module.exports= router;