const express = require('express');
const router = express.Router();
const passport = require('passport');

const Pet = require('../models/Pet');
const User = require('../models/User');

router.post('/addpet', passport.authenticate('jwt', {session: false}), (req, res, next) => {
    User.findById(req.user._id, (err, user) => {
        if(err) {
            res.json({
                success: false,
                message: 'Error Fetching User By Id',
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

        let newPet = new Pet({
            name: req.body.name,
            category: req.body.category,
            breed: req.body.breed,
            gender: req.body.gender,
            details: req.body.details,
            visible: req.body.visible,
            user: user
        });

        Pet.addPet(newPet, (err, pet) => {
            if(err) {
                return res.json({
                    success: false,
                    message: 'Error adding pet',
                    error: err
                });
            }
            
            user.pets.push(pet._id);
            user.save();
            res.json({
                success: true,
                message: 'New pet added',
                pet: pet
            });
        });
    }); 
});

router.get('/getPetsByUser/:id', (req, res, next) => {
    Pet.getPetsByUser(req.params.id, (err, pets) => {
        if(err) {
            return res.json({
                success: false,
                message: 'Error fetching pets by User',
                error: err
            });
        }

        res.json({
            success: true,
            message: 'Pets Fetched',
            pets: pets
        });
    });
});

router.get('/getPets', (req, res, next) => {
    Pet.getAllPets((err, pets) => {
        if(err) {
            return res.json({
                success: false,
                message: 'Error fetching pets',
                error: err
            });
        } 

        res.json({
            success: true,
            message: 'Pets fetched',
            pets: pets
        });
    });
});

module.exports = router;