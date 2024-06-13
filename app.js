const express = require("express")
const mongoose = require ("mongoose")
const cors = require("cors")
const bcryptjs = require ("bcryptjs") //for ciphertexting
const {signupmodel} = require("./modules/ksrtc")


mongoose.connect("mongodb+srv://salmanshan:salman642001@cluster0.odxej1b.mongodb.net/ksrtcusersDB?retryWrites=true&w=majority&appName=Cluster0")

const app = express()
app.use(cors())
app.use(express.json())


const generateHashedPassword= async (password)=>{
    const salt = await bcryptjs.genSalt(10)
    return bcryptjs.hash(password,salt)
}


app.post("/signup",async (req,res)=>{
    let input = req.body
    let hashedPassword = await generateHashedPassword(input.password)
    console.log(hashedPassword)
    input.password = hashedPassword
    let signup = new signupmodel(input)
    signup.save()
    res.json({"status":"success"})
})


app.listen(2000,()=>{
    console.log("server started")
})