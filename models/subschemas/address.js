const mongoose = require('mongoose');
const Joi = require('joi');

const addressSchema = new mongoose.Schema({
    city: {
        type: String,
        required: true,
        minLength: 3,
        maxLength: 50,
    },
    region: {
        type: String,
        required: true,
        minLength: 3,
        maxLength: 50,
    },
    postal: {
        type: String,
        required: true,
        minLength: 5,
        maxLength: 10,
    },
    country: {
        type: String,
        required: true,
        minLength: 3,
        maxLength: 50,
    }
});

const Address = mongoose.model('Address', addressSchema);

async function validateAddress(address) {
    const schema = {
        city: Joi.string().trim().min(3).max(50).required(),
        region: Joi.string().trim().min(3).max(50).required(),
        postal: Joi.string().trim().min(5).max(10).required(),
        country: Joi.string().trim().min(3).max(50).required(),
    };

    try {
        await Joi.validate(address, schema);
    } catch (ex) {
        return {
            error: {
                details: [
                    { message : ex.message }
                ]
            }
        }
    }

    return true;
}

exports.Address = Address;
exports.addressSchema = addressSchema;
exports.validateAddress = validateAddress;