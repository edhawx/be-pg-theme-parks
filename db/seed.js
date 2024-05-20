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

      // const rideArr = [...nestedArrOfValues, ride_name, ride_year_opened, votes]

        const park = [];
        for (let i = 0; i < parks.length; i++) {
          for (let j = 0; j < rides.length; j++) {
            if (rides[j].park_name === parks[i].park_name) {
              park.push({ ...parks[i], ...rides[j] });
            }
          }
        }
      const nestedArrOfValues = park.map((park) => {
        return [park.park_name, park.year_opened, park.annual_attendance,
          park.ride_name, park.votes
        ];
      })
      console.log(nestedArrOfValues)

      const itemInsertString = format(`INSERT INTO parks
      ( park_name, year_opened, annual_attendance, ride_name, votes )
      VALUES %L
      RETURNING *;`,
      nestedArrOfValues
    );

    // JOIN parks ON parks.park_id = rides.park_id

    return db.query(itemInsertString).then((result)=>{
      console.log(result.rows);
    })
    });
}


function createParks() {
  /* Create your parks table in the query below */
  return db.query(`CREATE TABLE parks (
    park_id SERIAL PRIMARY KEY,
    park_name VARCHAR(300) NOT null,
    year_opened INT NOT null,
    annual_attendance INT NOT NULL,
    ride_name VARCHAR(300) NOT NULL,
    votes INT NOT NULL);`)
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




module.exports = seed;
