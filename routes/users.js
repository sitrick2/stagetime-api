const admin = require('../middleware/admin');
const auth = require('../middleware/auth');
const express = require('express');
const bcrypt = require("bcrypt");
const router = express.Router();
const validate = require('../middleware/validate');
const { User, validateUser } = require('../models/user');

router.get('/me', auth, async (req, res) => {
    //req.user comes from auth middleware
    const user = await User.findById(req.user._id).select('-password');
    res.send(user);
});

router.get('/', [auth], async (req, res) => {
    res.send(
        await User.find()
        .sort('email')
        .select('-password')
    );
});

router.get('/:id', [auth, admin], async (req, res) => {
   //TODO
    res.send('ENDPOINT UNDER CONSTRUCTION')
});

//TODO: update fields
router.post('/', validate(validateUser), async (req, res) => {
    let user = await User.findOne({ email: req.body.email });
    if (user) return res.status(400).send("User already exists.");

    user = await new User(_.pick(req.body, ['name', 'email', 'password']));
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    await user.save();

    res.header('x-auth-token', user.generateAuthToken()).send(_.pick(user, ['_id', 'name', 'email']));
});

//TODO: update fields
router.put('/:id', [auth, validate(validateUser)], async (req, res) => {
    const user = await User.findByIdAndUpdate(req.params.id, {
        $set: {
            name: req.body.name,
            email: req.body.email,
            password: req.body.password
        }
    }, { new: true });
    if (!user) return res.status(404).send('Cannot find User.');

    res.send(user);
});

//TODO: ensure testing is robust
router.delete('/:id', [auth, admin], async (req, res) => {
    const user = await User.findByIdAndRemove(req.params.id);
    if (!user) return res.status(404).send('Cannot delete user: does not exist.');
    res.send(user);
});

module.exports = router;