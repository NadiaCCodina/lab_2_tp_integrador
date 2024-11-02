const express = require("express")
const app = express()
var path = require("path")
const pug= require("pug")
const bodyParser = require("body-parser")

//routers

const routerMedico   = require("./routers/medicoRouter")
const routerAgenda   = require("./routers/agendaRouter")
const routerPaciente = require("./routers/pacienteRouter")
//app.set('views', path.join(__dirname, 'public'));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.set("view engine", "pug");
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))

//app.use(routerNuevaAgenda)
app.use(routerMedico)
app.use(routerAgenda)
app.use(routerPaciente)

app.listen(3050, () => {
console.log('Server running on port ${3050')
console.log(__dirname)
})

