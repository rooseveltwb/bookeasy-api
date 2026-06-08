const express = require('express')

const router = express.Router()

const {
  getAllServices,
  createService,
  getServiceById,
  updateService, 
  deleteService
} = require('../controllers/servicesController')

router.get('/', getAllServices)

router.post('/', createService)

router.get('/:id', getServiceById)

router.put('/:id', updateService)

router.delete('/:id', deleteService)

module.exports = router