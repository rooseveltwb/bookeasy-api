const express = require('express')
const pool = require('./db')

const servicesRoutes = require('./routes/services')
const appointmentsRoutes = require('./routes/appointments')
const usersRoutes = require('./routes/users')
const authRoutes = require('./routes/auth')

const app = express()
app.use(express.json())

app.use('/api/services', servicesRoutes)
app.use('/api/appointments', appointmentsRoutes)
app.use('/api/users', usersRoutes)
app.use('/api/auth', authRoutes)

const PORT = process.env.PORT || 3000

app.get('/', (req, res) => {
  res.send('BookEasy API is running')
})

pool.query('SELECT NOW()', (err, result) => {
  if (err) {
    console.error(err)
  } else {
    console.log(result.rows)
  }
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})