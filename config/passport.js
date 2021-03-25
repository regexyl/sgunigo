const GoogleStrategy = require('passport-google-oauth20').Strategy;
const mongoose = require('mongoose')
const User = require('../models/User')

module.exports = function (passport) {
    passport.use(
        new GoogleStrategy(
            {
                clientID: process.env.GOOGLE_CLIENT_ID,
                clientSecret: process.env.GOOGLE_CLIENT_SECRET,
                callbackURL: "/auth/google/callback"
            }, 
            async (accessToken, refreshToken, profile, cb) => { // cb = callback
                const newUser = {
                    googleId: profile.id,
                    displayName: profile.displayName,
                    firstName: profile.name.givenName,
                    lastName: profile.name.familyName,
                    image: profile.photos.value
                }

                try {
                    let user = await User.findOne({ googleId: profile.id }) // using Mongoose
                    if (user) { // if there is an existing user
                        cb(null, user)
                    } else {
                        user = await User.create(newUser)
                        cb(null, user)
                    }
                } catch(err) {
                    console.error(err)
                }
            }
        )
    )

    /* Each subsequent request will not contain credentials, 
    but rather the unique cookie that identifies the session. 
    In order to support login sessions, Passport will serialize and 
    deserialize user instances to and from the session. */

    // StackOverflow - Understanding passport serialize deserialize
    // https://stackoverflow.com/questions/27637609/understanding-passport-serialize-deserialize

    passport.serializeUser((user, done) => {
        done(null, user.id)
    })
      
    passport.deserializeUser((id, done) => {
        User.findById(id, (err, user) => done(err, user));
    })
}