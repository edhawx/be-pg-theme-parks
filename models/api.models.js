const db = require("../db/connection")

exports.fetchParks = () => {
    return db.query("SELECT * FROM parks;")
    .then((data)=>{
        return data.rows;
    })
}

exports.fetchRideById = (ride_id)=>{
    return db
    .query("SELECT * FROM rides WHERE ride_id = $1", [ride_id])
    .then((data) => {
        return data.rows[0];
    })
}

exports.addRide = (park_id, newRide) =>{
    const { ride_name, year_opened } = newRide;
    const votes = newRide.votes || 0;
    return db
    .query(`INSERT INTO rides (park_id, ride_name, year_opened, votes)
    VALUES ($1, $2, $3, $4)
    RETURNING *;`,
[park_id, ride_name, year_opened, votes]
)
.then((data) => {
    return data.rows[0];
});
}

exports.updateRide = (ride_id, updatedRide)=>{
    const {ride_name} = updatedRide;
    return db
    .query(`UPDATE rides
    SET ride_name = $1
    WHERE ride_id = $2
    RETURNING *;`,
[ride_name, ride_id])
.then((data)=>{
    return data.rows[0];
})
}
