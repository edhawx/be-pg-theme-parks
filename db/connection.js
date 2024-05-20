/**
 * Create your connection to the DB in this file
 * and remember to export it
 */

const {Pool} = require("pg")


if(!process.env.PGDATABASE){
    throw new Error("PGDATABASE is not set up")
}

const connection = new Pool()

module.exports = connection
