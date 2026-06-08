const pool = require('../db')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const register = async (req, res) => {
  const { name, email, password } = req.body

  if (!name || !email || !password) {
    return res.status(400).json({
      error: 'Name, email, and password are required'
    })
  }

  try {
    const existingUser = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    )

    if (existingUser.rows.length > 0) {
      return res.status(400).json({
        error: 'Email already exists'
      })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const result = await pool.query(
      `
      INSERT INTO users (name, email, password)
      VALUES ($1, $2, $3)
      RETURNING id, name, email
      `,
      [name, email, hashedPassword]
    )

    res.status(201).json(result.rows[0])
  } catch (err) {
    console.error(err)
    res.status(500).send('Server error')
  }
}

const login = async (req, res) => {
  const { email, password } = req.body

  if (!email || !password) {
    return res.status(400).json({
      error: 'Email and password are required'
    })
  }

  try {
    const result = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    )

    if (result.rows.length === 0) {
      return res.status(400).json({
        error: 'Invalid credentials'
      })
    }

    const user = result.rows[0]

    const passwordMatch = await bcrypt.compare(
      password,
      user.password
    )

    if (!passwordMatch) {
      return res.status(400).json({
        error: 'Invalid credentials'
      })
    }

   const token = jwt.sign(
  {
    id: user.id,
    email: user.email
  },
  process.env.JWT_SECRET,
  {
    expiresIn: '1h'
  }
)

res.json({
  token,
  user: {
    id: user.id,
    name: user.name,
    email: user.email
  }
})

  } catch (err) {
    console.error(err)
    res.status(500).send('Server error')
  }
}

module.exports = {
  register,
  login
}