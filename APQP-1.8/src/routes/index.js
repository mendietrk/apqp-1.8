const express = require("express");
const router = express.Router();
const multer = require('multer');

const fs = require("fs");
const path = require("path");
const ejs = require("ejs");
const puppeteer = require("puppeteer"); // O puppeteer-core, según usas

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Carpeta donde se guardan las imágenes
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname)); // Nombre único + extensión original
  }
});

// Filtro para imágenes
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);
  
  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(new Error('Solo se permiten imágenes (jpeg, jpg, png, gif)'));
  }
};

// Configurar Multer
const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Máximo 5 MB
  fileFilter: fileFilter
});

// Ruta POST para cargar imagen
router.post('/', upload.single('imagen'), (req, res) => {
  try {
    res.json({
      mensaje: 'Imagen cargada correctamente',
      archivo: req.file.filename,
      ruta: `/uploads/${req.file.filename}`
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get('/', (req, res) => {
  const uploadsDir = path.join(__dirname, '../uploads');

  fs.readdir(uploadsDir, (err, archivos) => {
    if (err) {
      console.error('Error al leer la carpeta de imágenes:', err);
      return res.status(500).send('Error al leer las imágenes');
    }

    const imagenes = archivos.filter(archivo => /\.(jpg|jpeg|png|gif)$/i.test(archivo));
    res.render('imagenes', { imagenes });
  });
});

router.delete('/:nombre', (req, res) => {
  const nombreImagen = req.params.nombre;
  const rutaImagen = path.join(__dirname, '../uploads', nombreImagen);

  fs.unlink(rutaImagen, (err) => {
    if (err) {
      console.error('Error al eliminar la imagen:', err);
      return res.status(500).json({ mensaje: 'Error al eliminar la imagen' });
    }

    res.json({ mensaje: 'Imagen eliminada correctamente' });
  });
});


const Ubicacion = require("../models/ubicacion.js");

// Ruta GET para mostrar la vista
router.get('/registro-ubicacion', (req, res) => {
  res.render('../views/ubicacion.ejs'); 
});

router.post('/registro-ubicacion', async (req, res) => {
  try {
    const { nombre, latitud, longitud, fechaHora } = req.body;

    await Ubicacion.create({
      nombre,
      latitud: parseFloat(latitud),
      longitud: parseFloat(longitud),
      entrada: req.body.entrada,
      fechaHora: new Date(fechaHora),
    });

   
    res.redirect('/ubicaciones'); // ✅ Recomendado si usas una vista
    // res.send('Ubicación registrada exitosamente'); // ❌ No usar ambas
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al registrar la ubicación');
  }
});



router.get('/ubicaciones', async (req, res) => {
  try {
    const ubicaciones = await Ubicacion.find().sort({ fechaHora: -1 }); // más recientes primero
    res.render('../views/ubicaciones', { ubicaciones });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al obtener ubicaciones');
  }
});

router.delete('/ubicaciones/:id', async (req, res) => {
  try {
    await Ubicacion.findByIdAndDelete(req.params.id);
    res.redirect('/ubicaciones');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al borrar el registro');
  }
});

router.get("/ppap14pi/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const pars = await Par.findById(id);

    const logoPath = path.join(__dirname, "../../public/images/ppap/image001.png");
    const logoBase64 = fs.readFileSync(logoPath, "base64");

    const html = await ejs.renderFile(
      path.join(__dirname, "../views/PPAPp14.ejs"),
      { pars, logoBase64 }
    );

    res.send(html);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error interno");
  }
});

// Ruta 2
router.get("/ppap17.07p/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const pars = await Par.findById(id);

    const logoPath = path.join(__dirname, "../../public/images/ppap/image001.png");
    const logoBase64 = fs.readFileSync(logoPath, "base64");

    const html = await ejs.renderFile(
      path.join(__dirname, "../views/PPAPp1707.ejs"),
      { pars, logoBase64 }
    );

    res.send(html);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error interno");
  }
});

// Ruta 3
router.get("/ppap17.08p/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const pars = await Par.findById(id);

    const logoPath = path.join(__dirname, "../../public/images/ppap/image001.png");
    const logoBase64 = fs.readFileSync(logoPath, "base64");

    const html = await ejs.renderFile(
      path.join(__dirname, "../views/PPAPp1708.ejs"),
      { pars, logoBase64 }
    );

    res.send(html);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error interno");
  }
});

router.get("/ppap2pi/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const pars = await Par.findById(id);

    // Leer logo y convertirlo a base64
    const logoPath = path.join(__dirname, "../../public/images/ppap/image001.png");
    const logoBase64 = fs.readFileSync(logoPath, "base64");

    // Renderizar HTML con EJS
    const html = await ejs.renderFile(
      path.join(__dirname, "../views/PPAPp02.ejs"),
      { pars, logoBase64 }
    );

    // Lanzar Puppeteer y generar PDF
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "networkidle0" });

    const nombreArchivo = `02.${pars.pa6 || "sin_nombre"} Enginering Changes.pdf`;

    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
    });

    await browser.close();

    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${nombreArchivo}"`,
    });

    res.send(pdfBuffer);
  } catch (err) {
    console.error("Error al generar PDF:", err);
    res.status(500).send("Error al generar el PDF.");
  }
});

router.get("/ppap17.07pi/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const pars = await Par.findById(id);

    // Leer logo y convertirlo a base64
    const logoPath = path.join(__dirname, "../../public/images/ppap/image001.png");
    const logoBase64 = fs.readFileSync(logoPath, "base64");

    // Renderizar HTML con EJS
    const html = await ejs.renderFile(
      path.join(__dirname, "../views/PPAPp1707.ejs"),
      { pars, logoBase64 }
    );

    // Lanzar Puppeteer y generar PDF
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "networkidle0" });

    const nombreArchivo = `17.07.${pars.pa6 || "sin_nombre"} CustSpecifReq.pdf`;

    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
    });

    await browser.close();

    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${nombreArchivo}"`,
    });

    res.send(pdfBuffer);
  } catch (err) {
    console.error("Error al generar PDF:", err);
    res.status(500).send("Error al generar el PDF.");
  }
});

router.get("/ppap17.08pi/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const pars = await Par.findById(id);

    // Leer logo y convertirlo a base64
    const logoPath = path.join(__dirname, "../../public/images/ppap/image001.png");
    const logoBase64 = fs.readFileSync(logoPath, "base64");

    // Renderizar HTML con EJS
    const html = await ejs.renderFile(
      path.join(__dirname, "../views/PPAPp1708.ejs"),
      { pars, logoBase64 }
    );

    // Lanzar Puppeteer y generar PDF
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "networkidle0" });

    const nombreArchivo = `17.08.${pars.pa6 || "sin_nombre"} CustSpecifReq.pdf`;

    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
    });

    await browser.close();

    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${nombreArchivo}"`,
    });

    res.send(pdfBuffer);
  } catch (err) {
    console.error("Error al generar PDF:", err);
    res.status(500).send("Error al generar el PDF.");
  }
});

router.get("/cargar1", async (req, res) => {
  const partes = await Par.find({}, 'pa6 pa7').lean();
  res.render("cargar1", { partes });
});

router.get("/ppap14pi/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const pars = await Par.findById(id);

    // Leer logo y convertirlo a base64
    const logoPath = path.join(__dirname, "../../public/images/ppap/image001.png");
    const logoBase64 = fs.readFileSync(logoPath, "base64");

    // Renderizar HTML con EJS
    const html = await ejs.renderFile(
      path.join(__dirname, "../views/PPAPp14.ejs"),
      { pars, logoBase64 }
    );

    // Lanzar Puppeteer y generar PDF
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "networkidle0" });

    const nombreArchivo = `14.${pars.pa6 || "sin_nombre"} Sample Production Parts.pdf`;

    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
    });

    await browser.close();

    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${nombreArchivo}"`,
    });

    res.send(pdfBuffer);
  } catch (err) {
    console.error("Error al generar PDF:", err);
    res.status(500).send("Error al generar el PDF.");
  }
});

