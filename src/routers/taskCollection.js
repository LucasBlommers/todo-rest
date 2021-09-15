const express = require("express")
const jwt = require("jsonwebtoken")

const verifyAuth = require("../middleware/verifyAuth")

const TaskCollection = require("../models/taskCollection")

const router = new express.Router()

router.post("/taskCollection", async(req, res) => {
    //Verify Login
    if(!req.headers.token){
        return res.status(400).send()
    }

    if(!verifyAuth(req.headers.token)){
        return res.status(400).send()
    }

    req.body.owner = jwt.verify(req.headers.token, process.env.JWT_SECRET)._id
    const taskCollection = new TaskCollection(req.body)

    await taskCollection.save()

    return res.status(201).send()
})

router.get("/taskCollections", async(req, res) => {
  //Verify Login
    if(!req.headers.token){
        return res.status(400).send()
    }

    if(!verifyAuth(req.headers.token)){
        return res.status(400).send()
    }

    const decoded = jwt.verify(req.headers.token, process.env.JWT_SECRET)

    const taskCollections = await TaskCollection.find({owner: decoded._id})

    res.send(taskCollections)

})

module.exports = router