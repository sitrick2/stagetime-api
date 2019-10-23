const mongoose = require('mongoose');
const Joi = require('joi');



const Role = mongoose.model('Role', roleSchema);

async function validateRole(role) {
    const schema = {
        // name: Joi.string().trim().min(5).max(50).required(),
        // email: Joi.string().email().min(5).max(255).required(),
        // password: Joi.string().min(5).max(255).trim().required()
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