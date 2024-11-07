const createConnection = require("../config/bd");



const Paciente = {
    async get() {
        const conn = await createConnection();
        const [pacientes] = await conn.query("SELECT persona.dni, nombre_completo, mail, obra_social,  dni_imagen, telefono FROM `paciente`, persona WHERE persona.dni = paciente.dni");
        return pacientes;
    },




    async insertPerson(person) {

        const conn = await createConnection();
        const { dni, nombre_completo, mail, telefono } = person;

        const [personResult] = await conn.query(
            "INSERT INTO persona (dni, nombre_completo, telefono, mail) VALUES (?, ?, ?, ?)",
            [dni, nombre_completo, telefono, mail]
        );

        if (personResult.affectedRows !== 1) {
            console.error("Error al insertar en persona.");
            return false;
        }
    },

    async insertPatient(patient) {

        const conn = await createConnection();
        const { dni, obra_social, dni_imagen } = patient;

        try {
            const [patientResult] = await conn.query(
                "INSERT INTO paciente (obra_social, dni, dni_imagen) VALUES (?, ?, ?)",
                [obra_social, dni, dni_imagen]
            );
            return patientResult.affectedRows === 1;
        } catch {
            console.log("ERROR PROVISORIO")
        }
    },

    async findPersonByDni(dni) {
        const conn = await createConnection();
        const [persona] = await conn.query("SELECT * FROM persona WHERE dni = ?", [dni]);
        console.log("paso por el find person: ", persona, dni);
        return persona.length > 0 ? persona : null;
    },

    async findPatientByDni(dni) {
        const conn = await createConnection();
        const [paciente] = await conn.query("SELECT * FROM paciente WHERE dni = ?", [dni]);
        console.log("paso por el find patient: ", paciente, dni)
        return paciente.length > 0 ? paciente : null;
    },


    async delete(dni) {
        try {
            const conn = await createConnection();
            const resultado = await conn.query('DELETE FROM paciente WHERE dni = ?', [dni]);

            if (resultado.affectedRows === 0) {

                return true;
            }

        } catch (error) {
            console.error('Error al eliminar el paciente:', error);

        }
    },

    async update( obra_social, dni_imagen, dni) {
        const conn = await createConnection();
        console.log(dni_imagen) 

        try {
            const [patientResult] = await conn.query(
                "UPDATE paciente SET obra_social = ?,  dni_imagen =? WHERE dni = ?",
                [obra_social, dni_imagen, dni]
            );
            return patientResult.affectedRows === 1;
        } catch {
            console.log("ERROR PROVISORIO")
        }
  

    }
    


};

module.exports = Paciente;
