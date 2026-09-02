const express = require('express')
const router = express.Router()
const userController = require('../controller/userController')
const { checkAdminRole } = require('../middleware/checkrole')
const data = require('../public/data')

// Auth API endpoints
router.post('/api/auth/register', userController.register)
router.post('/api/auth/login', userController.login)
router.get('/api/auth/logout', userController.logout)

// Auth pages
router.get('/login', (req, res) => {
    res.render('login')
})
router.get('/signup', (req, res) => {
    res.render('signup')
})
router.get('/admin/login', (req, res) => {
    res.render('admin-login')
})

// Admin dashboard
router.get('/admin/dashboard', checkAdminRole, (req, res) => {
    res.render('admin-dashboard')
})

// Dashboard API endpoints
router.get('/api/auth/dashboard-stats', checkAdminRole, userController.getDashboardStats)
router.get('/api/auth/all-users', checkAdminRole, userController.getAllUsers)

// Hotel management endpoints
router.post('/api/auth/hotels', checkAdminRole, userController.addHotel)
router.get('/api/auth/hotels', checkAdminRole, userController.getAllHotels)
router.put('/api/auth/hotels/:id', checkAdminRole, userController.updateHotel)
router.delete('/api/auth/hotels/:id', checkAdminRole, userController.deleteHotel)

// Public site routes
router.get('/', (req, res) => {
    res.render('index', { title: 'PeakNest — Himalayan Luxury Hotels', ...data })
})

router.get('/hotel/:id', (req, res) => {
    const hotel = data.hotels.find(h => h.id === req.params.id)
    if (!hotel) return res.redirect('/')
    res.render('hotel', {
        title: `${hotel.name} | PeakNest`,
        hotel,
        rooms: data.rooms,
        ...data,
    })
})

module.exports = router
