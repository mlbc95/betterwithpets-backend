const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/keys');

const Vendor = require('../models/Vendor');

router.post('/addVendor', (req, res, next) => {
    let newVendor = new Vendor({
        email: req.body.email,
        password: req.body.password,
        businessName: req.body.businessName,
        contactName: req.body.contactName,
        type: req.body.type
    });

    Vendor.registerVendor(newVendor, (err, vendor) => {
        if (err) {
            res.json({
                success: false,
                message: 'Failed to register vendor',
                error: err
            });
        } else {
            res.json({
                success: true,
                message: 'Vendor registered',
                vendor: vendor
            });
        }
    });
});

router.post('/addProfile/:id', (req, res, next) => {
    let newVendorProfile = new Vendor({
        contact: req.body.contact,
        description: req.body.description
    });

    Vendor.addVendorProfile(req.params.id, newVendorProfile, (err, vendor) => {
        if (err) {
            return res.json({
                success: false,
                message: 'Error adding Vendor profile',
                error: err
            });
        }

        res.json({
            success: true,
            message: 'Added profile',
            vendor: vendor
        });
    });
});

//Authenticate
router.post('/login', (req, res, next) => {

    const email = req.body.credentials.email;
    const password = req.body.credentials.password;

    Vendor.getVendorByEmail(email, (err, vendor) => {
        if (err) {
            return res.json({
                success: false,
                message: 'Error fetching Vendor with email',
                error: err
            });
        }

        if (!vendor) {
            return res.json({
                success: false,
                message: 'Email does not exist'
            });
        }

        Vendor.comparePassword(password, vendor.password, (err, isMatched) => {
            if (err) {
                return res.json({
                    success: false,
                    message: 'Error comparing password',
                    error: err
                });
            }

            if (isMatched) {
                const token = jwt.sign({
                    vendor: vendor
                }, config.secretKEY, {
                    expiresIn: 3600
                });

                res.json({
                    success: true,
                    token: 'JWT ' + token,
                    message: 'Logged In Successfully',
                    vendor: {
                        _id: vendor._id,
                        vendor: vendor.email,
                        contactName: vendor.contactName,
                        businessName: vendor.businessName
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

//Get Vendors
router.get('/', (req, res, next) => {
    Vendor.getAllVendors((err, vendors) => {
        if(err) {
            return res.json({
                success: false,
                message: 'Error fetching all vendors',
                error: err
            });
        }

        res.json({
            success: true,
            message: 'Vendors fetched',
            vendors: vendors
        });
    });
});

module.exports = router;