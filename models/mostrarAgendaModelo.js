const createConnection = require('../config/db');

class MostrarAgendaModelo {
    static async get() {
        let connection; // Declaro la variable de conexión

        try {
            connection = await createConnection(); // conexión
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
    }

    static async guardarSeleccion(seleccion) {
       
        const {  clave, dni } = seleccion;
        const conn = await createConnection(); 

        const query = "INSERT INTO turno ( clave_horario, dni, clave_estado) VALUES (?, ?, ?)";
        const [result] = await conn.execute(query, [clave, dni, 4]);
        
        return result; 
    }
}

module.exports = MostrarAgendaModelo;





// const connection = require('../config/db'); // Ya tienes la conexión configurada

// class MostrarAgendaModelo {

//     static async get() {
//         try {
//             const [horarios] = await connection.query("SELECT * FROM horario"); // Usa la conexión existente
//             return horarios; // Retorna directamente el resultado, no necesitas corchetes
//         } catch (error) {
//             console.log('Error al consultar agenda:', error);
//             throw error; // Propaga el error para que sea manejado en la capa superior
//         }
//     }
// }

// module.exports = MostrarAgendaModelo;





// const connection = require('../config/db');




// class MostrarAgendaModelo {


   


//     static async get(){
//         try{
//             const conn = await createConnection();


//             const [horarios] = await conn.query("SELECT * FROM horario");
//             return[horarios]
//         }catch (error){
//             console.log('error al consultar agenda');
//         }
       
//     }
// }
// module.exports =  MostrarAgendaModelo