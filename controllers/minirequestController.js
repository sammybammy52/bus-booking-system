const State = require('../models/State');
const Park = require('../models/Park');
const Trip = require('../models/Trip');


module.exports.allstates = (req, res) => {
    
   State.find().sort({name: 'asc'})
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

  Trip.find({ from: from, to: to, departure_date: date }).exec()
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