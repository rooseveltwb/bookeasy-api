const pool = require('../db')

const getAllServices = (req, res) => {
  pool.query('SELECT * FROM services', (err, result) => {
    if (err) {
      console.error(err)
      res.status(500).send('Database error')
    } else {
      res.json(result.rows)
    }
  })
}

const createService = (req, res) => {
  const { name, description, price, duration_minutes } = req.body

  if (!name || !price || !duration_minutes) {
    return res.status(400).json({
      error: 'Name, price, and duration are required'
    })
  }

  pool.query(
    `
    INSERT INTO services (name, description, price, duration_minutes)
    VALUES ($1, $2, $3, $4)
    RETURNING *
    `,
    [name, description, price, duration_minutes],
    (err, result) => {
      if (err) {
        console.error(err)
        res.status(500).send('Database error')
      } else {
        res.status(201).json(result.rows[0])
      }
    }
  )
}


const getServiceById = (req, res) => {
  const serviceId = req.params.id

  pool.query(
    'SELECT * FROM services WHERE id = $1',
    [serviceId],
    (err, result) => {
      if (err) {
        console.error(err)
        res.status(500).send('Database error')
      } else {
        if (result.rows.length === 0) {
          return res.status(404).json({
            error: 'Service not found'
          })
        }

        res.json(result.rows[0])
      }
    }
  )
}

const updateService = (req, res) => {
  const serviceId = req.params.id
  const { name, description, price, duration_minutes } = req.body

  if (!name || !price || !duration_minutes) {
    return res.status(400).json({
      error: 'Name, price, and duration are required'
    })
  }

  pool.query(
    `
    UPDATE services
    SET name = $1, description = $2, price = $3, duration_minutes = $4
    WHERE id = $5
    RETURNING *
    `,
    [name, description, price, duration_minutes, serviceId],
    (err, result) => {
      if (err) {
        console.error(err)
        res.status(500).send('Database error')
      } else {
        res.json(result.rows[0])
      }
    }
  )
}

const deleteService = (req, res) => {
  const serviceId = req.params.id

  pool.query(
    'DELETE FROM services WHERE id = $1 RETURNING *',
    [serviceId],
    (err, result) => {
      if (err) {
        console.error(err)
        res.status(500).send('Database error')
      } else {
        res.json({
          message: 'Service deleted',
          deletedService: result.rows[0]
        })
      }
    }
  )
}


module.exports = {
  getAllServices,
  createService,
  getServiceById,
  updateService,
  deleteService
}