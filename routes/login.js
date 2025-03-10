const loginRouter = require('express').Router()
const passport = require('passport')
const jwt = require('jsonwebtoken')

loginRouter.route('/').post(async (req, res, next) => {
  passport.authenticate('login', async (err, user) => {
    try {
        if (err) {
            return next(err);
        }
        if (!user) {
            const error = new Error('Username or password is incorrect');
            return next(error);
        }

        req.login(user, { session: false },
            async (error) => {
                if (error) return next(error);

                const body = { _id: user._id, username: user.username };
                //You store the id and email in the payload of the JWT. 
                // You then sign the token with a secret or key (JWT_SECRET), and send back the token to the user.
                // DO NOT STORE PASSWORDS IN THE JWT!
                const token = jwt.sign({ user: body }, process.env.JWT_SECRET);

                return res.json({ token });
            }
        );
    } catch (error) {
        return next(error);
    }
    
  })(req, res, next)
})

module.exports = loginRouter
