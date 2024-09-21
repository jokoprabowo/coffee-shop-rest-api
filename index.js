const app = require('./src/api/app');

app.listen(process.env.PORT, () => console.log(`Server is running on port: http://localhost:${process.env.PORT}`));