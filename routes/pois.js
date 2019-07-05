"use strict";

const express = require('express');
const router  = express.Router();
const cookieSession = require('cookie-session')

module.exports = (knex) => {

  router.get("/", (req, res) => {
    knex
      .select("*")
      .from("pois")
      .then((results) => {
        res.json(results);
    });
  });

  router.post("/new", (req, res) => {
    let poi = {
      lat: req.body.lat,
      lng: req.body.lng,
      title: req.body.title,
      desc: req.body.desc,
      imgurl: req.body.imgurl,
      map_id: req.body.map_id
    }

    knex("pois")
      .returning('id')
      .insert(poi)
      .then((ids) => {
        res.json({id: ids[0]});
      })
  })

  router.delete("/pois/:id", (req, res) => {
    var poiID = req.params.id;
    knex('pois')
      .where({id: poiID})
      .del()
      .then(() => {
        res.redirect('maps/11');
        ;
      })
  });

  return router;

}
