const pool = require('../db')

const getAllUsers = (req, res) => {
  pool.query('SELECT id, name, email FROM users', (err, result) => {
    if (err) {
      console.error(err)
      res.status(500).send('Database error')
    } else {
      res.json(result.rows)
    }
  })
}

const createUser = (req, res) => {
  const { name, email, password } = req.body

  if (!name || !email || !password) {
    return res.status(400).json({
      error: 'Name, email, and password are required'
    })
  }

  pool.query(
    `
    INSERT INTO users (name, email, password)
    VALUES ($1, $2, $3)
    RETURNING id, name, email
    `,
    [name, email, password],
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

const getUserById = (req, res) => {
  const userId = req.params.id

  pool.query(
    'SELECT id, name, email FROM users WHERE id = $1',
    [userId],
    (err, result) => {
      if (err) {
        console.error(err)
        res.status(500).send('Database error')
      } else {
        if (result.rows.length === 0) {
          return res.status(404).json({
            error: 'User not found'
          })
        }

        res.json(result.rows[0])
      }
    }
  )
}

const updateUser = (req, res) => {
  const userId = req.params.id
  const { name, email, password } = req.body

  if (!name || !email || !password) {
    return res.status(400).json({
      error: 'Name, email, and password are required'
    })
  }

  pool.query(
    `
    UPDATE users
    SET name = $1, email = $2, password = $3
    WHERE id = $4
    RETURNING id, name, email
    `,
    [name, email, password, userId],
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

const deleteUser = (req, res) => {
  const userId = req.params.id

  pool.query(
    'DELETE FROM users WHERE id = $1 RETURNING id, name, email',
    [userId],
    (err, result) => {
      if (err) {
        console.error(err)
        res.status(500).send('Database error')
      } else {
        res.json({
          message: 'User deleted',
          deletedUser: result.rows[0]
        })
      }
    }
  )
}

module.exports = {
  getAllUsers,
  createUser,
  getUserById,
  updateUser,
  deleteUser
}