const express = require("express")

require('./db/mongoose')

const userRouter = require("./routers/user")
const taskCollectionRouter = require("./routers/taskCollection")
const taskRouter = require("./routers/task")

const app = express()

app.use(express.json())

app.use(express.urlencoded({ extended: false }))

app.use(userRouter)
app.use(taskCollectionRouter)
app.use(taskRouter)

const port = process.env.PORT

app.listen(port)
console.log("REST up on port: " + port)

module.exports = app