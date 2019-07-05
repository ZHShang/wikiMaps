"use strict";

const express = require('express');
const router  = express.Router();
const cookieSession = require('cookie-session')

module.exports = (knex) => {

  router.get("/", (req, res) => {
    knex
      .select("*")
      .from("maps")
      .then((results) => {
        const returnData = {
          results,
          id: req.session.user_id
        }
        res.json(returnData);
    });
  });

  router.post("/new", (req, res) => {

    let map = {
      title: req.body.title,
      lattitude: req.body.lattitude,
      longitude: req.body.longitude,
      user_id: req.session.user_id
    };

    knex("maps")
    .returning('id')
    .insert(map)
    .then((ids) => {
      res.json({id: ids[0]});
    })

  })


  router.get("/", (req, res) => {
    knex
      .select("*")
      .from("maps")
      .then((results) => {
        const returnData = {
          results,
          id: req.session.user_id
        }
        res.json(returnData);
    });
  });




  return router;
}