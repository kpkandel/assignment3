    // Assignment: JS Assignment-4
	// Name: Krishna Kandel
	// Date: 2021-08-11
	
// import dependencies
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

//Destructuring an object
const { check, validationResult, header } = require('express-validator');

//MongoDB
mongoose.connect('mongodb://localhost:27017/shoppingstore',
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });

const Contact = mongoose.model('Contact',
    {
        name: String,
        email: String
    });

const Order = mongoose.model('Order', {
    name: String,
    email: String,
    phone: String,
    streetAddress: String,
    province: String,
    country: String,
    postalCode: String,
    subTotal: Number,
    qBag: Number,
    qCopy: Number,
    qPen: Number,
    bagPrice: Number,
    penPrice: Number,
    copyPrice: Number,
    tax: Number,
    total: Number
});

// variables to use packages
var myApp = express();
myApp.use(express.urlencoded({ extended: false }));

//parse application json
myApp.use(express.json());

// set path to public folders and view folders
myApp.set('views', path.join(__dirname, 'views'));
myApp.use(express.static(__dirname + '/public'));
myApp.set('view engine', 'ejs');

//home page
myApp.get('/', function (req, res) {
    res.render('form');
});

//Error Array
myApp.post('/', [
    check('name', 'Name is required!').notEmpty(),
    check('sAddress', 'Street Address is required!').notEmpty(),
    check('province', 'Province is required!').notEmpty(),
    check('country', 'Country is Required!').notEmpty(),
    check('pCode', 'Postal Code is required!').notEmpty(),
], function (req, res) {
    const errors = validationResult(req);
    console.log(errors);
    if (!errors.isEmpty()) {
        res.render('form', {
            errors: errors.array()
        });
    }
    else {
        var name = req.body.name;
        var email = req.body.email;
        var phone = req.body.phone;
        var streetAddress = req.body.sAddress;
        var province = req.body.province;
        var country = req.body.country;
        var postalCode = req.body.pCode;
        var qPen = parseInt(req.body.pen);
        var qCopy = parseInt(req.body.copy);
        var qBag = parseInt(req.body.bag);

        var unitPrice = [2, 4, 12];
        const taxRate = 0.13;
        const shippingCharge = 15;

        var penPrice = qPen * unitPrice[0];
        var copyPrice = qCopy * unitPrice[1];
        var bagPrice = qBag * unitPrice[2];

        var itemTotal = copyPrice + penPrice + bagPrice;

        if (itemTotal > 0) {
            var subTotal = itemTotal + shippingCharge;
            var tax = subTotal * taxRate;
            var total = subTotal + tax;

            var pageData = {
                name: name,
                email: email,
                phone: phone,
                streetAddress: streetAddress,
                province: province,
                country: country,
                postalCode: postalCode,
                qCopy: qCopy,
                qPen: qPen,
                qBag: qBag,
                copyPrice: copyPrice,
                penPrice: penPrice,
                bagPrice: bagPrice,
                subTotal: subTotal,
                shippingCharge: shippingCharge,
                tax: tax,
                total: total
            }

            var myNewOrder = new Order(
                pageData
            );
            myNewOrder.save().then(() => console.log('New order saved'));

            res.render('form', pageData);
        }
  
    }
});

//orders page
myApp.get('/orders', function (req, res) {
    Order.find({}).exec(function (err, orders) {
        console.log(err);
        res.render('orders', { orders: orders });
    });
});

myApp.listen(8080);
console.log('Everything executed fine.. website at port 8080....');


