const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const tripSchema = new Schema({
    from: {
        type: String,
        required:true
    },
    to: {
        type: String,
        required:true
    },
    price: {
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

    departure_date: {
        type: String,
        required:true
    },
    departure_time: {
        type: String,
        required:true
    },


    
}, {timestamps: true});

const Trip = mongoose.model('Trip', tripSchema);

module.exports = Trip;