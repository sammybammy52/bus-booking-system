const mongoose = require('mongoose');
const { isEmail } = require('validator');

const Schema = mongoose.Schema;

const orderSchema = new Schema({
    name: {
        type: String,
        required:true
    },
    email:{
        type: String,
        required: [true, 'Please enter an email'],
        lowercase: true,
        validate: [isEmail, 'Please enter a valid email']
    },
    phone: {
        type: String,
        required:true
    },

    trip_id: {
        type: String,
        required:true
    },
    order_number: {
        type: String,
        required:true
    },
    ordered_by: {
        type: String,
        default: null
    }

    
}, {timestamps: true});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;