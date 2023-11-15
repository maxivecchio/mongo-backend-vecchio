const express = require('express');
const connectDB = require('./database');
const routerAPI = require('./routes');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT;

const whitelist = [
    'http://localhost:5173',
    'https://cambiar-moveup',
  ];
  
  const corsOptions = {
    origin: function (origin, callback) {
      if (whitelist.indexOf(origin) !== -1 || !origin) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS [Modified]'));
      }
    },
  };
  
  app.use(cors(corsOptions));

connectDB();

app.use(express.json());

routerAPI(app);

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
