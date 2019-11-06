const _ = require('lodash');
const  { validateUser } = require('../models/user');
const UserRepository = require('../repositories/user');

//middleware
const admin = require('../middleware/admin');
const auth = require('../middleware/auth');
const validate = require('../middleware/validate');

//express requires
const express = require('express');
const router = express.Router();



router.get('/me', auth, async (req, res) => {
    const user = await UserRepository.findSelf(req);
    res.send(user);
});

router.get('/', [auth], async (req, res) => {
    res.send(await UserRepository.getAllUsers());
});

router.get('/:id', [auth], async (req, res) => {
    const user = await UserRepository.getUserById(req);
    if (!user) return res.status(404).send('Cannot find user with that id');

    res.send(user);
});

router.post('/', validate(validateUser), async (req, res) => {
    let user = await UserRepository.storeUser(req);

    res.header('x-auth-token', user.generateAuthToken()).send(
        _.pick(user, ['_id', 'first_name', 'last_name', 'email']))
    ;
});

router.put('/:id', [auth, validate(validateUser)], async (req, res) => {
    const user = await UserRepository.updateUser(req);
    if (!user) return res.status(404).send('Cannot find User.');

    res.send(user);
});

router.delete('/:id', [auth], async (req, res) => {
    const user = await UserRepository.deleteUser(req);
    if (!user) return res.status(404).send('Cannot delete user: does not exist.');
    res.send(user);
});

module.exports = router;