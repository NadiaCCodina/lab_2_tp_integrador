const express = require('express');
const router = express.Router();
const MostrarAgendaControlador = require('../controllers/mostrarAgendaControlador');



const mostrarAgendaControlador_ = new MostrarAgendaControlador();

// Asegúrate de que estos métodos existen en tu controlador
router.get('/mostrar-agenda', mostrarAgendaControlador_.index);
router.post('/seleccionar', mostrarAgendaControlador_.seleccionarHorario);

module.exports = router;



