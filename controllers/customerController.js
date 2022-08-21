const Trip = require('../models/Trip');
const Order = require('../models/Order');
const nodemailer = require('nodemailer');
const { default: axios } = require('axios');


function generateSerial() {

  'use strict';

  var chars = '1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ',

    serialLength = 10,

    randomSerial = "",

    i,

    randomNumber;

  for (i = 0; i < serialLength; i = i + 1) {

    randomNumber = Math.floor(Math.random() * chars.length);

    randomSerial += chars.substring(randomNumber, randomNumber + 1);

  }

  return "XYZ-" + randomSerial;

}


module.exports.order_busride = async (req, res) => {

  let reference = req.params.ref;

  //setting up the nodemailer

  let mailTransporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.MY_EMAIL,
      pass: process.env.EMAIL_PASS
    }
  })

  // getting the info from paystack


  const headers = {
    'Authorization': 'Bearer ' + process.env.PAYSTACK_SECRET_KEY,
  };

  //Verify payments and do other stuff

  try {
    const check = axios.get(`https://api.paystack.co/transaction/verify/${reference}`, { headers });
    const response = await check;


    if (response.data.data.status !== "success") {
      return res.status(400).json({
        message: "Unable to Verify Payment"
      })
    }
    console.log(response.data.data.metadata.custom_filters);
    const passengers = response.data.data.metadata.custom_filters;

    let responseobj = [];
    let errobj = []

    //after collecting the information from paystack we have to save each passenger to the db, generate an order number for them,
    // and send info to the frontend 

    
    try {
      for (let i = 0; i < passengers.length; i++) {
        let order_number = generateSerial();
        let name = passengers[i].name;
        let email = passengers[i].email;
        let phone = passengers[i].phone_number;
        let trip_id = passengers[i].trip_id;

        const order = new Order({
          name: name,
          email: email,
          phone: phone,
          trip_id: trip_id,
          order_number: order_number
        })

        store_order = await order.save();

        let obj = {
          name: store_order.name,
          email: store_order.email,
          order_number: store_order.order_number
        }



        await responseobj.push(obj);

        //sending the email

        let details = {
          from: process.env.MY_EMAIL,
          to: email,
          subject: "Ticket Purchase",
          text: "you have successfully purchased a ticket from XYZ TRANSPORT, your order number is " + order_number
        }

        mailTransporter.sendMail(details, (err) => {
          if (err) {
            console.log('error occured', err)
          }
          else {
            console.log('email has sent');
          }
        })


      };

      //deducting from the trips

      const trip_id = passengers[0].trip_id;

      const passenger_no = passengers.length;

      const filter = { _id: trip_id };
      const update = { $inc: { seats: -passenger_no } };


      let doc = await Trip.findOneAndUpdate(filter, update, {
        new: true
      });

      await console.log(responseobj);
      await res.send(responseobj);

    } catch (err) {

      console.log(err);
      res.status(400).json({
        message: "An Error Occured"
      })
    }

    


  } catch (err) {
    console.log(err);
    res.status(400).json({
      message: "An Error Occured"
    })
  }




  /* const passengers = [
     {
       name: "segun olawale",
       email: "sammybammystudios@gmail.com",
       phone: "09056112564",
       trip_id: "62ba3dbd9fe4e81bb1246864"

     },

     {
       name: "tobi olusegun",
       email: "blackarrowinfo52@gmail.com",
       phone: "08113567650",
       trip_id: "62ba3dbd9fe4e81bb1246864"

     }
   ] */
  // the response array that contains info that will be sent to the frontend after creating the order and sending an email



}
