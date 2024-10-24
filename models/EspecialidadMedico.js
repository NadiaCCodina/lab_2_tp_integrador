const createConnection = require("../config/bd");

const EspecialidadMedico = {

    async get(dni) {
        const conn = await createConnection();
        const [medicos] = await conn.query("SELECT e.nombre_especialidad, p.nombre_completo, em.matricula FROM especialidad_medico em JOIN medico m ON em.clave_medico = m.clave_medico JOIN persona p ON m.dni = p.dni JOIN especialidad e ON em.clave_especialidad = e.clave_especialidad WHERE m.dni = ?", 
            [dni]
        );
        return medicos;
    },

    async getEspecialidades(){
        const conn = await createConnection();
        const [especialidades]= await conn.query("SELECT * FROM `especialidad`")
        return especialidades
    }
}
module.exports = EspecialidadMedico;