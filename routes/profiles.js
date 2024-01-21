var express = require('express');
var router = express.Router();

const User = require('../models/users');

router.get('/users', (req, res) => {
    User.find({}, 'username')
        .then(users => {
            const usernames = users.map(user => user.username);
            res.json({ result: true, usernames: usernames });
        })
});

module.exports = router;
