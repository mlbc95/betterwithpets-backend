const JwtStrategy = require('passport-jwt').Strategy;
const extractJwt = require('passport-jwt').ExtractJwt;
const config = require('./keys');
const User = require('../models/User');

module.exports = (passport) => {
    let opts = {};

    opts.jwtFromRequest = extractJwt.fromAuthHeaderWithScheme('jwt');
    opts.secretOrKey = config.secretKEY;

    passport.use(new JwtStrategy(opts, (jwt_payload, done) => {
        console.log('JWT_Payload', jwt_payload);
        User.getUserById(jwt_payload.user._id, (err, user) => {
            if(err) {
                return done(err, false);
            }

            if(user) {
                return done(null, user);
            } else {
                return done(null, false);
            }
        });
    }));
}