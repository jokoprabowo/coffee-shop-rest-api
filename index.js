const express = require('express');
const cors = require('cors');
const app = express();

require('dotenv').config();

app.use(cors());
app.use(express.json());

const userRouter = require('./src/api/routers/userRoute');

app.use('/api/user', userRouter);

app.listen(process.env.PORT, () => console.log(`Server is running on port: http://localhost:${process.env.PORT}`));