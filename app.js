require('dotenv').config();
require('express-async-errors');
// extra security packages
const helmet = require('helmet');
const cors = require('cors');
const xss = require('xss-clean');
const rateLimiter = require('express-rate-limit');

const express = require('express');
const app = express();

// ===== DB
const connectDB = require('./db/connect');
const authenticateUser = require('./middleware/authentication');

// ===== routers
const authRouter = require('./routes/auth');
const jobsRouter = require('./routes/jobs');

// ===== error handler
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');

// @@@@@@@@@@@@@@@@@@@@ MIDDLEWARE
app.use(express.json()); // para req.body

// extra security packages
app.set('trust proxy', 1); // pa q funcione desde Heroku y lugares como esos (el rateLimiter)
app.use(
   rateLimiter({
      windowMs: 15 * 60 * 1000, // 15 mins
      max: 100, // limita cada IP a 100 request por windowMs
   })
);
app.use(helmet());
app.use(cors());
app.use(xss());

// ===== routes
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/jobs', authenticateUser, jobsRouter);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

// @@@@@@@@@@@@@@@@@@@@ APP LISTEN
const port = process.env.PORT || 3000;

const start = async () => {
   try {
      await connectDB(process.env.MONGO_URI);
      app.listen(port, () =>
         console.log(`Server is listening on port ${port}...👍`)
      );
   } catch (error) {
      console.log(error);
   }
};

start();
