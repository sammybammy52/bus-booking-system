const Trip = require('../models/Trip');


module.exports.create_trip = async (req, res) => {
    
    const trip = new Trip(req.body);  

    try {

        const storetrip = await trip.save();

        res.status(201).json({
            status: "Trip successfully created Noiceeee"
        })

        
    } catch (err) {
        const errors = handleErrors(err);
        res.status(400).json({
            problem: "something happened"
        })
    }

    
}