const { User } = require('../models/user')
const { parsed: { SECRET_KEY } } = require('dotenv').config();
const router = require('express').Router();
const jwt = require('jsonwebtoken');
const auth = require('./auth');
const bcrypt = require('bcryptjs');


//Register random user and send jwt token
router.post('/register', async (req, res) => {
    try {
        const { email, password } = req.body;
        const token = jwt.sign({ email }, SECRET_KEY);
        const userExists = await User.findOne({ email: email });
        if (userExists) {
            res.status(409).send("user already exists");
        } else {
            const hashPassword = await bcrypt.hash(password, 10);
            const user = new User({ ...req.body, password: hashPassword });
            await user.save((err) => {
                if (err) {
                    res.status(400).send(err.message);
                } else {
                    const { password, __v, ...userDetails } = user._doc;
                    res.setHeader('token', token).status(200).json({
                        ...userDetails, token
                    });
                }
            });
        }
    } catch (err) {
        res.status(500).send("Internal server error");

    }
})

//Login registered user and respond with jwt token
router.post('/login', async (req, res) => {
    try {
        const { email, password: userPassword } = req.body;
        const user = await User.findOne({ email: email });
        if (!user) {
            res.status(401).send('Invalid email or password');
        }
        const isMatch = await bcrypt.compare(userPassword, user.password);
        if (!isMatch) {
            res.status(401).send('Invalid password');
        }
        const token = jwt.sign({ email }, SECRET_KEY);
        const { password, __v, ...userDetails } = user._doc;
        res.setHeader('token', token).status(200).json({ ...userDetails, token });
    } catch (err) {
        res.status(500).send("Internal server error");
    }
}
);

router.post('/follow/:id', auth, async (req, res) => {
    try {
        const { email: currentUserEmail } = req.user;
        const currentUser = await User.findOne({ email: currentUserEmail });
        const userToFollow = await User.findById(req.params.id);
        if (currentUser.id === userToFollow.id)
            res.status(400).send('You cannot follow yourself');
        if (await currentUser.followings.includes(userToFollow.id))
            res.status(400).send('You are already following this user');
        currentUser.followings.push(userToFollow.id);
        userToFollow.followers.push(currentUser.id);
        res.status(200).send("Successfully followed user");
    } catch (err) {
        res.status(500).send("Internal server error");
    }

})

//Post a new user to db
router.post('/user', (req, res) => {

    const userExists = User.findOne({ email: req.body.email });
    const user = new User(req.body);
    User(req.body).save().then(
        users => {
            res.json(users)
        }
    ).catch(err => res.status(400).json('Error! '))
});


//Delete a user from db via its id
router.delete('/user/:id', (req, res) => {
    User.findOneAndRemove({
        _id: req.params.id
    })
        .then(success => res.json('Success! User deleted.'))
        .catch(err => res.status(400).json('Error! ' + err))
})

//Edit a user detail
router.put('/user/:id', (req, res) => {
    User.findByIdAndUpdate(req.params.id)
        .then(user => res.json('Success! User updated.'))
        .catch(err => res.status(400).json('Error! ' + err))
})

// Export API routes
module.exports = router;