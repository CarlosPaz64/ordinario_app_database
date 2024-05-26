// authMiddleware.js
function checkAuthenticated(req, res, next) {
    if (req.session.userId) {
        console.log('Usuario autenticado con ID:', req.session.userId);
        return next();
    }
    console.log('Usuario no autenticado, redirigiendo a /login');
    res.redirect('/login');
}

function checkNotAuthenticated(req, res, next) {
    if (!req.session.userId) { // Agregar el operador de negación aquí
        console.log('Usuario no autenticado');
        return next();
    }
    console.log('Usuario ya autenticado, redirigiendo a /');
    res.redirect('/');
}

module.exports = { checkAuthenticated, checkNotAuthenticated };