const rutasPPAP = [
  {
    path: "ppap2p",
    subtitle: "02. Engineering Changes",
    description: (pa6) => `${pa6} design record references all dimensions, characteristics, and specifications of the part.`,
    footerText: (pa6) => `PPAP ${pa6} ENGINEERING CHANGES`,
    fileNamePrefix: "02. Engineering Changes",
  },
  {
    path: "ppap3p",
    subtitle: "03. Engineering Approval",
    description: (pa6) => `Engineering Approval for PPAP ${pa6} not applicable`,
    footerText: (pa6) => `PPAP ${pa6} ENGINEERING APPROVAL`,
    fileNamePrefix: "03. Engineering Approval",
  },
  {
    path: "ppap4p",
    subtitle: "04. Design Failure Mode and Effect Analysis (D-FMEA)",
    description: (pa6) =>
      `Design Failure Mode and Effect Analysis (D-FMEA) ${pa6} confidential document by Customer.`,
    footerText: (pa6) => `PPAP ${pa6} DESIGN FAILURE MODE AND EFFECT ANALYSIS (D-FMEA)`,
    fileNamePrefix: "04. Design Failure Mode and Effect Analysis (D-FMEA)",
  },
  {
    path: "ppap5p",
    subtitle: "05. Process Flow Diagram",
    description: (pa6) =>
      `Process Flow Diagram ${pa6} not required for annual validation.`,
    footerText: (pa6) => `PPAP ${pa6} PROCESS FLOW DIAGRAM`,
    fileNamePrefix: "05. Process Flow Diagram",
  },
  {
    path: "ppap6p",
    subtitle: "06. Process Failure Mode and Effects Analysis",
    description: (pa6) =>
      `Process Failure Mode and Effects Analysis ${pa6} not required for annual validation.`,
    footerText: (pa6) => `PPAP ${pa6} PROCESS FAILURE MODE AND EFFECTS ANALYSIS`,
    fileNamePrefix: "06. Process Failure Mode and Effects Analysis",
  },
  {
    path: "ppap7p",
    subtitle: "07. Control Plan",
    description: (pa6) =>
      `Control Plan ${pa6} not required for annual validation.`,
    footerText: (pa6) => `PPAP ${pa6} CONTROL PLAN`,
    fileNamePrefix: "07. Control Plan",
  },
  {
    path: "ppap4dp",
    subtitle: "04. Design Failure Mode and Effect Analysis (D-FMEA)",
    description: (pa6) =>
      `Design Failure Mode and Effect Analysis (D-FMEA) ${pa6} confidential document by Organization.`,
    footerText: (pa6) => `PPAP ${pa6} DESIGN FAILURE MODE AND EFFECT ANALYSIS (D-FMEA)`,
    fileNamePrefix: "04. Design Failure Mode and Effect Analysis (D-FMEA)",
  },
  {
    path: "ppap8p",
    subtitle: "08. Measurement System Analysis",
    description: (pa6) =>
      `Measurement System Analysis ${pa6} not required for annual validation.`,
    footerText: (pa6) => `PPAP ${pa6} MEASUREMENT SYSTEM ANALYSIS`,
    fileNamePrefix: "08. Measurement System Analysis",
  },
  {
    path: "ppap12p",
    subtitle: "12) Qualified Laboratory Documentation",
    description: (pa6) =>
      `Qualified Laboratory Documentation ${pa6} not required for annual validation.`,
    footerText: (pa6) => `PPAP ${pa6} QUALIFIED LABORATORY DOCUMENTATION`,
    fileNamePrefix: "12) Qualified Laboratory Documentation",
  },
  {
    path: "ppap13p",
    subtitle: "13. Appearance Approval Report",
    description: (pa6) => `Appearance Approval Report ${pa6} not applicable`,
    footerText: (pa6) => `PPAP ${pa6} APPEARANCE APPROVAL REPORT`,
    fileNamePrefix: "13. Appearance Approval Report",
  },
  {
    path: "ppap14p",
    subtitle: "14. Sample Production Parts",
    description: (pa6) => `Sample Production Parts ${pa6}`,
    footerText: (pa6) => `PPAP ${pa6} SAMPLE PRODUCTION PARTS`,
    fileNamePrefix: "14. Sample Production Parts",
  },
  {
    path: "ppap14np",
    subtitle: "14. Sample Production Parts",
    description: (pa6) => `Sample Production Parts ${pa6} not required for annual validation.`,
    footerText: (pa6) => `PPAP ${pa6} SAMPLE PRODUCTION PARTS`,
    fileNamePrefix: "14. Sample Production Parts",
  },
  {
    path: "ppap15p",
    subtitle: "15. Master Samples",
    description: (pa6) => `Master Samples ${pa6} `,
    footerText: (pa6) => `PPAP ${pa6} MASTER SAMPLES`,
    fileNamePrefix: "15. Master Samples",
  },
  {
    path: "ppap16p",
    subtitle: "16. Checking Aids",
    description: (pa6) => `Checking Aids ${pa6} not available.`,
    footerText: (pa6) => `PPAP ${pa6} CHECKING AIDS`,
    fileNamePrefix: "16. Checking Aids",
  },
  {
    path: "ppap17p",
    subtitle: "17. Customer-Specific Requirements",
    description: (pa6) =>
      `Customer-Specific Requirements ${pa6} not required for annual validation.`,
    footerText: (pa6) => `PPAP ${pa6} CUSTOMER-SPECIFIC REQUIREMENTS`,
    fileNamePrefix: "17. Customer-Specific Requirements",
  },
  {
    path: "ppap17.07p",
    subtitle: "17. Customer-Specific Requirements",
    description: (pa6) =>
      `IATF 16949 certificated is uploaded and up-to-date in the DPS.`,
    footerText: (pa6) => `PPAP ${pa6} CUSTOMER-SPECIFIC REQUIREMENTS`,
    fileNamePrefix: "17.07 Customer-Specific Requirements",
  },
  {
    path: "ppap17.08p",
    subtitle: "17. Customer-Specific Requirements",
    description: (pa6) =>
      `CQI audits at the current revision are uploaded in the DPS`,
    footerText: (pa6) => `PPAP ${pa6} CUSTOMER-SPECIFIC REQUIREMENTS`,
    fileNamePrefix: "17.0 Customer-Specific Requirements",
  },
];

rutasPPAP.forEach(({ path: ruta, subtitle, description, footerText, fileNamePrefix }) => {
  router.get(`/${ruta}/:id`, async (req, res) => {
    try {
      const { id } = req.params;
      const pars = await Par.findById(id);
      const logoPath = path.join(__dirname, "../../public/images/ppap/image001.png");
      const logoBase64 = fs.readFileSync(logoPath, "base64");

      const html = await ejs.renderFile(
        path.join(__dirname, "../views/PPAP_Generic.ejs"),
        {
          pars,
          logoBase64,
          subtitle,
          description: description(pars.pa6),
          footerText: footerText(pars.pa6),
        }
      );

      const nombreArchivo = `${fileNamePrefix} ${pars.pa6 || "sin_nombre"}.pdf`;

      const browser = await puppeteer.launch();
      const page = await browser.newPage();
      await page.setContent(html, { waitUntil: "networkidle0" });

      const pdfBuffer = await page.pdf({
        format: "A4",
        printBackground: true,
      });

      await browser.close();

      res.set({
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${nombreArchivo}"`,
      });

      res.send(pdfBuffer);
    } catch (err) {
      console.error(`Error al generar PDF para ${ruta}:`, err);
      res.status(500).send("Error al generar el PDF.");
    }
  });
});


const User = require("../models/exps.js");
const Org = require("../models/orgs.js");
const Cus = require("../models/cust.js");
const Par = require("../models/part.js");
const Ope = require("../models/oper.js");
const Chr = require("../models/chrc.js");
const Fme = require("../models/Fmea.js");
const Pro = require("../models/proc.js");
const Pcp = require("../models/pcpr.js");
const Fmea = require("../models/Fmea.js");
const Ace = require("../models/ac.js");
const Actividad = require("../models/issues.js");
const mongoose = require("mongoose");
const Subgrupo = require('../models/Subgrupo');
const PcpMake = require('../models/pcpmake');

router.post('/pcp/guardar', async (req, res) => {
  try {
    const camposCaracteristicas = [
      'chr_peso',
      'chr_peak_1', 'chr_peak_2', 'chr_peak_3', 'chr_peak_4',
      'chr_peak_5', 'chr_peak_6', 'chr_peak_7', 'chr_peak_8',
      'chr_root_1', 'chr_root_2', 'chr_root_3', 'chr_root_4',
      'chr_root_5', 'chr_root_6', 'chr_root_7',
      'chr_falda_1', 'chr_falda_2', 'chr_cuello'
    ];

    const pcpData = { ...req.body };

    // Limpia strings vacíos
    Object.keys(pcpData).forEach(key => {
      if (pcpData[key] === '') pcpData[key] = null;
    });

    const nuevoPCP = new PcpMake(pcpData);
    await nuevoPCP.save();

    res.redirect('/pcp/lista'); // O a donde desees redirigir tras guardar
  } catch (error) {
    console.error('Error al guardar PCP:', error);
    res.status(500).send('Error al guardar PCP. Por favor, revisa los datos ingresados.');
  }
});


router.get('/pcpmake', async (req, res) => {
  const partes = await Par.find();
  const caracteristicas = await Chr.find(); // usado para obtener ch3, ch4, etc.
  const opcionesCh3 = await Chr.find({}, { ch3: 1 }).lean();

  res.render('pcpmake', { partes, caracteristicas, opcionesCh3 });
});

router.get('/pcp/lista', async (req, res) => {
  try {
    const registros = await PcpMake.find().lean(); // sin populate
    res.render('pcplist', { registros });
  } catch (error) {
    console.error('Error al obtener la lista:', error);
    res.status(500).send('Error al obtener PCPs.');
  }
});

router.get('/pcpedit/:id', async (req, res) => {
  try {
    const registro = await PcpMake.findById(req.params.id).lean();
    if (!registro) return res.status(404).send('Registro no encontrado');

    // Obtener listas para selects
    const partes = await Par.find().lean();
    const opcionesCh3 = await Chr.find({}, { ch3: 1 }).lean();
    const caracteristicas = await Chr.find(); 

    res.render('pcpmedit', { registro, partes, opcionesCh3, caracteristicas });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al cargar la página de edición');
  }
});

