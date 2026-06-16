const express=require('express')
const path = require("path");
const cors = require('cors')
const app= express()
const taskModel = require("./models/task.model")
const cookieParser= require("cookie-parser")
const authRouter= require('./routes/auth.routes')
app.use(cors({
  origin:[ "http://localhost:5173",
   "https://task-manager-k64x.onrender.com"],
  credentials: true
}));
app.use(express.static("./public"))
app.use(express.json())
app.use(cookieParser())
app.use("",authRouter)
app.post("/createtask", async (req, res) => {
  try {
    console.log(req.body);

    const { taskTitle, description, date, assignTo, category } = req.body;

    const task = await taskModel.create({
      taskTitle,
      description,
      date,
      assignTo,
      category,
    });

    res.status(201).json({
      message: "Task created successfully",
      task,
    });
  } catch (err) {
    console.log(err);

    res.status(500).json({
      message: err.message,
    });
  }
});

app.get("/alltask" , async(req, res)=>{
    const task= await taskModel.find() // find method returns array
    res.status(200).json({
        message :"Notes fetched succesfully",
        tasks: task
    })
})
app.use((req, res) => {
  res.sendFile(
    path.join(__dirname, "../public/index.html")
  );
});
module.exports=app