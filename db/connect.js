const mongoose = require('mongoose');

const connectDB = url => {
   return mongoose.connect(url, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false,
      useUnifiedTopology: true,
   });
};

module.exports = connectDB;

// con mongoose 6 ya no se necesitan las configuraciones para quitar las deprecation warnings
