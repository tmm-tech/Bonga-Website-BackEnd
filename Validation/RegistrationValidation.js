const Joi = require('joi');

const registrationSchema = Joi.object({
    fullname: Joi.string().min(2).max(100).required().messages({
        'string.empty': `Fullname is required`,
        'string.min': `Fullname should have a minimum length of {#limit}`,
        'string.max': `Fullname should have a maximum length of {#limit}`
    }),
    email: Joi.string().email().messages({
        'string.email': `Invalid email format`
    }),
    phone: Joi.string().length(12).pattern(/^[0-9]+$/).messages({
        'string.empty': `Phone number is required`,
        'string.length': `Phone number should have a length of {#limit}`,
        'string.pattern.base': `Invalid phone number format`
    }),
    password: Joi.string().min(6).required().messages({
        'string.empty': `Password is required`,
        'string.min': `Password should have a minimum length of {#limit}`
    }),
    confirmPassword: Joi.string().valid(Joi.ref('password')).required().messages({
        'string.empty': `Confirm password is required`,
        'any.only': `Confirm password should match password`
    }),
    Image: Joi.string().uri().allow('').messages({
        'string.uri': `Invalid profile image URL`
    })
}).xor('email', 'phone');

const validateCreateUserSchema = (payload) => {
    return createUserSchema.validateAsync(payload, { abortEarly: false })
}
module.exports = validateCreateUserSchema