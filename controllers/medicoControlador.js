const Medico =
    require("../models/Medico");
const Especialidad= 
    require("../models/EspecialidadMedico")
var url= require("url")
module.exports = {
    async vistaCrearMedico(req, res) {

        console.log("entro al get")
        res.render("medico/verificarDniMedico", {})
    },

    async vistaActualizarMedico(req, res) {
        const dni = req.params.dni
        const medicos = await Medico.getByDni(dni)
        console.log("entro al get")
        res.render("medico/actualizarMedico", {medicos:medicos})
    },

    async verificarDni(req, res) {
        const dni = req.body.dni;
    
        try {
            const resultMedico = await Medico.getByDni(dni);
            if(resultMedico && resultMedico.length>0){
                const medicos = await Medico.get();
                res.render("medico/listaMedicos", {resultMedico:resultMedico, medicos:medicos})
            }else{

            const result = await Medico.findPersonByDni(dni);
            const exist = result !== null;
    
            console.log("existe????: ", exist);
            res.render("medico/nuevoMedico", { exist, dni, result});
            }
        } catch (error) {
            console.error("Error al crear paciente:", error);
            res.status(500).send("Error en el servidor");
        }
    }
        ,

    async guardar(req, res) {
        const dni = req.body.dni;
        const nombre_completoc = req.body.nombre_completo;
        const mail = req.body.mail;
        const telefono = req.body.telefono;
        const exist =req.body.exist
        console.log(dni)
        if (exist){
            if(await Medico.createM(dni)){
                const medicos = await Medico.get();
                res.redirect("/medico/lista?nombre="+nombre_completoc) 
            }
        }else{
        //validar la entrada
        //sanitizar
        if (await Medico.create({ dni: dni, nombre_completo: nombre_completoc, mail: mail, telefono: telefono })) {
            const medicos = await Medico.get();
            res.redirect("/medico/lista?nombre="+nombre_completoc);
        } else {
            // res.render("listaMedicos", { medicos: medicos });


        }
        }
    },

    async mostrar(req, res) {
        const nombre= req.query.nombre
        const medicos = await Medico.get();
        console.log(nombre+" url")
        if (nombre) {
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
            res.render("medico/listaMedicos", { medicos: medicos, nombre_completo:nombre_completo });
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