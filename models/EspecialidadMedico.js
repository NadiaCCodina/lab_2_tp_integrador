const createConnection = require("../config/bd");

const EspecialidadMedico = {

    async get(dni) {
        const conn = await createConnection();
        const [especialidades] = await conn.query("SELECT e.nombre_especialidad, p.nombre_completo, em.matricula, em.clave_medico, m.dni FROM especialidad_medico em JOIN medico m ON em.clave_medico = m.clave_medico JOIN persona p ON m.dni = p.dni JOIN especialidad e ON em.clave_especialidad = e.clave_especialidad WHERE m.dni = ?",
            [dni]
        );
        if (especialidades.length > 0) {
            return especialidades
        }
        else {
            return false
        }
    },

    async getEspecialidades() {
        const conn = await createConnection();
        const [especialidades] = await conn.query("SELECT * FROM `especialidad`")
        return especialidades
    },

    async addSpecialtyToDoctor(clave_especialidad, clave_medico, matricula) {
        const conn = await createConnection();
        const [result] = await conn.query("INSERT INTO especialidad_medico( clave_especialidad, clave_medico, matricula) VALUES (?,?,?)",
            [clave_medico, clave_especialidad, matricula]

        );
        return result.affectedRows == 1
    },
    async delete(matricula) {
        try {
            const conn = await createConnection();
            const [result] = await conn.query("DELETE FROM especialidad_medico WHERE `especialidad_medico`.`matricula` = ?",
                [matricula]
            );
            return result.affectedRows == 1
        }
        catch (error) {
            return false
        }
    }
}
module.exports = EspecialidadMedico;