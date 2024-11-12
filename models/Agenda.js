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
      const [horariosAgendaMedico] = await conn.query("SELECT `clave_horarios`, `fecha`, `hora_inicio`, clave_agenda FROM `horario` WHERE clave_agenda = ? AND estado=0;",
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
 
  async calculateSchedule(fecha, fecha_fin, hora_inicio, hora_fin, clave_agenda) {

    try {

      const conn = await createConnection()

      const agenda = await this.getAgendaById(clave_agenda)
      const intervalo_minutos = agenda[0].intervalo_minutos
      // Convertir las fechas y horas a objetos Date
      let fechaActual = new Date(fecha);
      const fechaFin = new Date(fecha_fin);
      const horaInicio = hora_inicio.split(':').map(Number);
      const horaFin = hora_fin.split(':').map(Number);

     


      // Bucle para recorrer cada día entre fecha y fecha_fin
      while (fechaActual <= fechaFin ) {

        // Crear horarios para cada día
        let inicioTurno = new Date(fechaActual);
        inicioTurno.setHours(horaInicio[0], horaInicio[1], 0);

        let finTurno = new Date(fechaActual);
        finTurno.setHours(horaFin[0], horaFin[1], 0);

        //consulta para controlar que no se repitan horarios
        const [result] = await conn.query(
          "SELECT * FROM `horario` WHERE horario.fecha = ? and horario.hora_inicio = ?",
          [fechaActual.toISOString().split('T')[0], inicioTurno.toTimeString().split(' ')[0]]
        );

        if (result.length === 0) { 


        while (inicioTurno < finTurno) {
          // Generar el horario para el turno actual
          const proximoTurno = new Date(inicioTurno);
          proximoTurno.setMinutes(proximoTurno.getMinutes() + intervalo_minutos);
         
     
         
          // Guardar en la base de datos si el turno no excede la hora de fin
          if (proximoTurno <= finTurno ) {

            await conn.query(
              'INSERT INTO horario ( fecha, hora_inicio, clave_agenda) VALUES ( ?, ?, ?)',
              [fechaActual.toISOString().split('T')[0], `${inicioTurno.toTimeString().split(' ')[0]} - ${proximoTurno.toTimeString().split(' ')[0]}`, clave_agenda]
            );
          }

          // Avanzar al siguiente turno
          inicioTurno = proximoTurno;
        }

      }else{ 
        fechaActual.setDate(fechaActual.getDate() + 1);
      }

        // Avanzar al siguiente día
        fechaActual.setDate(fechaActual.getDate() + 1);
      }

      console.log('Horarios generados y guardados con éxito.');
    } catch (error) {
      console.error('Error al generar los horarios:', error);
    }
  },



  async getAgendaById(id) {
    
    const conn = await createConnection();
    const [agenda] = await conn.query("SELECT * FROM agenda WHERE clave_agenda = ?", [id]);
    console.log("paso por el get agenda: ", agenda, id);
    return agenda.length > 0 ? agenda : null;
  }, 


  async getScheduleByDoctor(id){

    const conn = await createConnection();
    const [horario] = await conn.query("SELECT * FROM horario WHERE clave_agenda = ?", [id]);
    console.log("paso por el get horario: ", horario, id);
    return horario.length > 0 ? horario : null;
     

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
  },

  async addToList(clave_agenda, dni, fecha) {
    try {
      const conn = await createConnection();
      const [result] = await conn.query(
        "INSERT INTO `lista_espera` (`dni`, `clave_agenda`, `fecha`) VALUES (?, ?, ?)",
        [dni, clave_agenda, fecha]
      );
  
      // Cierra la conexión después de ejecutar la consulta
      await conn.end();
  
      return result.affectedRows == 1;
    } catch (error) {
      console.error("Error al insertar en la lista de espera:", error);
      return false;
    }
  },

  ///Busca registro en lista de espera por fecha y clave
 ////Parametros: 
 ///date: fecha
 ////clave_agenda: clave_agenda

  async findListByDate(date, clave_agenda) {
    try {
      const conn = await createConnection();
      const [result] = await conn.query(
        "SELECT * FROM `lista_espera` WHERE fecha = ? AND clave_agenda = ?",
        [date, clave_agenda] 
      );
      return result;
    } catch (error) {
      console.error("Error al buscar lista:", error);
      return false;
    }
  },
  
  ////Busca registro en la tabla lista de espera 
  ///Parametros:
  ////dni: dni del paciente
  ///date : fecha
  ///clave_agenda: clave_agenda

  async findList(dni, date,clave_agenda){
    try {
      const conn = await createConnection();
      const [result] = await conn.query(
        "SELECT * FROM `lista_espera` WHERE fecha = ? AND clave_agenda = ? AND dni= ?",
        [date, clave_agenda, dni] 
      );
      return result;
    } catch (error) {
      console.error("Error al buscar lista:", error);
      return false;
    }
  },

/////Borra registro de la tabla lista de espera con la clave de la tabla
////Parametros:
////Clave: clave_lista_espera

  async deleteList(clave){
    try {
      const conn = await createConnection();
      const [result] = await conn.query(
        "DELETE FROM `lista_espera` WHERE clave_lista_espera = ?",
        [clave] 
      );
      return result;
    } catch (error) {
      console.error("Error al eliminar registro en lista:", error);
      return false;
    }
  },

  ///////Busca regitro de la tabla horario por clave_horario
  ////// parametros:
  //////clave: clave_horario

  async findScheduleByKey(clave){

    try {
      const conn = await createConnection();
      const [result] = await conn.query(
        "SELECT * FROM `horario` WHERE clave_horarios = ? ",
        [clave] 
      );
      return result;
    } catch (error) {
      console.error("Error al buscar lista:", error);
      return false;
    }

  }, 

   ////Elimina registro de la tabla de lista de espera si existe
   //// Parametros:
   ////dni: dni del paciente
   ///clave_horario: clave_horario

  async deleteRecordFromList(dni ,clave_horario){
    
    try{ 
    const horario = await this.findScheduleByKey(clave_horario)
    const lista   = await this.findList(dni, horario[0].fecha, horario[0].clave_agenda)
    if (lista.length > 0){ 
    this.deleteList(lista[0].clave_lista_espera)
    return  true;
     }
    
      } catch{
        console.error("Error al buscar lista:", error);
        return false;
      }

  }
  
}

  

module.exports = Agenda