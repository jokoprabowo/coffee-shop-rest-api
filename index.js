const express = require('express');
const cors = require('cors');
const app = express();

require('dotenv').config();

app.use(cors());
app.use(express.json());

const userRoute = require('./src/api/routers/userRoute');
const cookieRoute = require('./src/api/routers/cookieRoute');
const transactionRoute = require('./src/api/routers/transactionRoute');

app.use('/api/user', userRoute);
app.use('/api/cookie', cookieRoute);
app.use('/api/transaction', transactionRoute);

app.listen(process.env.PORT, () => console.log(`Server is running on port: http://localhost:${process.env.PORT}`));