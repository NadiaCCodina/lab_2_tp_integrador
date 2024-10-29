const EspecialidadMedico =
    require("../models/EspecialidadMedico");
const Medico =
    require("../models/Medico");

module.exports = {
    async agregarEspecialidad(req, res) {
        const clave_medico = req.body.clave_medico
        console.log(clave_medico)

        const dni = req.body.dni
        const medico = await Medico.getByDni(dni)
        const medicos = await Medico.get();
        const matricula = req.body.matricula
        const clave_especialidad = req.body.clave_especialidad
       
        console.log(matricula)
        console.log("especialidad" + clave_especialidad)
        if (EspecialidadMedico.addSpecialtyToDoctor(clave_medico, clave_especialidad, matricula)) {
            const especialidades = EspecialidadMedico.getEspecialidades()
            res.render("medico/listaMedicos", {medico:medico, medicos: medicos });
        } else {
            const medicos = await Medico.get();
            res.render("medico/listaMedicos", { medicos: medicos })
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
        const dni = req.body.dni
        console.log(matricula + " matricula")
        const medico_especilidad_baja = await EspecialidadMedico.get(dni);
        const borrarEspecialidad = await EspecialidadMedico.delete(matricula)
        console.log(borrarEspecialidad)
        if (borrarEspecialidad) {
            const medicos = await Medico.get();
            res.render("medico/listaMedicos", { medico_especilidad_baja:medico_especilidad_baja, medicos: medicos })
        }

    }


}