require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const app = express();
const PORT = process.env.PORT || 8080;

// Middlewares
app.use(cors());
 app.use(express.json());

// Conexión a MongoDB
connectDB();

// Rutas
app.use('/api/auth', require('./routes/auth'))
app.use('/api/expenses', require('./routes/expenses'))
app.get('/', (req, res) => {
  res.send('Backend funcionando correctamente')
})

// Healthcheck
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' })
})

// Iniciar servidor
app.listen(PORT, () => {
  console.log("Servidor corriendo en puerto " + PORT);
});
