var express = require('express');
const bodyParser = require('body-parser');
var app = express();
var PORT = process.env.PORT || 8080;

app.set ('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended:true}));

var CLIENT_ID = 'ca_AJSsdAbBRMXOzblgubeeRFapxed8YLTY';
var API_KEY = "sk_test_6ywOLfo2NJahdTVJq8YDMBqo";

var TOKEN_URI = 'https://connect.stripe.com/oauth/token';
var AUTHORIZE_URI = 'https://connect.stripe.com/oauth/authorize';

var qs = require('querystring');
var request = require('request');
// Set your secret key: remember to change this to your live secret key in production
// See your keys here: https://dashboard.stripe.com/account/apikeys
var stripe = require("stripe")("sk_test_6ywOLfo2NJahdTVJq8YDMBqo");

app.get('/', (req,res)=>{
  res.render('index')
})

app.post('/stripetoken', (req,res)=>{
  console.log(req.query);
  console.log("tokening!");
  console.log(req.body);
  console.log("body over")
  var token = req.body.stripeToken; // Using Express
  var amount = req.query.amount;
  var fee = Math.round(amount * 0.05);

  // Charge the user's card:
  stripe.charges.create({
    amount: req.query.amount,
    currency: req.query.currency,
    source: token,
    application_fee:fee,
  }, {
    stripe_account: "acct_19zd5iJs3J1YlgFW",
  }).then(function(charge) {
    console.log("charged!!!", charge)
  });
})

app.get("/authorize", function(req, res) {
  // Redirect to Stripe /oauth/authorize endpoint
  res.redirect(AUTHORIZE_URI + "?" + qs.stringify({
    response_type: "code",
    scope: "read_write",
    client_id: CLIENT_ID
  }));
});

app.get("/oauth/callback", function(req, res) {

  var code = req.query.code;

  // Make /oauth/token endpoint POST request
  request.post({
    url: TOKEN_URI,
    form: {
      grant_type: "authorization_code",
      client_id: CLIENT_ID,
      code: code,
      client_secret: API_KEY
    }
  }, function(err, r, body) {

    var accessToken = JSON.parse(body).access_token;

    // Do something with your accessToken

    // For demo"s sake, output in response:
    res.send({ "Your Token": accessToken });

  });
});


// Token is created using Stripe.js or Checkout!
// Get the payment token submitted by the form:

app.listen(PORT, function(){
  console.log(`Example app listening on port ${PORT}!`);
});
