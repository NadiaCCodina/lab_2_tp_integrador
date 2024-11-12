const createConnection = require("../config/bd");

const Medico = {

    ///Recupera todos los medicos
    async get() {
        try {
            const conn = await createConnection();
            const [medicos] = await conn.query("SELECT persona.dni, nombre_completo, mail, telefono, estado FROM `medico`, persona WHERE persona.dni = medico.dni ORDER BY  medico.clave_medico desc");
            return medicos;
        } catch (error) {
            throw error;
        }
    },
    ///CREA PERSONA Y MEDICO
    // PARAMETRO: DATOS PERSONA Y MEDICO
    async create(medico) {
        try {
            const conn = await createConnection();
            const [result] = await conn.query("INSERT INTO persona (dni, nombre_completo, telefono, mail) VALUES (?,?,?,?)",
                [medico.dni, medico.nombre_completo, medico.telefono, medico.mail]);
            console.log(result)

            if (result.affectedRows == 1) {
                console.log("entro al if de medico")
                const [medicoResult] = await conn.query("INSERT INTO medico (dni) VALUES (?)", [medico.dni]);
                return medicoResult.affectedRows == 1
            } else { return false }
        } catch (error) {
            throw error;
        }
    },
    //BUSCA PERSONA POR DNI
    //PARAMETROS dni
    async findPersonByDni(dni) {
        try {
            const conn = await createConnection();
            const [persona] = await conn.query("SELECT * FROM persona WHERE dni = ?", [dni]);
            console.log("paso por el find person: ", persona, dni);
            return persona.length > 0 ? persona : null;
        } catch (error) {
            throw error;
        }
    },
    //CREA SOLO MEDICO
    //PARAMETROS dni
    async createM(dni) {
        try {
            const conn = await createConnection();
            const [medicoResult] = await conn.query("INSERT INTO medico (dni) VALUES (?)", [dni]);
            return medicoResult.affectedRows == 1
        } catch (error) {
            throw error;
        }
    },
    //UPDATE MEDICO/PERSONA
    //PARAMETROS OBJETO MEDICO
    async update(medico) {
        const conn = await createConnection();
        try {
            const results = await conn.query('UPDATE persona SET nombre_completo = ?, telefono=?, mail =? WHERE dni = ?',
                [medico.nombre_completo, medico.telefono, medico.mail, medico.dni]);
            return results.affectedRows == 1
        } catch (error) {
            throw error;
        }
    },

    //BUSCA MEDICO POR NOMBRE O APELLIDO
    //PARAMETRO: nombre
    async getByName(nombre) {
        try {
            const conn = await createConnection();
            const [medicos] = await conn.query("SELECT clave_medico, persona.dni, nombre_completo, mail, telefono FROM `medico`, persona WHERE nombre_completo LIKE ? AND persona.dni = medico.dni",
                ['%' + nombre + '%']);
            console.log(medicos)
            return medicos;
        } catch (error) {
            throw error;
        }
    },
    ////BUSCA MEDICO POR DNI
    // PARAMETRO: dni
    async getByDni(dni) {
        try {
            const conn = await createConnection();
            const [medico] = await conn.query("SELECT clave_medico, persona.dni, nombre_completo, mail, telefono FROM `medico`, persona WHERE persona.dni= ? AND persona.dni = medico.dni",
                [dni]);
            console.log(medico)
            return medico;
        } catch (error) {
            throw error;
        }
    },
    //ACTUALIZA EL ESTADO EN DESACTIVADO
    //PARAMETRO: dni
    async updateStatusDisable(dni) {
        try {
            const conn = await createConnection();
            const [results] = await conn.query("UPDATE `medico` SET `estado`= 0 WHERE dni= ?",
                [dni]);
            return results.affectedRows == 1
        }
        catch (error) {
            return false
        }
    },
    //ACTUALIZA EL ESTADO A ACTIVO
    //PARAMETRO: dni

    async updateStatusActive(dni) {
        const conn = await createConnection();
        try {

            const [results] = await conn.query("UPDATE `medico` SET `estado`= 1 WHERE dni= ?",
                [dni]);
            return results.affectedRows == 1
        }
        catch (error) {
            return false
        }
    },
    //BUSCA MEDICOS POR ESPECIALIDAD
    //PARAMETRO clave_especialidad
    async getByEspecialidad(especialidad) {
        try {
            const conn = await createConnection();
            const [medicos] = await conn.query(
                "SELECT medico.clave_medico, medico.dni, `estado`, nombre_completo, nombre_especialidad FROM `medico`, persona, especialidad_medico, especialidad WHERE persona.dni = medico.dni AND medico.clave_medico = especialidad_medico.clave_medico AND especialidad.clave_especialidad = especialidad_medico.clave_especialidad AND especialidad.clave_especialidad = ?",
                [especialidad])
            return medicos;
        } catch (error) {
            throw error;
        }
    },
    //ORDENA MEDICOS ALFABETICAMENTE
    async orderByNameAsc() {
        try {
            const conn = await createConnection();
            const [medicos] = await conn.query(
                "SELECT nombre_completo, medico.dni, telefono, mail, estado FROM `medico`, persona WHERE medico.dni = persona.dni ORDER BY  nombre_completo ASC")
            return medicos
        } catch (error) {
            throw error;
        }

    },
}
module.exports = Medico;
