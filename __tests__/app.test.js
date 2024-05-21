const db = require("../db/connection");
const seed = require("../db/seed");
const data = require("../db/data/index")
const request = require("supertest");
const app = require("../app");

beforeEach(()=>{
    return seed(data)
});

afterAll(()=> db.end());

describe("GET /api/healthcheck", ()=>{
    test('status 200: responds with a 200', ()=>{
    return request(app)
    .get("/api/healthcheck")
    .expect(200)
    .then((res) => {
        expect(res.body).toEqual({ msg: "All okay!"})
    })
    })
});

describe("GET /api/parks", () => {
  test("status 200: responds with park objects", () => {
    return request(app)
      .get("/api/parks")
      .expect(200)
      .then((res) => {
        // console.log(res.body.parks)
        expect(res.body.parks).toHaveLength(4)
        expect(res.body.parks).toEqual([
            {
              park_id: 1,
              park_name: 'Thorpe Park',
              year_opened: 1979,
              annual_attendance: 1700000
            },
            {
              park_id: 2,
              park_name: 'Alton Towers',
              year_opened: 1980,
              annual_attendance: 2520000
            },
            {
              park_id: 3,
              park_name: 'Chessington World of Adventures',
              year_opened: 1987,
              annual_attendance: 1400000
            },
            {
              park_id: 4,
              park_name: 'Tivoli Gardens',
              year_opened: 1843,
              annual_attendance: 3972000
            }
          ])
          res.body.parks.forEach((park)=>{
            expect(park).toMatchObject({
                park_id: expect.any(Number),
                park_name: expect.any(String),
                year_opened: expect.any(Number),
                annual_attendance: expect.any(Number),
            });
          })
      });
  });
});

describe("GET /api/ride/:ride_id", () => {
  test("Status 200: responds with ride by id", () => {
    return request(app)
      .get("/api/rides/1")
      .expect(200)
      .then((res) => {
        expect(res.body.ride).toEqual({
          ride_id: 1,
          park_id: 1,
          year_opened: 2002,
          ride_name: "Colossus",
          votes: 5,
        });
      });
  });
});

describe("POST /api/parks/:park_id/rides", ()=>{
    test("Status 201: responds with newly posted ride obj", ()=>{
        const newRide = {
            ride_name: 'new ride',
            year_opened: 2023,
          };
        return request(app)
        .post("/api/parks/1/rides")
        .send(newRide)
        .expect(201)
        .then((res) => {
            expect(res.body).toEqual(
                {
                    ride: {
                      ride_id: 21,
                      ride_name: 'new ride',
                      year_opened: 2023,
                      park_id: 1,
                      votes: 0
                    }
                  }
            );
        })
    })
})

describe("PATCH /api/rides/:ride_id", ()=>{
    test("Status 200: responds with newly posted ride obj", ()=>{
        const updatedRide = {
            ride_name: 'McSpeedy',
        };
        return request(app)
        .patch("/api/rides/1")
        .send(updatedRide)
        .expect(200)
        .then((res)=>{
            expect(res.body).toEqual(
                {
                    ride: {
                      ride_id: 1,
                      ride_name: 'McSpeedy',
                      year_opened: 2002,
                      park_id: 1,
                      votes: 5
                    }
                  }
            );
        })
    })
})