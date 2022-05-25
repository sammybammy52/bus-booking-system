const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const parkSchema = new Schema({
    name: {
        type: String,
        required:true
    },
    state: {
        type: String,
        required:true
    }

    
});

const Park = mongoose.model('Park', parkSchema);

module.exports = Park;