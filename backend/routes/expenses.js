const express = require('express')
const GastoProducto = require('../models/GastoProducto')
const GastoServicio = require('../models/GastoServicio')

const router = express.Router()

router.post('/', async (req, res) => {
  try {
    const tipo = (req.body.tipo || '').trim()
    if (tipo !== 'producto' && tipo !== 'servicio') return res.status(400).json({ error: 'Tipo inválido' })
    const correo = (req.body.correo || '').trim().toLowerCase()
    if (!correo) return res.status(400).json({ error: 'Correo requerido' })

    if (tipo === 'producto') {
      const producto = (req.body.nombreProducto || req.body.producto || '').trim()
      const cantidad = Number(req.body.cantidad)
      const PrecioTotal = Number(req.body.precio ?? req.body.PrecioTotal)
      if (!producto || !cantidad || !PrecioTotal) return res.status(400).json({ error: 'Faltan campos de producto' })
      const doc = await GastoProducto.create({ correo, producto, cantidad, PrecioTotal })
      return res.status(201).json(doc)
    }

    if (tipo === 'servicio') {
      const servicio = (req.body.nombreServicio || req.body.servicio || '').trim()
      const PrecioTotal = Number(req.body.precio ?? req.body.PrecioTotal)
      if (!servicio || !PrecioTotal) return res.status(400).json({ error: 'Faltan campos de servicio' })
      const doc = await GastoServicio.create({ correo, servicio, PrecioTotal })
      return res.status(201).json(doc)
    }
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

router.get('/productos', async (req, res) => {
  try {
    const correo = (req.query.correo || '').trim().toLowerCase()
    const q = correo ? { correo } : {}
    const items = await GastoProducto.find(q).sort({ _id: -1 })
    res.json(items)
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

router.get('/servicios', async (req, res) => {
  try {
    const correo = (req.query.correo || '').trim().toLowerCase()
    const q = correo ? { correo } : {}
    const items = await GastoServicio.find(q).sort({ _id: -1 })
    res.json(items)
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

router.put('/productos/:id', async (req, res) => {
  try {
    const id = req.params.id
    const update = {}
    if (req.body.producto) update.producto = String(req.body.producto).trim()
    if (req.body.cantidad != null) update.cantidad = Number(req.body.cantidad)
    if (req.body.PrecioTotal != null) update.PrecioTotal = Number(req.body.PrecioTotal)
    const doc = await GastoProducto.findByIdAndUpdate(id, update, { new: true })
    if (!doc) return res.status(404).json({ error: 'No encontrado' })
    res.json(doc)
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

router.put('/servicios/:id', async (req, res) => {
  try {
    const id = req.params.id
    const update = {}
    if (req.body.servicio) update.servicio = String(req.body.servicio).trim()
    if (req.body.PrecioTotal != null) update.PrecioTotal = Number(req.body.PrecioTotal)
    const doc = await GastoServicio.findByIdAndUpdate(id, update, { new: true })
    if (!doc) return res.status(404).json({ error: 'No encontrado' })
    res.json(doc)
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

router.delete('/productos/:id', async (req, res) => {
  try {
    const id = req.params.id
    const r = await GastoProducto.deleteOne({ _id: id })
    res.json({ ok: true, deletedCount: r.deletedCount })
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

router.delete('/servicios/:id', async (req, res) => {
  try {
    const id = req.params.id
    const r = await GastoServicio.deleteOne({ _id: id })
    res.json({ ok: true, deletedCount: r.deletedCount })
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

module.exports = router
