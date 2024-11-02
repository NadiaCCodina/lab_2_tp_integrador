const express = require('express');
const router = express.Router();
const controlador = require("../controllers/pacienteControlador")
///img
const multer = require('multer');
const upload = multer({ dest: 'uploads/' }); // Especifica el directorio donde se guardarán los archivos

// Aplica `upload.single('dni_imagen')` en la ruta `POST` para manejar el archivo
router.post('/paciente', upload.single('dni_imagen'), controlador.guardar);
router.post("/paciente", controlador.guardar);

router.post("/paciente/verificarDni", controlador.crearPaciente)
router.get("/paciente/vista", controlador.vistaCrearPaciente);

router.get("/paciente/lista",controlador.mostrar)

// router.get('/paciente/editar', controlador.mostrarFormularioEdicion);

// router.post('/paciente/editar', controlador.actualizarPaciente)
router.get("/paciente/borrar", controlador.borrarPaciente);
//router.get("/paciente/editar", controlador.vistaActualizarPaciente);


module.exports= router;