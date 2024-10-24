const express = require("express")
const app = express()
var path = require("path")
const pug= require("pug")
const bodyParser = require("body-parser")

//routers
//const routerNuevaAgenda = require("./routers/agendaRouter")
const routerMedico= require("./routers/medicoRouter")
const routerEspecialidadMedico= require("./routers/especialidadMedicoRouter")
//app.set('views', path.join(__dirname, 'public'));
app.set("view engine", "pug");
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:false}))
//app.use(routerNuevaAgenda)
app.use(routerMedico)
app.use(routerEspecialidadMedico)
app.listen(3050, () => {
console.log('Server running on port ${3050')
console.log(__dirname)
})

