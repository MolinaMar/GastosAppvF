const mongoose = require('mongoose')

const connectDB = async () => {
  const uri = process.env.MONGO_URI
  if (!uri) {
    console.error('MONGO_URI is not set')
    process.exit(1)
  }
  try {
    await mongoose.connect(uri, { dbName: 'gastosdbv2' })
    console.log('MongoDB conectado a base de datos gastosdbv2')
  } catch (e) {
    console.error('Error conectando a MongoDB', e.message)
  }
}

module.exports = connectDB
