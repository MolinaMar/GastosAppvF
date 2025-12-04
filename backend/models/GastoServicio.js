const mongoose = require('mongoose')

const GastoServicioSchema = new mongoose.Schema(
  {
    correo: { type: String, required: true },
    servicio: { type: String, required: true },
    PrecioTotal: { type: Number, required: true },
  },
  { collection: 'gastosServicios', versionKey: false, timestamps: false }
)

module.exports = mongoose.model('GastoServicio', GastoServicioSchema)