router.post('/pcp/editar/:id', async (req, res) => {
  try {
    const id = req.params.id;

    // Copia los datos enviados
    const pcpData = { ...req.body };

    // Convierte strings vacíos a null
    const camposChr = [
      'chr_peso',
      'chr_falda_1', 'chr_falda_2',
      'chr_cuello',
      ...Array.from({ length: 8 }, (_, i) => `chr_peak_${i + 1}`),
      ...Array.from({ length: 7 }, (_, i) => `chr_root_${i + 1}`)
    ];

    camposChr.forEach(field => {
      if (pcpData[field] === '') pcpData[field] = null;
    });

    // Actualiza el registro
    await PcpMake.findByIdAndUpdate(id, pcpData);

    res.redirect('/pcp/lista');
  } catch (error) {
    console.error('Error al editar PCP:', error);
    res.status(500).send('Error al editar PCP');
  }
});


router.post('/pcpdelete/:id', async (req, res) => {
  try {
    await PcpMake.findByIdAndDelete(req.params.id);
    res.redirect('/pcp/lista');
  } catch (error) {
    console.error(error);
    res.status(500).send("Error al eliminar el registro");
  }
});

router.get('/pcpexcel/:id', async (req, res) => {
  try {
    const registro = await PcpMake.findById(req.params.id).lean();
    res.render('pcpexcel', { registro });
  } catch (error) {
    console.error('Error al generar Excel-view:', error);
    res.status(500).send('Error al generar vista para Excel');
  }
});

router.get('/pcp1', async (req, res) => {
  try {
    // Obtener todos los números de parte y versiones (sin duplicados)
    const pcpList = await PcpMake.find({}, 'pa6 pa7').lean();
    res.render('pcp1', { pcpList, pcpData: null, controlPlan: [] });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error del servidor');
  }
});

// Ruta para mostrar PCP seleccionado
router.post('/pcp1', async (req, res) => {
  try {
    const { pa6, pa7 } = req.body;
    const pcpData = await PcpMake.findOne({ pa6, pa7 }).lean();
    if (!pcpData) {
      return res.send('No se encontró el PCP para los datos seleccionados.');
    }

    const controlPlan = [
      { proceso: 'Peso', caracteristica: pcpData.chr_peso, metodo: 'Balanza', frecuencia: 'Cada lote' },
      { proceso: 'Peak 1', caracteristica: pcpData.chr_peak_1, metodo: 'Inspección Visual', frecuencia: 'Cada hora' },
      { proceso: 'Root 1', caracteristica: pcpData.chr_root_1, metodo: 'Calibrador', frecuencia: 'Cada cambio de turno' },
      { proceso: 'Falda 1', caracteristica: pcpData.chr_falda_1, metodo: 'Regla', frecuencia: 'Cada lote' },
    ];

    // Volver a enviar lista de PCP para el menú
    const pcpList = await PcpMake.find({}, 'pa6 pa7').lean();

    res.render('pcp1', { pcpList, pcpData, controlPlan });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error del servidor');
  }
});

router.get('/pcp2/:id', async (req, res) => {
  try {
    const registro = await PcpMake.findById(req.params.id).lean();
    if (!registro) return res.status(404).send('Registro no encontrado');

    res.render('pcp2', { registro });
  } catch (error) {
    console.error('Error al cargar el PCP2:', error);
    res.status(500).send('Error al cargar PCP2');
  }
});

router.get('/show1', async (req, res) => {
  const { pa6, pa7 } = req.query;

  const partes = await Subgrupo.find().select('pa6 pa7');
  let subgrupos = [];
  let datosIndividuales = [];

  if (pa6) {
    let filtro = { pa6 };
    if (pa7 && pa7 !== 'N/A') {
      filtro.pa7 = pa7;
    } else if (pa7 === 'N/A') {
      filtro.pa7 = null;
    }

    subgrupos = await Subgrupo.find(filtro).sort({ fecha: 1 });
    datosIndividuales = subgrupos.flatMap(sg => sg.muestras);
  }

  res.render('ajuste', {
    partes,
    pa6,
    pa7,
    datosIndividuales
  });
});

router.post('/subgrupo/importar2', async (req, res) => {
  try {
    const { pa6, pa7, datos } = req.body;

    const lineas = datos.trim().split('\n');

    let columnaUnica = [];

    for (let linea of lineas) {
      const valores = linea.trim().split('\t').map(Number).filter(v => !isNaN(v));

      if (valores.length === 0) continue;

      if (valores.length === 1) {
        // Si es una sola columna, acumulamos
        columnaUnica.push(valores[0]);
      } else {
        // Validar que el subgrupo tenga 5 muestras
        if (valores.length === 5) {
          await Subgrupo.create({
            pa6,
            pa7,
            muestras: valores
          });
        }
      }
    }

    // Procesar columna única en grupos de 5
    for (let i = 0; i < columnaUnica.length; i += 5) {
      const grupo = columnaUnica.slice(i, i + 5);
      if (grupo.length === 5) {
        await Subgrupo.create({
          pa6,
          pa7,
          muestras: grupo
        });
      }
    }

    res.redirect('/sorpresa');
  } catch (error) {
    console.error('Error al importar subgrupos:', error);
    res.status(500).send('Error al importar subgrupos.');
  }
});


// Funciones auxiliares
function promedio(arr) {
  return arr.reduce((a, b) => a + b, 0) / arr.length;
}

function rango(arr) {
  return Math.max(...arr) - Math.min(...arr);
}

// 📄 Vista para formulario
router.get('/subgrupo/nuevo', async (req, res) => {
  const partes = await Par.find({ pa6: { $ne: "" } });
  res.render('formulario', { partes });
});

router.post('/subgrupo/nuevo', async (req, res) => {
  const muestras = [
    parseFloat(req.body.muestra1),
    parseFloat(req.body.muestra2),
    parseFloat(req.body.muestra3),
    parseFloat(req.body.muestra4),
    parseFloat(req.body.muestra5)
  ];

  const nuevo = new Subgrupo({
    muestras,
    pa6: req.body.pa6,
    pa7: req.body.pa7
  });

  await nuevo.save();
  res.redirect('/subgrupos');
});


// 💾 Guardar nuevo subgrupo
router.post('/subgrupo', async (req, res) => {
  try {
    const muestras = [
      parseFloat(req.body.muestra1),
      parseFloat(req.body.muestra2),
      parseFloat(req.body.muestra3),
      parseFloat(req.body.muestra4),
      parseFloat(req.body.muestra5)
    ];

    const nuevo = new Subgrupo({
      muestras,
      parte: req.body.parteId
    });

    await nuevo.save();
    res.redirect('/subgrupos');
  } catch (err) {
    console.error(err);
    res.status(500).send("Error al guardar el subgrupo.");
  }
});


// 📥 Vista de importar
router.get('/subgrupo/importar', async (req, res) => {
  const partes = await Par.find({ pa6: { $ne: "" } });
  res.render('importar', { partes });
});


// 📤 Procesar importación
router.post('/subgrupo/importar', async (req, res) => {
  try {
    const { datos, pa6, pa7 } = req.body;

    if (!datos || !pa6 || !pa7) {
      console.error("Faltan campos: datos, pa6 o pa7.");
      return res.status(400).send("Faltan campos requeridos.");
    }

    const lineas = datos.trim().split('\n');
    const subgrupos = [];

    lineas.forEach((linea, i) => {
      const columnas = linea.trim().split('\t');
      const muestras = columnas.slice(1).map(Number);
      if (muestras.length === 5 && muestras.every(n => !isNaN(n))) {
        subgrupos.push({ muestras, pa6, pa7 });
      } else {
        console.warn(`Línea ${i + 1} ignorada: inválida`);
      }
    });

    if (subgrupos.length > 0) {
      await Subgrupo.insertMany(subgrupos);
      console.log(`Insertados ${subgrupos.length} subgrupos.`);
    } else {
      console.warn("Ningún subgrupo válido encontrado.");
    }

    res.redirect('/subgrupos');
  } catch (error) {
    console.error("Error en importación masiva:", error);
    res.status(500).send("Error al importar.");
  }
});



// 📊 Vista de gráfico X̄-R

function promedio(array) {
  return array.reduce((sum, val) => sum + val, 0) / array.length;
}

function rango(array) {
  return Math.max(...array) - Math.min(...array);
}

