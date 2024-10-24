const Medico =
    require("../models/Medico");
const Especialidad= 
    require("../models/EspecialidadMedico")
module.exports = {
    async vistaCrearMedico(req, res) {

        console.log("entro al get")
        res.render("medico/nuevoMedico", {})
    },

    async vistaActualizarMedico(req, res) {

        console.log("entro al get")
        res.render("medico/actualizarMedico", {})
    },

    async guardar(req, res) {
        const dni = req.body.dni;
        const nombre_completo = req.body.nombre_completo;
        const mail = req.body.mail;
        const telefono = req.body.telefono;
        console.log(dni)
        //validar la entrada
        //sanitizar
        if (Medico.create({ dni: dni, nombre_completo: nombre_completo, mail: mail, telefono: telefono })) {
            const medicos = await Medico.get();
            res.render("medico/listaMedicos", { medicos: medicos });
        } else {
            // res.render("listaMedicos", { medicos: medicos });


        }
    },

    async mostrar(req, res) {

        const medicos = await Medico.get();
       
        if (req.query.nombre_completo) {
            res.render("medico/listaMedicos", { medicos: medicos, nombre: nombre });
        } else {
            res.render("medico/listaMedicos", { medicos: medicos });
        }
    },

    async actualizar(req, res) {


        const dni = req.body.dni;
        const nombre_completo = req.body.nombre_completo;
        const mail = req.body.mail;
        const telefono = req.body.telefono;

        if (Medico.update({ dni: dni, nombre_completo: nombre_completo, mail: mail, telefono: telefono })) {
            const medicos = await Medico.get();
            res.render("medico/listaMedicos", { medicos: medicos });
        } else {
            // res.render("listaMedicos", { medicos: medicos });


        }

    },


    async mostrarPorNombre(req, res) {
        const nombre = req.body.nombre;
        const medicos = await Medico.getByName(nombre);
        console.log(nombre)
        if (req.query.nombre_completo) {
            res.render("medico/listaMedicos", { medicos: medicos, nombre: nombre });
        } else {
            res.render("medico/listaMedicos", { medicos: medicos });
        }
    },


    async mostrarPorDni(req, res) {
        const dni = req.body.dni;
        const medicos = await Medico.getByDni(dni);
        console.log(dni)
        if (req.query.nombre_completo) {
            res.render("medico/listaMedicos", { medicos: medicos, nombre: nombre });
        } else {
            res.render("medico/listaMedicos", { medicos: medicos });
        }
    },

    async desactivar(req, res) {
        const dni = req.params.dni;
        console.log(dni)
        if (Medico.updateStatusIdle(dni)) {
            const medicos = await Medico.get();
            res.render("medico/listaMedicos", { medicos: medicos })
        }

    },

    async activar(req, res) {
        const dni = req.params.dni;
        console.log(dni)
        if (Medico.updateStatusActive(dni)) {
            const medicos = await Medico.get();
            res.render("medico/listaMedicos", { medicos: medicos })
        }

    },


   

}