const mongoose = require('mongoose')
const taskSchema = new mongoose.Schema({
    taskTitle:String , description:String , 
    date:String, assignTo: String, category:String
})
const taskModel = mongoose.model("task", taskSchema);
module.exports = taskModel;