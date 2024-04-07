const epxress = require("express")
const router = epxress.Router()
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
    res.render("admin/adminIndex")
})


router.get("/stations",async(req,res)=>{
    const stations = []
    await getDb().collection("stations").find({}).sort({stationDistance:1}).forEach((station)=> stations.push(station))
    res.render("admin/stations",{stations})
})

router.post("/stations",async(req,res)=>{
    try {
        const {stationName} = req.body
        let {stationDistance} = req.body
        stationDistance = Number(stationDistance)
        const existing = await getDb().collection("stations").findOne({stationName:stationName})
        if(existing || stationName === "")
        {
            return res.status(400).send({message:"Station already existing"})
        }
        const newStation = await getDb().collection("stations").insertOne({stationName,stationDistance})
        console.log(newStation)
        res.status(200).redirect("/admin/stations")
    } catch (error) {
        console.log(error.message)
    }
})

router.delete("/stations/:id",async(req,res)=>{
    try {
        const {id} = req.params
        if(!ObjectId.isValid(id))
        {
            return res.status(400).send({message:"Station doesn't exist"})
        }
        await getDb().collection("stations").deleteOne({_id:new ObjectId(id)})
        res.status(200).redirect("/admin/stations")
    } catch (error) {
        console.log(error)
    }
})

router.put("/stations/:id/edit",async(req,res)=>{
    try {
        const { id } = req.params;
        const { stationName } = req.body
        console.log(id)
        // Validate incoming data
        if (!ObjectId.isValid(id)) {
            return res.status(400).json({ error: "Invalid station ID" });
        }
        if (!stationName) {
            return res.status(400).json({ error: "Station name is required" });
        }

        await getDb().collection("stations").updateOne(
            { _id: new ObjectId(id) },
            { $set: { stationName: stationName } }
        );
        res.status(200).redirect("/admin/stations")
    } catch (error) {
        console.log(error)
    }
    
})


router.get("/getFormData/:id",async(req,res)=>{
    try {
        const {id} = req.params
        const data = await getDb().collection("stations").findOne({_id: new ObjectId(id)})
        console.log("*****************")
        console.log(data)
        res.send(data)
    } catch (error) {
        console.log(error)
    }
})

module.exports = router