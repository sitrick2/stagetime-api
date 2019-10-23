const mongoose = require('mongoose');
const Joi = require('joi');

const roleSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    // permissions: {
    //
    // }
});

const Role = mongoose.model('Role', roleSchema);

async function validateRole(role) {
    const schema = {
        // name: Joi.string().trim().min(5).max(50).required(),
        // permissions: Joi.string().email().min(5).max(255).required(),
    };

    try {
        await Joi.validate(role, schema);
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

exports.Role = Role;
exports.roleSchema = roleSchema;
exports.validateRole = validateRole;