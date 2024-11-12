const express = require('express');
const router = express.Router();
const controlador = require("../controllers/agendaControlador")
const controladorUsuario = require("../controllers/usuarioControlador")


router.get("/agenda", controlador.vistaAgenda);

//router.get('/agendasturno',controladorUsuario.isAuthenticatedOp, controlador.index);
router.post('/seleccionar',controladorUsuario.isAuthenticatedOp, controlador.seleccionarHorario);
router.post('/horario/nuevo',controladorUsuario.isAuthenticatedOp, controlador.registrarHorario);
router.get('/gestorHorarios', controladorUsuario.isAuthenticatedOp, controlador.vistaGestorHorarios);
router.get("/nuevaagenda",controladorUsuario.isAuthenticatedOp, controlador.verEspecialidades )
router.get('/seleccionar/medicoespecialidad',controladorUsuario.isAuthenticatedOp, controlador.medicosPorEspecialidad);
router.post("/agenda/crear/:matricula", controladorUsuario.isAuthenticatedOp, controlador.mostrarConfiguracionAgenda )
router.post("/agendanueva", controladorUsuario.isAuthenticatedOp, controlador.guardarNuevaAgenda )
router.get("/agendas", controladorUsuario.isAuthenticatedOp, controlador.vistaAgenda )
router.get('/agendas/horario/medico',controladorUsuario.isAuthenticatedOp, controlador.horarioPorAgendaMedico);
router.get("/seleccionar/agendas/especialidad", controladorUsuario.isAuthenticatedOp,  controlador.agendaPorEspecialidad);
router.get("/turnos/agenda", controladorUsuario.isAuthenticatedOp,  controlador.verTurnos );
router.post("/editar/estado/turno", controladorUsuario.isAuthenticatedOp, controlador.updateEstadoTurno);
router.get("/seleccionar/agendas/medico", controlador.agendaPorMedicoNombre );
router.get("/agenda/turnos/estado", controladorUsuario.isAuthenticatedOp,  controladorUsuario.isAuthenticatedOp,  controlador.verTurnosPorEstado );
router.get("/agenda/turnos/paciente",  controladorUsuario.isAuthenticatedOp, controlador.verTurnosPorPaciente );


router.get("/agendas/online", controlador.vistaAgendaOnline )
router.get("/seleccionar/agendas/especialidad/online", controlador.agendaPorEspecialidadOnline )
router.get("/medico/busqueda/nombre/online", controlador.agendaPorMedicoNombreOnline )

router.get('/agendas/turno/medico/online', controlador.horarioPorAgendaMedicoOnline);
router.post('/seleccionar/online', controlador.seleccionarHorarioOnline);


module.exports = router;