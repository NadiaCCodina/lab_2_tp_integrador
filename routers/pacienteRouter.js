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

router.get("/paciente/lista",controladorUsuario.isAuthenticatedOp, controlador.mostrar)

        //router.get('/paciente/editar', controlador.mostrarFormularioEdicion);

 router.post('/paciente/editar', controlador.actualizarPaciente)
router.get("/paciente/borrar", controladorUsuario.isAuthenticatedOp, controlador.borrarPaciente);
router.get("/paciente/editar", controlador.vistaActualizarPaciente);


router.post("/paciente/verificarDni/online", controlador.crearPacienteOnline)
router.post('/paciente/online', upload.single('dni_imagen'),controlador.guardarOnline);

//////////////////////////VERSION PREVIA AL AUTENTICADOR

// router.post('/paciente', upload.single('dni_imagen'), controlador.guardar);
// router.post("/paciente", controlador.guardar);
// router.post("/paciente/verificarDni", controlador.crearPaciente)
// router.get("/paciente/vista", controlador.vistaCrearPaciente);
// router.get("/paciente/lista",controlador.mostrar)

// router.get('/paciente/editar', controlador.encontrarParaEdicion)
// router.post('/paciente/editar', upload.single('dni_imagen'), controlador.actualizarPaciente);
// router.post('/paciente/editar', controlador.actualizarPaciente)

// router.get("/paciente/borrar", controlador.borrarPaciente);

////////////
// router.get('/paciente/editar', controlador.mostrarFormularioEdicion);
//router.get("/paciente/editar", controlador.vistaActualizarPaciente);



module.exports= router;