const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const User = require('./User');
const Pet = require('./Pet');

const EventSchema = new Schema({
    type: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    date: {
        type: Date,
        default: Date.now()
    },
    duration: {
        amount: Number,
        unit: String
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    vendor: {
        type: Schema.Types.ObjectId,
        ref: 'Vendor'
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    pet: {
        type: Schema.Types.ObjectId,
        ref: 'Pet'
    },
    done: {
        type: Boolean,
        default: false
    }
});

const Event = module.exports = mongoose.model('Event', EventSchema);

module.exports.addEvent = (newEvent, callback) => {
    newEvent.duration.amount = newEvent.duration.amount;
    newEvent.duration.unit = newEvent.duration.unit;

    newEvent.save(callback);
}

module.exports.getEventsByUser = (id, callback) => {
    const query = {
        user: id
    };
    Event.find(query)
        .populate('user', '-password -__v -stories')
        .populate('pet', '-__v -details.photo')
        .populate('vendor', '-__v')
        .exec(callback);
}

module.exports.getParkEvents = (callback) => {
    const query = {
        type: 'park' || 'Park'
    };
    Event.find(query)
        .populate('user', '-password -__v -stories')
        .populate('pet', '-__v -details.photo')
        .populate('vendor', '-__v -password')
        .exec(callback);
}

module.exports.getEventsByVendor = (id, callback) => {
    const query = {
        vendor: id
    };
    Event.find(query)
        .populate('user', '-password -__v -stories')
        .populate('pet', '-__v -details.photo')
        .populate('vendor', '-__v -password')
        .exec(callback);
}

module.exports.getLatest = (id, callback) => {
    const findQuery = {user: id};
    const query = {createdAt: -1};
    Event.findOne(findQuery)
        .sort(query)
        .exec(callback);
}