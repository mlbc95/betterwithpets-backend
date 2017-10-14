const express = require('express');
const router = express.Router();
const passport = require('passport');

const Event = require('../models/Event');
const Pet = require('../models/Pet');
const User = require('../models/User');
const Vendor = require('../models/Vendor');

router.post('/addEvent', passport.authenticate('jwt', {session: false}), (req, res, next) => {
    console.log(`Body coming in /addEvent`, req.body);

    const vendorId = req.body.vendorId;
    const petId = req.body.petId;

    User.findById(req.user._id, (err, user) => {
        if(err) {
            return res.json({
                success: false,
                message: 'Error fetching User by Id',
                error: err
            });
        }

        if(!user) {
            res.json({
                success: false,
                message: 'Not Authenticated',
                error: 'Token might have been expired'
            });
        }

        Vendor.findById(req.body.vendorId, (err, vendor) => {
            if(err) {
                return res.json({
                    success: false,
                    message: 'Error fetching Vendor by Id',
                    error: err
                });
            }
            
            Pet.findById(req.body.petId, (err, pet) => {
                if(err) {
                    return res.json({
                        success: false,
                        message: 'Error fetching Pet by Id',
                        error: err
                    });
                }

                let newEvent = new Event({
                    type: req.body.type,
                    description: req.body.description,
                    duration: req.body.duration,
                    vendor: vendor,
                    pet: pet,
                    user: user
                });

                Event.addEvent(newEvent, (err, event) => {
                    if(err) {
                        return res.json({
                            success: false,
                            message: 'Error adding event',
                            error: err
                        });
                    }

                    vendor.events.push(event._id);
                    vendor.save();

                    res.json({
                        success:true,
                        message: 'Event added',
                        event: event
                    });
                });
            });
        })
    });
});

router.get('/', (req, res, next) => {
    Event.getAllEvents((err, events) => {
        if(err) {
            return res.json({
                success: false,
                message: 'Error fetching events',
                error: err
            });
        }

        res.json({
            success: true,
            message: 'Events fetched',
            events: events
        });
    });
});

router.get('/getEventsByUser/:id', (req, res, next) => {
    Event.getEventsByUser(req.params.id, (err, events) => {
        if(err) {
            return res.json({
                success: false,
                message: 'Error fetching events by User',
                error: err
            });
        }

        res.json({
            success: true,
            message: 'Events by User fetched',
            events: events
        });
    });
})

module.exports = router;