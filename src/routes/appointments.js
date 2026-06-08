const express = require('express')

const router = express.Router()

const protect = require('../middleware/authMiddleware')

const {
  getAllAppointments,
  createAppointment,
  getAppointmentById,
  updateAppointment,
  deleteAppointment
} = require('../controllers/appointmentsController')

router.get('/', protect, getAllAppointments)

router.post('/', createAppointment)

router.get('/:id', getAppointmentById)

router.put('/:id', updateAppointment)

router.delete('/:id', deleteAppointment)

module.exports = router