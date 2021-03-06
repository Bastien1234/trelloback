const path = require('path');
const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const compression = require('compression');
const cors = require('cors');
const { createProxyMiddleware } = require("http-proxy-middleware");

const { message } = require('statuses');
const AppError = require('./AppError/appError');

// import routes
const userRouter = require('./routes/userRoutes');

const app = express();

app.enable('trust proxy');

app.use(cors());
app.options('*', cors());

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", '*');
  res.header("Access-Control-Allow-Credentials", true);
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header("Access-Control-Allow-Headers", 'Origin,X-Requested-With,Content-Type,Accept,content-type,application/json');
  next();
});

app.use(express.static(path.join(__dirname, './public')));

app.use(helmet());
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
};

const limiter = rateLimit({
    max: 100,
    windowMs: 60 * 60 * 1000,
    message: 'Too many requests for this IP, retry after one hour'
});

app.use('./api', limiter);


// Body parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

app.use(compression());

// Test middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  // console.log(req.cookies);
  next();
});

// Routes

app.use('/api/v1/users', userRouter);

// app.all('*', (req, res, next) => {
//     next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
// });

module.exports = app;