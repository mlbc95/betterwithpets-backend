const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/keys');

const User = require('../models/User');

//Register
router.post('/register', (req, res, next) => {
    console.log(`Body coming /register/ ${req.body}`);
    let newUser = new User({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: req.body.password
    });

    console.log(`newUser object ${newUser}`);

    User.registerUser(newUser, (err, user) => {
        if(err) {
            res.json({
                success: false,
                message: 'Failed to register user',
                error: err
            });
        } else {
            res.json({
                success: true,
                message: 'User registered',
                user: user
            });
        }
    });
});

module.exports = router;