const config = require('config');
const mongoose = require('mongoose');
const Joi = require('joi');
const jwt = require('jsonwebtoken');
const { addressSchema, validateAddress } = require('./subschemas/address');
require('mongoose-type-url');
const uniqueValidator = require('mongoose-unique-validator');
const { isEmail } = require('validator');
// const { imageSchema, validateImage } = require('./subschemas/image');
// const { roleSchema, validateRole } = require('./role');
// const { venueSchema, validateVenue } = require('./venue');


const userSchema = new mongoose.Schema({
    first_name: {
        type: String,
        required: true,
        minLength: 1,
        maxLength: 50,
    },
    last_name: {
        type: String,
        required: true,
        minLength: 1,
        maxLength: 50,
    },
    email: {
        type: String,
        unique: true,
        required: true,
        minLength: 5,
        maxLength: 255,
        validate: [isEmail, 'invalid email']
    },
    address: {
        type: addressSchema,
        required: true
    },
    password: {
        type: String,
        minLength: 5,
        maxLength: 1024,
        required: true,
        select: false
    },
    // social_data: [{
    //     platform: {
    //         type: String,
    //         required: true,
    //         validate: {
    //             validator: function(v) {
    //                 const platforms = config.get('social_platforms');
    //                 return platforms.includes(v);
    //             }
    //         }
    //     },
    //     url: {
    //         type: mongoose.SchemaTypes.Url,
    //         required: true
    //     }
    // }],
    // role: roleSchema,
    // profile_image: imageSchema,
    // header_image: imageSchema,
    // // COMIC ROLE PROPERTIES
    // bio: {
    //     type: String,
    //     min: 10,
    //     max: 1000
    // },
    // clip_url: {
    //     type: mongoose.SchemaTypes.Url,
    // },
    // points: {
    //     type: Number,
    //     default: 0
    // },
    //PRODUCER ROLE PROPERTIES
    // contact_email: {
    //     type: String,
    //     unique: true,
    //     minLength: 5,
    //     maxLength: 255,
    //     validate: [isEmail, 'invalid email']
    // },
    // shows_managed: [{
    //     name: {
    //         type: String,
    //         required: true,
    //         min: 3,
    //         max: 255
    //     },
    //     venue: {
    //         type: venueSchema,
    //         required: true
    //     },
    // }]
});

userSchema.plugin(uniqueValidator);
userSchema.methods.generateAuthToken = function() {
    return jwt.sign({
        _id: this._id,
        // role: this.role
    }, config.get('jwtPrivateKey'));
};

const User = mongoose.model('User', userSchema);

async function validateUser(user) {
    const schema = {
        first_name: Joi.string().trim().min(1).max(50).required(),
        last_name: Joi.string().trim().min(1).max(50).required(),
        email: Joi.string().email().min(5).max(255).required(),
        password: Joi.string().min(5).max(20).trim().required(),
        address: Joi.required(),
        //social_data: TODO validate social data from client
        // bio: Joi.string().trim().min(10).max(1000),
        // clip_url: Joi.string().uri(),
        // points: Joi.number().min(0),
        // contact_email: Joi.string().email().min(5).max(255),
        // shows_managed:  TODO validate shows_managed from client
    };

    await Promise.all([
        Joi.validate(user, schema),
        validateAddress(user.address),
        // validateImage(user.profile_image),
        // validateImage(user.header_image),
        // validateRole(user.role),
        // user.shows_managed === undefined ? null : validateVenue(user.show)
    ]);

    return true;
}

async function validateAuth(user) {
    const schema = {
        email: Joi.string().email().min(5).max(255).required(),
        password: Joi.string().min(5).max(255).trim().required()
    };

    await Joi.validate(user, schema);

    return true;
}

exports.User = User;
exports.userSchema = userSchema;
exports.validateUser = validateUser;
exports.validateAuth = validateAuth;