const Paciente = require("../models/Paciente");

module.exports = {
    async vistaCrearPaciente(req, res) {

        console.log("entro al get")
        res.render("paciente/nuevoPaciente", {})
    },

     async vistaActualizarPaciente(req, res) {

         console.log("entro al get")
         res.render("paciente/actualizarPaciente", {})
     },
    async guardar(req, res) {
        const { dni, nombre_completo, mail, telefono, obra_social } = req.body;
    
        const dni_imagen = req.file ? req.file.filename : null;
       
          

        if (nombre_completo) {
            await Paciente.insertPerson({  dni,nombre_completo, mail, telefono })
            await Paciente.insertPatient( {dni, obra_social, dni_imagen })
        }
        else {
            await Paciente.insertPatient(  {dni, obra_social, dni_imagen })
        }
           
        const pacientes = await Paciente.get();
        res.render("paciente/listaPacientes", { pacientes: pacientes });

},
    
    async crearPaciente(req, res) {
    const dni = req.body.dni;

    try {
        const result = await Paciente.findPersonByDni(dni);
        const exist = result !== null;

        console.log("existe????: ", exist);
        res.render("paciente/paciente", { exist, dni});

    } catch (error) {
        console.error("Error al crear paciente:", error);
        res.status(500).send("Error en el servidor");
    }
}
    ,


    async mostrar(req, res) {

    const pacientes = await Paciente.get();

    if (req.query.nombre_completo) {
        res.render("paciente/listaPacientes", { pacientes: pacientes, nombre: nombre });
    } else {
        res.render("paciente/listaPacientes", { pacientes: pacientes });
    }
},

 async borrarPaciente(req, res){
    const { dni } = req.query

    try{ 
      await Paciente.delete(dni)

      const pacientes = await Paciente.get();
      res.render('paciente/listaPacientes', { pacientes: pacientes }); 

    } catch (error) {
        console.error('Error al eliminar el paciente:', error);
        res.status(500).send('Error al eliminar el paciente'); 
    
    }


 }

 

}