router.get('/grafico', async (req, res) => {
  try {
    const { pa6, pa7 } = req.query;

    // Traer todos los pares pa6 / pa7 únicos
    const partes = await Subgrupo.aggregate([
      {
        $group: {
          _id: { pa6: "$pa6", pa7: "$pa7" }
        }
      },
      {
        $project: {
          _id: 0,
          pa6: "$_id.pa6",
          pa7: "$_id.pa7"
        }
      }
    ]);

    // Construir filtro dinámico si se seleccionaron valores
    const filtro = {};
    if (pa6) filtro.pa6 = pa6;
    if (pa7) filtro.pa7 = pa7;

    const subgrupos = await Subgrupo.find(filtro).sort({ fecha: 1 });

    let promedios = [];
    let rangos = [];
    let limites = null;

    if (subgrupos.length > 0) {
      promedios = subgrupos.map(sg => promedio(sg.muestras));
      rangos = subgrupos.map(sg => rango(sg.muestras));

      const xBarra = promedio(promedios);
      const rPromedio = promedio(rangos);

      const A2 = 0.577; // n = 5
      const D3 = 0;
      const D4 = 2.114;

      limites = {
        x: {
          central: xBarra,
          superior: xBarra + A2 * rPromedio,
          inferior: xBarra - A2 * rPromedio
        },
        r: {
          central: rPromedio,
          superior: D4 * rPromedio,
          inferior: D3 * rPromedio
        }
      };
    }

    res.render('grafico', {
      promedios,
      rangos,
      limites,
      partes,
      pa6,
      pa7
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error al generar el gráfico');
  }
});

router.get('/grafico2', async (req, res) => {
  try {
    const { pa6, pa7 } = req.query;
    const partes = await Subgrupo.find(); // Para llenar los selects

    if (!pa6 || !pa7) {
      return res.render('grafico2', {
        partes,
        pa6,
        pa7,
        datosIndividuales: [],
        rangosMoviles: [],
        limites: {},
        reglasVioladas: [],
        estadisticas: null
      });
    }

    // Obtener subgrupos para el número de parte y versión seleccionados
    const subgrupos = await Subgrupo.find({ 'pa6': pa6, 'pa7': pa7 });

    const datosIndividuales = subgrupos.flatMap(sg => sg.muestras || []);

    if (datosIndividuales.length === 0) {
      return res.render('grafico2', {
        partes,
        pa6,
        pa7,
        datosIndividuales: [],
        rangosMoviles: [],
        limites: {},
        reglasVioladas: [],
        estadisticas: null
      });
    }

    // Calcular rangos móviles
    const rangosMoviles = [];
    for (let i = 1; i < datosIndividuales.length; i++) {
      rangosMoviles.push(Math.abs(datosIndividuales[i] - datosIndividuales[i - 1]));
    }

    // Calcular límites de control
    const mediaI = datosIndividuales.reduce((a, b) => a + b, 0) / datosIndividuales.length;
    const promedioMR = rangosMoviles.reduce((a, b) => a + b, 0) / rangosMoviles.length;
    const d2 = 1.128; // para n=2

    const sigma = promedioMR / d2;

    const limites = {
      i: {
        central: mediaI,
        superior: mediaI + 3 * sigma,
        inferior: mediaI - 3 * sigma
      },
      mr: {
        central: promedioMR,
        superior: promedioMR * 3.267,
        inferior: 0
      }
    };

    // Evaluar reglas de control
    const reglasVioladas = Array(datosIndividuales.length).fill(0);

    // Regla 1: Punto fuera de límites
    datosIndividuales.forEach((valor, i) => {
      if (valor > limites.i.superior || valor < limites.i.inferior) {
        reglasVioladas[i] = 1;
      }
    });

    // Regla 2: 7 puntos consecutivos del mismo lado de la media
    let count = 0;
    let ladoAnterior = null;
    for (let i = 0; i < datosIndividuales.length; i++) {
      const actualLado = datosIndividuales[i] > mediaI ? 'arriba' : 'abajo';
      if (actualLado === ladoAnterior) {
        count++;
        if (count >= 6) {
          for (let j = i - 6; j <= i; j++) reglasVioladas[j] = 2;
        }
      } else {
        count = 0;
      }
      ladoAnterior = actualLado;
    }

    // Regla 3: 14 puntos alternando lados
    let alternancia = 0;
    for (let i = 1; i < datosIndividuales.length; i++) {
      const ladoActual = datosIndividuales[i] > mediaI ? 'arriba' : 'abajo';
      const ladoPrevio = datosIndividuales[i - 1] > mediaI ? 'arriba' : 'abajo';
      if (ladoActual !== ladoPrevio) {
        alternancia++;
        if (alternancia >= 13) {
          for (let j = i - 13; j <= i; j++) reglasVioladas[j] = 3;
        }
      } else {
        alternancia = 0;
      }
    }

    // Cálculo de estadísticas generales
    const especSuperior = limites.i.superior;
    const especInferior = limites.i.inferior;

    const desviacion = sigma;
    const cpk = Math.min(
      (especSuperior - mediaI) / (3 * desviacion),
      (mediaI - especInferior) / (3 * desviacion)
    );

    const ppk = Math.min(
      (especSuperior - mediaI) / (3 * desviacion),
      (mediaI - especInferior) / (3 * desviacion)
    );

    const estadisticas = {
      media: mediaI,
      lsc: especSuperior,
      lic: especInferior,
      desviacion,
      cpk,
      ppk
    };

    
    res.render('grafico2', {
      partes,
      pa6,
      pa7,
      datosIndividuales,
      rangosMoviles,
      limites,
      reglasVioladas,
      estadisticas
    });

  } catch (error) {
    console.error('Error al generar gráfico:', error);
    res.status(500).send('Error interno del servidor.');
  }
});

router.get('/subgrupos', async (req, res) => {
  const subgrupos = await Subgrupo.find().populate('parte').sort({ fecha: 1 });
  res.render('listaSubgrupos', { subgrupos });
});


router.get('/show', async (req, res) => {
  const { pa6, pa7 } = req.query;

  const partes = await Subgrupo.find().select('pa6 pa7'); // o el modelo que estés usando para partes
  let subgrupos = [];
  let datosIndividuales = [];

  if (pa6) {
    let filtro = { pa6 };
    if (pa7 && pa7 !== 'N/A') {
      filtro.pa7 = pa7;
    } else if (pa7 === 'N/A') {
      filtro.pa7 = null;
    }

    subgrupos = await Subgrupo.find(filtro).sort({ fecha: 1 });

    // Obtener datos individuales desagrupados
    datosIndividuales = subgrupos.flatMap(sg => sg.muestras);
  }

  res.render('show', {
    partes,
    pa6,
    pa7,
    subgrupos,
    datosIndividuales
  });
});



// Ruta GET que muestra la vista sort.ejs con los datos ordenados
router.get('/sort', (req, res) => {
  const datosOrdenados = req.session.datosOrdenados || [];
  res.render('sort', { datosIndividuales: datosOrdenados });
});

router.post('/sort', (req, res) => {
  try {
    let datos = req.body.datos;

    if (typeof datos === 'string') {
      datos = JSON.parse(datos);
    }

    if (!Array.isArray(datos)) {
      throw new Error('Formato incorrecto');
    }

    res.render('sort', { datosIndividuales: datos });
  } catch (error) {
    console.error('Error procesando los datos:', error);
    res.status(400).send('Error procesando los datos.');
  }
});

// Función para barajar un arreglo (Fisher–Yates shuffle)
function shuffle(array) {
  let currentIndex = array.length;
  let temporaryValue, randomIndex;

  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // Intercambia elementos
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

// Ruta para mostrar los datos reorganizados
router.post('/parimpar', (req, res) => {
  const datosOrdenados = JSON.parse(req.body.datosOrdenados || '[]');

  // 1. Separar en pares e impares por índice
  const pares = [];
  const impares = [];

  datosOrdenados.forEach((valor, index) => {
    if (index % 2 === 0) {
      pares.push(valor);
    } else {
      impares.push(valor);
    }
  });

  // 2. Barajar cada grupo
  const paresAleatorios = shuffle(pares);
  const imparesAleatorios = shuffle(impares);

  // 3. Combinar los datos en el nuevo patrón: 2 impares, 3 pares, 3 impares, 2 pares
  const combinados = [];
  let impIndex = 0;
  let parIndex = 0;
  let paso = 0;

  while (impIndex < imparesAleatorios.length || parIndex < paresAleatorios.length) {
    switch (paso % 4) {
      case 0: // 2 impares
        combinados.push(...imparesAleatorios.slice(impIndex, impIndex + 1));
        impIndex += 1;
        break;
      case 1: // 3 pares
        combinados.push(...paresAleatorios.slice(parIndex, parIndex + 2));
        parIndex += 2;
        break;
      case 2: // 3 impares
        combinados.push(...imparesAleatorios.slice(impIndex, impIndex + 2));
        impIndex += 2;
        break;
      case 3: // 2 pares
        combinados.push(...paresAleatorios.slice(parIndex, parIndex + 1));
        parIndex += 1;
        break;
    }
    paso++;
  }

  res.render('parimpar', { listaFinal: combinados });
});

router.post('/parimpar1', (req, res) => {
  const datosOrdenados = JSON.parse(req.body.datosOrdenados || '[]');

  // 1. Separar en pares e impares por índice
  const pares = [];
  const impares = [];

  datosOrdenados.forEach((valor, index) => {
    if (index % 2 === 0) {
      pares.push(valor);
    } else {
      impares.push(valor);
    }
  });

  // 2. Barajar cada grupo
  const paresAleatorios = shuffle(pares);
  const imparesAleatorios = shuffle(impares);

  // 3. Combinar los datos en el nuevo patrón: 2 impares, 3 pares, 3 impares, 2 pares
  const combinados = [];
let impIndex = 0;
let parIndex = 0;

while (impIndex < imparesAleatorios.length || parIndex < paresAleatorios.length) {
  // Agregar uno de los impares si quedan
  if (impIndex < imparesAleatorios.length) {
    combinados.push(imparesAleatorios[impIndex]);
    impIndex++;
  }

  // Agregar uno de los pares si quedan
  if (parIndex < paresAleatorios.length) {
    combinados.push(paresAleatorios[parIndex]);
    parIndex++;
  }
}
  res.render('parimpar', { listaFinal: combinados });
});


// Recibir en random

router.post('/random', (req, res) => {
  try {
    const datosPares = JSON.parse(req.body.datosPares);
    const datosImpares = JSON.parse(req.body.datosImpares);

    res.render('random', {
      datosPares,
      datosImpares
    });
  } catch (error) {
    res.status(400).send('Error al procesar los datos aleatorios.');
  }
});


// Ruta siguiente (ejemplo: guardar en la base de datos, enviar a análisis, etc.)
router.post('/procesar-final', async (req, res) => {
  const datosOrdenados = req.session.datosOrdenados || [];

  // Aquí podrías hacer algo con los datos ordenados, por ejemplo:
  // - Guardarlos como un nuevo documento
  // - Asociarlos a un proceso de análisis
  // - Exportarlos

  // Por ahora solo mostramos un mensaje
  res.send(`Procesados ${datosOrdenados.length} datos ordenados correctamente.`);
});



// 📋 Ver todos los subgrupos
router.get('/subgrupos', async (req, res) => {
  const subgrupos = await Subgrupo.find().populate('parte').sort({ fecha: 1 });
  res.render('listaSubgrupos', { subgrupos });
});


// ✏️ Formulario de edición
router.get('/subgrupo/:id/editar', async (req, res) => {
  const subgrupo = await Subgrupo.findById(req.params.id);
  res.render('editarSubgrupo', { subgrupo });
});

// 💾 Guardar edición
router.post('/subgrupo/:id', async (req, res) => {
  const { pa6, pa7 } = req.body;
  const muestras = [
    parseFloat(req.body.muestra1),
    parseFloat(req.body.muestra2),
    parseFloat(req.body.muestra3),
    parseFloat(req.body.muestra4),
    parseFloat(req.body.muestra5)
  ];

  try {
    await Subgrupo.findByIdAndUpdate(req.params.id, {
      pa6,
      pa7,
      muestras
    });

    res.redirect('/subgrupos'); // o a donde lo necesites redirigir
  } catch (err) {
    console.error(err);
    res.status(500).send('Error al actualizar el subgrupo');
  }
});

// 🗑️ Eliminar subgrupo
router.post('/subgrupo/:id/eliminar', async (req, res) => {
  await Subgrupo.findByIdAndDelete(req.params.id);
  res.redirect('/subgrupos');
});

// 🔍 Ver un subgrupo individual (IMPORTANTE: debe ir al final)
router.get('/subgrupo/:id', async (req, res) => {
  const subgrupo = await Subgrupo.findById(req.params.id);
  res.render('show', { subgrupo });
});

router.get('/exportar', async (req, res) => {
  const datos = await Subgrupo.find();

  // Extraer valores únicos para las listas
  const partesUnicas = [...new Set(datos.map(d => d.pa6))].map(pa6 => ({ pa6 }));
  const versionesUnicas = [...new Set(datos.map(d => d.pa7))].map(pa7 => ({ pa7 }));

  res.render('exportar', {
    partes: partesUnicas,
    versiones: versionesUnicas,
    filtrados: null
  });
});

// POST - Procesar selección y mostrar resultados
router.post('/exportar', async (req, res) => {
  const { pa6, pa7 } = req.body;

  const datos = await Subgrupo.find();
  const partesUnicas = [...new Set(datos.map(d => d.pa6))].map(pa6 => ({ pa6 }));
  const versionesUnicas = [...new Set(datos.map(d => d.pa7))].map(pa7 => ({ pa7 }));

  const filtrados = await Subgrupo.find({ pa6, pa7 });

  res.render('exportar', {
    partes: partesUnicas,
    versiones: versionesUnicas,
    filtrados,
    pa6,
    pa7
  });
});

const ExcelJS = require('exceljs');

// Exportar a Excel
router.post('/exportar/excel', async (req, res) => {
  const { pa6, pa7 } = req.body;
  const datos = await Subgrupo.find({ pa6, pa7 });

  // Reunir todas las muestras en un solo arreglo
  let todasMuestras = [];
  datos.forEach(doc => {
    todasMuestras.push(...doc.muestras);
  });

  // Crear libro Excel
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Muestras');

  // Encabezado
  worksheet.addRow(['Muestra']);

  // Agregar muestras como filas
  todasMuestras.forEach(valor => {
    worksheet.addRow([valor]);
  });

  // Nombre del archivo
  const filename = `08 initial study${pa6}${pa7}.xls`;

  // Enviar archivo como descarga
  res.setHeader(
    'Content-Disposition',
    `attachment; filename="${filename}"`
  );
  res.setHeader(
    'Content-Type',
    'application/vnd.ms-excel'
  );

  await workbook.xlsx.write(res);
  res.end();
});


// Ruta modificada
router.post('/db/submit', async (req, res) => {
        
    if (!req.body || !req.body.db1) {
        console.error("Datos faltantes:", {
            body: req.body,
            headers: req.headers
        });
        return res.status(400).json({ 
            success: false, 
            message: "Datos incompletos" 
        });
    }
    const URI = `mongodb+srv://${req.body.db1}:JLqfp91zOg8yjP2A@cluster0.lnpsbzn.mongodb.net/rapqp2?retryWrites=true&w=majority`;
         
    try {
        await mongoose.connect(URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            connectTimeoutMS: 1200000  
        });
        res.json({ success: true });
    } catch (error) {
        console.error("Error MongoDB:", error);
        res.status(500).json({ 
            success: false, 
            message: error.message 
        });
    }
});



  router.post('/db/submit1', async (req, res) => {
    const { selectedUserId, bd2 } = req.body; // Obtener el _id del usuario seleccionado y la contraseña
    console.log('ID del usuario seleccionado:', selectedUserId); // Verificar el valor

    try {
        // Buscar el usuario en la base de datos por su _id
        const user = await User.findById(selectedUserId);
        const cust = await Cus.find();
        const users = await User.find();
        console.log('Usuario encontrado:', user); // Verificar el usuario encontrado

        if (user && user.us3 === bd2) {
            // Si el usuario existe y la contraseña coincide, renderizar la vista commercial1.ejs
            res.render('commercial1', {users, cust});
        } else {
            // Si no coincide, enviar un mensaje de contraseña incorrecta
            res.status(401).send('Contraseña incorrecta');
        }
    } catch (error) {
        res.status(500).send('Error al buscar el usuario');
    }
});

  router.get('/', (req, res, next) =>
    {
            res.render('home', { dbConnectedAt: Date.now() });
    });

router.get("/us", async (req, res) =>
{
    const users = await User.find();
    
    res.render("home", {users});
});

router.get("/db", async (req, res) =>
{
    const users = await User.find();
    
    res.render("users", {users});
});

router.get("/edit/:id", async (req, res) =>
{
    const {id} = req.params;
    const user = await User.findById(id);
    res.render("edit", {user});
});

router.get("/pro/view/:id", async (req, res) =>
{
    const {id} = req.params;
    const procs = await Pro.findById(id);
    res.render("proviewer", {procs});
});

router.get("/org/:id", async (req, res) => {
    const { id } = req.params;
    const orgs = await Org.findById(id);
    res.render("org", {id: id});
    
});

router.post("/org/submit", async (req, res) =>
{   
    const orgs = new Org(req.body);
    await orgs.save();
    res.redirect("/org");
});

router.get("/org", async (req, res) =>
{
    const orgs = await Org.find();
    console.log(orgs);
    res.render("orgs", {orgs});
});

router.get("/org/edit/:id", async (req, res) =>
{
    const {id} = req.params;
    const orgs = await Org.findById(id);
    res.render("orgedit", {orgs});
});

router.get("/org/delete/:id", async (req, res) =>
{
    const {id} = req.params;
    const orgs = await Org.deleteOne({_id: id});
    res.redirect("/org");
});

router.get("/cust/:id", async (req, res) => {
    const { id } = req.params;
    const org= await Org.findById(id);
    res.render("cust", {org});
});

router.post("/cust/submit", async (req, res) =>
{   
    const cust = new Cus(req.body);
    await cust.save();
    res.redirect("/cust");

});

router.get("/cust", async (req, res) =>
{
    const cust = await Cus.find();
    const users = await User.find();
    console.log(cust);
    res.render("commercial", {users, cust});
});

router.get("/cust1", async (req, res) =>
    {
        const cust = await Cus.find();
        const users = await User.find();
        console.log(cust);
        res.render("commercial1", {users, cust});
    });



router.post("/submit", async (req, res) =>
{   
    const user = new User(req.body);
    await user.save();
    res.redirect("/db");
});

router.get("/submit", async (req, res) => {
    try {
        const users = await User.find(); // Cambiado a "users" porque devuelve un arreglo
        console.log(users);

        // Puedes mostrar un mensaje especial si está vacío
        if (users.length === 0) {
            return res.render("user", { user: null, message: "No hay usuarios registrados." });
        }

        res.render("user", { user: users, message: null });
    } catch (error) {
        console.error("Error al obtener usuarios:", error);
        res.status(500).send("Error del servidor");
    }
});




router.get("/cust/edit/:id", async (req, res) =>
{
    const {id} = req.params;
    const cust = await Cus.findById(id);
    res.render("custedit", {cust});
});

router.get("/cus/delete/:id", async (req, res) =>
{
    const {id} = req.params;
    const cust = await Cus.deleteOne({_id: id});
    res.redirect("/cust/");
});


router.post("/cus/update/:id", async (req, res) =>
{
    const {id} = req.params;
    await Cus.updateOne({_id: id}, req.body);
    res.redirect("/cust");
});


router.post("/org/update/:id", async (req, res) =>
{
    const {id} = req.params;
    await Org.updateOne({_id: id}, req.body);
    res.redirect("/org");
});

router.post("/update/:id", async (req, res) =>
{
    const {id} = req.params;
    await User.updateOne({_id: id}, req.body);
    res.redirect("/db");
});

router.get("/dup/:id", async (req, res) =>
{
    const {id} = req.params;
    const user = await User.findById(id);
    res.render("userdup", {user});
});

router.post("/dup/:id", async (req, res) =>
{
    const {id} = req.params;
    await User.updateOne({_id: id}, req.body);
    res.redirect("/db");
});

router.get("/fme/dup/:id", async (req, res) =>
    {
        const {id} = req.params;
        const fmeas = await Fmea.findById(id);
        res.render("fmeadup", {fmeas});
    });
    
    router.post("/fme/dup/:id", async (req, res) =>
    {
        const {id} = req.params;
        await Fmea.updateOne({_id: id}, req.body);
        res.redirect("/db");
    });

router.get("/delete/:id", async (req, res) =>
{
    const {id} = req.params;
    const user = await User.deleteOne({_id: id});
    res.redirect("/db");
});

router.get("/par", async (req, res) =>
{
    const pars = await Par.find();
    console.log(pars);
    res.render("parts", {pars});
});

router.post("/par/submit", async (req, res) =>
{   console.log(new Par(req.body));
    const custs = new Par(req.body);
    await custs.save();
    res.redirect("/par/");
});

router.post("/par/update/:id", async (req, res) =>
{
    const {id} = req.params;
    await Par.updateOne({_id: id}, req.body);
    res.redirect("/par");
});

router.get("/par/edit/:id", async (req, res) =>
{
    const {id} = req.params;
    const pars = await Par.findById(id);
    res.render("partedit", {pars});
});

router.get("/par/delete/:id", async (req, res) =>
{
    const {id} = req.params;
    const pars = await Par.deleteOne({_id: id});
    res.redirect("/par/");
});

router.get("/par/:id", async (req, res) => {
    const { id } = req.params;
    const cus = await Cus.findById(id);
    res.render("part", {cus});
    
});

router.get("/ope", async (req, res) =>
{
    const opes = await Ope.find();
    console.log(opes);
    res.render("opers", {opes});
});

router.get("/flowchart/:cu1", async (req, res) =>
{   const { cu1 } = req.params;
    const opes = await Ope.find({cu1});
    console.log(opes);
    res.render("flowchart2", {opes});
});





router.get("/pcpview/:pc10", async (req, res) => {
    try {
        let page = parseInt(req.query.page) || 1; // Página actual, por defecto 1
        let limit = 9; // Número de registros por página
        let skip = (page - 1) * limit;

        const totalRecords = await Pcp.countDocuments(); // Total de registros
               const pcps = await Pcp.find().skip(skip).limit(limit); // Consulta con paginación
console.log(pcps)
        res.render("PCP", {
            pcps,
            page,
            totalPages: Math.ceil(totalRecords / limit) // Total de páginas
        });

    } catch (error) {
        console.error("Error al obtener los datos:", error);
        res.status(500).send("Error al obtener los registros");
    }
});

router.get("/fmea", async (req, res) => {
    try {
        let page = parseInt(req.query.page) || 1; // Página actual, por defecto 1
        let limit = 9; // Número de registros por página
        let skip = (page - 1) * limit;

        const totalRecords = await Fmea.countDocuments(); // Total de registros
               const fmeas = await Fmea.find().skip(skip).limit(limit); // Consulta con paginación

        res.render("fmeaprint", {
            fmeas,
            page,
            totalPages: Math.ceil(totalRecords / limit) // Total de páginas
        });

    } catch (error) {
        console.error("Error al obtener los datos:", error);
        res.status(500).send("Error al obtener los registros");
    }
});




router.get("/psw/:id", async (req, res) =>
{   const { id } = req.params;
    const pars = await Par.findById(id);
    console.log(pars);
    res.render("psw2", {pars});
});

router.get("/acep/:id", async (req, res) => {
    try {
        const { id } = req.params;

        // Verificar si el ID es un ObjectId válido de MongoDB
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).send("ID no válido");
        }

        const acs = await Ace.findById(id);

        // Si no encuentra el documento, responder con un 404
        if (!acs) {
            return res.status(404).send("Registro no encontrado");
        }

        console.log("Registro encontrado:", acs);
        res.render("acprint", { acs });
    } catch (error) {
        console.error("Error al buscar el registro:", error);
        res.status(500).send("Error en el servidor");
    }
});

