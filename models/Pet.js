const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Pet Schema
const PetSchema = new Schema({
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
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
});

//Create Model out of Schema
const Pet = module.exports = mongoose.model('Pet', PetSchema);