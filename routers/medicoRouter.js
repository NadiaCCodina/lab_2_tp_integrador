const express = require('express');
const router = express.Router();
const controlador = require("../controllers/medicoControlador")
const controladorUsuario = require("../controllers/usuarioControlador")
router.get("/medico/vista", controladorUsuario.isAuthenticated, controlador.vistaCrearMedico);
router.post("/medico", controladorUsuario.isAuthenticated, controlador.guardar)
router.get("/medico/lista",controladorUsuario.isAuthenticated, controlador.mostrar)

router.post("/medico/edit/:dni",controladorUsuario.isAuthenticated, controlador.vistaActualizarMedico);
router.post("/medico/actualizar",controladorUsuario.isAuthenticated, controlador.actualizar)
router.post("/medico/busqueda/nombre",controladorUsuario.isAuthenticated,controlador.mostrarPorNombre)
router.post("/medico/busqueda/dni",controladorUsuario.isAuthenticated,controlador.mostrarPorDni)
router.post("/medico/desactivar/:dni",controladorUsuario.isAuthenticated,controlador.desactivar)
router.post("/medico/activar/:dni",controladorUsuario.isAuthenticated,controlador.activar)

module.exports= router;