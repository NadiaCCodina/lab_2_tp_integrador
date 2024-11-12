const Agenda = require("../models/Agenda");
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
        const { dni, nombre_completo, mail, telefono, obra_social, clave_horario } = req.body;
        
        const dni_imagen = req.file ? req.file.filename : null;
    
        let PacienteEnLista = false;   

        if (nombre_completo) {
            await Paciente.insertPerson({  dni,nombre_completo, mail, telefono })
            await Paciente.insertPatient( {dni, obra_social, dni_imagen })
        }
        else {
            await Paciente.insertPatient(  {dni, obra_social, dni_imagen })
        }
        
     

        if (clave_horario !== 'undefined') {
           
            PacienteEnLista = await Agenda.deleteRecordFromList(dni, clave_horario)
            await Agenda.createTurno(dni, 4, clave_horario)
            await Agenda.updateEstadoHorario(1,clave_horario)

        }


        const pacientes = await Paciente.get();

        if(PacienteEnLista){
            res.render("paciente/listaPacientes", { pacientes: pacientes ,
                errorMessage:`Paciente dni: ${dni} eliminado de lista de espera, turno agendado` }
           );
           
        }   else {
            res.render("paciente/listaPacientes", { pacientes: pacientes }
           );
           
        }

      


        

},
    
    async crearPaciente(req, res) {
    const dni = req.body.dni;
    const turno= req.params.turno
    const clave_horario = req.body.clave_horario
    try {
        const result = await Paciente.findPersonByDni(dni);
        const exist = result !== null;

        console.log("existe????: ", exist);
        res.render("paciente/paciente", { exist, dni, turno, clave_horario});

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


 },

 async guardarPacienteOnline(req, res) {
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
    res.render("agenda/agendaVistaPacientes", { pacientes: pacientes });

},


 async actualizarPaciente(req, res){
              const { dni, obra_social } = req.body
              const dni_imagen = req.file ? req.file.filename : null;

    try{ 
      await Paciente.update(obra_social, dni_imagen, dni)

      const pacientes = await Paciente.get();
      res.render('paciente/listaPacientes', { pacientes: pacientes }); 

    } catch (error) {
        console.error('Error al editar el paciente:', error);
        res.status(500).send('Error al editar el paciente'); 
    
    }

           
 },

 async encontrarParaEdicion(req, res){
    const { dni } = req.query

    try{ 
      

      const pacientes = await Paciente.findPatientByDni(dni);
      res.render('paciente/editar', {  paciente: pacientes[0] }); 

    } catch (error) {
        console.error('Error al eliminar el paciente:', error);
        res.status(500).send('Error al eliminar el paciente'); 
    
    }



 }
 

}