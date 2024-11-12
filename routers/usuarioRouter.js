const express = require('express');
const router = express.Router();
const controlador = require("../controllers/usuarioControlador")


router.get("/usuario/registro",controlador.isAuthenticatedAdmi, controlador.vistaRegistroUsuario);


router.get("/sucursal/registro",controlador.isAuthenticatedAdmi, controlador.vistaRegistroSucursal);


router.post("/registro-sucursal", controlador.registrarSucursal);
router.post("/login-op", controlador.logInOp);


router.post("/registro", controlador.registro)
router.get("/", controlador.vistaLoginUsuario)
router.post("/login", controlador.login)

module.exports= router;
