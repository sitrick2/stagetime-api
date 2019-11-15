const { User } = require('../models/user');
//express requires
const express = require('express');
const router = express.Router();

router.post('/login', async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  const token = user.generateAuthToken();
  return res.status(200)
    .cookie('refreshToken', 'test', { httpOnly: true, secure: true })
    .send({token});
});

module.exports = router;
