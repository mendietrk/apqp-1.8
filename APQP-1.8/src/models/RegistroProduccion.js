const mongoose = require('mongoose');

const registroProduccionSchema = new mongoose.Schema({
  pa6: {
    type: String,
    required: true, // Número de parte
    trim: true
  },
  pa7: {
    type: String,
    required: false, // Descripción
    trim: true
  },
  cantidad: {
    type: Number,
    required: false,
    min: 0
  },
  defecto: {
    type: String,
    required: false, // Puede ir vacío si no hay defecto
    trim: true
  },
  fechaFabricacion: {
    type: Date,
    required: true
  },
  observaciones: {
    type: String,
    required: false,
    trim: true
  }
}, {
  timestamps: true // Guarda automáticamente createdAt y updatedAt
});

module.exports = mongoose.model('RegistroProduccion', registroProduccionSchema);
