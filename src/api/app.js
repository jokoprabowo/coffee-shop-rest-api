const express = require('express');
const cors = require('cors');
const app = express();

require('dotenv').config();

app.use(cors());
app.use(express.json());

const userRoute = require('./routers/userRoute');
const cookieRoute = require('./routers/cookieRoute');
const transactionRoute = require('./routers/transactionRoute');

app.use('/api/user', userRoute);
app.use('/api/cookie', cookieRoute);
app.use('/api/transaction', transactionRoute);

module.exports = app;