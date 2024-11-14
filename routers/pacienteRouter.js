const express = require('express');
const router = express.Router();
const controlador = require("../controllers/pacienteControlador")
///img
const multer = require('multer');
const upload = multer({ dest: 'uploads/' }); // Especifica el directorio donde se guardarán los archivos
const controladorUsuario = require("../controllers/usuarioControlador")

//Aplica `upload.single('dni_imagen')` en la ruta `POST` para manejar el archivo
router.post('/paciente', upload.single('dni_imagen'), controladorUsuario.isAuthenticatedOp, controlador.guardar);
router.post("/paciente", controladorUsuario.isAuthenticatedOp, controlador.guardar);

router.post("/paciente/verificarDni", controladorUsuario.isAuthenticatedOp, controlador.crearPaciente)
router.get("/paciente/vista", controladorUsuario.isAuthenticatedOp, controlador.vistaCrearPaciente);

router.get("/paciente/lista", controladorUsuario.isAuthenticatedOp, controlador.mostrar);



router.post("/paciente/busqueda/nombre", controlador.mostrarPorNombre)
router.post('/paciente/editar', controlador.actualizarPaciente)
router.get("/paciente/borrar", controladorUsuario.isAuthenticatedOp, controlador.borrarPaciente);
router.get("/paciente/editarP", controlador.vistaActualizarPaciente);
router.post("/paciente/busqueda/dni", controlador.mostrarPorDni);
router.post("/ver/paciente", controladorUsuario.isAuthenticatedOp, controlador.mostrarPorDni);


router.post("/paciente/verificarDni/online", controlador.crearPacienteOnline)
router.post('/paciente/online', upload.single('dni_imagen'), controlador.guardarOnline);



module.exports = router;