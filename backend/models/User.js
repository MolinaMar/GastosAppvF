const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema(
  {
    nombre: { type: String },
    Apellidopaterno: { type: String },
    Apellidomaterno: { type: String },
    correo: { type: String },
    contrasena: { type: String },
    activo: { type: Boolean, default: true }
  },
  { timestamps: false, collection: 'usuarios', versionKey: false }
)



module.exports = mongoose.model('User', UserSchema)
