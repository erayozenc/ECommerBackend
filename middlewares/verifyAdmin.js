  
const User = require('../model/User')

module.exports = async function (req, res, next) {
    try {
        // Get user information by Id
        const user = await User.findOne({
            _id: req.user._id
        })

        console.log(user);
        if (!user.isAdmin) {
            return res.status(403).json({
                error: 'Admin resources access denied'
            })
        }

        next()
    } catch (err) {
        console.log(err)
        res.status(500).send({
            error: 'Server Error'
        });
    }
}