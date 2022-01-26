const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { UnauthenticatedError } = require('../errors');

const auth = (req, res, next) => {
   // check header, 🔥
   const authHeader = req.headers.authorization;

   if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthenticatedError('Authentication invalid');
   }

   const token = authHeader.split(' ')[1];

   try {
      const payload = jwt.verify(token, process.env.JWT_SECRET);
      // creando user en el req
      req.user = { userId: payload.userId, name: payload.name };

      next();
   } catch (error) {
      throw new UnauthenticatedError('Authentication invalid');
   }
};

module.exports = auth;

// 🔥
// AQUI DEBE VENIR EL TOKEN Q ES DONDE ESTÁ ( CODIFICADO ) EL ID DEL USUARIO EN LA DB, y aquí si está todo bien => se crea el req.user y coloca ahí el id
