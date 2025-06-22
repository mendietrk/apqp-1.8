const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const APQPKUNSchema = new Schema({
    // Campos obligatorios que tu error indica que faltan
    nombreDeLaParte: { type: String, required: true }, // Ejemplo: "Boot SX8.1 - 56"
    material: { type: String, required: true },       // Ejemplo: "Arnitel"
    descripcion: { type: String, required: true },    // Ejemplo: "PB420B"

    // Otros campos basados en el orden de tus datos pegados
    pa6: { type: String, unique: true }, // '10440210' (asumo que es único)
    fecha: { type: Date },               // '11 de junio de 2025'
    pa6_pa7_combinado: { type: String }, // '10440210 / 14D-AE7-000'
    pa7: { type: String },               // '14D-AE7-000'
    proveedor: { type: String },         // 'Phoenix D-PUP'
    numeroDeDibujo: { type: String },    // '3100934272'
    peso: { type: Number },              // '0.1003'
    clasificacion: { type: String },     // 'B'
    fechaRevision: { type: Date },       // '12/5/2021'
    valorGenerico1: { type: String },    // '123'
    cliente: { type: String },           // 'GKN VLG (CELAYA)'
    valorGenerico2: { type: String },    // '123'
    porcentaje1: { type: String },       // '´0.06%'
    temperaturaRango: { type: String },  // '100 c +/-10 c'
    tiempoRango: { type: String },       // '2hr - 3 hr'
    porcentaje2: { type: String },       // '´0.04%'
    dim1: { type: String },              // '100.3 ± 1.5'
    dim2: { type: String },              // '1.29 ± 0.15'
    dim3: { type: String },              // '1.4 ± 0.15'
    dim4: { type: String },              // '1.33 ± 0.15'
    dim5: { type: String },              // '1.39 ± 0.15'
    dim6: { type: String },              // '1.03 ± 0.15'
    dim7: { type: String },              // '1.23 ± 0.15'
    dim8: { type: String },              // '1.38 ± 0.2'
    dim9: { type: String },              // '1.18 ± 0.15'
    dim10: { type: String },             // '1.09 ± 0.15'
    dim11: { type: String },             // '1.19 ± 0.15'
    dim12: { type: String },             // '1.16 ± 0.15'
    dim13: { type: String },             // '1.22 ± 0.15'
    dim14: { type: String },             // '1.21 ± 0.2'
    dim15: { type: String },             // '2.0 ± 0.15'
    dim16: { type: String },             // '1.45 ± 0.15'
    // ... agrega más campos según necesites

    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

APQPKUNSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

// Asegúrate de que el nombre del modelo aquí sea el que usas en tu aplicación (ej. 'Part' o 'APQPKUN')
module.exports = mongoose.model("Part", APQPKUNSchema);