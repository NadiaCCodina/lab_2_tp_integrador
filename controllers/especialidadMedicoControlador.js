const EspecialidadMedico =
    require("../models/EspecialidadMedico");

module.exports = {
    async agregarEspecialidad() {

    },

    async verEspecialidades(req, res) {
        const especialidades = await EspecialidadMedico.getEspecialidades();
        const dni= req.params.dni;
        const medicos = await EspecialidadMedico.get(dni);
        console.log(especialidades)
        console.log("Especialidad "+dni)
        if (req.query.dni) {
            res.render("medico/listaEspecialidadPorMedico", { medicos: medicos, especialidades:especialidades });
        } else {
            res.render("medico/listaEspecialidadPorMedico", { medicos: medicos, especialidades:especialidades  });
        }
    }


}