const express = require('express');
const router = express.Router();
const controlador = require("../controllers/medicoControlador")
const controladorUsuario = require("../controllers/usuarioControlador")

router.get("/medico/vista", controladorUsuario.isAuthenticatedAdmi, controlador.vistaCrearMedico);
router.post("/medico", controladorUsuario.isAuthenticatedAdmi, controlador.guardar)
router.get("/medico/lista",controladorUsuario.isAuthenticatedAdmi, controlador.mostrar)
router.post("/medico/verificarDni", controlador.verificarDni)
router.post("/medico/edit/:dni",controladorUsuario.isAuthenticatedAdmi, controlador.vistaActualizarMedico);
router.post("/medico/actualizar",controladorUsuario.isAuthenticatedAdmi, controlador.actualizar)
router.post("/medico/busqueda/nombre",controladorUsuario.isAuthenticatedAdmi,controlador.mostrarPorNombre)
router.post("/medico/busqueda/dni",controladorUsuario.isAuthenticatedAdmi,controlador.mostrarPorDni)
router.post("/medico/desactivar/:dni",controladorUsuario.isAuthenticatedAdmi,controlador.desactivar)
router.post("/medico/activar/:dni",controladorUsuario.isAuthenticatedAdmi,controlador.activar)

module.exports= router;