const jwt = require('jsonwebtoken')
const eJwt = require('express-jwt')
require('dotenv').config()
const User = require('../models/user')

exports.signup = async (req, res) => {
    const userExists = await User.findOne({
        email: req.body.email
    });
    if (userExists) return res.status(403).json({
        error: 'Email is taken!'
    });
    const user = await new User(req.body);
    await user.save();
    res.status(200).json({
        message: 'Signup success'
    });
}

exports.signin = async (req, res) => {
    // FInd the User based on email
    const { email, password } = req.body
    User.findOne({ email }, (err, user) => {
        if (err || !user) {
            errorHandler('User not exist', res)
        }
        else if (!user.authenticate(password)) {
            errorHandler('Incorrect password', res)
        }
        else {
            const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
                algorithm: "HS256",
            });
            // Persist token
            // res.cookie('t', token, { expire: new Date() + 9999 })
            const { _id, name, email } = user
            return res.json({
                token,
                user: {
                    _id, email, name
                }
            })
        }
    });
}

exports.signout = (req, res) => {
    res.clearCookie('t')
    return res.json({ message: 'Signout success' })
}

exports.requireSignin = eJwt({
    // If the token is valid, express jwt appends the
    // verified user id in an auth key to the request object 
    secret: process.env.JWT_SECRET,
    algorithms: ['HS256'],
    userProperty: "auth"
});

const errorHandler = (msg, res) => {
    return res.status(401).json({
        error: msg
    })
}

