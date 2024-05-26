const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const session = require('express-session');
const pool = require('./database/database'); // Importa la base de datos
const userModel = require('./models/userModel')
const registerRouter = require('./routes/register'); // Importa la ruta de registro
const loginRoute = require('./routes/login'); // Importa la ruta del login
const logoutRoute = require('./routes/logout'); // Importa la ruta de logout
const { checkAuthenticated, checkNotAuthenticated } = require('./checkAuthenticated/authMiddleware'); // Importa los middlewares

// Configura DotEnv
dotenv.config();

const app = express();

// Configuración de sesiones
app.use(session({
  secret: process.env.SECRET_SESSION,
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false } // Asegúrate de configurar esto en true en producción con HTTPS
}));

// Configuración de la plantilla Pug
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// Middleware para procesar archivos estáticos en la carpeta 'public'
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Rutas
app.use('/register', checkNotAuthenticated, registerRouter); // Usa la ruta de registro
app.use('/login', checkNotAuthenticated, loginRoute); // Usa la ruta del login
app.use('/logout', checkAuthenticated, logoutRoute); // Usa la ruta del logout

// Rutas existentes protegidas
app.get('/content', checkAuthenticated, (req, res) => {
    res.render('content');
});

app.get('/', checkAuthenticated, async (req, res) => {
  try {
      const user = await userModel.findUserById(req.session.userId); // Encuentra al usuario por su ID de sesión
      if (!user) {
          throw new Error('Usuario no encontrado');
      }
      res.render('index', { user }); // Renderiza la vista con el objeto de usuario
  } catch (error) {
      console.error(error);
      res.status(500).send('Error al cargar el dashboard');
  }
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
