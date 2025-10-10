const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
    taskName: {
        type: String
    },
    overview: {
        type: String
    },
    assignTo: {
        type: String
    },
    comment: {
        type: String
    },
    dateStart:{
        type:Date
    }

}, {
    timestamps: true
});


const Task = mongoose.model("Task", taskSchema);
module.exports = Task