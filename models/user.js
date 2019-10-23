const config = require('config');
const mongoose = require('mongoose');
const Joi = require('joi');
const jwt = require('jsonwebtoken');
const { isEmail } = require('validator');
require('mongoose-type-url');

const roleSchema = new mongoose.Schema({});

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

const imageSchema = new mongoose.Schema({

});

const venueSchema = new mongoose.Schema({

});

const userSchema = new mongoose.Schema({
    first_name: {
        type: String,
        required: true,
        minLength: 5,
        maxLength: 50,
    },
    last_name: {
        type: String,
        required: true,
        minLength: 5,
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
        required: true
    },
    social_data: [{
        platform: {
            type: String,
            required: true,
            validate: {
                validator: function(v) {
                    const platforms = config.get('social_platforms');
                    return platforms.includes(v);
                }
            }
        },
        url: {
            type: mongoose.SchemaTypes.Url,
            required: true
        }
    }],
    role: roleSchema,
    profile_image: imageSchema,
    header_image: imageSchema,
    // COMIC ROLE PROPERTIES
    bio: {
        type: String,
        min: 10,
        max: 1000
    },
    clip_url: {
        type: mongoose.SchemaTypes.Url,
    },
    points: {
        type: Number,
        default: 0
    },
    //PRODUCER ROLE PROPERTIES
    contact_email: {
        type: String,
        unique: true,
        required: true,
        minLength: 5,
        maxLength: 255,
        validate: [isEmail, 'invalid email']
    },
    shows_managed: [{
        name: {
            type: String,
            required: true,
            min: 3,
            max: 255
        },
        venue: venueSchema
    }]
});

userSchema.methods.generateAuthToken = function() {
    return jwt.sign({
        _id: this._id,
        isAdmin: this.isAdmin
    }, config.get('jwtPrivateKey'));
};

const User = mongoose.model('User', userSchema);

async function validateUser(user) {
    const schema = {
        name: Joi.string().trim().min(5).max(50).required(),
        email: Joi.string().email().min(5).max(255).required(),
        password: Joi.string().min(5).max(255).trim().required()
    };

    try {
        await Joi.validate(user, schema);
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

async function validateAuth(user) {
    const schema = {
        email: Joi.string().email().min(5).max(255).required(),
        password: Joi.string().min(5).max(255).trim().required()
    };

    try {
        await Joi.validate(user, schema);
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

exports.User = User;
exports.userSchema = userSchema;
exports.validateUser = validateUser;
exports.validateAuth = validateAuth;