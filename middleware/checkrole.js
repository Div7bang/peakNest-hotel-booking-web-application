const jwt = require('jsonwebtoken')

// Middleware to verify admin role
const checkAdminRole = (req, res, next) => {
    try {
        const token = req.session.token

        if (!token) {
            return res.status(401).json({ message: 'Unauthorized: No token provided' })
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        if (decoded.role !== 'admin') {
            return res.status(403).json({ message: 'Forbidden: Admin access only' })
        }

        req.user = decoded
        next()
    } catch (error) {
        return res.status(401).json({ message: 'Unauthorized: Invalid token' })
    }
}

module.exports = { checkAdminRole }
