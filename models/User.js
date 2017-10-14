const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongooseUnique = require('mongoose-unique-validator')
const bcrypt = require('bcryptjs');

//User Schema
const UserSchema = new Schema({
    googleId: {
        type: String
    },
    email: {
        type: String,
        required: true,
        set: toLower,
        unique: true
    },
    firstName: {
        type: String
    },
    lastName: {
        type: String
    },
    profilePicture: {
        type: String
    },
    password: {
        type: String
    },
    contact: {
        phone: {
            type: String
        },
        address: {
            street: {
                type: String
            },
            street2: {
                type: String
            },
            city: {
                type: String
            },
            state: {
                type: String
            },
            zip: {
                type: Number
            }
        }
    },
    stories: [{
        type: String
    }],
    pets: [{
        type: Schema.Types.ObjectId,
        ref: 'Pet'
    }]
});

//Set Email to Lowercase
function toLower(str) {
    return str.toLowerCase();
}

//MongooseUnique Middleware
UserSchema.plugin(mongooseUnique);

//Create Model out of Schema
const User = module.exports = mongoose.model('User', UserSchema);

module.exports.getUserById = (id, callback) => {
    User.findById(id, callback);
}

module.exports.registerUser = (newUser, callback) => {
    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
            if(err) {
                console.error(`Error hashing password...: ${err}`);
            }

            newUser.password = hash;
            newUser.save(callback);
        });
    });
}

module.exports.comparePassword = (candidatePassword, hash, callback) => {
    bcrypt.compare(candidatePassword, hash, (err, isMatched) => {
        if(err) {
            console.log(`Error comparing password...: ${err}`);
        }

        callback(null, isMatched);
    });
}