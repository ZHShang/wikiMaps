"use strict";

const express = require('express');
const router  = express.Router();
const bcrypt = require('bcrypt')
const cookieSession = require('cookie-session')

module.exports = (knex) => {

  router.get("/", (req, res) => {
    knex
      .select("*")
      .from("users")
      .then((results) => {
        res.json(results);
    });
  });

  router.post("/register", (req, res) => {

    const username = req.body.username;
    const pswrd = req.body.pswrd;
    const salt = bcrypt.genSaltSync(5);
    const hashedPassword = bcrypt.hashSync(pswrd, salt);

    knex.select('name', 'id').from('users').then((users) => {
      for (let i = 0; i < users.length; i ++) {
        if (users[i].name === username) {
          res.status(403).send('User already exists')
          return false
        }
      }
      knex('users')
        .returning('id')
        .insert([{name: username, password: hashedPassword}])
        .then((ids) => {
          var user_id = ids[0];
          req.session.user_id = user_id;
          res.redirect("/")
      })
    })
  });

  router.post("/login", (req, res) => {

    const username = req.body.user;
    const pswrd = req.body.password;
    let flag = false
    let pswrdFromDatabase = ''
    let userIndex = 0

    knex.select('name', 'id', 'password').from('users').then((users) => {
      for (let i = 0; i < users.length; i ++) {
        if (users[i].name === username) {
          flag = true
          pswrdFromDatabase = users[i].password
          userIndex = i
        }
      }
      if (flag === true && (bcrypt.compareSync(pswrd, pswrdFromDatabase))) {
      knex('users')
        .returning('id')
        .then((ids) => {
          req.session.user_id = ids[userIndex].id;
          res.redirect("/")
      })
      }
    })
  });

  router.post("/logout", (req, res) => {
    req.session = null;
    res.redirect("/")
  });

  return router;
}