router.post("/ope/submit", async (req, res) =>
{   console.log(new Ope(req.body));
    const parts = new Ope(req.body);
    await parts.save();
    res.redirect("/ope/");
});

router.post("/ope/update/:id", async (req, res) =>
{
    const {id} = req.params;
    await Ope.updateOne({_id: id}, req.body);
    res.redirect("/ope");
});

router.get("/ope/edit/:id", async (req, res) =>
{
    const {id} = req.params;
    const opes = await Ope.findById(id);
    res.render("operedit", {opes});
});

router.get("/ope/edit/f/:id", async (req, res) =>
{
    const {id} = req.params;
    const opes = await Ope.findById(id);
    res.render("flowchart", {opes});
});

router.get("/ope/delete/:id", async (req, res) =>
{
    const {id} = req.params;
    const opes = await Ope.deleteOne({_id: id});
    res.redirect("/ope/");
});

router.get("/ope/:id", async (req, res) => {
    const { id } = req.params;
    const par = await Par.findById(id);
    res.render("oper", {par});
});

router.get("/chr", async (req, res) =>
{
    const chrc = await Chr.find();
    console.log(chrc);
    res.render("chrcs", {chrc});
});

router.post("/chr/submit", async (req, res) =>
{   console.log(new Chr(req.body));
    const chrcs = new Chr(req.body);
    await chrcs.save();
    res.redirect("/chr/");
});

