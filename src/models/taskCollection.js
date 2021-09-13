const mongoose = require("mongoose")

const taskCollectionSchema = mongoose.Schema({
    title:{
        type: String,
        required: true,
        trim: true
    },
    tasks:[{
        taskId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "Task"
        }
    }],
    owner:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: User
    }
}, {
    timestamps: true
})

taskCollectionSchema.virtual("tasks", {
    ref = "Task",
    localField: "_id",
    foreignField: "taskCollectionId"
})

const TaskCollection = mongoose.model("TaskCollection", taskCollectionSchema)

module.exports = TaskCollection