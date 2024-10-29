const express = require('express');
const router = express.Router();
const controlador = require("../controllers/especialidadMedicoControlador")

router.post("/medico/especialidades/:dni",controlador.verEspecialidades)
router.post("/medico/nuevaespecialidad",controlador.agregarEspecialidad)
router.post("/medico/desactivarespecialidad/:matricula",controlador.eliminarEspecialidadMedico)

module.exports = router;