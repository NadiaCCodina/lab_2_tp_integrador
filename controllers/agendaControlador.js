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


      res.render("agenda/agendas", { agendas: agendas, especialidades:especialidades});
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


      res.render("agenda/agendaVistaPacientes", { agendas: agendas, especialidades:especialidades});
    } catch (error) {
      console.error("Error al obtener la agenda: ", error);
      res.status(500).send("Error interno del servidor");
    }
  },

  async vistaGestorHorarios(req, res) {

    console.log("Entrando a gestor de horarios");
    res.render("agenda/gestorHorarios", {});

  },

  //////////////////////

  async index(req, res) {
    try {
      const agenda = await Agenda.get(); // Obtener la agenda
      res.render("agenda/mostrarAgenda", { agenda: agenda });
    } catch (error) {
      console.error('Error al obtener la agenda:', error);
      res.status(500).send('Error al obtener la agenda');
    }
  },


  async registrarHorario(req, res) {

    try {
      const { fecha, hora_inicio, hora_fin, clave_agenda } = req.body;

      await Agenda.crearHorario({
        fecha,
        hora_inicio,
        hora_fin,
        clave_agenda,
      });
      //console.log(fecha)
      res.render("agenda/gestorHorarios", { fecha, hora_inicio, hora_fin, clave_agenda });

    } catch (error) {
      console.error("Error al crear un nuevo horario: ", error);
      res.status(500).send("Error interno del servidor");
    }
  },






  async seleccionarHorario(req, res) {
    const { hora_inicio, clave, dni } = req.body;
    console.log('Datos recibidos:', req.body);
    try {
      await Agenda.guardarSeleccion({ clave, dni })

      console.log(`Horario seleccionado:  ${hora_inicio} `);
      res.render("header", {})

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
      res.render("agenda/nuevaAgenda", { especialidades: especialidades, medicos_especialidad: medicos_especialidad, especialidad:especialidad })


    }else{
      const error= "No se encontraron medicos para esa especialidad"
      res.render("agenda/nuevaAgenda", { especialidades: especialidades, error:error })
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
      res.render("agenda/agendaConfiguracion", { matriculaAgenda: matriculaAgenda, clasificaciones: clasificaciones, error:error })
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

  async horarioPorAgendaMedico(req, res) {
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
      res.render("agenda/mostrarAgendaPorMedico", { agendaMedico: agendaMedico });
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
      res.render("agenda/mostrarAgendaPorMedico", { agendaMedico: agendaMedico });
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
     
      res.render("agenda/agendas", { agendas: agendas, especialidades:especialidades });
    } catch (error) {
      console.error('Error al obtener la agenda:', error);
      res.status(500).send('Error al obtener la agenda');
    }
  },



};
