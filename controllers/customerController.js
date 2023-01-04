const Trip = require('../models/Trip');
const Order = require('../models/Order');
const nodemailer = require('nodemailer');
const { default: axios } = require('axios');
const User = require('../models/User');



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
    console.log(response.data.data.customer.email);
    //res.send(response.data.data);


    const passengers = response.data.data.metadata.custom_filters.passengers;

    const trip_info = response.data.data.metadata.custom_filters.trip_info;
    const ordered_by = response.data.data.customer.email;

    let dd = new Date(trip_info.departure_date);
    let readable_date = dd.toDateString();

    const amount_paid = response.data.data.amount;

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
        let trip_id = trip_info._id;

        const order = new Order({
          name: name,
          email: email,
          phone: phone,
          trip_id: trip_id,
          order_number: order_number,
          ordered_by: ordered_by
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
          text: "you have successfully purchased a ticket from XYZ TRANSPORT, your order number is " + order_number,
          html: `<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Raleway:wght@300&display=swap');

        * {
            margin: 0;
            padding: 0;
        }

        body {
            background-color: #111827;
            font-family: sans-serif, serif;
        }

        .maindiv {

            background-color: #111827;
            padding-top: 2rem;



        }

        .info-container {
            padding: 1rem;
            margin-top: 2rem;
            margin-left: auto;
            margin-right: auto;
            margin-bottom: 1.25rem;
            background-color: #E5E7EB;
            border-radius: 1rem;
            box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
            width: 400px;


        }

        .greeting-text {
            margin-top: 0.75rem;
            margin-bottom: 0.75rem;
            margin-left: .75rem;
            margin-right: .75rem;
            font-size: 1.875rem;
            line-height: 2.25rem;
            font-weight: 700;
            color: #5D3FD3;
        }

        .greeting-text-details {
            margin-left: 0.75rem;
            margin-right: 0.75rem;


        }

        .gtd {
            color: #374151;
            margin-top: 8px;
            margin-bottom: 8px;
        }

        .details-div {
            margin: 1rem;
        }

        .details {
            color: #111827;
            font-size: 1.25rem;
            text-align: center;
        }

        .personal-info {
            padding-left: 1rem;
            padding-right: 1rem;
            padding-top: 1rem;
            padding-bottom: 1.5rem;
            background-color: #D1D5DB;
            border-radius: 1rem;

        }

        .destination-container {

            border-bottom: 2px solid #5D3FD3;
            width: 100%;
            display: table;
            table-layout: fixed;
            border-collapse: collapse;
        }

        td {
            display: table-cell;
            text-align: center;

            vertical-align: middle;
            word-wrap: break-word;
        }

        .from-div {
            margin-top: 0.5rem;
            margin-bottom: 0.5rem;

        }

        .from-text {
            font-size: 1.25rem;
            line-height: 1.75rem;
            font-family: 'Raleway', sans-serif;
            text-align: center;
        }

        .bus-div {
            margin-bottom: 0.5rem;
            display: flex;
            justify-content: center;
        }

        .name-div {

            border-top-width: 2px;
        }

        .nd1 {
            margin-top: 0.75rem;
            color: #1F2937;
            font-weight: 600;


        }

        .nd2 {
            color: #374151;
            margin-top: 0.75rem;
        }

        .price-div {
            border-top: 2px solid #5D3FD3;
            padding: 10px;
            width: 100%;
            display: table;
            table-layout: fixed;
            border-collapse: collapse;

        }

        .pd1 {
            font-weight: 600;
            font-size: large;
            float: left;
            margin-top: 10px;
        }

        .pd2 {
            font-weight: 600;
            font-size: large;
            float: right;
            margin-top: 10px;
        }

        .img-center {
            display: block;
            margin-left: auto;
            margin-right: auto;
        }

        @media (max-width: 425px) {

            body {
                height: 100vh;
                width: 100%;
            }

            .info-container {
                width: 80%;

            }

            .maindiv {
                width: 100%;
                height: 100vh;
                margin-top: 20px;
                margin-bottom: 0px;
            }
        }
    </style>



</head>

<body>
    <div class="maindiv">

        <div class="info-container">
            <h1 class="greeting-text">Thank you for your order.</h1>

            <div class="greeting-text-details">
                <p class="gtd">Hi ${store_order.name}, you have successfully purchased a bus ticket from XYZ logistics</p>
                <p class="gtd">View details below</p>
            </div>

            <div class="details-div">
                <h4 class="details">Details</h4>
            </div>


            <div class="personal-info">

                <table>
                    <tr class="destination-container">
                        <td class="from-div">
                            <p class="from-text">${trip_info.from}</p>
                        </td>
                        <td class="bus-div">
                            <img width="48px" height="48px" src="https://i.ibb.co/DfYjWVM/bus.png" alt="bus" border="0"
                                class="img-center">
                        </td>
                        <td class="from-div">
                            <p class="from-text">${trip_info.to}</p>
                        </td>
                    </tr>

                </table>

                <div class="name-div">
                    <p class="nd1">Your Name:</p>
                    <p class="nd2">${store_order.name}</p>
                </div>

                <div class="name-div">
                    <p class="nd1">Order Number:</p>
                    <p class="nd2">${store_order.order_number}</p>
                </div>

                <div class="name-div">
                    <p class="nd1">Departure Date:</p>
                    <p class="nd2">${readable_date}</p>
                </div>

                <div class="name-div">
                    <p class="nd1">Departure Time:</p>
                    <p class="nd2">${trip_info.departure_time}</p>
                </div>

                <table style="margin-top: 10px;">
                    <tr class="price-div">
                        <td class="pd1">Price</td>
                        <td class="pd2">N${amount_paid}</td>
                    </tr>
                </table>




            </div>

        </div>

    </div>

</body>

</html>`
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

      const trip_id = trip_info._id;

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

    //*/


  } catch (err) {
    console.log(err);
    res.status(400).json({
      message: "An Error Occured"
    })
  }





  // the response array that contains info that will be sent to the frontend after creating the order and sending an email



}

module.exports.tripHistory = async (req, res) => {
  const { user_id } = req.body;

  try {

    const orders = await Order.find({ ordered_by: user_id }).exec()

    if (orders) {
      console.log(orders);
      res.status(200).json({
        pastTrips: orders
      });
    }
    else {
      console.log(orders);
      res.status(200).json({
        pastTrips: []
      });
    }
  } catch (err) {
    res.status(400).json({
      problem: "oops something happened",
      error: err
    })
  }


}
