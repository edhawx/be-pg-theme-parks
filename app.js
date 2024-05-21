const express = require('express');
const { getApiHealth, getParks, getRideById, postNewRide, patchRide } = require('./controllers/api.controllers')

const app = express();
app.use(express.json());

app.get('/api/healthcheck', getApiHealth);

app.get('/api/parks', getParks);

app.get('/api/rides/:ride_id', getRideById);

app.post('/api/parks/:park_id/rides', postNewRide)

app.patch('/api/rides/:ride_id', patchRide)

module.exports = app;