const express = require('express');
const path = require('path');
const dotenv = require('dotenv');

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

app.get('/register', (req, res) => {
    res.render('register');
  });

app.get('/login', (req, res) => {
  res.render('login');
});

app.get('/', (req, res) => {
    res.render('dashboard');
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
