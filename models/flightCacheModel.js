const mongoose = require('mongoose')

const fightCacheSchema = new mongoose.Schema({
    origin : String,
    destination : String,
    adult: Number,
    child: Number,
    infant: Number,
    DepartureDate: String,
    triptype: String,
    ReturnDate: String,
    result: { type: Array, default: [] },  // to store the entire flight result
    createdAt:  { type: Date, expires: '1d', default: Date.now }
})

const flightCache = mongoose.model('flightSearch', fightCacheSchema)

module.exports = flightCache