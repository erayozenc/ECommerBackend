const router = require('express').Router();
const verify = require('../middlewares/verifyToken');
const verifyAdmin = require('../middlewares/verifyAdmin');
const User = require('../model/User');
const Product = require('../model/Product');
const cloudinary = require('../utils/cloudinary');
const upload = require('../utils/multer');
const { productValidation } = require('../validation');
const productById = require('../middlewares/productById');

//@route Post api/products/
//@desc Create a product
//@access private admin
router.post('/', upload.single('image'), verify, verifyAdmin, async (req, res) => {

    //Verify existing user
    const authorizedUser = await User.findById( { _id: req.user._id } )
    if(!authorizedUser) return res.status(400).json({
        error: 'Unauthorized Account!'
    });

    //Validation
    const { error } = productValidation(req.body);
    if(error){ 
        console.log(req.body)
        console.log(error.details[0].message);
        return res.status(400).json({
            error: error.details[0].message
        });
    }

    //Creating product
    try{
        const result = await cloudinary.uploader.upload(req.file.path)
        
        const newProduct = new Product({
            name: req.body.name,
            description: req.body.description,
            price: req.body.price,
            category: req.body.category,
            quantity: req.body.quantity,
            sold: req.body.sold,
            image: result.secure_url,
            cloudinary_id: result.public_id
        });

        const product = await newProduct.save();
        res.json({product : product});

    } catch(err) {
        res.status(400).json(err);
        console.log("Procuct has not saved!");
    }
})

//@route Get api/products/list
//@desc Get list of product by filter
//@access public
router.get('/list', verify, async (req, res) => {
    const order = req.query.order ? req.query.order : 'asc';
    const sortBy =  req.query.sortBy ? req.query.sortBy : '_id';
    const limit =  req.query.limit ? parseInt(req.query.limit) : 20;

    try {
        const products = await Product.find({})
            .populate('category','name').sort([
                [sortBy, order]
            ]).limit(limit).exec();

        res.json({products: products});
        console.log({products: products});
    }catch(err){
        console.log(err);
        res.status(500).send('Invalid querys');
    }
})

//@route Get api/products/:id
//@desc Get a product
//@access public
router.get('/search', verify, async(req, res) => {
    const query= {};
    console.log('00')
    if(req.query.search){
        query.name= {
            $regex: req.query.search,
            $options:'i'
        }
    }

    if(req.query.category && req.query.category != 'All'){
        query.category = req.query.category
    }
    console.log(req.query.category);

    try{
        const products = await Product.find(query).populate('category','name');
        res.json({products: products});
    }catch(err){
        console.log(err);
        res.status(500).send('Error to get products');
    }
})

//@route Get api/products/:id
//@desc Get a product
//@access public
router.get('/:id', verify, productById, (req, res) => {
    return res.json({product: req.product});
})

module.exports = router;