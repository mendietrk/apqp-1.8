const path = require("path");
const express = require("express");
const morgan = require("morgan");
const methodOverride = require("method-override");
const app = express();
const session = require('express-session');


// Configuración de vistas y archivos estáticos
app.set("port", process.env.PORT || 3000);
app.set("views", path.join(__dirname, "src/views"));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));

// Middleware global para evitar caché
app.use((req, res, next) => {
  res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, private");
  next();
});

// Middlewares principales
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));

// Agrega middleware de sesión
app.use(session({
  secret: 'tu_secreto_aqui',   // Cambia esto por un valor seguro en producción
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 24 * 60 * 60 * 1000 } // Cookie válida por 1 día
}));

// Middleware para inicializar y compartir dbConnectedAt
app.use((req, res, next) => {
  if (!req.session.dbConnectedAt) {
    req.session.dbConnectedAt = Date.now();
  }
  // Lo hacemos disponible en todas las vistas vía res.locals
  res.locals.dbConnectedAt = req.session.dbConnectedAt;
  next();
});

// Ruta raíz (home)
app.get('/', (req, res) => {
  // Ya no es necesario asignar dbConnectedAt aquí, se hace en el middleware
  res.render('home');  // res.locals.dbConnectedAt estará disponible en el header
});

// Rutas
const indexRoutes = require("./src/routes/index.js");
app.use("/", indexRoutes);
const chrcRoutes = require("./src/routes/chrcRoutes");
// (Registra también chrcRoutes si no lo has hecho aún)

// Inicio del servidor
app.listen(app.get("port"), () => {
  console.log("Server on port " + app.get("port"));
});

