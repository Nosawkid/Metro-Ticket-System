require("dotenv").config()


const express = require("express")
const app = express()
const path = require("path")
const engine = require("ejs-mate")
const methodOverride = require("method-override")

// EJS
app.engine("ejs",engine)
app.set("view engine","ejs")
app.set("views",path.join(__dirname,"views"))


// BOdy Parser
app.use(express.urlencoded({extended:true}))

// Method
app.use(methodOverride("_method"))

// Serving Static Files
app.use(express.static(path.join(__dirname,"public")))

// DB
const {
    connectToDb,getDb
} = require("./db")

app.use(express.json());





// ROuters
const adminROuter = require("./routers/admin")
app.use("/admin",adminROuter)

const userRouter = require("./routers/users")
app.use("/user",userRouter)


app.get("/",(req,res)=>{
    res.render("index")
})


















  app.listen(process.env.PORT || 3000,()=>{
    console.log(`Port Running at ${process.env.PORT}`)
})



