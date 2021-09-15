const express = require("express")
const jwt = require("jsonwebtoken")

const verifyAuth = require("../middleware/verifyAuth")
const Task = require("../models/task")

const router = new express.Router()

router.get("/tasks", async(req, res) => {
     //Verify Login
     if(!req.headers.token){
        return res.status(400).send()
    }

    if(!verifyAuth(req.headers.token)){
        return res.status(400).send()
    }

    const uId = jwt.verify(req.headers.token, process.env.JWT_SECRET)._id

    const tasks = await Task.find({owner: uId})

    res.send(tasks)

})

router.post("/task", async(req, res) => {

    //Verify Login
    if(!req.headers.token){
        return res.status(400).send()
    }

    if(!verifyAuth(req.headers.token)){
        return res.status(400).send()
    }

    req.body.owner = jwt.verify(req.headers.token, process.env.JWT_SECRET)._id

    try{
        const task = new Task(req.body)

        await task.save()

        return res.status(201).send()
    }catch(error){
        console.log(error)
        return res.status(500).send()
    }
    


})

module.exports = router