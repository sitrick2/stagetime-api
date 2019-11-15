const { User } = require('../models/user');
const _ = require('lodash');
const bcrypt = require("bcrypt");


exports.findSelf = async (req) => {
    return await User.findById(req.user._id);
};

exports.getAllUsers = async () => {
    return await User.find().sort('email');
};

exports.storeUser = async (req) => {
    let address = {
        city: req.body.city,
        region: req.body.region,
        postal: req.body.postal,
        country: req.body.country
    };

    let user = await new User(_.pick(req.body, [
        'first_name',
        'last_name',
        'email',
        'password'
    ]));
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    user.address = address;
    await user.save();

    return user;
};

exports.getUserById = async (req) => {
    return await User.findById(req.params.id);
};

exports.updateUser = async (req) => {
    let password = undefined;
    if (req.body.password !== undefined){
        const salt = await bcrypt.genSalt(10);
        password = await bcrypt.hash(req.body.password, salt);
    }

    return await User.findByIdAndUpdate(req.params.id, {
        $set: {
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            email: req.body.email,
            address: req.body.address,
            password: password === undefined ? this.password : password
        }
    }, { new: true });
};

exports.deleteUser = async (req) => {
    return await User.findByIdAndRemove(req.params.id);
};
