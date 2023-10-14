const express = require('express');
const connectDB = require('./database');
const routerAPI = require('./routes');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT;

connectDB();

app.use(express.json());

routerAPI(app);

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
