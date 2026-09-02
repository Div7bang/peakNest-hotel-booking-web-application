const User = require('../models/User')
const Hotel = require('../models/Hotel')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

// Register
exports.register = async (req, res) => {
    try {
        const { fullname, email, password, role } = req.body
        const userExists = await User.findOne({ email })
        if (userExists) {
            return res.json({ message: 'user already exists' })
        }
        const hashpassword = await bcrypt.hash(password, 10)
        const user = await User.create({
            fullname,
            email,
            password: hashpassword,
            role
        })
        res.json({ message: 'user registered successfully', user })
    } catch (error) {
        res.json({ error: error.message })
    }
}

// Login
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body
        const users = await User.findOne({ email })
        if (!users) {
            return res.json({ message: 'Invalid Email' })
        }
        const isMatch = await bcrypt.compare(password, users.password)
        if (!isMatch) {
            return res.json({ message: 'Invalid Password' })
        }
        const token = jwt.sign({
                id: users._id,
                role: users.role
            },
            process.env.JWT_SECRET, { expiresIn: '1d' }
        )

        req.session.token = token
        res.json({ message: 'login successful', token, users })
    } catch (error) {
        res.json({ error: error.message })
    }
}

// Logout (client side token remove)
exports.logout = (req, res) => {
    req.session.destroy(() => {
        res.clearCookie('connect.sid')
        res.json({ message: 'Logout successful' })
    })
}

// Get Dashboard Statistics
exports.getDashboardStats = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments()
        const totalAdmins = await User.countDocuments({ role: 'admin' })
        const totalRegularUsers = await User.countDocuments({ role: 'user' })
        const recentUsers = await User.find().sort({ createdAt: -1 }).limit(5)

        res.json({
            totalUsers,
            totalAdmins,
            totalRegularUsers,
            recentUsers
        })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

// Get All Users
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find().sort({ createdAt: -1 })
        res.json({ users })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

// Hotel Management Methods

// Add Hotel
exports.addHotel = async (req, res) => {
    try {
        const { name, location, description, image, price, rating } = req.body

        if (!name || !location) {
            return res.status(400).json({ message: 'Hotel name and location are required' })
        }

        const newHotel = await Hotel.create({
            name,
            location,
            description: description || '',
            image: image || '/images/default-hotel.jpg',
            price: price || 0,
            rating: rating || '4.5'
        })

        res.json({ message: 'Hotel added successfully', hotel: newHotel })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

// Get All Hotels
exports.getAllHotels = async (req, res) => {
    try {
        const hotels = await Hotel.find().sort({ createdAt: -1 })
        res.json({ hotels })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

// Update Hotel
exports.updateHotel = async (req, res) => {
    try {
        const { id } = req.params
        const { name, location, description, image, price, rating, status } = req.body

        const updatedHotel = await Hotel.findByIdAndUpdate(
            id, { name, location, description, image, price, rating, status }, { new: true }
        )

        if (!updatedHotel) {
            return res.status(404).json({ message: 'Hotel not found' })
        }

        res.json({ message: 'Hotel updated successfully', hotel: updatedHotel })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

// Delete Hotel
exports.deleteHotel = async (req, res) => {
    try {
        const { id } = req.params

        const deletedHotel = await Hotel.findByIdAndDelete(id)

        if (!deletedHotel) {
            return res.status(404).json({ message: 'Hotel not found' })
        }

        res.json({ message: 'Hotel deleted successfully' })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}
