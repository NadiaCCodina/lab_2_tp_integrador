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
  //////////////////////
  async guardarSeleccion(seleccion) {

    const { clave, dni } = seleccion;
    const conn = await createConnection();

    const query = "INSERT INTO turno ( clave_horario, dni, clave_estado) VALUES (?, ?, ?)";
    const [result] = await conn.execute(query, [clave, dni, 4]);

    return result;
  },
  //////////////////////
  async crearHorario(datosHorario) {
    const { fecha, hora_inicio, hora_fin, clave_agenda } = datosHorario;
    const conn = await createConnection()
    try {
      const sql = `
        INSERT INTO horario ( fecha, hora_inicio, hora_fin, clave_agenda)
        VALUES (?, ?, ?, ?)
      `;

      // Ejecuta la consulta
      const [result] = await conn.execute(sql, [fecha, hora_inicio, hora_fin, clave_agenda]);

      return result;
    } catch (error) {
      console.error("Error al crear el horario:", error);
      throw error;
    }
  },
  async clasificacionCustom() {

    try {
      const conn = await createConnection()
      const [clasificaciones] = await conn.query(" SELECT * FROM `clasificacion_custom`")

      return clasificaciones
    } catch (error) {
      return false

    }
  },


  async creatAgenda(clave_clasificacion, matricula, sobreturnos, intervalo) {
    try {
      const conn = await createConnection()
      const [result] = await conn.query("INSERT INTO `agenda`(`clave_sucursal`, `clave_clasificacion`, `matricula_medico`, `cantidad_sobreturno`, `intervalo_minutos`) VALUES (1,?,?,?,?)",
        [clave_clasificacion, matricula, sobreturnos, intervalo]

      )
      return result.affectedRows == 1
    } catch (error) {
      return false

    }
  },

  async getAgendas() {
    try {
      const conn = await createConnection()
      const [agendas] = await conn.query("SELECT `clave_agenda`, `clave_sucursal`, `clave_clasificacion`, `matricula_medico`, persona.nombre_completo,especialidad.nombre_especialidad,`cantidad_sobreturno`, `intervalo_minutos` FROM `agenda`, medico, especialidad_medico, persona , especialidad WHERE especialidad_medico.matricula= agenda.matricula_medico AND especialidad_medico.clave_medico = medico.clave_medico AND persona.dni = medico.dni AND especialidad.clave_especialidad = especialidad_medico.clave_especialidad;")
      return agendas
    } catch (error) {
      return false

    }
  },

  async getAgendasPorMedico(clave_medico) {
    try {
      const conn = await createConnection()
      const [agendaMedico] = await conn.query("SELECT `clave_agenda`, `clave_sucursal`, `clave_clasificacion`, `matricula_medico`, persona.nombre_completo,especialidad.nombre_especialidad,`cantidad_sobreturno`, `intervalo_minutos` FROM `agenda`, medico, especialidad_medico, persona , especialidad WHERE especialidad_medico.matricula= agenda.matricula_medico AND especialidad_medico.clave_medico = medico.clave_medico AND persona.dni = medico.dni AND especialidad.clave_especialidad = especialidad_medico.clave_especialidad AND medico.clave_medico = ?;",
        [clave_medico]
      )

      return agendaMedico
    } catch (error) {
      return false

    }
  },

  async getHorariosPorMedico(clave_agenda) {
    try {
      const conn = await createConnection()
      const [horariosAgendaMedico] = await conn.query("SELECT `clave_horarios`, `fecha`, `hora_inicio`, clave_agenda, `hora_fin` FROM `horario` WHERE clave_agenda =  ?;",
        [clave_agenda]
      )
      console.log(horariosAgendaMedico)
      return horariosAgendaMedico
    } catch (error) {
      return false

    }
  },



}
module.exports = Agenda