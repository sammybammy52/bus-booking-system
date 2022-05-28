const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const orderSchema = new Schema({
    name: {
        type: String,
        required:true
    },
    to: {
        type: String,
        required:true
    },
    departure_park: {
        type: String,
        required:true
    },

    arrival_park: {
        type: String,
        required:true
    },

    seats: {
        type: Number,
        required:true
    },

    departure_datetime: {
        type: String,
        required:true
    },

    
}, {timestamps: true});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;