const { fetchParks, fetchRideById, addRide, updateRide } = require("../models/api.models");


exports.getApiHealth = (req, res) => {
    // console.log("controller");
    res.status(200).send({ msg: "All okay!"});
}

exports.getParks = (req, res) => {
    return fetchParks().then((parks)=>{
    res.status(200).send({ parks });
    }) 
}

exports.getRideById = (req, res) =>{
    const { ride_id } = req.params;
    fetchRideById(ride_id).then((ride)=>{
        // console.log(ride)
        res.status(200).send({ ride })
    })
}

exports.postNewRide = (req, res)=>{
    const { park_id } = req.params;
    const newRide = req.body;
    // console.log(newRide)

    addRide(park_id, newRide)
    .then((ride)=>{
        res.status(201).send({ ride })
    })
}

exports.patchRide = (req, res)=>{
    const {ride_id} = req.params;
    const updatedRide = req.body;
    // console.log(updatedRide)

    updateRide(ride_id, updatedRide)
    .then((ride)=>{
        // console.log({ride})
        res.status(200).send({ride})
    })
}