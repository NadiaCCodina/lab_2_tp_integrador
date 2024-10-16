const express = require("express")
const app = express()
const routerNuevaAgenda = require("./routers/agendaRouter")
var path = require("path")
const pug= require("pug")
const bodyParser = require("body-parser")

//app.set('views', path.join(__dirname, 'public'));
app.set("view engine", "pug");
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:false}))
app.use(routerNuevaAgenda)

app.listen(3050, () => {
console.log('Server running on port ${3050')
console.log(__dirname)
})

