const router = require('express').Router();
const verify = require('../middlewares/verifyToken');
const verifyAdmin = require('../middlewares/verifyAdmin');
const User = require('../model/User');
const Product = require('../model/Product');
const Order = require('../model/Order');
const orderById = require('../middlewares/orderById');
const { orderValidation } = require('../validation');

//@route Post api/order/
//@desc Create a order
//@access private user
router.post('/', verify, async (req, res) => {
    
    //Validation
    const { error } = orderValidation(req.body);
    if(error){ 
        console.log(req.body)
        console.log(error);
        return res.status(400).json(error.details[0].message);
    }
    
    //Creating order
     try{
        const order = new Order({
            user: req.user._id,
            orderItems: req.body.orderItems,
            shippingAddress: req.body.shippingAddress,
            paymentMethod: req.body.paymentMethod,
            shippingPrice: req.body.shippingPrice,
            totalPrice: req.body.totalPrice
        });
        
        await order.save();
        res.json(order);

    } catch(err) {
        res.status(400).json(err);
        console.log("Order has not saved!");
    }
});

//@route Post api/order/
//@desc Create a order
//@access private user
router.get('/:id', verify, orderById, async(req, res) => {
    return res.json(req.order);
});

module.exports = router;