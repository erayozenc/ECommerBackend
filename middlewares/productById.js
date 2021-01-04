const mongoose = require('mongoose');
const Product = require('../model/Product')

module.exports = async function (req, res, next) {
    const id = req.params.id

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(403).json({
            error: 'Product not found'
        })
    }

    try {
        const product = await Product.findById(id).populate('category','name')
        console.log(product);
        if (!product) {
            return res.status(403).json({
                error: 'Product not found'
            })
        }

        req.product = product
    } catch (error) {
        console.log(error)
        res.send('Server error');
    }

    next()
}