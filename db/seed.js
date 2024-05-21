const db = require("./connection");
const format = require("pg-format");

function seed({ parks, rides, stalls}) {
  return db
    .query("DROP TABLE IF EXISTS rides;")
    .then(() => {
      return db.query("DROP TABLE IF EXISTS stalls;");
    })
    .then(() => {
      return db.query("DROP TABLE IF EXISTS foods;");
    })
    .then(() => {
      return db.query("DROP TABLE IF EXISTS stalls_foods;");
    })
    .then(() => {
      return db.query("DROP TABLE IF EXISTS parks;");
    })
    .then(() => {
      return createParks();
    })
    .then(() => {
      return createRides();
    })
    .then(() => {
    const formattedParks = parks.map((park)=>{
      return ([park.park_name, park.year_opened, park.annual_attendance])
    })
    const insertParksQueryString = format(
      `INSERT INTO parks (park_name, year_opened, annual_attendance)
      VALUES %L
      RETURNING *;`,
      formattedParks
    );
    return db.query(insertParksQueryString)
    })
    .then(result => {
      const insertedParks = result.rows;
      const modifiedRides = modifyRides(rides, insertedParks);
      const formattedRides = modifiedRides.map(ride => [
        ride.park_id,
        ride.ride_name,
        ride.year_opened,
        ride.votes
      ]);

      const insertRidesQueryString = format(
        `INSERT INTO rides (park_id, ride_name, year_opened, votes)
        VALUES %L
        RETURNING *;`,
        formattedRides
      );
      return db.query(insertRidesQueryString)
    });
};


function createParks() {
  /* Create your parks table in the query below */
  return db.query(`CREATE TABLE parks (
    park_id SERIAL PRIMARY KEY,
    park_name VARCHAR(300) NOT null,
    year_opened INT NOT null,
    annual_attendance INT NOT NULL);`)
};

function createRides() {
  /* Create your parks table in the query below */
  return db.query(`CREATE TABLE rides (
    ride_id SERIAL PRIMARY KEY,
    park_id INT REFERENCES parks(park_id),
    year_opened INT NOT NULL,
    ride_name VARCHAR(100),
    votes INT NOT NULL);`)
};

function modifyRides(rides, parks){
  const parkMap = parks.reduce((acc, park)=>{
    acc[park.park_name] = park.park_id;
    return acc;
  }, {});

  const modifiedRides = rides.map(ride =>{
    return {
      ride_name: ride.ride_name,
      year_opened: ride.year_opened,
      park_id: parkMap[ride.park_name],
      votes: ride.votes
    }
  });
  return modifiedRides;
}



module.exports = seed;
