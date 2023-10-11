const express = require('express');
const connectDB = require('./database');
const routes = require('./routes');

const app = express();

// Conexión a la base de datos
connectDB();

// Middleware
app.use(express.json({ extended: false }));

// Definición de Rutas
app.use('/', routes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
