const express = require('express');
const cors = require('cors');
const path = require('path');
const swaggerUi = require('swagger-ui-express');
const { logger } = require('./middlewares/logger');
const corsOptions = require('./config/corsOptions');
const errorHandler = require('./middlewares/errorHandler');

const app = express();
require('dotenv').config();
const swaggerDoc = require('../docs/swagger.json');

app.set('views', path.join(__dirname, '../public/views'));
app.use(express.static(path.join(__dirname, '../public')));
app.set('view engine', 'ejs');
app.use(cors(corsOptions));
app.use(logger);
app.use(express.json());
app.use(express.urlencoded({ extended: false }))
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDoc));
app.use(express.static('public'));

const userRoute = require('./routers/userRoute');
const cookieRoute = require('./routers/cookieRoute');
const transactionRoute = require('./routers/transactionRoute');

app.get('', (req, res) => {
  res.render('index');
})

app.use('/api/user', userRoute);
app.use('/api/cookie', cookieRoute);
app.use('/api/transaction', transactionRoute);
// app.use(errorHandler);

module.exports = app;
