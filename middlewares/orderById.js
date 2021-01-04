const mongoose = require('mongoose')
const Order = require('../model/Order')


module.exports = async function (req, res, next) {
    const id = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(403).json({
            error: 'Order not founded'
        })
    }

    try {
        const order = await Order.findById(id)

        if (!order) {
            return res.status(403).json({
                error: 'Order not founded'
            })
        }

        req.order = order
        next()
    } catch (error) {
        console.log(error)
        res.status(500).send('Server error')
    }
}