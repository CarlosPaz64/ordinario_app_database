const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const pool = require('./database/database');
const registerRouter = require('./routes/register'); // Importa la ruta de registro

// Configura DotEnv
dotenv.config();

const app = express();

// Configuración de la plantilla Pug
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// Middleware para procesar archivos estáticos en la carpeta 'public'
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Rutas
app.use('/register', registerRouter); // Usa la ruta de registro

// Rutas existentes
app.get('/content', (req, res) => {
  res.render('content');
});

app.get('/login', (req, res) => {
  res.render('login');
});

app.get('/', (req, res) => {
  res.render('index');
});

// Manejo de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Algo salió mal');
});

// Puerto en el que escucha el servidor
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Servidor iniciado en http://localhost:${port}`);
});
