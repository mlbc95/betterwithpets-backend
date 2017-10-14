const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Schema = mongoose.Schema;

const Event = require('./Event');

const VendorSchema = new Schema({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    businessName: {
        type: String,
        required: true
    },
    contactName: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    type: {
        type: String,
        required: true
    },
    contact: {
        address: {
            street: String,
            street2: String,
            city: String,
            state: String,
            zip: Number
        },
        phone: String
    },
    events: [{
        type: Schema.Types.ObjectId,
        ref: 'Event'
    }]
});

const Vendor = module.exports = mongoose.model('Vendor', VendorSchema);

module.exports.getVendorByEmail = (email, callback) => {
    const query = {email: email};
    Vendor.findOne(query, callback);
}

module.exports.registerVendor = (newVendor, callback) => {
    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newVendor.password, salt, (err, hash) => {
            if(err) {
                console.log('Error hashing Vendor password', err);
            }

            newVendor.password = hash;
            newVendor.save(callback);
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

module.exports.addVendorProfile = (id, newVendorProfile, callback) => {

    Vendor.findById(id, (err, vendor) => {
        if(err) {
            return res.json({
                success: false,
                message: 'Error fetching Vendor by Id',
                error: err
            });
        }

        vendor.description = newVendorProfile.description;
        vendor.contact.address.street = newVendorProfile.contact.address.street;
        vendor.contact.address.street2 = newVendorProfile.contact.address.street2;
        vendor.contact.address.city = newVendorProfile.contact.address.city;
        vendor.contact.address.state = newVendorProfile.contact.address.state;
        vendor.contact.address.zip = newVendorProfile.contact.address.zip;
        vendor.contact.phone = newVendorProfile.contact.phone;
    
        vendor.save(callback);
    });
}