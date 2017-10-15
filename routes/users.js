const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/keys');

const User = require('../models/User');

//Add this to the route you want to protect: 'passport.authenticate('jwt', {session:false})'
//example: router.get('/:id', passport.authenticate('jwt', {session:false}), (req, res, next) => {});

//Register
router.post('/register', (req, res, next) => {
    let newUser = new User({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: req.body.password
    });

    User.registerUser(newUser, (err, user) => {
        if (err) {
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

//Get User By Id
router.get('/:id', (req, res, next) => {
    User.getUserById(req.params.id, (err, result) => {
        if (err) {
            res.json({
                success: false,
                message: 'Error fetching User',
                error: err
            });
        } else {
            res.json({
                success: true,
                message: 'User fetched',
                user: result
            });
        }
    });
});

//Authenticate
router.post('/login', (req, res, next) => {
    console.log('Body coming /login/: ', req.body);

    const email = req.body.credentials.email;
    const password = req.body.credentials.password;

    User.getUserByEmail(email, (err, user) => {
        if (err) {
            return res.json({
                success: false,
                message: 'Error fetching User with email',
                error: err
            });
        }

        if (!user) {
            return res.json({
                success: false,
                message: 'Email does not exist'
            });
        }

        User.comparePassword(password, user.password, (err, isMatched) => {
            if (err) {
                return res.json({
                    success: false,
                    message: 'Error comparing password',
                    error: err
                });
            }

            if (isMatched) {
                const token = jwt.sign({
                    user: user
                }, config.secretKEY, {
                    expiresIn: 3600
                });

                user.loginCount++;
                user.save();

                res.json({
                    success: true,
                    token: 'JWT ' + token,
                    message: 'Logged In Successfully',
                    user: {
                        _id: user._id,
                        firstName: user.firstName,
                        lastName: user.lastName,
                        email: user.email,
                        loginCount: user.loginCount
                    }
                });
            } else {
                return res.json({
                    success: false,
                    message: 'Password does not match'
                });
            }
        });
    });
});

//Add Profile
router.post('/addProfile/:id', (req, res, next) => {
    let newUserProfile = new User({
        contact: req.body.contact
    })

    User.addUserProfile(req.params.id, newUserProfile, (err, user) => {
        if (err) {
            return res.json({
                success: false,
                message: 'Error adding User profile',
                error: err
            });
        }

        res.json({
            success: true,
            message: 'Added profile',
            user: user
        });
    });
});

module.exports = router;