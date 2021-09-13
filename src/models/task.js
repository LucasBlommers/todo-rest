const mongoose = require("mongoose")

const taskSchema = mongoose.Schema({
    title:{
        type: String,
        required: true,
        trim: true
    },
    body:{
        type: String,
        required: true,
        trim: true
    },
    taskCollectionId:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "TaskCollection"
    },
    owner:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User"
    }
}, {
    timestamps: true
})

taskSchema.virtual("taskCollections", {
    ref: "TaskCollection",
    localField: "_id",
    foreignField: "taskId"
})

const Task = mongoose.model("Task", taskSchema)

module.exports = Task