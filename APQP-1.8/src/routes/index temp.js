const express = require ('express');
const router = express.Router();
const { Denominacion, Movimiento } = require('../models/Fmea');
const mongoose = require ('mongoose');



// Ruta para mostrar la vista home.ejs
router.get('/', (req, res, next) =>
{
        res.render('home');
});
  
  router.post('/db/submit', (req, res) => {
    const bd1 = req.body.db1; 
    const URI ='mongodb+srv://' + bd1 +
      ':HHnOQn2B4iVtEdOU@cluster0.pgfsbij.mongodb.net/exchange?retryWrites=true&w=majority';
      console.log(bd1)
      mongoose.connect(URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
      })
        .then(() => {
          console.log("Conexión exitosa a la base de datos");
        })
        .catch(error => {
          console.log("Error al conectar a la base de datos:", error);
        });
        res.redirect("/index");
    
  });
  
  
  
  router.get('/', (req, res) => {
    res.render('home');
  });
  
  // Ruta para calcular el balance total
  const calcularBalanceTotal = async () => {
    const denominaciones = await Denominacion.find({});
    return denominaciones.reduce((total, denom) => total + denom.balance * denom.venta, 0);
  };
  
  // Ruta principal
  router.get('/index', async (req, res) => {
    try {
      const denominaciones = await Denominacion.find({});
      const movimientos = await Movimiento.find({}).sort({ fecha: -1 });
      const balanceTotal = await calcularBalanceTotal();
  
      res.render('index', { denominaciones, movimientos, balanceTotal, error: null });
    } catch (error) {
      console.error('Error obteniendo datos:', error);
      res.status(500).send('Error interno del servidor');
    }
  });
  
  // Ruta para agregar un movimiento
  router.post('/agregar-movimiento', async (req, res) => {
    const { tipo, monto, descripcion, moneda } = req.body;
    
    try {
      const montoFloat = parseFloat(monto);
      if (isNaN(montoFloat)) {
        return res.status(400).send('Error: Monto no válido.');
      }
  
      const movimiento = new Movimiento({ tipo, monto: montoFloat, descripcion, moneda });
      await movimiento.save();
  
      const denominacion = await Denominacion.findOne({ nombre: moneda });
      if (!denominacion) {
        return res.status(400).send('Error: Moneda no encontrada.');
      }
  
      denominacion.balance += tipo === 'entrada' ? montoFloat : -montoFloat;
      await denominacion.save();
  
      res.redirect('/index');
    } catch (error) {
      console.error('Error agregando movimiento:', error);
      res.status(500).send('Error interno del servidor');
    }
  });
  
  // Ruta para actualizar los tipos de cambio
  router.post('/actualizar-tipos-cambio', async (req, res) => {
    const { moneda, compra, venta } = req.body;
  
    try {
      const denominacion = await Denominacion.findOne({ nombre: moneda });
      if (!denominacion) {
        return res.render('index', {
          denominaciones: await Denominacion.find({}),
          movimientos: await Movimiento.find({}).sort({ fecha: -1 }),
          balanceTotal: await calcularBalanceTotal(),
          error: 'Denominación no encontrada',
        });
      }
  
      denominacion.compra = parseFloat(compra);
      denominacion.venta = parseFloat(venta);
      await denominacion.save();
  
      res.redirect('/index');
    } catch (error) {
      console.error('Error actualizando tipos de cambio:', error);
      res.status(500).send('Error interno del servidor');
    }
  });
  
  

  module.exports = router