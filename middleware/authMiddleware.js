const jwt = require('jsonwebtoken');
const User = require('../models/User');

const requireAuth = (req, res, next) => {
    const token = req.headers.token;

    //check if webtoken exists and is verifed

    if (token) {
        jwt.verify(token, process.env.SECRET_KEY, (err, decodedToken) => {
            if (err) {
                console.log(err.message);
                res.status(403).json({
                    status: "Unauthorized"
                })
            }
            else{
                console.log(decodedToken);
                next();
            }
        });
    }
    else{
        res.status(403).json({
            status: "Unauthorized"
        })
    }
}


const checkUser = (req, res, next) => {
    const token = req.cookies.jwt;

    if (token) {
        jwt.verify(token, 'sammybammy', async (err, decodedToken) => {
            if (err) {
                console.log(err.message);
                res.locals.user = null;
                next();
            }
            else{
                console.log(decodedToken);
                let user = await User.findById(decodedToken.id);
                res.locals.user = user;
                next();
            }
        });
    }
    else{
        res.locals.user = null;
        next();
    }

} 
module.exports = { requireAuth, checkUser };