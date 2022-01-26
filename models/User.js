const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

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
// 🍑, usar fcn normal ( no arrow ) pa q el "this" apunte al document
UserSchema.pre('save', async function () {
   const salt = await bcrypt.genSalt(10);
   this.password = await bcrypt.hash(this.password, salt);
});

// ⭐
UserSchema.methods.createJWT = function () {
   return jwt.sign(
      { userId: this._id, name: this.name },
      process.env.JWT_SECRET,
      {
         expiresIn: process.env.JWT_LIFETIME,
      }
   );
};

// instance method para comparar password hasheados
UserSchema.methods.comparePassword = async function (candidatePassword) {
   const isMatch = await bcrypt.compare(candidatePassword, this.password);

   return isMatch;
};

module.exports = mongoose.model('User', UserSchema);

//
// para el JWT_SECRET usar allkeysgenerator.com, en la pestaña de "encription key" con "security level" de 256-bit

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
// 🍑 PARA UN MONGOOSE MIDDLEWARE

// Types of Middleware
// Mongoose has 4 types of middleware: document middleware, model middleware, aggregate middleware, and query middleware. Document middleware is supported for the following document functions. In document middleware functions, ⭐this⭐ refers to the document.

// validate
// save
// remove
// updateOne
// deleteOne
// init (note: init hooks are synchronous)

// Note: The create() function fires save() hooks.

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

//
// ⭐ Instance methods
// Instances of Models are documents. Documents have many of their own built-in instance methods. We may also define our own custom document instance methods.

//   // define a schema
//   const animalSchema = new Schema({ name: String, type: String });

//   // assign a function to the "methods" object of our animalSchema
//   animalSchema.methods.findSimilarTypes = function(cb) {
//     return mongoose.model('Animal').find({ type: this.type }, cb);
//   };
// Now all of our animal instances have a findSimilarTypes method available to them.

//   const Animal = mongoose.model('Animal', animalSchema);
//   const dog = new Animal({ type: 'dog' });

//   dog.findSimilarTypes((err, dogs) => {
//     console.log(dogs); // woof
//   });
// Overwriting a default mongoose document method may lead to unpredictable results. See this for more details.
// The example above uses the Schema.methods object directly to save an instance method. You can also use the Schema.method() helper as described here.
// Do not declare methods using ES6 arrow functions (=>). Arrow functions explicitly prevent binding this, so your method will not have access to the document and the above examples will not work.
