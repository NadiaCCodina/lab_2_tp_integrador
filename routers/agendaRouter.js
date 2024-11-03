const express = require('express');
const router = express.Router();
const controlador = require("../controllers/agendaControlador")


router.get("/agenda", controlador.vistaAgenda);

router.get('/agendasturno', controlador.index);
router.post('/seleccionar', controlador.seleccionarHorario);
router.post('/horario/nuevo', controlador.registrarHorario);
router.get('/gestorHorarios', controlador.vistaGestorHorarios);


module.exports = router;