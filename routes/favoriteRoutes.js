const router = require('express').Router();
const verify = require('../middlewares/verifyToken');
const verifyAdmin = require('../middlewares/verifyAdmin');
const User = require('../model/User');
const Product = require('../model/Product');
const productById = require('../middlewares/productById');

router.post('/add/:id', verify, productById, async (req, res) => {

    const productId = req.product._id
    //Verify existing user
    const user = await User.findById( { _id: req.user._id } )
    if(!user) return res.status(400).json('Unauthorized Account!');
    
    try {
        await User.updateOne(
            {_id : req.user._id } ,
            { $push: {favorites: {product : productId}}}
        )
        res.send('Favorite product has added!')

    } catch (error) {
        console.log(error);
    }
});

router.post('/delete/:id', verify, productById, async (req, res) => {

    const productId = req.product._id
    console.log(productId);
    //Verify existing user
    const user = await User.findById( { _id: req.user._id } )
    if(!user) return res.status(400).json('Unauthorized Account!');
    const favorites = user.favorites
    
    try {
        
        let flag = 0
        favorites.map(async (element) => {
            console.log(element.product);
            if(element.product.toString() === productId.toString()){
                flag++;
            }
        });
        if(flag === 0){
            return res.status(400).send('Favorite product not found!');
        }

        await User.updateOne(
            {_id : req.user._id } ,
            { $pull: {favorites: { product: productId}}}
        );

        return res.send({msg : 'Favorite product has removed!'});

    } catch (error) {
        console.log(error);
        res.status(500).send('Server error!')
    }
});

router.get('/',verify, async(req , res) => {
    const user = await User.findById( { _id: req.user._id } )
    if(!user) return res.status(400).json('Unauthorized Account!');
    let favoriteIds = []
    user.favorites.map((element) => {
        favoriteIds.push(element.product)
    })

    try {
        const favorites = await Product.find({_id: {$in: favoriteIds }}).populate('category','name')
        console.log(favorites);
        res.send({products: favorites})
    } catch (error) {
        res.send(error)
    }
});

router.get('/user' , verify, async(req, res) => {
    const user = await User.findById( { _id: req.user._id } )
    if(!user) return res.status(400).json('Unauthorized Account!');

    try {
        let favoriteIds = []
        user.favorites.map((element) => {
            favoriteIds.push(element.product)
        })
        console.log(favoriteIds);
        res.json(favoriteIds);
    } catch (error) {
        
        res.json(error);
    }
    
})

module.exports = router;

