const mongoose = require('mongoose');

const SubgrupoSchema = new mongoose.Schema({
  muestras: {
    type: [Number],
    validate: [arr => arr.length === 5, 'Debe haber 5 muestras']
  },
  fecha: {
    type: Date,
    default: Date.now
  },
  pa6: String,
  pa7: String
});

module.exports = mongoose.model('Subgrupo', SubgrupoSchema);


