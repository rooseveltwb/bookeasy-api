const pool = require('../db')

const getAllAppointments = (req, res) => {
  pool.query(
    `
    SELECT
      appointments.id,
      appointments.appointment_date,
      appointments.appointment_time,
      appointments.status,
      users.name AS user_name,
      services.name AS service_name,
      services.price,
      services.duration_minutes
    FROM appointments
    JOIN users ON appointments.user_id = users.id
    JOIN services ON appointments.service_id = services.id
    `,
    (err, result) => {
      if (err) {
        console.error(err)
        res.status(500).send('Database error')
      } else {
        res.json(result.rows)
      }
    }
  )
}

const createAppointment = (req, res) => {
  const {
    user_id,
    service_id,
    appointment_date,
    appointment_time
  } = req.body

  if (!user_id || !service_id || !appointment_date || !appointment_time) {
    return res.status(400).json({
      error: 'user_id, service_id, appointment_date, and appointment_time are required'
    })
  }

  pool.query(
    'SELECT * FROM users WHERE id = $1',
    [user_id],
    (userErr, userResult) => {
      if (userErr) {
        console.error(userErr)
        return res.status(500).send('Database error')
      }

      if (userResult.rows.length === 0) {
        return res.status(400).json({
          error: 'User does not exist'
        })
      }

      pool.query(
        'SELECT * FROM services WHERE id = $1',
        [service_id],
        (serviceErr, serviceResult) => {
          if (serviceErr) {
            console.error(serviceErr)
            return res.status(500).send('Database error')
          }

          if (serviceResult.rows.length === 0) {
            return res.status(400).json({
              error: 'Service does not exist'
            })
          }

          pool.query(
            `
            INSERT INTO appointments (user_id, service_id, appointment_date, appointment_time)
            VALUES ($1, $2, $3, $4)
            RETURNING *
            `,
            [user_id, service_id, appointment_date, appointment_time],
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
      )
    }
  )
}

const getAppointmentById = (req, res) => {
  const appointmentId = req.params.id

  pool.query(
    `
    SELECT
      appointments.id,
      appointments.appointment_date,
      appointments.appointment_time,
      appointments.status,
      users.name AS user_name,
      services.name AS service_name,
      services.price,
      services.duration_minutes
    FROM appointments
    JOIN users ON appointments.user_id = users.id
    JOIN services ON appointments.service_id = services.id
    WHERE appointments.id = $1
    `,
    [appointmentId],
    (err, result) => {
      if (err) {
        console.error(err)
        res.status(500).send('Database error')
      } else {
        if (result.rows.length === 0) {
          return res.status(404).json({
            error: 'Appointment not found'
          })
        }

        res.json(result.rows[0])
      }
    }
  )
}

const updateAppointment = (req, res) => {
  const appointmentId = req.params.id

  const {
    user_id,
    service_id,
    appointment_date,
    appointment_time,
    status
  } = req.body

  if (!user_id || !service_id || !appointment_date || !appointment_time || !status) {
    return res.status(400).json({
      error: 'user_id, service_id, appointment_date, appointment_time, and status are required'
    })
  }

  pool.query(
    `
    UPDATE appointments
    SET user_id = $1,
        service_id = $2,
        appointment_date = $3,
        appointment_time = $4,
        status = $5
    WHERE id = $6
    RETURNING *
    `,
    [user_id, service_id, appointment_date, appointment_time, status, appointmentId],
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

const deleteAppointment = (req, res) => {
  const appointmentId = req.params.id

  pool.query(
    'DELETE FROM appointments WHERE id = $1 RETURNING *',
    [appointmentId],
    (err, result) => {
      if (err) {
        console.error(err)
        res.status(500).send('Database error')
      } else {
        res.json({
          message: 'Appointment deleted',
          deletedAppointment: result.rows[0]
        })
      }
    }
  )
}



module.exports = {
  getAllAppointments,
  createAppointment,
  getAppointmentById,
  updateAppointment,
  deleteAppointment
}