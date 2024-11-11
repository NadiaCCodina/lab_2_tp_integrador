const Agenda = require("../models/Agenda");
const EspecialidadMedico =
  require("../models/EspecialidadMedico");
const Medico =
  require("../models/Medico");


module.exports = {
  async vistaAgenda(req, res) {
    try {
      console.log("Entrando a vistaAgenda");
      const agendas = await Agenda.getAgendas()
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


      res.render("agenda/agendaVistaPacientes", { agendas: agendas, especialidades: especialidades });
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

  async registrarHorario(req, res) {

    const { fecha, fecha_fin, hora_inicio, hora_fin, clave_agenda } = req.body;

    const horaInicio = new Date(`1970-01-01T${hora_inicio}:00`);
    const horaFin = new Date(`1970-01-01T${hora_fin}:00`);
    const fechaInicio = new Date(fecha);
    const fechaFin = new Date(fecha_fin);

    // Verificar si la hora de fin es menor que la hora de inicio
    if (horaFin <= horaInicio || fechaFin < fechaInicio) {
      return res.render("agenda/gestorHorarios", {
        error: 'Rango de horario o fechas incorrecto.',
        clave_agenda: clave_agenda
      });
    } try {

      await Agenda.calculateSchedule(fecha, fecha_fin, hora_inicio, hora_fin, clave_agenda)

      res.render("agenda/gestorHorarios", {
        error: 'Horario ingresado.',
        clave_agenda: clave_agenda
      });

    } catch (error) {
      console.error("Error al crear un nuevo horario: ", error);
      res.status(500).send("Error interno del servidor");
    }
  },


  async seleccionarHorario(req, res) {
    const clave_horario = req.body.clave_horario;
    console.log('Datos recibidos:', req.body);
    try {


      res.render("paciente/nuevoPaciente", { clave_horario })

    } catch (error) {
      console.error('Error al seleccionar horario:', error);

      res.status(500).json({ message: 'Error al seleccionar horario' });
    }
  },

  async verEspecialidades(req, res) {
    const especialidades = await EspecialidadMedico.getEspecialidades();



    console.log(especialidades)

    console.log("Especialidad " + especialidades)


    if (especialidades) {
      res.render("agenda/nuevaAgenda", { especialidades: especialidades })
      console.log("entro al if de especialidad agenda");
    } else {

    }
  },

  async medicosPorEspecialidad(req, res) {
    const clave_especialidad = req.query.clave_especialidad
    console.log(clave_especialidad + "clave especialidad")
    const medicos_especialidad = await EspecialidadMedico.getMedicosEspecialidad(clave_especialidad)
    const especialidades = await EspecialidadMedico.getEspecialidades();
    const especialidad = await EspecialidadMedico.getEspecialidad(clave_especialidad)
    console.log(especialidad)
    //console.log(medicos_especialidad)
    if (medicos_especialidad) {
      res.render("agenda/nuevaAgenda", { especialidades: especialidades, medicos_especialidad: medicos_especialidad, especialidad: especialidad })


    } else {
      const error = "No se encontraron medicos para esa especialidad"
      res.render("agenda/nuevaAgenda", { especialidades: especialidades, error: error })
    }

  },


  async mostrarConfiguracionAgenda(req, res) {
    const matricula = req.params.matricula
    console.log("matricula agenda" + matricula)
    const clasificaciones = await Agenda.clasificacionCustom()
    res.render("agenda/agendaConfiguracion", { matricula: matricula, clasificaciones: clasificaciones })
  },

  async guardarNuevaAgenda(req, res) {
    const matriculaAgenda = req.body.matricula
    const sobreturnos = req.body.sobreturnos
    const intervalo_minutos = req.body.intervalo_minutos
    const clasificacion = req.body.clasificacion
    const clasificaciones = await Agenda.clasificacionCustom()
    console.log(matriculaAgenda + " matricula de guardar agenda " + sobreturnos + " " + intervalo_minutos + " " + clasificacion)
    try {
      if (await Agenda.creatAgenda(clasificacion, matriculaAgenda, sobreturnos, intervalo_minutos)) {
        console.log("entro al if de guardar agenda")
        res.render("agenda/agendaConfiguracion", { matriculaAgenda: matriculaAgenda, clasificaciones: clasificaciones })
      }

    } catch (error) {
      console.error('Error al guardar la agenda:', error);
      res.render("agenda/agendaConfiguracion", { matriculaAgenda: matriculaAgenda, clasificaciones: clasificaciones, error: error })
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
      console.log(agendaMedico+" agenda de busqueda por nombre")
      console.log(nombre_completo+"nombre completo busqeuda agenda")
      const especialidades = await EspecialidadMedico.getEspecialidades();

      res.render("agenda/agendas", { agendas: agendaMedico, especialidades:especialidades});
    } catch (error) {
      console.error('Error al obtener la agenda:', error);
      res.status(500).send('Error al obtener la agenda');
    }
  },

  async horarioPorAgendaMedico(req, res) {
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

      res.render("agenda/mostrarAgendaPorMedico", { especialidad: especialidad, medico: medico, gruposPorFecha: gruposPorFecha });
    } catch (error) {
      console.error('Error al obtener la agenda:', error);
      res.status(500).send('Error al obtener la agenda');
    }
  },

  async horarioPorAgendaMedicoOnline(req, res) {
    try {
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
      const agenda = agruparHorariosPorFecha(agendaMedico)
      console.log(agenda)
      res.render("agenda/mostrarAgendaPorMedico", { agenda: agenda });
    } catch (error) {
      console.error('Error al obtener la agenda:', error);
      res.status(500).send('Error al obtener la agenda');
    }
  },


  async agendaPorEspecialidad(req, res) {
    try {
      const clave_especialidad = req.query.clave_especialidad
      const agendas = await Agenda.agendasPorEspecialidad(clave_especialidad);

      const especialidades = await EspecialidadMedico.getEspecialidades();

      res.render("agenda/agendas", { agendas: agendas, especialidades: especialidades });
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

  async verTurnos(req, res) {
    try {
      const clave_agenda = req.query.clave_agenda
      console.log(clave_agenda + " req de clave agenda")
      const turnosAgenda = await Agenda.getTurnos(clave_agenda);

      turnosAgenda.forEach(horario => {
        const fecha = new Date(horario.fecha);
        horario.fecha = fecha.toLocaleDateString('es-AR', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit'
        });

      });
      console.log(turnosAgenda + "turnos de agenda medico 9")
      res.render("agenda/gestionTurnos", { turnosAgenda: turnosAgenda, clave_agenda:clave_agenda })
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
      console.log(dni+"dni update turnos")
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
        res.render("agenda/gestionTurnos", { turnosAgenda: turnosAgenda, clave_agenda:clave_agenda })
      }else{
        res.render("agenda/gestionTurnos", { turnosAgenda: turnosAgenda, clave_agenda:clave_agenda })
      }}catch (error) {
        console.error('Error al actualizar turnos:', error);
        res.status(500).send('Error al obtener la agenda');

    

    }



},
};