router.post("/chr/update/:id", async (req, res) =>
{
    const {id} = req.params;
    await Chr.updateOne({_id: id}, req.body);
    res.redirect("/chr");
});

router.get("/chr/edit/:id", async (req, res) =>
{
    const {id} = req.params;
    const chrs = await Chr.findById(id);
    res.render("chrcedit", {chrs});
});

router.get("/chr/delete/:id", async (req, res) =>
{
    const {id} = req.params;
    const chrs = await Chr.deleteOne({_id: id});
    res.redirect("/chr/");
});

router.get("/chr/:id", async (req, res) => {
    const { id } = req.params;
    const ope = await Ope.findById(id);
    res.render("chrc", {ope});
    
});

router.get("/fme", async (req, res) =>
{
    const fmeas = await Fme.find();
    
    res.render("fmeas", {fmeas});
});

router.post("/fme/submit", async (req, res) =>
{   console.log(new Fme(req.body));
    const fmeas = new Fme(req.body);
    await fmeas.save();
    res.redirect("/fme/");
});

router.post("/fme/update/:id", async (req, res) =>
{
    const {id} = req.params;
    await Fme.updateOne({_id: id}, req.body);
    res.redirect("/fme");
});

router.get("/fme/edit/:id", async (req, res) =>
{
    const {id} = req.params;
    const fmeas = await Fme.findById(id);
    res.render("fmeaedit", {fmeas});
});

router.get("/fme/delete/:id", async (req, res) =>
{
    const {id} = req.params;
    const fmeas = await Fme.deleteOne({_id: id});
    res.redirect("/fme/");
});

router.get("/fme/:id", async (req, res) => {
    const { id } = req.params;
    const par = await Par.findById(id);
    const fme = await Chr.findById(id);
    const ope = await Ope.findById(id);
    res.render("fmea", {par, ope, fme});
    
});

router.get("/ppap2/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const pars = await Par.findById(id);

    // Leer y codificar el logo como base64
    const logoPath = path.join(__dirname, "../public/images/ppap/image001.png");
    const logoBase64 = fs.readFileSync(logoPath, "base64");

    res.render("PPAP02", {
      pars,
      logoBase64
    });
  } catch (err) {
    console.error("Error al renderizar PPAP02:", err);
    res.status(500).send("Error al generar el reporte.");
  }
});

router.get("/ppap3/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const pars = await Par.findById(id);

    // Leer y codificar el logo como base64
    const logoPath = path.join(__dirname, "../../public/images/ppap/image001.png");
    const logoBase64 = fs.readFileSync(logoPath, "base64");

    res.render("PPAP03", {
      pars,
      logoBase64
    });
  } catch (err) {
    console.error("Error al renderizar PPAP03:", err);
    res.status(500).send("Error al generar el reporte.");
  }
});


router.get("/ppap4/:id", async (req, res) => {
    const { id } = req.params;
    const pars = await Par.findById(id);
    res.render("PPAP04", {pars});
    
});

router.get("/ppap8/:id", async (req, res) => {
    const { id } = req.params;
    const pars = await Par.findById(id);
    res.render("PPAP08", {pars});
    
});

