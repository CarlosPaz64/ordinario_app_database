const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
dotenv.config();

async function comparePassword(passwordString, bdHash) {
    const compareHashes = await bcrypt.compare(passwordString, bdHash);
    return compareHashes;
}

function checkAuthenticated(req, res, next) {
    const token = req.cookies.jwt;
    console.log("El token de la sesión es: ", token);

    if (token) {
        // Envolver jwt.verify en una promesa
        new Promise((resolve, reject) => {
            jwt.verify(token, process.env.RSA_PRIVATE_KEY, (err, decoded) => {
                if (err) {
                    reject(err); // Rechazar la promesa si hay un error
                } else {
                    console.log('Token decodificado:', decoded); // Aquí imprimes el objeto decoded
                    resolve(decoded); // Resolver la promesa con el token decodificado
                }
            });
        })
        .then(decoded => {
            // Si el token es válido, continuar con el middleware
            req.session.userId = decoded.data.userId; // Establece el userId en req.session
            console.log('Usuario autenticado con JWT:', req.session.userId);
            next();
        })
        .catch(err => {
            console.log('JWT no válido:', err);
            // Si el token no es válido, redirigir al usuario a /usuarios/login
            res.redirect('/usuarios/login');
        });
    } else {
        console.log('Usuario no autenticado, redirigiendo a /login');
        // Redirigir al usuario al login si no hay token en las cookies
        res.redirect('/usuarios/login');
    }
}

// Función para proteger las vistas sin autenticación
function checkNotAuthenticated(req, res, next) {
    if (!req.session.userId && !req.userId) {
        console.log('Usuario no autenticado');
        return next();
    }
    console.log('Usuario ya autenticado, redirigiendo a /');
    res.redirect('/');
}

// Función que genera el token
function generateToken(data, expirationTime) {
    return jwt.sign({ data }, process.env.RSA_PRIVATE_KEY, { algorithm: 'RS256', expiresIn: expirationTime });
}


module.exports = {
    comparePassword,
    checkAuthenticated,
    checkNotAuthenticated,
    generateToken
};
