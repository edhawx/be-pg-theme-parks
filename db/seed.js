const db = require("./connection");

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
    });
}

function createParks() {
  /* Create your parks table in the query below */
  return db.query(`CREATE TABLE parks (
    park_id SERIAL PRIMARY KEY,
    park_name VARCHAR(300) NOT null,
    year_opened INT NOT null,
    annual_attendance INT NOT NULL);`)
    .then((result) => console.log(result));
};

function createRides() {
  /* Create your parks table in the query below */
  return db.query(`CREATE TABLE rides (
    ride_id SERIAL PRIMARY KEY,
    park_id INT REFERENCES parks(park_id),
    year_opened INT NOT NULL,
    ride_name VARCHAR(100),
    votes INT NOT NULL);`)
    .then((result) => console.log(result));
};


module.exports = seed;
