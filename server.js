const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const passport = require('passport');
const routes = require('./routes/routes');
const LocalStrategy = require('passport-local').Strategy;
const userModel = require('./models/userModel') // Importa el modelo de los usuarios
const { checkAuthenticated, checkNotAuthenticated } = require('./checkAuthenticated/authMiddleware')


// Configura DotEnv
dotenv.config();

const app = express();

app.use(cookieParser()); // Llamada a cookie parser

// Configuración de sesiones
app.use(session({
  secret: process.env.SECRET_SESSION,
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false } // Asegúrate de configurar esto en true en producción con HTTPS
}));
app.use(passport.initialize());
app.use(passport.session());


passport.use(new LocalStrategy(async (correo, contrasenia, done) => {
  try {
      const user = await userModel.findUserByEmail(correo);
      if (!user) {
          return done(null, false, { message: 'Nombre de usuario incorrecto' });
      }
      const passwordMatch = await bcrypt.compare(contrasenia, user.contrasenia);
      if (!passwordMatch) {
          return done(null, false, { message: 'Contraseña incorrecta' });
      }
      return done(null, user);
  } catch (error) {
      return done(error);
  }
}));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
      const user = await userModel.findUserById(id);
      if (!user) {
          return done(new Error('Usuario no encontrado'));
      }
      return done(null, user);
  } catch (error) {
      return done(error);
  }
});

// Configuración de la plantilla Pug
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// Middleware para procesar archivos estáticos en la carpeta 'public'
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Rutas
app.use('/', routes);

// Rutas del inicio de la aplicación
app.get('/content', checkAuthenticated, async (req, res) => {
  const userId = req.session.userId;
  try {
      const tasks = await getTasksByUserId(userId);
      console.log("Tasks: ", tasks);
      res.render('content', { tasks });
  } catch (error) {
      console.error('Error al obtener las tareas:', error);
      res.render('content', { tasks: [], error: 'Error al obtener las tareas' });
  }
});

app.get('/', checkAuthenticated, async (req, res) => {
  try {
      const user = await userModel.findUserById(req.userId); // Encuentra al usuario por su ID de usuario decodificado del token JWT
      if (!user) {
          throw new Error('Usuario no encontrado');
      }

      // Obtén las tareas recientes y las tareas por estado
      const tasksByStatus = await getTasksByStatus(user.id);
      const recentTasks = await getRecentTasks(user.id);

      // Inicializa contadores
      let toDoCount = 0;
      let doingCount = 0;
      let doneCount = 0;

      // Cuenta las tareas por estado
      tasksByStatus.forEach(task => {
          if (task.estatus === 'To do') toDoCount = task.count;
          if (task.estatus === 'Doing') doingCount = task.count;
          if (task.estatus === 'Done') doneCount = task.count;
      });

      // Renderiza la vista con los datos obtenidos
      res.render('index', {
          user,
          toDoCount,
          doingCount,
          doneCount,
          recentTasks
      });
  } catch (error) {
      console.error(error);
      res.status(500).send('Error al cargar el dashboard');
  }
});


// Manejo de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Algo salió mal: ');
});

// Puerto en el que escucha el servidor
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Servidor iniciado en http://localhost:${port}`);
});
