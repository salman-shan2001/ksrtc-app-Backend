const express = require("express")
const mongoose = require ("mongoose")
const cors = require("cors")
const bcryptjs = require ("bcryptjs") //for ciphertexting
const jwt = require("jsonwebtoken")
const {signupmodel} = require("./modules/ksrtc")

//mongodb link
mongoose.connect("mongodb+srv://salmanshan:salman642001@cluster0.odxej1b.mongodb.net/ksrtcusersDB?retryWrites=true&w=majority&appName=Cluster0")

const app = express()
app.use(cors())
app.use(express.json())

// creating hash function
const generateHashedPassword= async (password)=>{
    const salt = await bcryptjs.genSalt(10)
    return bcryptjs.hash(password,salt)
}

//signup api

app.post("/signup",async (req,res)=>{
    let input = req.body
    let hashedPassword = await generateHashedPassword(input.password)
    console.log(hashedPassword)
    input.password = hashedPassword
    let signup = new signupmodel(input)
    signup.save()
    res.json({"status":"success"})
})


// login link

app.post("/LogIn",(req,res)=>{
    
    let input = req.body
    signupmodel.find({"email":req.body.email}).then(
        (response)=>{
            if(response.length > 0){

                let dbPassword = response[0].password
                console.log(dbPassword)
                bcryptjs.compare(input.password,dbPassword,(error,isMatch)=>{

                    if (isMatch) {
                        jwt.sign({email:input.email},"blog-app",{expiresIn:"1d"},(error,token)=>{
                            if (error) {
                               res.json("unable to create a token") 
                            } else {
                                res.json({"status":"success","userId":response[0]._id,"token":token})
                            }
                        })
                    } else {
                        res.json({"status":"Incorrect"})
                    }
                })
            }else{
                
                res.json({"status":"user not found"})
            }
        }
    ).catch()


})




app.listen(2000,()=>{
    console.log("server started")
})