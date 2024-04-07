const express = require("express")
const router = express.Router()
const {ObjectId} = require("mongodb")

const {
    connectToDb,getDb
} = require("../db")

connectToDb((err)=>{
    if(err)
    {
        console.log("Failed to connect to DB",err)
        return
    }
})

router.get("/",(req,res)=>{
    res.render("user/userIndex")
})


router.get("/book-ticket",async(req,res)=>{
    try {
        const stations = []
        const stationCurser = await getDb().collection("stations").find({}).sort({stationDistance:1}).forEach(station => stations.push(station))
        console.log(stations)
        res.render("user/bookTicket",{stations})
    } catch (error) {
        console.log(error)
    }
})

router.get("/get-destination/:start",async(req,res)=>{
    try {
        const {start} = req.params
        
        const stations = await getDb().collection("stations").find({_id:{$ne:new ObjectId(start)}}).sort({stationDistance:1}).toArray()
        res.status(200).send(stations)
    } catch (error) {
        console.log(error)
    }
})

router.post("/book-ticket",async(req,res)=>{
    try {
        let fare = 60
        const fareChart = [
            {maxDistance:2,fare:10},
            {maxDistance:5,fare:20},
            {maxDistance:10,fare:30},
            {maxDistance:15,fare:40},
            {maxDistance:20,fare:50},
        ]
        const {beginningPoint,destination} = req.body
        const startStation = await getDb().collection("stations").findOne({_id: new ObjectId(beginningPoint)})
        const endPoint = await getDb().collection("stations").findOne({_id: new ObjectId(destination)})
        const begDistance = startStation.stationDistance
        const destDistance = endPoint.stationDistance
        const distance = Math.abs(destDistance - begDistance)

        for (const ele of fareChart){
            if(distance <= ele.maxDistance)
            {
                fare = ele.fare
                break
            }
        }
        await getDb().collection("journey").insertOne({startingPoint:startStation,endPoint:endPoint,fare:fare})
        res.status(200).send({startStation,endPoint,fare})
        
    } catch (error) {
        console.log(error)
    }
})














module.exports = router