const mongoose = require('mongoose');

const ubicacionSchema = new mongoose.Schema({
  nombre: String,
  latitud: Number,
  longitud: Number,
  entrada: String,
  fechaHora: Date,
});

module.exports = mongoose.model('Ubicacion', ubicacionSchema);