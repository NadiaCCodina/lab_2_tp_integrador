

const mysql = require('mysql2/promise');


const createConnection = async () => {
    try {
        // Creo conexión
        const connection = await mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: '',
            database: 'laboratorio 2',
        });

        console.log('Conectado a la base de datos MySQL');
        return connection; 
    } catch (error) {
        console.error('Error al conectar a la base de datos:', error);
        throw error; 
    }
};

module.exports = createConnection;


