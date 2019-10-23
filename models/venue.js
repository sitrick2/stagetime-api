const mongoose = require('mongoose');
const Joi = require('joi');
const { addressSchema, validateAddress } = require('./subschemas/address')

const venueSchema = new mongoose.Schema({
    name: {
        type: String,
        min: 3,
        max: 255,
        required: true
    },
    address: {
        type: addressSchema,
        required: true
    },
    //TODO: Shows hosted (once Show model defined)
    //TODO: Banned Users?
});

const Venue = mongoose.model('Venue', venueSchema);

async function validateVenue(venue) {
    const schema = {
        name: Joi.string().trim().min(5).max(50).required(),
        // email: Joi.string().email().min(5).max(255).required(),
        // password: Joi.string().min(5).max(255).trim().required()
    };

    try {
        await Joi.validate(venue, schema);
        await validateAddress(venue.address);
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

exports.Venue = Venue;
exports.venueSchema = venueSchema;
exports.validateVenue = validateVenue;