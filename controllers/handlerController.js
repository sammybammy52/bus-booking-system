const Trip = require('../models/Trip');


module.exports.create_trip = async (req, res) => {
    
    const { from, to, price, departure_park, arrival_park, seats, departure_date, departure_time } = req.body;

    let mod_date = new Date(departure_date);

    const trip = new Trip({
        from:from,
        to:to,
        price:price,
        departure_park:departure_park,
        arrival_park:arrival_park,
        seats:seats,
        departure_date:mod_date,
        departure_time:departure_time
    });  

    try {

        const storetrip = await trip.save();

        res.status(201).json({
            status: "Trip successfully created Noiceeee"
        })

        
    } catch (err) {
        
        res.status(400).json({
            problem: "could not save trip",
            error: err
        })
    }

    
}