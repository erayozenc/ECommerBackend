//VALIDATION
const Joi = require('@hapi/joi');

//Register Validation
const registerValidation = (data) => {
    const schema = Joi.object ({
        name: Joi.string().min(6).required(),
        email: Joi.string().min(6).required().email(),
        password: Joi.string().min(6).required()
    
    });

    return schema.validate(data);
};

//Login Validation
const loginValidation = (data) => {
    const schema = Joi.object ({
        email: Joi.string().min(6).required().email(),
        password: Joi.string().min(6).required()
    
    });

    return schema.validate(data);
};

//Create product validation
const productValidation = (data) => {
    const schema = Joi.object ({
        name: Joi.string().max(64).required(),
        description: Joi.string().required(),
        price: Joi.number().max(999999999).required(),
        category: Joi.required(),
        quantity: Joi.required()
    });

    return schema.validate(data);
}

//Create category validation
const categoryValidation = (data) => {
    const schema = Joi.object ({
        name : Joi.string().max(64).required()
    });

    return schema.validate(data);
}

//Create order validation
const orderValidation = (data) => {

    const schema = Joi.object ({
        orderItems: Joi.array().min(1),
        shippingAddress: Joi.object({
            address: Joi.string().required(),
            city: Joi.string().required(),
            postalCode: Joi.string().required(),
        }).required(),
        paymentMethod: Joi.string().max(64).required(),
        shippingPrice: Joi.number().required(),
        totalPrice: Joi.number().required()
    });

    return schema.validate(data);
}


module.exports.registerValidation = registerValidation;
module.exports.loginValidation = loginValidation;
module.exports.productValidation = productValidation;
module.exports.orderValidation = orderValidation;
module.exports.categoryValidation = categoryValidation;

