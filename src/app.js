const express = require("express")

require('./db/mongoose')

const userRouter = require("./routers/user")

const app = express()

app.use(express.json())

app.use(express.urlencoded({ extended: false }))

app.use(userRouter)

const port = process.env.PORT

app.listen(port)
console.log("REST up on port: " + port)

module.exports = app