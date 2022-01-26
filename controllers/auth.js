// '/api/v1/auth'
const User = require('../models/User');
const { StatusCodes } = require('http-status-codes');
const { BadRequestError, UnauthenticatedError } = require('../errors');

const register = async (req, res) => {
   // console.log(req.body); { name: 'pepithor', email: 'sully@sully.com', password: 'maimlb2006' }
   // 💥

   // ===== creando usuario en DB, 1ro pasa x el mongoose middleware ".pre"
   const user = await User.create({ ...req.body });

   // ===== JWT
   // en lugar de hacerlo de esta forma, voy a generarle un método a la instancia ( q es como un método cualquiera "una fcn q va a tener la instancia del schema" ) para q "con ese método" sea la instancia la q cree el token. ( está en /models/User.js ), la ventaja es q toda la lógica va a quedar allá.
   // const token = jwt.sign({ userId: user._id, user: user.name }, 'jwtSecret', {
   //    expiresIn: '30d',
   // });
   const token = user.createJWT();

   // ===== respuesta al front
   res.status(StatusCodes.CREATED).json({ user: { name: user.name }, token });
};

const login = async (req, res) => {
   const { email, password } = req.body;

   if (!email || !password) {
      throw new BadRequestError('Please provide an email and password');
   }

   const user = await User.findOne({ email });

   if (!user) {
      throw new UnauthenticatedError('Invalid Credentials');
   }

   // con el middleware q yo cree
   const isPasswordCorrect = await user.comparePassword(password);

   if (!isPasswordCorrect) {
      throw new UnauthenticatedError('Invalid Credentials');
   }
   // compare password

   const token = user.createJWT();
   res.status(StatusCodes.OK).json({ user: { name: user.name }, token });
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
