const Usuario = require("../models/Usuario");
const bcryptjs = require("bcryptjs")
const Medico = require("../models/Medico");
const jwt = require("jsonwebtoken")
const { promisify } = require('util');
const Paciente = require("../models/Paciente")
const Especialidades = require("../models/EspecialidadMedico")
module.exports = {
    async vistaRegistroUsuario(req, res) {

        res.render("usuario/registro")
    },

    async vistaLoginUsuario(req, res) {

        try {


            res.render("usuario/login")
        } catch (error) {
            console.log(error)

        }
    },
    //REGISTRO USA BCRYPTJS PARA HASHEAR LA CONTRASEÑA
    //GUARDAMOS USUARIO, CONTRASEÑA, ROL
    async registro(req, res) {

        const usuario = req.body.usuario
        const contraseña = req.body.contraseña
        const rol = req.body.rol
        let contraseñaHash = await bcryptjs.hash(contraseña, 8)
        try {
            await Usuario.create(usuario, contraseñaHash, rol)
            res.render("usuario/login", {})
        }
        catch (error) {
            if (error.code == 'ER_DUP_ENTRY') {
                res.render("usuario/registro", { error: "El usuario ya existe" })
            } else {
                res.render("usuario/registro", { error: "Ocurrio un problema al crear el usuario. Intente nuevamente" })
            }
        }
    },
// LOGIN CON BCRYPT COMPARA CONTRASEÑA GUARDADA CON LA INGRESADA
//USA JWT (JSON WEB TOKEN) PARA GUARDAR LOS DATOS DEL USUARIO EN COOKIES
//RENDERISA SEGUN ROL
    async login(req, res) {
        const usuario = req.body.usuario
        const contraseña = req.body.contraseña
        if (!usuario || !contraseña) {
            res.render("usuario/login", { error: "Error al ingresar, intentelo de nuevo" })
        } else {
            const datosUsuario = await Usuario.getUsuario(usuario)

            if (datosUsuario.length == 0 || !(await bcryptjs.compare(contraseña, datosUsuario[0].contraseña))) {
                res.render("usuario/login", { error: "Error al ingresar, compruebe su contraseña" })
            } else {
                const usuario = datosUsuario[0].usuario
                const rol = datosUsuario[0].rol
                const token = jwt.sign({ usuario: usuario, rol: rol }, "clave_secreta", { expiresIn: '24h' })
                console.log("token" + token)

                const cookiesOptions = {
                    expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
                    httpOnly: true
                }
                res.cookie("jwt", token, cookiesOptions)
                const medicos = await Medico.get();
                const pacientes = await Paciente.get();
                const especialidades = await Especialidades.getEspecialidades();
                if (rol == "admin") {
                    res.render("medico/listaMedicos", { medicos: medicos, especialidades: especialidades, admi: "Ingreso exitoso" });
                }
                else {
                    if (rol == "op") {
                        const sucursales = await Usuario.getBranches();

                        res.render("usuario/inicio", { sucursales: sucursales, admi: "Ingreso exitoso" })
                    }
                }
            }

        }

    },
//DECODIFICAMOS EL JWT DE LAS COOKIES
//COMPROBAMOS QUE EL USUARIO ES ADMIN 
    async isAuthenticatedAdmi(req, res, next) {
        console.log("req " + req.cookies.jwt)
        if (req.cookies.jwt) {
            try {
                const decodificada = await promisify(jwt.verify)(req.cookies.jwt, "clave_secreta")
                const datosUsuario = await Usuario.getUsuario(decodificada.usuario)
                console.log(datosUsuario)
                console.log(decodificada)
                //conexion.query('SELECT * FROM users WHERE id = ?', [decodificada.id], (error, results) => {
                if (datosUsuario && datosUsuario[0].rol === "admin") {
                    return next()

                } else {
                    res.render('usuario/login', { errorAutorizacion: "No autorizado" })
                }
            } catch (error) {
                console.log(error)
                return next()
            }
        } else {
            res.render('usuario/login', { errorAutorizacion: "No autorizado" })
        }

    },
//DECODIFICAMOS EL JWT DE LAS COOKIES
//COMPROBAMOS QUE EL USUARIO ES OPERADOR 
    async isAuthenticatedOp(req, res, next) {
        console.log("req " + req.cookies.jwt)
        if (req.cookies.jwt) {
            try {
                const decodificada = await promisify(jwt.verify)(req.cookies.jwt, "clave_secreta")
                const datosUsuario = await Usuario.getUsuario(decodificada.usuario)
                console.log(datosUsuario)
                console.log(decodificada)
                //conexion.query('SELECT * FROM users WHERE id = ?', [decodificada.id], (error, results) => {
                if (datosUsuario && datosUsuario[0].rol === "op") { return next() }
                else {

                    res.render('usuario/login', { errorAutorizacion: "No autorizado" })
                }

            } catch (error) {
                console.log(error)
                return next()
            }
        } else {
            res.render('usuario/login', { errorAutorizacion: "No autorizado" })


        }


    },

    async vistaRegistroSucursal(req, res) {

        res.render("sucursal/registro")

    },

    async registrarSucursal(req, res) {
        const sucursal = req.body
        try {
            await Usuario.createBranch(sucursal.nombre, sucursal.direccion)

            res.render("sucursal/registro", { message: `Sucursal creada con exito` })
        }
        catch (error) {
            console.log(error)
        }
    },

    // async logInOp(req, res) {
    //     const clave_sucursal = req.body.sucursal
    //     const sucursal = await Usuario.getBranchByKey(clave_sucursal)
    //     const nombreSucursal = sucursal[0].nombre_sucursal
    //     try {

    //         res.render("headerOp", { nombreSucursal })
    //     }
    //     catch (error) {
    //         console.log(error)
    //     }

    // },

 async logInOp(req, res){
    const clave_sucursal = req.body.sucursal
    const sucursal = await Usuario.getBranchByKey(clave_sucursal)
    const nombreSucursal = sucursal[0].nombre_sucursal

    try{ 
 
     res.render( "headerOp", {nombreSucursal, clave_sucursal})
 }
     catch (error) {
         console.log(error)
 }



}

}
