import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'sampahku-secret-key-2026'

export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET)
  } catch (error) {
    return null
  }
}

export function generateToken(user) {
  return jwt.sign(
    { 
      id: user.id, 
      email: user.email, 
      role: user.role,
      nama: user.nama 
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  )
}

export function getTokenFromRequest(request) {
  const authHeader = request.headers.get('authorization')
  return authHeader?.split(' ')[1] || null
}