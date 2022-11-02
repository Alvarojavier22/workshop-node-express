import express from "express";
import cors from "cors"
import dbCollecion from "./db.js";

const myApi=express()

myApi.use(express.json())
myApi.use(cors())


const dbUsers=dbCollecion("users")

const logger=(req,res,next)=>{
    console.info({
        "ruta":req.path,
        "metodo":req.method
    })
    next()
}

myApi.use(logger)

/*****************************************/
/*********** API DE USUARIOS**************/
/*****************************************/
myApi.get("/users", async (req, res) =>{
    let users=await dbUsers.getAll()
    res.status(200).send(users)
})

myApi.post("/users", async (req, res) =>{
    let userData={... req.body}
    console.log({userData})
    let users=await dbUsers.create(userData)
    res.status(200).send(users)
})

myApi.get("/users/:id", async (req, res) =>{
    let id=req.params.id
    let users=await dbUsers.get(id)
    res.status(200).send(users)
})

myApi.patch("/users/:id", async (req, res) =>{
    let id=req.params.id
    let users=await dbUsers.update(id,req.body)
    res.status(200).send(users)
})

myApi.put("/users/:id", async (req, res) =>{
    let id=req.params.id
    let users=await dbUsers.write(id,req.body)
    res.status(200).send(users)
})

myApi.delete("/users/:id", async (req, res) =>{
    let id=req.params.id
    let users=await dbUsers.delete(id)  
    res.status(200).send(users)
})

myApi.use("*",(req,res)=>{
    res.status(404).send("Route not found")
})

export default myApi