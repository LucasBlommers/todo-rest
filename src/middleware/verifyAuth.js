const jwt = require("jsonwebtoken")
const User = require("../models/user")

var verifyAuth = async(token) => {

    const rToken = token.replace("Bearer ", "")
    const decoded = jwt.verify(rToken, process.env.JWT_SECRET)
    const user = await User.findOne({id: decoded._id, "tokens.token": rToken})

    if(!user){
        return false
    }

    return true
}

module.exports = verifyAuth