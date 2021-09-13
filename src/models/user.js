const mongoose = require("mongoose")
const validator = require("validator")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        trim: true,
        validate(value){
            if(value.length < 6){
                throw new Error("Password must be at least 6 characters long.")
            }

            if(value.toLowerCase().includes("password")){
                throw new Error ("Password can\'t  contain \"password\"")
            }
        }
    },
    email: {
        type: String,
        unique: true,
        required: true,
        lowercase: true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("Email is invalid")
            }
        }
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }],
    avatar: {
        type: Buffer
    }
},{
    timestamps: true
})

userSchema.virtual("tasks", {
    ref: "Task",
    localField: "_id",
    foreignField: "owner"
})

userSchema.methods.generateAuthToken = async function(){
    console.log("Start generating auth token")
    const user = this
    console.log("Loaded user")
    const token = jwt.sign({_id: user._id.toString ()}, process.env.JWT_SECRET) 
    console.log("Signed token")
    user.tokens = user.tokens.concat({token})
    console.log("Added token to the tokens array of the user")
    await user.save()
    console.log("Saved the user")
    return token
}

userSchema.methods.toJSON = function (){
    const user = this
    const userObject = user.toObject()

    delete userObject.password
    delete userObject.tokens
    delete userObject.avatar

    return userObject
}

userSchema.statics.findByCredentials = async (email, password) =>{
    const user = await User.findOne({email})

    if(!user){
        throw new Error("Unable to login.")
    }

    const isMatch = await bcrypt.compare(password, user.password)

    if(!isMatch){
        throw new Error("Unable to login.")
    }
    return user
}

userSchema.pre("save", async function(next){
    const user = this

    if(user.isModified("password")){
        user.password = await bcrypt.hash(user.password, 10)
    }

    next()
})

const User = mongoose.model("User", userSchema)

module.exports = User