const mongoose = require('mongoose');
const { Schema } = mongoose;

const PcpMakeSchema = new Schema({
    // Campos par
    pa1: String,
    pa4: String,
    pa6: String,
    pa7: String,
    pa8: String,
    pa10: String,
    pa11: String,
    pa13: String,
    pa19: String,
    pa45: String,
    cu1: String,
    pa47: String,

    // Campos chr simples
    ch4: String,
    ch5: String,
    ch6: String,
    ch7: String,
    ch8: String,

    // Cambiamos de ObjectId a String para guardar directamente el valor (editable por el usuario)
    chr_peso: String,

    chr_peak_1: String,
    chr_peak_2: String,
    chr_peak_3: String,
    chr_peak_4: String,
    chr_peak_5: String,
    chr_peak_6: String,
    chr_peak_7: String,
    chr_peak_8: String,
    chr_peak_9: String,

    chr_root_1: String,
    chr_root_2: String,
    chr_root_3: String,
    chr_root_4: String,
    chr_root_5: String,
    chr_root_6: String,
    chr_root_7: String,
    chr_root_8: String,
    chr_root_9: String,

    chr_falda_1: String,
    chr_cuello: String,
    chr_falda_2: String,

    machine: String,
}, { timestamps: true });

module.exports = mongoose.model('PcpMake', PcpMakeSchema);



