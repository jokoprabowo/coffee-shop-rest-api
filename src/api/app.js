const express = require('express');
const cors = require('cors');
const swaggerJSDoc = require('swagger-jsdoc')
const swaggerUi = require('swagger-ui-express')
const { options } = require('../docs/swagger')

const app = express();
const specs = swaggerJSDoc(options)
require('dotenv').config();


app.use(cors());
app.use(express.json());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs))

const userRoute = require('./routers/userRoute');
const cookieRoute = require('./routers/cookieRoute');
const transactionRoute = require('./routers/transactionRoute');

app.use('/api/user', userRoute);
app.use('/api/cookie', cookieRoute);
app.use('/api/transaction', transactionRoute);

module.exports = app;