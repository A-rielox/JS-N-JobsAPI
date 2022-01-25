const mongoose = require('mongoose');

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
      maxlength: 12,
   },
});

module.exports = mongoose.model('User', UserSchema);

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
