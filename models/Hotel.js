const mongoose = require('mongoose')

const hotelSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    location: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    image: {
        type: String,
        default: '/images/default-hotel.jpg'
    },
    price: {
        type: Number,
        default: 0
    },
    rating: {
        type: String,
        default: '4.5'
    },
    status: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'active'
    }
}, { timestamps: true })

module.exports = mongoose.model('Hotel', hotelSchema)
