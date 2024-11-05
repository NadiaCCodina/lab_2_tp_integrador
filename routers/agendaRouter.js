const express = require('express');
const router = express.Router();
const controlador = require("../controllers/agendaControlador")
const controladorUsuario = require("../controllers/usuarioControlador")

router.get("/agenda", controlador.vistaAgenda);

router.get('/agendasturno',controladorUsuario.isAuthenticatedOp, controlador.index);
router.post('/seleccionar',controladorUsuario.isAuthenticatedOp, controlador.seleccionarHorario);
router.post('/horario/nuevo',controladorUsuario.isAuthenticatedOp, controlador.registrarHorario);
router.get('/gestorHorarios', controladorUsuario.isAuthenticatedOp, controlador.vistaGestorHorarios);
router.get("/nuevaagenda",controladorUsuario.isAuthenticatedOp, controlador.verEspecialidades )
router.get('/seleccionar/medicoespecialidad',controladorUsuario.isAuthenticatedOp, controlador.medicosPorEspecialidad);
router.post("/agenda/crear/:matricula", controladorUsuario.isAuthenticatedOp, controlador.mostrarConfiguracionAgenda )
router.post("/agendanueva", controladorUsuario.isAuthenticatedOp, controlador.guardarNuevaAgenda )
router.get("/agendas", controladorUsuario.isAuthenticatedOp, controlador.vistaAgenda )

module.exports = router;