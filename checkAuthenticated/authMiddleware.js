const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const crypto = require('crypto');
const bcrypt = require('bcrypt');

dotenv.config();

function verificarToken(req, res, next) {
    const token = req.headers['authorization'] ? req.headers['authorization'].split(' ')[1] : null;

    if (!token) {
        return res.status(401).json({ mensaje: 'Token no proporcionado' });
    }

    jwt.verify(token, process.env.RSA_PRIVATE_KEY, { algorithm: 'RS256' }, (err, usuario) => {
        if (err) {
            return res.status(403).json({ mensaje: 'Token inválido' });
        }
        req.usuario = usuario;
        next();
    });
}

function verificarDatos(dataSegura) {
    let partes = dataSegura.split(',');
    let resultado = {};

    partes.forEach((parte, index) => {
        resultado[index === 0 ? 'nombre' : index === 1 && partes.length > 2 ? 'email' : 'password'] = decryptData(parte);
    });

    return resultado;
}

function decryptData(encryptedText) {
    const key = Buffer.from(process.env.AES_PRIVATE_KEY, 'hex');
    const [ivHex, authTagHex, encryptedHex] = encryptedText.split(':');
    const iv = Buffer.from(ivHex, 'hex');
    const authTag = Buffer.from(authTagHex, 'hex');
    const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv);
    decipher.setAuthTag(authTag);
    let decrypted = decipher.update(encryptedHex, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
}

async function comparePassword(passwordString, bdHash) {
    const compareHashes = await bcrypt.compare(passwordString, bdHash);
    return compareHashes;
}

function checkAuthenticated(req, res, next) {
    const token = req.cookies.jwt;

    if (token) {
        jwt.verify(token, process.env.RSA_PRIVATE_KEY, (err, decoded) => {
            if (err) {
                console.log('JWT no válido, redirigiendo a /login');
                return res.redirect('/login');
            }
            req.userId = decoded.userId;
            console.log('Usuario autenticado con JWT:', decoded.userId);
            next();
        });
    } else {
        console.log('Usuario no autenticado, redirigiendo a /login');
        res.redirect('usuarios/login');
    }
}

function checkNotAuthenticated(req, res, next) {
    if (!req.session.userId && !req.userId) {
        console.log('Usuario no autenticado');
        return next();
    }
    console.log('Usuario ya autenticado, redirigiendo a /');
    res.redirect('/');
}

function generateToken(data, expirationTime) {
    return jwt.sign({ data }, process.env.RSA_PRIVATE_KEY, { algorithm: 'RS256', expiresIn: expirationTime });
}

function encryptData(text) {
    const key = Buffer.from(process.env.AES_PRIVATE_KEY, 'hex');
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return iv.toString('hex') + ':' + cipher.getAuthTag().toString('hex') + ':' + encrypted;
}

async function getHash(passwordString) {
    const saltRounds = parseInt(process.env.PASSWORD_SALT_ROUNDS);
    const password_hash = await bcrypt.hash(passwordString, saltRounds);
    return password_hash;
}

module.exports = {
    verificarToken,
    verificarDatos,
    comparePassword,
    checkAuthenticated,
    checkNotAuthenticated,
    generateToken,
    encryptData,
    getHash
};
