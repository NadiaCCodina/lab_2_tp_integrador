const EspecialidadMedico =
    require("../models/EspecialidadMedico");
const Medico =
    require("../models/Medico");

module.exports = {
    async agregarEspecialidad(req, res) {
        const clave_medico = req.body.clave_medico
        console.log(clave_medico)

        const dni = req.body.dni
        const medico = await Medico.getByDni(dni);
        const medicos = await Medico.get();
        const especialidades = await EspecialidadMedico.getEspecialidades();
        const matricula = req.body.matricula
        console.log(especialidades)
        const clave_especialidad = req.body.clave_especialidad
        try {
            console.log(matricula)
            console.log("especialidad" + clave_especialidad)
            if (await EspecialidadMedico.addSpecialtyToDoctor(clave_medico, clave_especialidad, matricula)) {
                //const especialidades = EspecialidadMedico.getEspecialidades()
                console.log("entro al if de especialidaddesc ")
                res.render("medico/listaMedicos", { medico: medico, medicos: medicos, especialidades:especialidades });
            } else {
                const medicos = await Medico.get();
                console.log("entro al else de especialidades")
                res.render("medico/listaMedicos", { medicos: medicos, especialidades:especialidades })
            }
        } catch (error) {
            console.log(error)
            res.status(500).send("Error en el servidor");

        }
    },

    async verEspecialidades(req, res) {
        const especialidades = await EspecialidadMedico.getEspecialidades();

        const dni = req.params.dni;
        //const medico_arreglo = await Medico.getByDni(dni)
        const medicos = await EspecialidadMedico.get(dni);
        console.log(especialidades)

        console.log("Especialidad " + dni)
        const medico = await Medico.getByDni(dni)
        console.log(medico)
        if (especialidades) {
            res.render("medico/listaEspecialidadPorMedico", { medico: medico, medicos: medicos, especialidades: especialidades });
        } else {

        }
    },

    async eliminarEspecialidadMedico(req, res) {
        const matricula = req.params.matricula
        const dni = req.params.dni
        console.log("dni" + dni)
        console.log(matricula + " matricula")
        const especialidades = await EspecialidadMedico.getEspecialidades();
        const medico_especialidad_baja = await Medico.getByDni(dni)
        const medico_especilidad_baja = await EspecialidadMedico.get(dni);
        const borrarEspecialidad = await EspecialidadMedico.delete(matricula)
        console.log("medico especilaidad " + medico_especialidad_baja)
        console.log(borrarEspecialidad)
        if (borrarEspecialidad) {
            const medicos = await Medico.get();
            res.render("medico/listaMedicos", { medico_especilidad_baja: medico_especilidad_baja, medicos: medicos, medico_especialidad_baja: medico_especialidad_baja, especialidades:especialidades })
        }

    },
   


}