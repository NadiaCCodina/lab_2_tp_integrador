const createConnection = require('../config/bd');


const Agenda = {
    async get() {
        let connection; 

        try {
            connection = await createConnection(); 
            const [horarios] = await connection.query("SELECT * FROM horario");
            return horarios;
        } catch (error) {
            console.error('Error al consultar agenda:', error);
            throw error;
        } finally {
            if (connection) {
                await connection.end();
            }
        }
    },

    async guardarSeleccion(seleccion) {

        const { clave, dni } = seleccion;
        const conn = await createConnection();

        const query = "INSERT INTO turno ( clave_horario, dni, clave_estado) VALUES (?, ?, ?)";
        const [result] = await conn.execute(query, [clave, dni, 4]);

        return result;
    },
/////
    async crearHorario(datosHorario) {
    const {  fecha, hora_inicio, hora_fin, clave_agenda } = datosHorario;
    const conn = await createConnection()
    try {
      const sql = `
        INSERT INTO horario ( fecha, hora_inicio, hora_fin, clave_agenda)
        VALUES (?, ?, ?, ?)
      `;

      // Ejecuta la consulta
      const [result] = await conn.execute(sql, [ fecha, hora_inicio, hora_fin, clave_agenda]);

      return result;
    } catch (error) {
      console.error("Error al crear el horario:", error);
      throw error; 
    }
  }

}

module.exports = Agenda