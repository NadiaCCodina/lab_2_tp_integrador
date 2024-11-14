const Agenda = require("../models/Agenda");
const EspecialidadMedico =
  require("../models/EspecialidadMedico");
const Medico =
  require("../models/Medico");
const Paciente =
  require("../models/Paciente");
const Usuario =
  require("../models/Usuario");

module.exports = {

  async vistaAgendaReprogramar(req, res) {
    const dni = req.query.dni
    const clave_horario = req.query.clave_horario
    const clave_horario_reprogamacion = req.query.clave_horario_reprogamacion
    const fecha = req.query.fecha
    const clave_especialidad = req.query.clave_especialidad
    console.log(fecha + " fecha y dni de trasnferir" + dni + " " + clave_especialidad + " " + clave_horario)
    try {
      const agendas = await Agenda.agendasPorEspecialidad(clave_especialidad)

      const especialidades = await EspecialidadMedico.getEspecialidades();


      res.render("agenda/agendas", { agendas: agendas, especialidades: especialidades, dni, fecha, clave_horario, clave_horario_reprogamacion });

    } catch (error) {
      console.error("Error al obtener la agenda: ", error);
      res.status(500).send("Error interno del servidor");
    }
  },


  async vistaAgenda(req, res) {
    try {
      const dni = req.query.dni
      const fecha = req.query.fecha
      const clave_especialidad = req.query.clave_especialidad
      console.log(fecha + " fecha y dni de trasnferir" + dni + " " + clave_especialidad)
      console.log("Entrando a vistaAgenda");
      const clave_sucursal = req.query.clave_sucursal
      const agendas = await Agenda.getAgendasByBranch(clave_sucursal)
      const especialidades = await EspecialidadMedico.getEspecialidades();


      res.render("agenda/agendas", { agendas: agendas, especialidades: especialidades });
    } catch (error) {
      console.error("Error al obtener la agenda: ", error);
      res.status(500).send("Error interno del servidor");
    }
  },
  ///////////////////////////

  async vistaAgendaOnline(req, res) {
    try {
      console.log("Entrando a vistaAgenda");
      const agendas = await Agenda.getAgendas()
      const especialidades = await EspecialidadMedico.getEspecialidades();
      const sucursales = await Usuario.getBranches();


      res.render("agenda/agendasOnline", { agendas: agendas, especialidades: especialidades, sucursales: sucursales });
    } catch (error) {
      console.error("Error al obtener la agenda: ", error);
      res.status(500).send("Error interno del servidor");
    }
  },



  //////////////////////

  async index(req, res) {
    try {
      const agenda = await Agenda.get(); // Obtener la agenda

      //cambia el formato
      agenda.forEach(item => {
        const fecha = new Date(item.fecha);
        item.fecha = fecha.toLocaleDateString('es-AR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

      });
      res.render("agenda/mostrarAgenda", { agenda: agenda });
    } catch (error) {
      console.error('Error al obtener la agenda:', error);
      res.status(500).send('Error al obtener la agenda');
    }
  },

  async vistaGestorHorarios(req, res) {

    console.log("Entrando a gestor de horarios");
    const clave_agenda = req.query.clave_agenda
    res.render("agenda/gestorHorarios", { clave_agenda });

  },

/////Registra horario segun la descripcion del mismo
  async registrarHorario(req, res) {
    const { fecha, fecha_fin, hora_inicio, hora_fin, clave_agenda } = req.body;
  
    const fechaInicio = new Date(fecha);
    const fechaFin = new Date(fecha_fin);
  
    // Verificar si la hora de fin es menor que la hora de inicio
    if (fechaFin < fechaInicio) {
      return res.render("agenda/gestorHorarios", {
        error: 'Rango fechas incorrecto.',
        clave_agenda: clave_agenda
      });
    }
  
    switch (req.body.descripcion) {
      case "vacaciones":
        try {
          const cont = await Agenda.vacationSchedule(fecha, fecha_fin,clave_agenda);
  
          if (cont > 0) {  res.render("agenda/gestorHorarios", {
            error: 'Existen fechas ya registradas, revisar agenda',
            clave_agenda: clave_agenda
          }); }
               else {
            res.render("agenda/gestorHorarios", {
              error: 'Horario ingresado.',
              clave_agenda: clave_agenda
            });
          }
  
        } catch (error) {
          console.error("Error al crear un nuevo horario: ", error);
          res.status(500).send("Error interno del servidor");
        }
        break;
  
      case "disponible":
        const horaInicio = new Date(`1970-01-01T${hora_inicio}:00`);
        const horaFin = new Date(`1970-01-01T${hora_fin}:00`);
  
        // Verificar si la hora de fin es menor que la hora de inicio
        if (horaFin <= horaInicio) {
          return res.render("agenda/gestorHorarios", {
            error: 'Rango de horario incorrecto.',
            clave_agenda: clave_agenda
          });
        }
  
        try {
          const cont = await Agenda.calculateSchedule(fecha, fecha_fin, hora_inicio, hora_fin, clave_agenda);
  
          if (cont > 0) {  res.render("agenda/gestorHorarios", {
            error: 'Existen fechas ya registradas, revisar agenda',
            clave_agenda: clave_agenda
          }); } 
                else {
            res.render("agenda/gestorHorarios", {
              error: 'Horario ingresado.',
              clave_agenda: clave_agenda
            });
          }
  
        } catch (error) {
          console.error("Error al crear un nuevo horario: ", error);
          res.status(500).send("Error interno del servidor");
        }
        break;
  
      case "feriado":
        try {
           const cont = await Agenda.holidaySchedule(fecha, fecha_fin, clave_agenda);

           if (cont > 0) {  res.render("agenda/gestorHorarios", {
            error: 'Existen fechas ya registradas, revisar agenda',
            clave_agenda: clave_agenda
          }); } else {
            res.render("agenda/gestorHorarios", {
              error: 'Horario ingresado.',
              clave_agenda: clave_agenda
            });
          }
           
  
        } catch (error) {
          console.error("Error al crear un nuevo horario: ", error);
          res.status(500).send("Error interno del servidor");
        }
        break;
  
      default:
        // Bloque de código que se ejecuta si ninguno de los casos coincide
        break;
    }
  },

  async seleccionarHorario(req, res) {
    const clave_horario = req.body.clave_horario;
    const { clave_agenda, motivo_consulta, sobreturno } = req.body;
    const fecha_sobreturno = new Date;
    let year = fecha_sobreturno.getFullYear();
    let month = String(fecha_sobreturno.getMonth() + 1).padStart(2, '0');
    let day = String(fecha_sobreturno.getDate()).padStart(2, '0');


    let fecha_sobreturno_formateada = `${year}-${month}-${day}`;

    console.log(fecha_sobreturno_formateada);

    console.log('Datos recibidos:', req.body + " sobreturno" + fecha_sobreturno_formateada);
    try {


      res.render("paciente/nuevoPaciente", { clave_horario, fecha_sobreturno_formateada, clave_agenda, motivo_consulta, sobreturno })

    } catch (error) {
      console.error('Error al seleccionar horario:', error);

      res.status(500).json({ message: 'Error al seleccionar horario' });
    }
  },

  async reprogramarTurno(req, res) {
    try {
      const clave_nueva = req.body.clave_horarios
      const dni = req.body.dni
      const clave_horario_reprogamacion = req.body.clave_horario_reprogamacion
      console.log(clave_horario_reprogamacion + " clave horarios de reprogramacion en guardar turno" + dni + " clave nueva " + clave_nueva)
      const reprogramacion = await Agenda.createTurno(dni, 4, clave_nueva)
      console.log(reprogramacion)

      await Agenda.updateEstadoTurnoAgenda(1, dni, clave_horario_reprogamacion)
      if (reprogramacion) {
        res.render("agenda/confirmacionTurno", { reprogramacion: reprogramacion })
      } else {
        res.render("agenda/confirmacionTurno")
      }
    }
    catch (error) {
      console.error('Error al reprogramar turno horario:', error);

    }
  },

  async seleccionarHorarioOnline(req, res) {
    const clave_horario = req.body.clave_horario;
    const medico = req.body.medico
    console.log("medico en seleccionar horario " + medico)
    console.log('Datos recibidos:', req.body);
    try {


      res.render("paciente/nuevoPacienteOnline", { clave_horario, medico })

    } catch (error) {
      console.error('Error al seleccionar horario:', error);

      res.status(500).json({ message: 'Error al seleccionar horario' });
    }
  },


  async verEspecialidades(req, res) {
    const especialidades = await EspecialidadMedico.getEspecialidades();
    const clave_sucursal = req.query.clave_sucursal

    console.log(especialidades)

    console.log("Especialidad " + especialidades)


    if (especialidades) {
      res.render("agenda/nuevaAgenda", { especialidades: especialidades, clave_sucursal })
      console.log("entro al if de especialidad agenda");
    } else {

    }
  },

  async medicosPorEspecialidad(req, res) {
    const clave_especialidad   = req.query.clave_especialidad
    console.log(clave_especialidad + "clave especialidad")
    const medicos_especialidad = await EspecialidadMedico.getMedicosEspecialidad(clave_especialidad)
    const especialidades       = await EspecialidadMedico.getEspecialidades();
    const especialidad         = await EspecialidadMedico.getEspecialidad(clave_especialidad)
    const clave_sucursal       = req.query.clave_sucursal 

    console.log(especialidad)
    //console.log(medicos_especialidad)
    if (medicos_especialidad) {
      res.render("agenda/nuevaAgenda", { especialidades: especialidades, medicos_especialidad: medicos_especialidad, especialidad: especialidad, clave_sucursal })


    } else {
      const error = "No se encontraron medicos para esa especialidad"
      res.render("agenda/nuevaAgenda", { especialidades: especialidades, error: error })
    }

  },


  async mostrarConfiguracionAgenda(req, res) {
    const matricula       = req.params.matricula
    const clave_sucursal  = req.body.clave_sucursal
    const agenda          = await Agenda.getAgendaByMatricula(matricula)
    console.log("matricula agenda" + matricula)
    const error           = 'Ya existe agenda para el profesional seleccionado'
    const clasificaciones = await Agenda.clasificacionCustom()
    const especialidades  = await EspecialidadMedico.getEspecialidades();

    if(agenda.length === 0){
      res.render("agenda/agendaConfiguracion", { matricula: matricula, clasificaciones: clasificaciones, clave_sucursal })
    }else{ 
    res.render("agenda/nuevaAgenda", { especialidades: especialidades,  clave_sucursal, error })
  }
  },

  async guardarNuevaAgenda(req, res) {
    const matricula         = req.body.matricula
    const sobreturnos       = req.body.sobreturnos
    const intervalo_minutos = req.body.intervalo_minutos
    const clasificacion     = req.body.clasificacion
    const clave_sucursal    = req.body.clave_sucursal
    const especialidades    = await EspecialidadMedico.getEspecialidades();



    console.log(matricula + " matricula de guardar agenda " + sobreturnos + " " + intervalo_minutos + " " + clasificacion)
   
    try {
      if (await Agenda.creatAgenda(clave_sucursal, clasificacion, matricula, sobreturnos, intervalo_minutos)) {
        console.log("entro al if de guardar agenda")
        res.render("agenda/nuevaAgenda", { especialidades: especialidades,  clave_sucursal, error : 'Agenda creada con exito' })
      }

    } catch (error) {
      console.error('Error al guardar la agenda:', error);
      res.render("agenda/nuevaAgenda", { especialidades: especialidades,  clave_sucursal, error: 'error al ingresar agenda' })    
    }
  },

  async agendaPorMedico(req, res) {
    try {
      const clave_medico = req.body.clave_medico
      const agendaMedico = await Agenda.getAgendasPorMedico(clave_medico);
      res.render("agenda/mostrarAgendasPorMedico", { agendaMedico: agendaMedico });
    } catch (error) {
      console.error('Error al obtener la agenda:', error);
      res.status(500).send('Error al obtener la agenda');
    }
  },

  async agendaPorMedicoNombre(req, res) {
    try {
      const nombre_completo = req.query.nombre_completo
      const agendaMedico = await Agenda.getAgendasPorMedicoNombre(nombre_completo)
      console.log(agendaMedico + " agenda de busqueda por nombre")
      console.log(nombre_completo + "nombre completo busqeuda agenda")
      const especialidades = await EspecialidadMedico.getEspecialidades();

      res.render("agenda/agendas", { agendas: agendaMedico, especialidades: especialidades });
    } catch (error) {
      console.error('Error al obtener la agenda:', error);
      res.status(500).send('Error al obtener la agenda');
    }
  },

  async agendaPorMedicoNombreOnline(req, res) {
    try {
      const nombre_completo = req.query.nombre_completo
      const agendaMedico = await Agenda.getAgendasPorMedicoNombre(nombre_completo)
      console.log(agendaMedico + " agenda de busqueda por nombre")
      console.log(nombre_completo + "nombre completo busqeuda agenda")
      const especialidades = await EspecialidadMedico.getEspecialidades();

      res.render("agenda/agendasOnline", { agendas: agendaMedico, especialidades: especialidades });
    } catch (error) {
      console.error('Error al obtener la agenda:', error);
      res.status(500).send('Error al obtener la agenda');
    }
  },

  async horarioPorAgendaMedicoReprogramar(req, res) {
    try {
      const dni = req.query.dni
      const fecha_turno = req.query.fecha
      const clave_horario = req.query.clave_horario
      const clave_horario_reprogamacion = req.query.clave_horario_reprogamacion
      console.log("fecha y dni reprogramacion en pagina de horarios de agenda " + dni + " " + fecha_turno + "clave horario de horarios agenda" + clave_horario_reprogamacion)
      const especialidad = req.query.nombre_especialidad
      console.log("especialidad .Reprogramacion agenda medica" + especialidad)
      const medico = req.query.nombre_completo
      console.log(medico + " medico")
      const clave_agenda = req.query.clave_agenda
      //console.log("clave agnda de horarios " + clave_agenda)
      const agendaMedico = await Agenda.getHorariosPorMedico(clave_agenda);
      const fecha = agendaMedico.fecha
      //console.log(fecha)

      agendaMedico.forEach(horario => {
        const fecha = new Date(horario.fecha);
        horario.fecha = fecha.toLocaleDateString('es-AR', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit'
        });
      });

      const gruposPorFecha = {};
      const agenda = agendaMedico.forEach(horario => {
        if (!gruposPorFecha[horario.fecha]) {
          gruposPorFecha[horario.fecha] = [];
        }
        gruposPorFecha[horario.fecha].push(horario);
      });
      //console.log(gruposPorFecha)

      res.render("agenda/mostrarAgendaPorMedicoReprogramar", { especialidad: especialidad, medico: medico, gruposPorFecha: gruposPorFecha, dni, clave_horario, clave_horario_reprogamacion });
    } catch (error) {
      console.error('Error al obtener la agenda:', error);
      res.status(500).send('Error al obtener la agenda');
    }
  },
  async horarioPorAgendaMedico(req, res) {
    try {
      
      const dni = req.query.dni
      const fecha_turno = req.query.fecha
      console.log("fecha y dni reprogramacion en pagina de horarios de agenda " + dni + " " + fecha_turno)
      var especialidad = req.query.nombre_especialidad

      if (especialidad == undefined) {
        especialidad = req.body.nombre_especialidad
      }


      console.log("especialidad ....." + especialidad)
      const medico = req.query.nombre_completo
      const clave_agenda = req.query.clave_agenda
      var sobreturno = null
      var cantidadSobreturnosDisp =0

      const cantidadHorarios = await Agenda.countHorariosAgendaHoy(clave_agenda)

      //  COMPARA LOS HORARIOS DE UNA FECHA Y AGENDA CON LOS TURNOS DE LA MISMA
      
      if (cantidadHorarios[0].cantidad_horarios > 0) {
        const cantidadTurnos = await Agenda.countTurnosHoy(clave_agenda)
        
        if (cantidadTurnos[0].cantidad_turnos == cantidadHorarios[0].cantidad_horarios) {
          const sobreturnosAgenda = await Agenda.cantidadSobreturnoPorAgenda(clave_agenda)
          const sobreturnosPorDia = await Agenda.cantidadSobreturnoPorDia(clave_agenda)
          console.log("turnos: " + cantidadTurnos[0].cantidad_turnos + " horarios: " + cantidadHorarios[0].cantidad_horarios)
          if (sobreturnosAgenda[0].cantidad_sobreturnos_agenda > sobreturnosPorDia[0].cantidad_sobreturnos) {
            sobreturno = "sobreturno"
            cantidadSobreturnosDisp = (sobreturnosAgenda[0].cantidad_sobreturnos_agenda-sobreturnosPorDia[0].cantidad_sobreturnos)
            console.log("cantidad sobreturnos "+cantidadSobreturnosDisp)
          }
        }
      }

      console.log(sobreturno + " existe sobreturnos")

      const agendaMedico = await Agenda.getHorariosPorMedico(clave_agenda);
      const fecha = agendaMedico.fecha


      agendaMedico.forEach(horario => {
        const fecha = new Date(horario.fecha);
        horario.fecha = fecha.toLocaleDateString('es-AR', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit'
        });
      });

      const gruposPorFecha = {};
      const agenda = agendaMedico.forEach(horario => {
        if (!gruposPorFecha[horario.fecha]) {
          gruposPorFecha[horario.fecha] = [];
        }
        gruposPorFecha[horario.fecha].push(horario);
      });
      //console.log(gruposPorFecha)

      res.render("agenda/mostrarAgendaPorMedico", { especialidad: especialidad, medico: medico, gruposPorFecha: gruposPorFecha, dni, sobreturno, clave_agenda, cantidadSobreturnosDisp });
    } catch (error) {
      console.error('Error al obtener la agenda:', error);
      res.status(500).send('Error al obtener la agenda');
    }
  },

  async horarioPorAgendaMedicoOnline(req, res) {
    try {
      const especialidad = req.query.nombre_especialidad
      console.log("especialidad ....." + especialidad)
      const medico = req.query.nombre_completo
      console.log(medico + " medico")
      const clave_agenda = req.query.clave_agenda
      console.log("clave agnda de horarios " + clave_agenda)
      const agendaMedico = await Agenda.getHorariosPorMedico(clave_agenda);
      const fecha = agendaMedico.fecha
      console.log(fecha)

      agendaMedico.forEach(horario => {
        const fecha = new Date(horario.fecha);
        horario.fecha = fecha.toLocaleDateString('es-AR', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit'
        });
      });

      const gruposPorFecha = {};
      const agenda = agendaMedico.forEach(horario => {
        if (!gruposPorFecha[horario.fecha]) {
          gruposPorFecha[horario.fecha] = [];
        }
        gruposPorFecha[horario.fecha].push(horario);
      });
      console.log(gruposPorFecha)

      res.render("agenda/mostrarAgendaPorMedicoOnline", { especialidad: especialidad, medico: medico, gruposPorFecha: gruposPorFecha });
    } catch (error) {
      console.error('Error al obtener la agenda:', error);
      res.status(500).send('Error al obtener la agenda');
    }
  },


  async agendaPorEspecialidad(req, res) {
    try {
      const clave_sucursal = req.query.clave_sucursal;
      const clave_especialidad = req.query.clave_especialidad
      const agendas = await Agenda.agendasPorEspecialidad(clave_especialidad);

      const especialidades = await EspecialidadMedico.getEspecialidades();

      res.render("agenda/agendas", { agendas: agendas, especialidades: especialidades });
    } catch (error) {
      console.error('Error al obtener la agenda:', error);
      res.status(500).send('Error al obtener la agenda');
    }
  },

  //// Busca las agendas por especialidad 

  async agendaPorEspecialidadOnline(req, res) {
    try {
      const clave_especialidad = req.query.clave_especialidad
      const clave_sucursal = req.query.clave_sucursal
      const agendas = await Agenda.agendasPorEspecialidadYSucursar(clave_especialidad, clave_sucursal);

      const especialidades = await EspecialidadMedico.getEspecialidades();
      const sucursales = await Usuario.getBranches();


      res.render("agenda/agendasOnline", { agendas: agendas, especialidades: especialidades, sucursales: sucursales });
    } catch (error) {
      console.error('Error al obtener la agenda:', error);
      res.status(500).send('Error al obtener la agenda');
    }
  },


  async agruparHorariosPorFecha(horarios) {
    const gruposPorFecha = {};
    horarios.forEach(horario => {
      if (!gruposPorFecha[horario.fecha]) {
        gruposPorFecha[horario.fecha] = [];
      }
      gruposPorFecha[horario.fecha].push(horario);
    });
    return gruposPorFecha;
  },
  //VER TURNOS POR AGENDA
  async verTurnos(req, res) {


    try {
      const clave_agenda = req.query.clave_agenda
      console.log(clave_agenda + " req de clave agenda")
      const turnosAgenda = await Agenda.getTurnos(clave_agenda);
      const medico = await Agenda.getMedicoPorAgenda(clave_agenda);
      turnosAgenda.forEach(horario => {
        const fecha = new Date(horario.fecha);
        horario.fecha = fecha.toLocaleDateString('es-AR', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit'
        });

      });
      console.log(medico[0].nombre_completo + "turnos de agenda medico 9")
      res.render("agenda/gestionTurnos", { turnosAgenda: turnosAgenda, clave_agenda: clave_agenda, medico: medico })
    } catch (error) {
      console.error('Error al obtener turnos:', error);
      res.status(500).send('Error al obtener la agenda');
    }
  },
  async updateEstadoTurno(req, res) {
    try {
      const dni = req.body.dni
      const clave_estado = req.body.clave_estado
      const clave_horario = req.body.clave_horario
      const clave_agenda = req.body.clave_agenda
      console.log(dni + "dni update turnos")
      const medico = await Agenda.getMedicoPorAgenda(clave_agenda);
      if (await Agenda.updateEstadoTurnoAgenda(clave_estado, dni, clave_horario)) {

        const turnosAgenda = await Agenda.getTurnos(clave_agenda);
        turnosAgenda.forEach(horario => {
          const fecha = new Date(horario.fecha);
          horario.fecha = fecha.toLocaleDateString('es-AR', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
          });

        });
        res.render("agenda/gestionTurnos", { turnosAgenda: turnosAgenda, clave_agenda: clave_agenda, medico: medico })
      } else {
        res.render("agenda/gestionTurnos", {  clave_agenda: clave_agenda, medico: medico })
      }
    } catch (error) {
      console.error('Error al actualizar turnos:', error);
      res.status(500).send('Error al obtener la agenda');



    }

  },


  async verTurnosPorEstado(req, res) {
    try {
      const clave_agenda = req.query.clave_agenda
      const clave_estado = req.query.clave_estado
      console.log(clave_agenda + " req de clave agenda")
      const turnosAgenda = await Agenda.getTurnosPorEstado(clave_agenda, clave_estado);
      const medico = await Agenda.getMedicoPorAgenda(clave_agenda);

      turnosAgenda.forEach(horario => {
        const fecha = new Date(horario.fecha);
        horario.fecha = fecha.toLocaleDateString('es-AR', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit'
        });

      });
      console.log(medico[0].nombre_completo + "turnos de agenda medico 9")
      res.render("agenda/gestionTurnos", { turnosAgenda: turnosAgenda, clave_agenda: clave_agenda, medico: medico })
    } catch (error) {
      console.error('Error al obtener turnos:', error);
      res.status(500).send('Error al obtener la agenda');
    }
  },


  async listaDeEspera(req, res) {
    try {

      const clave_agenda = req.query.clave_agenda
      console.log(clave_agenda + " req de clave agenda")


      res.render("agenda/listaEspera", { clave_agenda })
    } catch (error) {
      console.error('Error al obtener turnos:', error);
      res.status(500).send('Error al obtener la agenda');
    }
  },

  //crea registro en la tabla lista_espera

  async agregarALista(req, res) {
    const dni = req.body.dni
    const fecha = req.body.fecha
    const clave_agenda = req.body.clave_agenda

    const paciente = await Paciente.findPatientByDni(dni);

    if (paciente) {
      await Agenda.addToList(clave_agenda, dni, fecha);

      return res.render("agenda/listaEspera", {
        clave_agenda,
        error: 'Agregado a lista de espera.'
      });

    } else {

      return res.render("agenda/listaEspera", {
        error: 'El paciente no existe en el sistema.',
        clave_agenda: clave_agenda
      });
    }
  },

  async buscarPorFecha(req, res) {
    const fecha = req.query.fecha
    const clave_agenda = req.query.clave_agenda

    const listaEspera = await Agenda.findListByDate(fecha, clave_agenda);

    if (listaEspera) {
      return res.render("agenda/listaEspera", { listaEspera });

    } else {

      return res.render("agenda/listaEspera", {
        error: 'No se encontraron turnos en espera para la fecha seleccionada',
        clave_agenda: clave_agenda
      });
    }

  },





  async verTurnosPorPaciente(req, res) {
    try {
      const clave_agenda = req.query.clave_agenda
      const dni = req.query.dni
      console.log(clave_agenda + " req de clave agenda")
      const turnosAgenda = await Agenda.getTurnosPorDni(clave_agenda, dni);
      const medico = await Agenda.getMedicoPorAgenda(clave_agenda);

      turnosAgenda.forEach(horario => {
        const fecha = new Date(horario.fecha);
        horario.fecha = fecha.toLocaleDateString('es-AR', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit'
        });

      });
      console.log(turnosAgenda.length + " turnos")
      console.log(medico[0].nombre_completo + "turnos de agenda medico 9")
      if (turnosAgenda.length == 0) {
        const noHayTurnos = "No se encuentra turnos"
        res.render("agenda/gestionTurnos", { turnosAgenda: turnosAgenda, clave_agenda: clave_agenda, medico: medico, noHayTurnos: noHayTurnos })
      } else {

        res.render("agenda/gestionTurnos", { turnosAgenda: turnosAgenda, clave_agenda: clave_agenda, medico: medico })
      }
    } catch (error) {
      console.error('Error al obtener turnos:', error);
      res.status(500).send('Error al obtener Turnos');
    }
  },
  
  

  async borrarAgenda(req, res){
    const clave_agenda = req.query.clave_agenda
    const especialidades = await EspecialidadMedico.getEspecialidades();
    const clave_sucursal = req.query.clave_sucursal
    const agendas = await Agenda.getAgendasByBranch(clave_sucursal)
    

      try{
         await Agenda.deleteAgenda(clave_agenda)
         res.render("agenda/agendas", { agendas:agendas, especialidades: especialidades, error: 'La agenda se borro con exito' });
      }  catch (error){
        console.error('Error al borrar turnos:', error);
      }
  },
  async agregarSobreturnos(req, res) {





  }
  }

