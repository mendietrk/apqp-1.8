const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ActividadesSchema = new Schema({
  indice: { type: Number },               // Índice (número secuencial)
  actividad: { type: String },            // Actividad (descripción)
  responsable: { type: String },          // Responsable
  inicio: { type: Date },                 // Fecha de inicio planificada
  plazo: { type: Date },                  // Fecha de plazo
  dias: { type: Number },                 // Días estimados
  porcentajeConcluido: { type: Number },  // % Concluido
  inicioReal: { type: Date },             // Fecha de inicio real
  fin: { type: Date },                    // Fecha de fin real
  diasReal: { type: Number },             // Días reales
  observaciones: { type: String },        // Observaciones
  emailPara: { type: String },            // Email para:
  emailCC: { type: String },              // Email CC
  difDias: { type: Number }              // Diferencia de días
});

module.exports = mongoose.model("actividades", ActividadesSchema);
