const express = require("express")

const User = require("../models/user")
const verify = require("../middleware/verifyAuth")
const verifyAuth = require("../middleware/verifyAuth")

const router = new express.Router()

router.get("/user", async(req, res) => {
    const user = await User.findOne()
    return res.send(user)
})

router.post("/user", async (req, res) =>  {
    const user = new User(req.body)

    try{
        await user.save()
        console.log("Saved user")

        const token = await user.generateAuthToken()
        console.log("Generated authencation token")
        //sendWelcomeEmail(user.email, user.name)
        res.status(201).send({user, token})
        
    }catch(error){
        console.log(error)
        res.status(400).send(error)
    }
})

router.post("/user/update", async(req, res) => {
    const token = req.body.token

    if(!token){
        return res.status(400).send()
    }

    if(!verifyAuth(token)){
        return res.status(400).send()
    }
    const user = await User.findOne()

    user.name = req.body.user.name
    user.email = req.body.user.email
    if(req.body.user.password){
        user.password = req.body.user.password
    }
    user.save()

    return res.status(201).send()
})

router.post("/user/login", async (request, response) => {
    try{

        const user = await User.findByCredentials(request.body.email, request.body.password)
        const token = await user.generateAuthToken()
        console.log(user._id)
        response.send({
            user,
            token
        })
    }catch(error){
        console.log(error)
        response.status(400).send()
    }
})

router.post("/user/logout", async (request, response) =>{
    const user = request.body.user
    const curToken = request.body.token
    try{
        user.tokens = user.filter((token) =>{
            return token.token !== curToken
        })

        await request.user.save()

        response.send({logedOut: true})
    }catch(error){
        response.send({logedOut: false})
    }
})

router.post("/user/logoutAll", async (request, response) => {
    try{
        const user = await User.findById(request.body.user._id)
        user.tokens = []

        await user.save()
        response.send()
    }catch(error){
        response.status(500).send(error)
    }
})

router.post("/user/verify", async (req, res) => {
    if(!req.body.token){
        return res.send({verified:false})
    }
    if(!verify(req.body.token)){
        return res.send({verified: false})
    }

    res.send({verified: true})
})

module.exports = router