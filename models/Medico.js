const createConnection = require("../config/bd");

const Medico = {
    async get() {
        const conn = await createConnection();
        const [medicos] = await conn.query("SELECT persona.dni, nombre_completo, mail, telefono FROM `medico`, persona WHERE persona.dni = medico.dni");
        return medicos;
    },

    async create(medico) {
        const conn = await createConnection();
        const [result] = await conn.query("INSERT INTO persona (dni, nombre_completo, telefono, mail) VALUES (?,?,?,?)",
            [medico.dni, medico.nombre_completo, medico.telefono, medico.mail]);
        console.log(result)

        if (result.affectedRows == 1) {
            console.log("entro al if de medico")
            const [medicoResult] = await conn.query("INSERT INTO medico (dni) VALUES (?)", [medico.dni]);
            return medicoResult.affectedRows == 1
        }else{return false}
        
    },


    async update(medico) {
        const conn = await createConnection();
        try {
            const results = await conn.query('UPDATE persona SET nombre_completo = ?, telefono=?, mail =? WHERE dni = ?',
                [medico.nombre_completo, medico.telefono, medico.mail, medico.dni]);
            return results.affectedRows == 1
        } catch (error) {
            throw error;
        }
    }
};

module.exports = Medico;
