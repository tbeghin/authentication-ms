const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const User = require('../models/user');
const configAuth = require('../config/auth'); // use this one for testing

module.exports = passport => {
    // used to serialize the user for the session
    passport.serializeUser((user, done) => done(null, user.id));

    // used to deserialize the user
    passport.deserializeUser((id, done) => User.findById(id, (err, user) => done(err, user)));

    const googleStrategy = configAuth.googleAuth;
    googleStrategy.passReqToCallback = true; // allows us to pass in the req from our route (lets us check if a user is logged in or not)
    passport.use(
        new GoogleStrategy(
            googleStrategy,
            (req, token, refreshToken, profile, done) => {
                process.nextTick(() => {
                    if (!req.user) {
                        User.findOne({'google.id': profile.id}, (err, user) => {
                            if (err) {
                                return done(err);
                            }
                            if (user) {
                                if (!user.google.token) {
                                    user.google.token = token;
                                    user.google.name = profile.displayName;
                                    user.google.email = (profile.emails[0].value || '').toLowerCase(); // pull the first email
                                    user.save(err => {
                                        if (err) {
                                            return done(err);
                                        }
                                        return done(null, user);
                                    });
                                }
                                return done(null, user);
                            } else {
                                let newUser = new User();
                                newUser.google.id = profile.id;
                                newUser.google.token = token;
                                newUser.google.name = profile.displayName;
                                newUser.google.email = (profile.emails[0].value || '').toLowerCase(); // pull the first email
                                newUser.save(err => {
                                    if (err) {
                                        return done(err);
                                    }
                                    return done(null, newUser);
                                });
                            }
                        });
                    } else {
                        // user already exists and is logged in, we have to link accounts
                        let user = req.user; // pull the user out of the session
                        user.google.id = profile.id;
                        user.google.token = token;
                        user.google.name = profile.displayName;
                        user.google.email = (profile.emails[0].value || '').toLowerCase(); // pull the first email
                        user.save(err => {
                                if (err) {
                                    return done(err);
                                }
                                return done(null, user);
                            }
                        );
                    }
                });
            }
        )
    );
};
