const express = require('express');
const router = express.Router();
const controlador = require("../controllers/usuarioControlador")


router.get("/usuario/registro", controlador.vistaRegistroUsuario);
router.post("/registro", controlador.registro)
router.get("/", controlador.vistaLoginUsuario)
router.post("/login", controlador.login)
module.exports= router;