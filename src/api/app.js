const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express')

const app = express();
require('dotenv').config();
const swaggerDoc = require('../docs/swagger.json')


app.use(cors());
app.use(express.json());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDoc))

const userRoute = require('./routers/userRoute');
const cookieRoute = require('./routers/cookieRoute');
const transactionRoute = require('./routers/transactionRoute');

app.use('/api/user', userRoute);
app.use('/api/cookie', cookieRoute);
app.use('/api/transaction', transactionRoute);

module.exports = app;