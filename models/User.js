const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
   name: {
      type: String,
      required: [true, 'Please provide a name'],
      minlength: 3,
      maxlength: 50,
   },
   email: {
      type: String,
      required: [true, 'Please provide an email'],
      match: [
         /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
         'Please provide a valid email',
      ],
      unique: true,
   },
   password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: 6,
   },
});

// ===== para tener hashiado el pass
// 🍑 usar fcn normal ( no arrow ) pa q el "this" apunte al UserSchema
UserSchema.pre('save', async function () {
   const salt = await bcrypt.genSalt(10);
   this.password = await bcrypt.hash(this.password, salt);
});

module.exports = mongoose.model('User', UserSchema);

//
// bcryptjs --> pa hacer el hashing del password

// match: RegExp, creates a validator that checks if the value matches the given regular expression

// unique
// Indexes
// You can also define MongoDB indexes using schema type options.
//
// index: boolean, whether to define an index on this property.
// unique: boolean, whether to define a unique index on this property.
// sparse: boolean, whether to define a sparse index on this property.
//
// const schema2 = new Schema({
//   test: {
//     type: String,
//     index: true,
//     unique: true // Unique index. If you specify `unique: true`
//     // specifying `index: true` is optional if you do `unique: true`
//   }
// });
// básicamente lo q va a hacer es q si estoy tratando de registrarme y el correo q pongo ya existe con alguien registrado => me da el mensaje de duplicado

//
// PARA UN MONGOOSE MIDDLEWARE
// en la documentacion en Middleware --> pre :
// Pre
// Pre middleware functions are executed one after another, when each middleware calls next.
//
// const schema = new Schema(..);
// schema.pre('save', function(next) {
//   // do stuff
//   next();
// });
//
// In mongoose 5.x, instead of calling next() manually, you can use a function that returns a promise. In particular, you can use async/await.
//
// schema.pre('save', function() {
//   return doStuff().
//     then(() => doMoreStuff());
// });
//
// // Or, in Node.js >= 7.6.0:
// schema.pre('save', async function() {
//   await doStuff();
//   await doMoreStuff();
// });
//
// If you use next(), the next() call does not stop the rest of the code in your middleware function from executing. Use the early return pattern to prevent the rest of your middleware function from running when you call next().
//
// const schema = new Schema(..);
// schema.pre('save', function(next) {
//   if (foo()) {
//     console.log('calling next!');
//     // `return next();` will make sure the rest of this function doesn't run
//     /*return*/ next();
//   }
//   // Unless you comment out the `return` above, 'after next' will print
//   console.log('after next');
// });
