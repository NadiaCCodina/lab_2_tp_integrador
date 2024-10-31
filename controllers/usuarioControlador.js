const Usuario = require("../models/Usuario");
const bcryptjs = require("bcryptjs")
const Medico = require("../models/Medico");
module.exports = {
    async vistaRegistroUsuario(req, res) {

        res.render("usuario/registro")
    },
    async vistaLoginUsuario(req, res) {

        res.render("usuario/login")
    },

    async registro(req, res) {

        const usuario = req.body.usuario
        const contraseña = req.body.contraseña
        let contraseñaHash = await bcryptjs.hash(contraseña, 8)
        try {
            await Usuario.create(usuario, contraseñaHash)
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

    async login(req, res) {
        const usuario = req.body.usuario
        const contraseña = req.body.contraseña
        if (!usuario || !contraseña){
            res.render("usuario/login", { error: "Error al ingresar, intentelo de nuevo" })
        } else {
           const datosUsuario= await Usuario.login(usuario)
              
            if (datosUsuario.length == 0 || !(await bcryptjs.compare(contraseña, datosUsuario[0].contraseña))) {
                res.render("usuario/login", { error: "Error al ingresar, compruebe su contraseña" })
            }else{
                const medicos = await Medico.get();
                res.render("medico/listaMedicos", { medicos: medicos, admi: "Ingreso exitoso"});
            }

        }

    }

}
