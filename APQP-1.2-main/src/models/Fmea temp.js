const mongoose = require('mongoose');

// Esquema para las denominaciones
const denominacionSchema = new mongoose.Schema({
  nombre: { type: String, required: true, unique: true }, // ETH, BTC, USD
  balance: { type: Number, default: 0 },
  compra: { type: Number, required: true },
  venta: { type: Number, required: true },
});

// Esquema para los movimientos
const movimientoSchema = new mongoose.Schema({
  tipo: { type: String, required: true, enum: ['entrada', 'salida'] },
  monto: { type: Number, required: true },
  descripcion: { type: String, required: true },
  moneda: { type: String, required: true },
  fecha: { type: Date, default: Date.now },
});

// Crear modelos
const Denominacion = mongoose.model('Denominacion', denominacionSchema);
const Movimiento = mongoose.model('Movimiento', movimientoSchema);

module.exports = { Denominacion, Movimiento };