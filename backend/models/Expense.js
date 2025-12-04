const mongoose = require('mongoose')

const ExpenseSchema = new mongoose.Schema(
  {
    tipo: { type: String, enum: ['producto', 'servicio'], required: true },
    nombreProducto: { type: String },
    cantidad: { type: Number },
    precio: { type: Number },
    nombreServicio: { type: String }
  },
  { collection: 'gastos', versionKey: false, timestamps: false }
)

module.exports = mongoose.model('Expense', ExpenseSchema)
