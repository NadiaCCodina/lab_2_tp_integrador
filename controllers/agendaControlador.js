const Agenda = require("../models/Agenda");

module.exports = {
  async vistaAgenda(req, res) {
    try {
      console.log("Entrando a vistaAgenda");


      res.render("header", {});
    } catch (error) {
      console.error("Error al obtener la agenda: ", error);
      res.status(500).send("Error interno del servidor");
    }
  },
  ///////////////////////////

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


      res.render("header", {});



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
  }




};
