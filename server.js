var express = require('express');
const bodyParser = require('body-parser');
var app = express();
var PORT = process.env.PORT || 8080;

app.set ('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended:true}));
// Set your secret key: remember to change this to your live secret key in production
// See your keys here: https://dashboard.stripe.com/account/apikeys
var stripe = require("stripe")("sk_test_6ywOLfo2NJahdTVJq8YDMBqo");

app.get('/', (req,res)=>{
  res.render('index')
})

app.post('/stripetoken', (req,res)=>{
  console.log("tokening!");
  console.log(req.body);
  var token = req.body.stripeToken; // Using Express

  // Charge the user's card:
  var charge = stripe.charges.create({
    amount: 1000,
    currency: "cad",
    description: "Example charge",
    source: token,
  }, function(err, charge) {
    console.log("charge created", charge)
  });
})

// Token is created using Stripe.js or Checkout!
// Get the payment token submitted by the form:

app.listen(PORT, function(){
  console.log(`Example app listening on port ${PORT}!`);
});
