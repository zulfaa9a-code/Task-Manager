const express= require('express')
const authRouter= express.Router()
const userModel= require("../models/user.model")
const crypto = require('crypto')
const jwt = require('jsonwebtoken')

authRouter.post("/signup", async(req , res)=>
{
    const{ name , email, password}= req.body;
    const isUserExist= await userModel.findOne({email})
    if(isUserExist)
    {
        return res.status(409).json({
            message:"User with this email already exists."
        })
    }
    const user = await userModel.create({name ,email, 
        password: crypto.createHash('sha256').update(password).digest('hex')
})
     const token = jwt.sign({
        id:user._id,
    }, process.env.JWT_SECRET,{ expiresIn:"7h"})
    res.cookie("token", token)
    res.status(201).json({
        message:"User registered successfully ",
        user :{ 
            name:user.name  , email:user.email,
        }
    })

})

authRouter.post("/login", async(req,res)=>{
    const {email,password}= req.body
    const user= await userModel.findOne({email})
    if(!user){
        return res.status(404).json({
            message:"Login Credentials incorrect."
        })
    }
    const hash = crypto.createHash('sha256').update(password).digest('hex')
    const isPasswordValid= hash === user.password
    console.log(hash)
    if(!isPasswordValid)
    {
        return res.status(401).json({
            message:"Invalid Password."
        })
    }
    const token = jwt.sign({
        id :user._id , 
    },process.env.JWT_SECRET)
    res.cookie("token", token)
    res.json({
        message:"User logged IN successfully ", user:{
            name: user.name, email: user.email,
        }
    })
})
authRouter.post("/logout", (req, res) => {
  res.clearCookie("token");
  return res.status(200).json({
    message: "Logged out successfully"
  });
  localStorage.clear()
});

module.exports= authRouter;