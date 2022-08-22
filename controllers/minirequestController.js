const State = require('../models/State');
const Park = require('../models/Park');
const Trip = require('../models/Trip');


module.exports.allstates = async (req, res) => {
    

  try {
    const states = await State.find().sort({ name: 'asc' })

    const parks = await Park.find().sort({ name: 'asc' })

    console.log(states);
    console.log(parks);

    res.status(200).json({states ,parks });
  } catch (error) {
    res.status(400).json({
      problem: "oops something happened"
    })
  }
    
}

module.exports.allparks = (req, res) => {
    console.log(req.body);
    var { selectedstate } = req.body;
    
    Park.find({ state: selectedstate}).exec()
   .then((result) => {
     res.status(201).send(result);
     console.log(result);
   })
   .catch((err) => {
     res.status(400).json({
         problem: "oops something happened"
     })
   })
 
     
 }

module.exports.alltrips = (req, res) => {

  var { from, to, date } = req.body;

  from.toUpperCase();
  to.toUpperCase();

  Trip.find({ from: from, to: to, departure_date: { $gte: date} }).exec()
    .then((result) => {
      res.status(201).send(result);
      console.log(result);
    })
    .catch((err) => {
      res.status(400).json({
        problem: "oops something happened"
      })
    })


}