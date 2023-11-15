const express = require('express');
const connectDB = require('./database');
const routerAPI = require('./routes');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT;
app.use(cors());

connectDB();

app.use(express.json());

routerAPI(app);

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
