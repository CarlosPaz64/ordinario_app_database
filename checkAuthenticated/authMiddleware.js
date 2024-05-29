const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

function checkAuthenticated(req, res, next) {
    if (req.session.userId) {
        console.log('Usuario autenticado con ID:', req.session.userId);
        return next();
    }

    const token = req.cookies.jwt;
    if (token) {
        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                console.log('JWT no válido, redirigiendo a /login');
                return res.redirect('/login');
            }
            req.user = decoded;
            req.session.userId = decoded.userId;
            console.log('Usuario autenticado con JWT:', decoded.userId);
            next();
        });
    } else {
        console.log('Usuario no autenticado, redirigiendo a /login');
        res.redirect('/login');
    }
}

function checkNotAuthenticated(req, res, next) {
    if (!req.session.userId) {
        console.log('Usuario no autenticado');
        return next();
    }
    console.log('Usuario ya autenticado, redirigiendo a /');
    res.redirect('/');
}

const lastServerRestartTime = Date.now();

function checkServerRestart(req, res, next) {
    if (req.session && req.session.loginTime) {
      if (req.session.loginTime < lastServerRestartTime) {
        console.log('Sesión creada antes del último reinicio del servidor, redirigiendo a /logout');
        return res.redirect('/logout');
      }
    }
    next();
  }
  

module.exports = { checkAuthenticated, checkNotAuthenticated, checkServerRestart };
