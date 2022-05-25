const State = require('../models/State');
const Park = require('../models/Park');


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