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
    const conn = await createConnection({ fecha, hora_inicio, hora_fin, clave_agenda })
    console.log()
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
      const [horariosAgendaMedico] = await conn.query("SELECT `clave_horarios`, `fecha`, `hora_inicio`, clave_agenda, `hora_fin` FROM `horario` WHERE clave_agenda = ? AND estado=0;",
        [clave_agenda]
      )
      console.log(horariosAgendaMedico)
      return horariosAgendaMedico
    } catch (error) {
      return false

    }
  },

  async agendasPorEspecialidad(clave_especialidad) {
    try {
      const conn = await createConnection()
      const [agendasEspecialidad] = await conn.query("SELECT `clave_agenda`, `clave_sucursal`, `clave_clasificacion`, `matricula_medico`, `cantidad_sobreturno`, `intervalo_minutos`, nombre_especialidad, persona.nombre_completo FROM `agenda`, especialidad, especialidad_medico, medico, persona WHERE agenda.matricula_medico = especialidad_medico.matricula AND especialidad_medico.clave_especialidad = especialidad.clave_especialidad AND medico.dni= persona.dni  AND medico.clave_medico = especialidad_medico.clave_medico AND especialidad.clave_especialidad= ?",
        [clave_especialidad]
      )
      console.log(agendasEspecialidad)
      return agendasEspecialidad
    } catch (error) {
      return false

    }
  },

  async createTurno(dni, clave_estado, clave_horario) {
    try {
      const conn = await createConnection()
      const [result] = await conn.query("INSERT INTO `turno`(`dni`, `clave_estado`, `clave_horario`) VALUES (?,?,?)",
        [dni, clave_estado, clave_horario]

      )
      return result.affectedRows == 1
    } catch (error) {
      return false

    }
  },
  async updateEstadoHorario(estado, clave_horario){
    try {
      const conn = await createConnection()
      const [result] = await conn.query("UPDATE `horario` SET estado= ? WHERE `clave_horarios` = ?", 
        [estado, clave_horario]
       
      )
      return result.affectedRows==1
  }catch (error) {
    return false

  }
},

  async getTurnos(clave_agenda){
    try {
      connection = await createConnection(clave_agenda);
      const [turnos] = await connection.query("SELECT turno.dni, turno.clave_estado, `clave_horario`, fecha, hora_inicio, nombre_completo, nombre_estado FROM `turno`, horario, persona, estado_turno WHERE persona.dni = turno.dni AND turno.clave_horario = horario.clave_horarios AND estado_turno.clave_estado = turno.clave_estado and horario.clave_agenda= ?",
        [clave_agenda]
      )
      console.log(turnos+" modelo turno")
      return turnos
    }catch (error) {
      return false
  
    }
  },

  async getTurnosPorDni(){
    ("SELECT turno.dni, `clave_estado`, `clave_horario`, fecha, hora_inicio, nombre_completo FROM `turno`, horario, persona WHERE persona.dni = turno.dni AND turno.clave_horario = horario.clave_horarios and clave_horario =9 and turno.dni = 33103814" )
  }
}
module.exports = Agenda