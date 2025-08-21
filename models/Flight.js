// models/Flight.js
const mongoose = require('mongoose');

// Define Flight Schema
const flightSchema = new mongoose.Schema({
  airline: String,
  logo: String, // This will store the path to the logo file
  flightCode: String,
  departure: String,
  departureTime: String,
  arrivalTime: String,
  stop: String,
  duration: String,
  price: Number,
  type: String,
  baggage: String,
  meal: String,
  lax: String,
  laf: String
});

const Flight = mongoose.model('Flight', flightSchema);

module.exports = Flight;
