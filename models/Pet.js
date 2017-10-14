const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const User = require('./User');

//Pet Schema
const PetSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    breed: {
        type: String
    },
    gender: {
        type: String
    },
    details: {
        age: {
            number: {
                type: Number
            },
            unit: {
                type: String
            }
        },
        weight: {
            type: Number
        },
        size: {
            type: String
        },
        color: {
            type: String
        }
    },
    visible: {
        type: Boolean,
        default: false
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
});

PetSchema.post('remove', (pet) => {
    User.findById(pet.user, (err, user) => {
        user.pets.pull(pet);
        user.save();
    });
});

//Create Model out of Schema
const Pet = module.exports = mongoose.model('Pet', PetSchema);

module.exports.addPet = (newPet, callback) => {
    console.log(newPet);
    newPet.details.weight = newPet.details.weight;
    newPet.details.size = newPet.details.size;
    newPet.details.color = newPet.details.color;
    newPet.details.age.number = newPet.details.age.number;
    newPet.details.age.unit = newPet.details.age.unit;

    newPet.save(callback);
}

module.exports.getPetsByUser = (id, callback) => {
    const query = {user: id};
    Pet.find(query)
        .populate('user', '-password -__v -stories -pets')
        .exec(callback);
}

module.exports.getAllPets = (callback) => {
    const query = {visible: true};
    Pet.find(query)
        .populate('user', '-password -__v -stories -pets')
        .exec(callback);
}