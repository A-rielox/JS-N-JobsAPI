// '/api/v1/auth'
const User = require('../models/User');
const { StatusCodes } = require('http-status-codes');
const jwt = require('jsonwebtoken');
// const { BadRequestError } = require('../errors');

const register = async (req, res) => {
   // console.log(req.body); { name: 'pepithor', email: 'sully@sully.com', password: 'maimlb2006' }
   // 💥

   // ===== creando usuario en DB, 1ro pasa x el mongoose middleware ".pre"
   const user = await User.create({ ...req.body });

   // ===== JWT
   const token = jwt.sign({ userId: user._id, user: user.name }, 'jwtSecret', {
      expiresIn: '30d',
   });

   // ===== respuesta al front
   res.status(StatusCodes.CREATED).json({ user: { name: user.name }, token });
};

const login = async (req, res) => {
   res.send('login user');
};

module.exports = { register, login };

//
// 💥 la validación antigua era:
// const { name, email, password } = req.body;
// if (!name || !email || !password) {
//    throw new BadRequestError('Please provide name, email and password');
// }
// en lugar de validar de esta forma voy a ocupar la validacón el schema que pone required en los tres campos

//
// recordar ( de proy task-manager )
// User --> es el modelo q provee la interfaz a la DB para hacer las CRUD , en este caso va a hacer un create, para esto va a acupar el schema del User, x eso, como el schema tiene name,email y user, es q hay q pasar estas, y procuramos q sean las q vienen en el req.body
