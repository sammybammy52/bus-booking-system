
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv/config');
const { query } = require('express');

//handle errors
const handleErrors = (err) => {
    console.log(err.message, err.code);
    let errors = { email: '', password: '' };



    //incorrect email

    if (err.message === 'incorrect email') {
        errors.email = 'that email is not registered';
    }

    //incorrect password

    if (err.message === 'incorrect password') {
        errors.email = 'that password is not incorrect';
    }



    //duplicate error code

    if (err.code === 11000) {
        errors.email = 'that email is already registered';
        return errors;
    }

    if (err.message.includes('user validation failed')) {
        Object.values(err.errors).forEach(({ properties }) => {
            errors[properties.path] = properties.message;
        })
    }

    return errors;
}

//function for JWT

const maxAge = 3 * 24 * 60 * 60;

const createToken = (id, email) => {
    //second argument is string secret, dont share on repos
    return jwt.sign({ id, email }, process.env.SECRET_KEY, { expiresIn: maxAge });
}




module.exports.signup_get = (req, res) => {
    res.render('signup');
}

module.exports.login_get = (req, res) => {
    res.render('login');
}

module.exports.signup_post = async (req, res) => {

    const { email, password } = req.body;

    try {
        const user = await User.create({ email, password });

        const token = createToken(user._id, user.email);
        const user_id = user._id;
        const user_email = user.email;
        
        res.status(201).json({
            user: {
                id: user_id,
                email: user_email,
            },
            token: token
        });

    } catch (err) {
        const errors = handleErrors(err);
        res.status(400).json({ errors })
    }


}

module.exports.login_post = async (req, res) => {

    const { email, password } = req.body;

    try {
        const user = await User.login(email, password);
        const token = createToken(user._id, user.email);

        const user_id = user._id;
        const user_email = user.email;
        
        res.status(201).json({
            user: {
                id: user_id,
                email: user_email,
            },
            token: token
        });

        
    } catch (err) {
        const errors = handleErrors(err)
        res.status(400).json({ errors });
    }

}

module.exports.login_google_post = async (req, res) => {


    try {

        const { email } = req.body;

        const filter = { email: email };

        //check query
        const query = await User.findOne(filter).exec();

        if (query != null) {
            user = query;

            const user_id = user._id;
            const user_email = user.email;

            token = createToken(user._id, user.email);

            res.status(201).json({
                user: {
                    id: user_id,
                    email: user_email,
                },
                token: token
            });

        }
        else {
            const gen_password = makeid(8);
            const new_user = { email: email, password: gen_password };

            const user = await User.create(new_user);

            token = createToken(user._id, user.email);

            const user_id = user._id;
            const user_email = user.email;

            res.status(201).json({
                user: {
                    id: user_id,
                    email: user_email,
                },
                token: token
            });
        }



    } catch (err) {
        const errors = handleErrors(err)
        res.status(400).json({ errors });
    }

}

module.exports.logout_get = (req, res) => {
    res.cookie('jwt', '', { maxAge: 1 });
    res.redirect('/');
}



function makeid(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}