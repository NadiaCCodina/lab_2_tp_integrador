const createConnection = require("../config/bd");
const bcryptjs = require("bcryptjs")
const Usuario = {
    async create(usuario, contraseña, rol) {
        const conn = await createConnection();
        try {
            const [result] = await conn.query("INSERT INTO `usuario`(`usuario`, `contraseña`, rol) VALUES (?,?,?)",
                [usuario, contraseña, rol]);
            return result.affectedRows == 1
        }
        catch (error) {
            console.log("entro al error de usuario")
            throw error;

        }
        
    },

    async getUsuario(usuario){
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
    },

    async getId(id){
        const conn = await createConnection();
        try {
            const [result] = await conn.query("SELECT clave_usuario, `usuario`, `contraseña`, `rol` FROM `usuario` WHERE id = (?)",
                [id] );
                console.log(result)
                return result
                
            } catch (error) {
                console.log("entro al error de login")
                throw error;
    
            }
    },

    async createBranch(nombre, direccion){

        const conn = await createConnection();
        try {
            const [result] = await conn.query("INSERT INTO `sucursal`(`nombre_sucursal`, `direccion_sucursal`) VALUES (?,?)",
                [nombre, direccion]);
            return result.affectedRows == 1
        }
        catch (error) {
            console.log("entro al error de usuario")
            throw error;

        }
        

    },
    async getBranches(){ 
        const conn = await createConnection();
        try {
            const [result] = await conn.query("SELECT * FROM `sucursal`");
            return result
        }
        catch (error) {
            console.log("entro al error de SUCURSAL")
            throw error;

        }
        
    },
    async getBranchByKey(clave){ 
        const conn = await createConnection();
        try {
            const [result] = await conn.query("SELECT * FROM `sucursal` WHERE clave_sucursal = ?", [clave]);
            return result
        }
        catch (error) {
            console.log("entro al error de SUCURSAL")
            throw error;

        }
        
    }

    
}
module.exports = Usuario