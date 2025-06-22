const mongoose = require('mongoose');

const ubicacionSchema = new mongoose.Schema({
  nombre: String,
  latitud: Number,
  longitud: Number,
  fechaHora: Date,
});

module.exports = mongoose.model('Ubicacion', ubicacionSchema);

