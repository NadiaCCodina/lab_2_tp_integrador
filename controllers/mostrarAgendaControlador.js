const MostrarAgenda = require('../models/mostrarAgendaModelo');

class MostrarAgendaControlador {
    async index(req, res) {
        try {
            const agenda = await MostrarAgenda.get(); // Obtener la agenda

            
            res.render("mostrarAgendaVista", { agenda: agenda }); 
        } catch (error) {
            console.error('Error al obtener la agenda:', error);
            res.status(500).send('Error al obtener la agenda');
        }
    }

    async seleccionarHorario(req, res) {
        const {  hora_inicio, clave, dni} = req.body;
        console.log('Datos recibidos:', req.body); 
        try {
            await MostrarAgenda.guardarSeleccion({ clave, dni } )
     
        console.log(`Horario seleccionado:  ${hora_inicio} `);
        res.json({ message: 'Horario seleccionado', hora_inicio, dni });
         }  catch (error) {
            console.error('Error al seleccionar horario:', error);
          
            res.status(500).json({ message: 'Error al seleccionar horario' });
        }
    }

 
}




module.exports = MostrarAgendaControlador;














// const MostrarAgenda = require('../models/mostrarAgendaModelo');




// class MostrarAgendaControlador {


//    async index(req, res){
       
//        const agenda = await MostrarAgenda.get();


//        res.render("mostrarAgendaVista", { agenda: res }); //datos a la vista



//        // const query = "SELECT * FROM horario";




//        // connection.query(query, (err, results) => {
//        //     if (err) {
//        //         throw err;
//        //     }
//        //     res.render("mostrarAgenda", { horarios: results }); //datos a la vista
//        // });
  


// }


// }


module.exports =  MostrarAgendaControlador