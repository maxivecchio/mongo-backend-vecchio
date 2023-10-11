const express = require('express');
const connectDB = require('./database');
const routerAPI = require('./routes');

const app = express();
const PORT = 5000;

connectDB();

app.use(express.json());

routerAPI(app);

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