router.get("/ppap13/:id", async (req, res) => {
    const { id } = req.params;
    const pars = await Par.findById(id);
    res.render("PPAP13", {pars});
    
});

router.get("/ppap14/:id", async (req, res) => {
    const { id } = req.params;
    const pars = await Par.findById(id);
    res.render("PPAP14", {pars});
    
});

router.get("/ppap15/:id", async (req, res) => {
    const { id } = req.params;
    const pars = await Par.findById(id);
    res.render("PPAP15", {pars});
    
});

router.get("/ppap16/:id", async (req, res) => {
    const { id } = req.params;
    const pars = await Par.findById(id);
    res.render("PPAP16", {pars});
    
});

router.get("/ppap17/:id", async (req, res) => {
    const { id } = req.params;
    const pars = await Par.findById(id);
    res.render("PPAP17", {pars});
    
});


// router.get('/signup', (req, res, next) => {
//     res.render('signup');
//   });
  
//   router.post('/signup', passport.authenticate('local-signup', {
//     successRedirect: '/profile',
//     failureRedirect: '/signup',
//     failureFlash: true
//   })); 
  
//   router.get('/signin', (req, res, next) => {
//     res.render('signin');
//   });
  
  
//   router.post('/signin', passport.authenticate('local-signin', {
//     successRedirect: '/profile',
//     failureRedirect: '/signin',
//     failureFlash: true
//   }));
  
//   router.get('/profile',isAuthenticated, (req, res, next) => {
//     res.render('user');
//   });
  
//   router.get('/logout', (req, res, next) => {
//     req.logout((err) => {
//         if (err) {
//           return next(err);
//         }
//     res.redirect('/signin');
//   });
// });
  
  
//   function isAuthenticated(req, res, next) {
//     if(req.isAuthenticated()) {
//       return next();
//     }
  
//     res.redirect('/signin')
//   }


  router.get("/pro", async (req, res) => {
    const procs = await Pro.find();
    console.log(procs);
    res.render("procs", { procs });
});

router.post("/pro/submit", async (req, res) => {
    console.log(new Pro(req.body));
    const procs = new Pro(req.body);
    await procs.save();
    res.redirect("/pro/");
});

router.post("/pro/update/:id", async (req, res) => {
    const { id } = req.params;
    await Pro.updateOne({ _id: id }, req.body);
    res.redirect("/pro");
});

router.get("/pro/edit/:id", async (req, res) => {
    const { id } = req.params;
    const procs = await Pro.findById(id);
    res.render("procedit", { procs });
});

router.get("/pro/delete/:id", async (req, res) => {
    const { id } = req.params;
    const procs = await Pro.deleteOne({ _id: id });
    res.redirect("/pro/");
});

router.get("/pro/:id", async (req, res) => {
    const { id } = req.params;
    const pro = await Org.findById(id);
    res.render("proc", { pro });
});

router.get("/pcp", async (req, res) => {
    const pcps = await Pcp.find();
    res.render("pcprs", { pcps });
});

router.get("/ace", async (req, res) => {
    try {
        const acs = await Ace.find(); // Obtener datos de la base de datos
        console.log(acs)
        res.render("acs", { acs }); // Enviar datos a la vista
    } catch (error) {
        console.error("Error al obtener datos:", error);
        res.render("ac", { acs: [] }); // En caso de error, evitar que falle la vista
    }
});

// Procesar formulario y guardar en la base de datos
router.post("/ace/submit", async (req, res) => {
    try {
        const newAcs = new Ace(req.body);
        await newAcs.save();
        res.redirect("/sorpresa"); // Redirigir a la vista para ver los datos guardados
    } catch (error) {
        console.error("Error al guardar datos:", error);
        res.status(500).send("Error al guardar los datos.");
    }
});

router.get('/sorpresa', (req, res) => {
    res.render('sorpresa');
});


router.post("/pcp/submit", async (req, res) => {
    console.log(new Pcp(req.body));
    const pcps = new Pcp(req.body);
    await pcps.save();
    res.redirect("/pcp/");
});


router.post("/pcp/update/:id", async (req, res) => {
    const { id } = req.params;
    await Pcp.updateOne({ _id: id }, req.body);
    res.redirect("/pcp");
});

router.get("/pcp/edit/:id", async (req, res) => {
    const { id } = req.params;
    const pcps = await Pcp.findById(id);
    res.render("pcpredit", { pcps });
});

router.get("/ace/edit/:id", async (req, res) => {
    const { id } = req.params;
    const acs = await Ace.findById(id);
    res.render("Acedit", { acs });
});

router.post("/ace/update/:id", async (req, res) => {
    const { id } = req.params;
    await Ace.updateOne({ _id: id }, req.body);
    res.redirect("/ace");
});

router.get("/ace/delete/:id", async (req, res) => {
    const { id } = req.params;
    const acs = await Ace.deleteOne({ _id: id });
    res.redirect("/ace/");
});

router.get("/pcp/delete/:id", async (req, res) => {
    const { id } = req.params;
    const pcps = await Pcp.deleteOne({ _id: id });
    res.redirect("/pcp/");
});

router.get("/pcp/:id", async (req, res) => {
    const { id } = req.params;
    const pcps = await Chr.findById(id);
    res.render("pcpr", { pcps });
});


