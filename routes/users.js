var express = require('express');
var router = express.Router();

const { checkBody } = require("../modules/checkBody");

const User = require('../models/users');

const bcrypt = require('bcrypt');
const uid2 = require('uid2');

const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

//  ------------------------------------------------------------------------------------------------------------------------------------------  Inscription

router.post('/register', (req, res) => {

  if (!checkBody(req.body, ["username", "password", "email"])) {
    res.json({ result: false, error: "Champs manquants ou vides" });
    return;
  }

  if (!emailRegex.test(req.body.email)) {
    res.json({ result: false, error: "Format d'e-mail invalide" });
    return;
  }

  User.findOne({ email: req.body.email })
    .then(data => {
      if (data !== null) {
        res.json({ result: false, error: "Un compte avec cet e-mail existe déjà" });
      } else {
        User.findOne({ username: req.body.username })
          .then(data => {
            if (data !== null) {
              res.json({ result: false, error: "Nom d'utilisateur déjà pris" });
            } else {
              const hashPassword = bcrypt.hashSync(req.body.password, 10);

              const newUser = new User({
                username: req.body.username,
                email: req.body.email,
                password: hashPassword,
                token: uid2(32),
              });

              newUser.save().then(newDoc => {
                res.json({ result: true, token: newDoc.token, username: newDoc.username});
              });
            }
          });
      }
    });
});

//  ------------------------------------------------------------------------------------------------------------------------------------------    Connection

router.post('/login', (req, res) => {

  if (!checkBody(req.body, ["email", "password"])) {
    res.json({ result: false, error: 'Champs manquants ou vides' });
    return;
  }

  User.findOne({ email: req.body.email }).then(data => {
    if (data && bcrypt.compareSync(req.body.password, data.password)) {

     res.json({ result: true, token: data.token, username: data.username });
    } else {
      res.json({ result: false, error: 'Utilisateur introuvable ou mot de passe incorrect' });
    }
  });
});



// ------------------------------------------------------------------------------------------------------------------------------------------    Supprimer profil

router.delete('/delete', (req, res) => {

  const userToken = req.headers.authorization;
  console.log('userToken:', userToken);

  if (!userToken) {
    console.log('Token manquant');
    return res.status(401).json({ result: false, error: 'Token manquant' });
  }

  User.findOne({ token: userToken })
    .then(userToDelete => {
      console.log('userToDelete:', userToDelete);
      if (userToDelete) {
        
        User.findByIdAndDelete(userToDelete._id)
          .then(() => {
            res.json({ result: true, message: 'Profil supprimé avec succès' });
          })
      } else {
        console.log('Utilisateur introuvable');
        res.status(401).json({ result: false, error: 'Utilisateur introuvable' });
      }
    })
});

module.exports = router;

