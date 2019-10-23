const express = require('express');
const router = express.Router();
const bcrypt = require("bcrypt");
const { User, validateUser } = require('../models/user');