router.get('/sev', (req, res) => {
    const datosFMEA = [
      {
        puntaje: 10,
        efectoProducto: "Falla en cumplir requisitos de seguridad y/o regulaciones (sin alerta)",
        efectoPlanta: "Puede causar riesgos al operador y ocurre sin alerta"
      },
      {
        puntaje: 9,
        efectoProducto: "Falla en cumplir requisitos de seguridad y/o regulaciones (con alerta)",
        efectoPlanta: "Puede causar riesgos al operador y ocurre con alerta"
      },
      {
        puntaje: 8,
        efectoProducto: "Pérdida de la función primaria (vehículo inoperante sin afectar la seguridad)",
        efectoPlanta: "Descontinuidad mayor: 100% del producto podría ser descartado. Parada de línea"
      },
      {
        puntaje: 7,
        efectoProducto: "Degradación de la función primaria (vehículo operante con rendimiento reducido)",
        efectoPlanta: "Descontinuidad significativa: Parte del lote puede ser descartado"
      },
      {
        puntaje: 6,
        efectoProducto: "Pérdida de función secundaria (vehículo operante, pero ítems de confort inoperantes)",
        efectoPlanta: "Descontinuidad moderada: 100% del lote puede necesitar retrabajo"
      },
      {
        puntaje: 5,
        efectoProducto: "Degradación de función secundaria (rendimiento reducido en ítems de confort)",
        efectoPlanta: "Descontinuidad moderada: parte del lote puede requerir retrabajo"
      },
      {
        puntaje: 4,
        efectoProducto: "Ítem de apariencia o ruido percibido por mayoría (>75%) de clientes",
        efectoPlanta: "Descontinuidad moderada: retrabajo antes del procesamiento"
      },
      {
        puntaje: 3,
        efectoProducto: "Ítem de apariencia o ruido percibido por muchos (≈50%) clientes",
        efectoPlanta: "Descontinuidad moderada: retrabajo parcial antes del procesamiento"
      },
      {
        puntaje: 2,
        efectoProducto: "Ítem de apariencia o ruido percibido por minoría (<25%) de clientes",
        efectoPlanta: "Descontinuidad menor: leve inconveniente para el proceso"
      },
      {
        puntaje: 1,
        efectoProducto: "Sin efectos perceptibles",
        efectoPlanta: "Sin efectos perceptibles"
      }
    ];
  
    res.render('severidad', { datosFMEA });
  });
  
  router.get('/ocu', (req, res) => {
    const datosOcurrencia = [
      {
        puntaje: 10,
        probabilidad: "Muy Alta",
        ocurrencia: "≥ 100 por mil (≥ 1 en 10)"
      },
      {
        puntaje: 9,
        probabilidad: "Alta",
        ocurrencia: "50 por mil (1 en 20)"
      },
      {
        puntaje: 8,
        probabilidad: "Alta",
        ocurrencia: "20 por mil (1 en 50)"
      },
      {
        puntaje: 7,
        probabilidad: "Alta",
        ocurrencia: "10 por mil (1 en 100)"
      },
      {
        puntaje: 6,
        probabilidad: "Moderada",
        ocurrencia: "2 por mil (1 en 500)"
      },
      {
        puntaje: 5,
        probabilidad: "Moderada",
        ocurrencia: "0.5 por mil (1 en 2,000)"
      },
      {
        puntaje: 4,
        probabilidad: "Moderada",
        ocurrencia: "0.1 por mil (1 en 10,000)"
      },
      {
        puntaje: 3,
        probabilidad: "Baja",
        ocurrencia: "0.01 por mil (1 en 100,000)"
      },
      {
        puntaje: 2,
        probabilidad: "Baja",
        ocurrencia: "≤ 0.001 por mil (1 en 1,000,000)"
      },
      {
        puntaje: 1,
        probabilidad: "Muy Baja",
        ocurrencia: "Falla eliminada mediante control preventivo"
      }
    ];
  
    res.render('ocurrencia', { datosOcurrencia });
  });
  
  router.get('/det', (req, res) => {
    const datosDeteccion = [
      {
        puntaje: 10,
        oportunidad: "No hay oportunidad de detección",
        control: "No existe control del proceso; el control no puede detectar o no es analizado.",
        probabilidad: "Casi imposible"
      },
      {
        puntaje: 9,
        oportunidad: "Detección improbable en cualquier etapa",
        control: "Modo de falla o causa difícil de detectar; controles indirectos o aleatorios.",
        probabilidad: "Muy remota"
      },
      {
        puntaje: 8,
        oportunidad: "Detección después del proceso",
        control: "Por operador mediante inspección visual, táctil o auditiva.",
        probabilidad: "Remota"
      },
      {
        puntaje: 7,
        oportunidad: "Detección del problema en su origen",
        control: "Por operador en estación o después del proceso con medición atributiva (pasa/no pasa).",
        probabilidad: "Muy baja"
      },
      {
        puntaje: 6,
        oportunidad: "Detección después del proceso",
        control: "Por operador usando medición variable o verificación manual (torquímetro, etc.).",
        probabilidad: "Baja"
      },
      {
        puntaje: 5,
        oportunidad: "Detección del problema en su origen",
        control: "Por operador o control automatizado con alarma; incluye mediciones en set-up o primera pieza.",
        probabilidad: "Moderada"
      },
      {
        puntaje: 4,
        oportunidad: "Detección después del proceso",
        control: "Por control automatizado que detecta y retiene automáticamente la pieza defectuosa.",
        probabilidad: "Moderadamente alta"
      },
      {
        puntaje: 3,
        oportunidad: "Detección del problema en su origen",
        control: "Control automatizado que detecta y retiene automáticamente la pieza defectuosa.",
        probabilidad: "Alta"
      },
      {
        puntaje: 2,
        oportunidad: "Detección del error y/o prevención del problema",
        control: "Control automatizado que detecta el error y evita procesar piezas defectuosas.",
        probabilidad: "Muy alta"
      },
      {
        puntaje: 1,
        oportunidad: "No aplica detección; prevención del error",
        control: "Prevención por diseño del proceso/producto con dispositivos a prueba de fallos.",
        probabilidad: "Casi garantizada"
      }
    ];
  
    res.render('deteccion', { datosDeteccion });
  });

  router.get('/sevi', (req, res) => {
    const datosFMEA = [
      {
        puntaje: 10,
        efectoProducto: "Fails to meet safety and/or regulatory requirements (without warning)",
        efectoPlanta: "May pose risks to the operator and occurs without warning"
      },
      {
        puntaje: 9,
        efectoProducto: "Fails to meet safety and/or regulatory requirements (with warning)",
        efectoPlanta: "May pose risks to the operator and occurs with warning"
      },
      {
        puntaje: 8,
        efectoProducto: "Loss of primary function (vehicle inoperative, but no safety impact)",
        efectoPlanta: "Major disruption: 100% of the product could be scrapped. Line stoppage"
      },
      {
        puntaje: 7,
        efectoProducto: "Degradation of primary function (vehicle operates with reduced performance)",
        efectoPlanta: "Significant disruption: Part of the batch may be scrapped"
      },
      {
        puntaje: 6,
        efectoProducto: "Loss of secondary function (vehicle operates, but comfort items are inoperative)",
        efectoPlanta: "Moderate disruption: 100% of the batch may require rework"
      },
      {
        puntaje: 5,
        efectoProducto: "Degradation of secondary function (reduced performance in comfort items)",
        efectoPlanta: "Moderate disruption: Part of the batch may require rework"
      },
      {
        puntaje: 4,
        efectoProducto: "Appearance issue or noise perceived by the majority (>75%) of customers",
        efectoPlanta: "Moderate disruption: Rework before processing"
      },
      {
        puntaje: 3,
        efectoProducto: "Appearance issue or noise perceived by many (~50%) customers",
        efectoPlanta: "Moderate disruption: Partial rework before processing"
      },
      {
        puntaje: 2,
        efectoProducto: "Appearance issue or noise perceived by a minority (<25%) of customers",
        efectoPlanta: "Minor disruption: Slight inconvenience to the process"
      },
      {
        puntaje: 1,
        efectoProducto: "No noticeable effects",
        efectoPlanta: "No noticeable effects"
      }
    ];
  
    res.render('severity', { datosFMEA });
  });

  router.get('/ocui', (req, res) => {
    const datosOcurrencia = [
      {
        puntaje: 10,
        probabilidad: "Very High",
        ocurrencia: "More than 1 in 2"
      },
      {
        puntaje: 9,
        probabilidad: "Very High",
        ocurrencia: "1 in 3"
      },
      {
        puntaje: 8,
        probabilidad: "High",
        ocurrencia: "1 in 8"
      },
      {
        puntaje: 7,
        probabilidad: "Moderately High",
        ocurrencia: "1 in 20"
      },
      {
        puntaje: 6,
        probabilidad: "Moderate",
        ocurrencia: "1 in 80"
      },
      {
        puntaje: 5,
        probabilidad: "Low",
        ocurrencia: "1 in 400"
      },
      {
        puntaje: 4,
        probabilidad: "Very Low",
        ocurrencia: "1 in 2,000"
      },
      {
        puntaje: 3,
        probabilidad: "Remote",
        ocurrencia: "1 in 15,000"
      },
      {
        puntaje: 2,
        probabilidad: "Very Remote",
        ocurrencia: "1 in 150,000"
      },
      {
        puntaje: 1,
        probabilidad: "Almost Impossible",
        ocurrencia: "1 in 1,500,000"
      }
    ];
  
    res.render('ocurrence', { datosOcurrencia });
  });
  
  router.get('/deti', (req, res) => {
    const datosDeteccion = [
      {
        puntaje: 10,
        oportunidad: "No opportunity for detection",
        descripcion: "No process control; Control cannot detect or is not analyzed",
        probabilidad: "Almost Impossible"
      },
      {
        puntaje: 9,
        oportunidad: "Detection unlikely at any stage",
        descripcion: "Failure mode or cause is not easily detected; indirect/random checks",
        probabilidad: "Very Remote"
      },
      {
        puntaje: 8,
        oportunidad: "Detection after process",
        descripcion: "Detected by operator using visual/tactile/auditory means after process",
        probabilidad: "Remote"
      },
      {
        puntaje: 7,
        oportunidad: "Detection at source",
        descripcion: "Detected at station by operator (visual/tactile/auditory) or after process by attribute checks",
        probabilidad: "Very Low"
      },
      {
        puntaje: 6,
        oportunidad: "Detection after process",
        descripcion: "Detected by operator using variable measurement after process or attribute check at station",
        probabilidad: "Low"
      },
      {
        puntaje: 5,
        oportunidad: "Detection at source",
        descripcion: "Detected at station by operator (variable check) or automated alert (light/alarm); includes setup or first-piece inspection",
        probabilidad: "Moderate"
      },
      {
        puntaje: 4,
        oportunidad: "Detection after process",
        descripcion: "Detected by automated control after process, which retains defective part automatically",
        probabilidad: "Moderately High"
      },
      {
        puntaje: 3,
        oportunidad: "Detection at source",
        descripcion: "Detected by automated control at station and retained automatically to stop processing",
        probabilidad: "High"
      },
      {
        puntaje: 2,
        oportunidad: "Error detection and/or prevention",
        descripcion: "Detected by automated control at station that prevents processing of defective parts",
        probabilidad: "Very High"
      },
      {
        puntaje: 1,
        oportunidad: "Detection not applicable; Error prevention",
        descripcion: "Error prevention due to design features; defects cannot be produced thanks to error-proof devices",
        probabilidad: "Almost Certain"
      }
    ];
  
    res.render('detection', { datosDeteccion });
  });
  
  // GET /actividades/:id/editar
router.get('/actividades/:id/editar', async (req, res) => {
    const actividad = await Actividad.findById(req.params.id);
    res.render('formularioEditar', { actividad });
  });
  

  // DELETE /actividades/:id
router.delete('/actividades/:id', async (req, res) => {
    await Actividad.findByIdAndDelete(req.params.id);
    res.redirect('/actividades');
  });
  
  // PUT /actividades/:id
router.put('/actividades/:id', async (req, res) => {
    await Actividad.findByIdAndUpdate(req.params.id, req.body);
    res.redirect('/actividades');
  });

  router.post('/actividades', async (req, res) => {
    try {
      const nuevaActividad = new Actividad({
        indice: req.body.indice,
        actividad: req.body.actividad,
        responsable: req.body.responsable,
        inicio: req.body.inicio,
        plazo: req.body.plazo,
        dias: req.body.dias,
        porcentajeConcluido: req.body.porcentajeConcluido,
        inicioReal: req.body.inicioReal,
        fin: req.body.fin,
        diasReal: req.body.diasReal,
        observaciones: req.body.observaciones,
        emailPara: req.body.emailPara,
        emailCC: req.body.emailCC,
        difDias: req.body.difDias
      });
  
      await nuevaActividad.save();
      res.redirect('/actividades'); // redirige a la lista o página de éxito
    } catch (error) {
      console.error(error);
      res.status(500).send("Error al guardar la actividad");
    }
  });

  router.get('/actividades', async (req, res) => {
    try {
      const actividades = await Actividad.find().sort({ indice: 1 }); // ordena por índice
      res.render('issues', { actividades });
    } catch (error) {
      console.error(error);
      res.status(500).send("Error al obtener las actividades");
    }
  });
  


// Exports
module.exports = router