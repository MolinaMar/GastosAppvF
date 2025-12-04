const mongoose = require('mongoose')

const GastoProductoSchema = new mongoose.Schema(
  {
    correo: { type: String, required: true },
    producto: { type: String, required: true },
    cantidad: { type: Number, required: true },
    PrecioTotal: { type: Number, required: true },
  },
  { collection: 'gastosProductos', versionKey: false, timestamps: false }
)

module.exports = mongoose.model('GastoProducto', GastoProductoSchema)
