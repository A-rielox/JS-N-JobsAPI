const { StatusCodes } = require('http-status-codes');

const errorHandlerMiddleware = (err, req, res, next) => {
   // set default
   let customError = {
      statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
      msg: err.message || 'Something went wrong, please try again later',
   };

   // if (err instanceof CustomAPIError) {
   //    return res.status(err.statusCode).json({ msg: err.message });
   // }

   if (err.name === 'ValidationError') {
      customError.msg = Object.values(err.errors)
         .map(item => item.message)
         .join(',');
      customError.statusCode = 400;
   }

   if (err.code && err.code === 11000) {
      customError.msg = `Duplicate value entered for ${Object.keys(
         err.keyValue
      )} field, please choose another value`;
      customError.statusCode = 400;
   }

   if (err.name === 'CastError') {
      customError.msg = `No item found with id ${err.value}`;
      customError.statusCode = 404;
   }

   return res.status(customError.statusCode).json({ msg: customError.msg });
   // return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ err }); // el original q saltaba con los q tira mongoose
};

module.exports = errorHandlerMiddleware;

//
// ${err.keyValue} me daba [object Object], x eso Object.keys()

//
// lo q saltan "q no son" custom errors ( los q están fuera el if ) vienen de MongoDB, son por:
// -  Validation Errors
// -  Duplicate (Email)
// -  Cast Error (cuando intento crear un usuario con un email q ya tiene cuenta, p.e.), cuando paso un id en el url con parametros de + o - ( no coincide con el formato de id de DB )
// los q estan en el if() q checa si son instancias e CustomAPIError, son los q mando yo en los controladores, los otros, q manipulo aqui son los q manda mongoose, y lo hago para q sean mas "amigables"

//
// error.code#
// <string>
// The error.code property is a string label that identifies the kind of error. error.code is the most stable way to identify an error. It will only change between major versions of Node.js. In contrast, error.message strings may change between any versions of Node.js. See Node.js error codes for details about specific codes.

// "msg": "User validation failed: password: Please provide a password, email: Please provide an email"
