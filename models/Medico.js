const createConnection = require("../config/bd");

const Medico = {
    async get() {
        const conn = await createConnection();
        const [medicos] = await conn.query("SELECT persona.dni, nombre_completo, mail, telefono, estado FROM `medico`, persona WHERE persona.dni = medico.dni ORDER BY  medico.clave_medico desc");
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
        } else { return false }

    },
    
    async findPersonByDni(dni) {
        const conn = await createConnection();
        const [persona] = await conn.query("SELECT * FROM persona WHERE dni = ?", [dni]);
        console.log("paso por el find person: ", persona, dni);
        return persona.length > 0 ? persona : null;
    },

    async createM(dni) {
        const conn = await createConnection();
        const [medicoResult] = await conn.query("INSERT INTO medico (dni) VALUES (?)", [dni]);
        return medicoResult.affectedRows == 1
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
    ,

    async getByName(nombre) {
        const conn = await createConnection();
        const [medicos] = await conn.query("SELECT clave_medico, persona.dni, nombre_completo, mail, telefono FROM `medico`, persona WHERE nombre_completo LIKE ? AND persona.dni = medico.dni",
            ['%' + nombre + '%']);
        console.log(medicos)
        return medicos;
    },

    async getByDni(dni) {
        const conn = await createConnection();
        const [medico] = await conn.query("SELECT clave_medico, persona.dni, nombre_completo, mail, telefono FROM `medico`, persona WHERE persona.dni= ? AND persona.dni = medico.dni",
            [dni]);
        console.log(medico)
        return medico;
    },

    async updateStatusIdle(dni) {
        try {
            const conn = await createConnection();
            const [medicos] = await conn.query("UPDATE `medico` SET `estado`= 0 WHERE dni= ?",
                [dni]);
            return results.affectedRows == 1
        }
        catch (error) {
            return false
        }
    },


    async updateStatusActive(dni) {
        try {
            const conn = await createConnection();
            const [medicos] = await conn.query("UPDATE `medico` SET `estado`= 1 WHERE dni= ?",
                [dni]);
            return results.affectedRows == 1
        }
        catch (error) {
            return false
        }
    }

}
module.exports = Medico;
