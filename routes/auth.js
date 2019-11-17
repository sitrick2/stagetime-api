const { User } = require('../models/user');
//express requires
const express = require('express');
const router = express.Router();

router.post('/login', async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return res.status(400).send('Invalid login.');
  }

  const token = user.generateAuthToken();
  return res.status(200)
    .cookie('refreshToken', 'test', {
      domain: 'localhost:8080', httpOnly: true, secure: true, sameSite: 'None'
    })
    .send({token});
});

module.exports = router;
