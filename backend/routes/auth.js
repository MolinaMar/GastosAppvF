const express = require('express')
const crypto = require('crypto')
const User = require('../models/User')

const router = express.Router()

// Utilidades de seguridad
function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex')
  const hash = crypto.scryptSync(password, salt, 64).toString('hex')
  return `${salt}:${hash}`
}

function verifyPassword(password, stored) {
  if (!stored) return false
  if (!stored.includes(':')) return password === stored
  const [salt, hash] = stored.split(':')
  const test = crypto.scryptSync(password, salt, 64).toString('hex')
  try {
    return crypto.timingSafeEqual(Buffer.from(hash, 'hex'), Buffer.from(test, 'hex'))
  } catch {
    return false
  }
}

// Rate limit básico por IP para mitigar fuerza bruta (5/min)
const hits = new Map()
function rateLimit(req, res, next) {
  const key = req.ip || req.headers['x-forwarded-for'] || 'unknown'
  const now = Date.now()
  const windowMs = 60_000
  const entry = hits.get(key) || { count: 0, start: now }
  if (now - entry.start > windowMs) {
    entry.count = 0
    entry.start = now
  }
  entry.count += 1
  hits.set(key, entry)
  if (entry.count > 5) {
    return res.status(429).json({ error: 'Demasiadas solicitudes, intenta más tarde' })
  }
  next()
}

router.post('/register', rateLimit, async (req, res) => {
  try {
    const nombre = (req.body.nombre || '').trim()
    const correo = (req.body.correo || '').trim().toLowerCase()
    const Apellidopaterno = (req.body.Apellidopaterno ?? req.body.apellidoPaterno ?? '').trim()
    const Apellidomaterno = (req.body.Apellidomaterno ?? req.body.apellidoMaterno ?? '').trim()
    const contrasena = (req.body.contrasena ?? req.body.contraseña ?? '').trim()
    if (!nombre || !Apellidopaterno || !Apellidomaterno || !correo || !contrasena) {
      return res.status(400).json({ error: 'Faltan campos requeridos' })
    }
    if (contrasena.length < 6) {
      return res.status(400).json({ error: 'La contraseña debe tener al menos 6 caracteres' })
    }

    const exists = await User.findOne({ correo })
    if (exists) return res.status(409).json({ error: 'El correo ya está registrado' })

    const contrasenaHasheada = hashPassword(contrasena)
    const user = await User.create({ nombre, Apellidopaterno, Apellidomaterno, correo, contrasena: contrasenaHasheada, activo: true })

    res.status(201).json({
      id: user._id,
      nombre: user.nombre,
      Apellidopaterno: user.Apellidopaterno,
      Apellidomaterno: user.Apellidomaterno,
      correo: user.correo,
      activo: user.activo
    })
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

router.post('/login', rateLimit, async (req, res) => {
  try {
    const correo = (req.body.correo || '').trim().toLowerCase()
    const contrasena = (req.body.contrasena ?? req.body.contraseña ?? '').trim()
    if (!correo || !contrasena) return res.status(400).json({ error: 'Correo y contraseña requeridos' })

    const user = await User.findOne({ correo })
    if (!user) return res.status(401).json({ error: 'Credenciales inválidas' })

    const ok = verifyPassword(contrasena, user.contrasena)
    if (!ok) return res.status(401).json({ error: 'Credenciales inválidas' })

    // Actualiza a hash si aún estaba en texto plano
    if (!String(user.contrasena).includes(':')) {
      const nueva = hashPassword(contrasena)
      await User.findByIdAndUpdate(user._id, { contrasena: nueva })
    }

    await User.findByIdAndUpdate(user._id, { activo: true })

    res.json({ ok: true, id: user._id, nombre: user.nombre, correo: user.correo, activo: true })
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

router.post('/logout', async (req, res) => {
  try {
    const id = (req.body.id || '').toString().trim()
    const correo = (req.body.correo || '').trim().toLowerCase()
    const user = id ? await User.findById(id) : await User.findOne({ correo })
    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' })
    const updated = await User.findByIdAndUpdate(user._id, { activo: false }, { new: true })
    res.json({ ok: true, id: updated._id, activo: updated.activo })
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

module.exports = router
