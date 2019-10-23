const mongoose = require('mongoose');
const Joi = require('joi');

const imageSchema = new mongoose.Schema({
    // filename: {
    //     type: String,
    //     required: true,
    //     minLength: 3,
    //     maxLength: 50,
    // },
    // url: {
    //     type: String,
    //     required: true,
    //     minLength: 3,
    //     maxLength: 50,
    // }
});

const Image = mongoose.model('Image', imageSchema);

async function validateImage(image) {
    const schema = {
        // filename: Joi.string().trim().min(5).max(50).required(),
        // url: Joi.string().email().min(5).max(255).required(),
    };

    try {
        await Joi.validate(image, schema);
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

exports.Image = Image;
exports.imageSchema = imageSchema;
exports.validateImage = validateImage;