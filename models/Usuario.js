const createConnection = require("../config/bd");
const bcryptjs = require("bcryptjs")
const Usuario = {
    async create(usuario, contraseña) {
        const conn = await createConnection();
        try {
            const [result] = await conn.query("INSERT INTO `usuario`(`usuario`, `contraseña`) VALUES (?,?)",
                [usuario, contraseña]);
            return result.affectedRows == 1
        }
        catch (error) {
            console.log("entro al error de usuario")
            throw error;

        }
        
    },

    async login(usuario){
        const conn = await createConnection();
        try {
            const [result] = await conn.query("SELECT  `usuario`, `contraseña`, `rol` FROM `usuario` WHERE usuario = (?)",
                [usuario] );
                console.log(result)
                return result
                
            } catch (error) {
                console.log("entro al error de login")
                throw error;
    
            }
    }
}
module.exports = Usuario