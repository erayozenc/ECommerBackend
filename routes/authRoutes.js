const router = require('express').Router();
const User = require('../model/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const verify = require('../middlewares/verifyToken');
const  {registerValidation, loginValidation } = require('../validation');


router.post('/register',async (req, res) => {

    //Validation
    const { error } = registerValidation(req.body);
    if(error){ 
        console.log(req.body)
        console.log(error.details[0].message);
        return res.status(400).json(error.details[0].message);
    }

    //Checking if the user exist
    const emailExist = await User.findOne({email: req.body.email});
    if(emailExist) return res.status(400).json('Email already exist!');

    //Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    //Create a new user
    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword
    });
    try{
        const savedUser = await user.save();
        const token = jwt.sign({_id: user.id}, process.env.TOKEN_SECRET);
        res.header('auth-token', token).json({
            user: {
                id: savedUser.id,
                name: savedUser.name,
                email: savedUser.email,
                token: token,
                isAdmin: savedUser.isAdmin
            }
        });
        console.log('Registration success');

    }catch(err){
        res.status(400).json(err);
        console.log('Registration error');
    }

});

router.post('/login', async (req, res) => {
    
    //Validation
    const { error } = loginValidation(req.body);
    if(error) return res.status(400).json(error.details[0].message);

    //Checking if the user exist
    const user = await User.findOne( { email: req.body.email });
    if(!user) return res.status(400).json('There is no account with this email!');

    //Password crypto
    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if(!validPassword) return res.status(400).json('Wrong password!');

    //Create and assign a token
    const token = jwt.sign({_id: user.id}, process.env.TOKEN_SECRET);
    res.header('auth-token', token).json({
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
            token: token,
            isAdmin: user.isAdmin
        }
    });

});

router.post('/logout', async (req, res) => {
    res.send('Succesfully Logout');
})

router.get('/', verify, async (req, res) => {

    try {
        const user = await User.findOne({
            _id: req.user._id
        })

        console.log(user);
        res.json({
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                isAdmin: user.isAdmin
        }
        });
        console.log('hi')
    } catch (err) {
        console.log(err)
        res.status(500).send({
            error: 'Server Error'
        });
    }
})

module.exports = router;