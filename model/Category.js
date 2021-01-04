const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        max: 255,
        trim: true
    },
    image: {
        type: String,
        
    },
    cloudinary_id: {
        type: String
    }
}, {
    timestamps: true
});


module.exports = mongoose.model('Category',categorySchema);