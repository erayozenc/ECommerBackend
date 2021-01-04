const router = require('express').Router();
const Category = require('../model/Category');
const User = require('../model/User')
const verify = require('../middlewares/verifyToken');
const verifyAdmin = require('../middlewares/verifyAdmin')
const categoryById = require('../middlewares/categoryById')
const cloudinary = require('../utils/cloudinary');
const upload = require('../utils/multer');
const { categoryValidation } = require('../validation');


// @route   POST api/category
// @desc    Create Category
// @access  Private Admin
router.post('/', upload.single('image'), verify, verifyAdmin, async (req, res) => {
   
    //Verify existing user
    const authorizedUser = await User.findById( { _id: req.user._id } )
    if(!authorizedUser) return res.status(400).json('Unauthorized Account!');

    //Validation
    const { error } = categoryValidation(req.body);
    if(error){ 
        console.log(req.body)
        console.log(error.details[0].message);
        return res.status(400).json(error.details[0].message);
    }

    try {
        let category = await Category.findOne({
            name: req.body.name
        })

        if (category) {
            return res.status(403).json({
                error: 'Category already exist'
            })
        }

        const result = await cloudinary.uploader.upload(req.file.path)

        const newCategory = new Category({
            name: req.body.name,
            image: result.secure_url,
            cloudinary_id: result.public_id
        })

        category = await newCategory.save()
        res.json({category: category})
    } catch (error) {
        console.log(error)
        res.status(500).send('Server error')
    }
})

// @route   Get api/category/all
// @desc    Get all categories
// @access  Public
router.get('/all', verify, async (req, res) => {
    try {
        let data = await Category.find({})
        res.json({categories: data})
    } catch (error) {
        console.log(error)
        res.status(500).send('Server error')
    }
})

// @route   Get api/category/:categoryId
// @desc    Get Single category
// @access  Public
router.get('/:categoryId', verify, categoryById, async (req, res) => {
    res.json(req.category)
})

// @route   Put api/category/:categoryId
// @desc    Update Single category
// @access  Private Admin
router.put('/:categoryId', verify, verifyAdmin, categoryById, async (req, res) => {
    let category = req.category;
    const {
        name
    } = req.body
    if (name) category.name = name.trim()

    try {
        category = await category.save()
        res.json(category)
    } catch (error) {
        console.log(error.message)
        res.status(500).send('Server error');
    }
})

// @route   Delete api/category/:categoryId
// @desc    Delete Single category
// @access  Private Admin
router.delete('/:categoryId', verify, verifyAdmin, categoryById, async (req, res) => {
    let category = req.category;
    try {
        let deletedCategory = await category.remove()
        res.json({
            message: `${deletedCategory.name} deleted successfully`
        })
    } catch (error) {
        console.log(error.message)
        res.status(500).send('Server error');
    }
})

module.exports = router;