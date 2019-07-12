"use strict";

require('dotenv').config();

const PORT        = process.env.PORT || 8080;
const ENV         = process.env.ENV || "development";
const express     = require("express");
const bodyParser  = require("body-parser");
const sass        = require("node-sass-middleware");
const app         = express();

const knexConfig  = require("./knexfile");
const knex        = require("knex")(knexConfig[ENV]);
const morgan      = require('morgan');
const knexLogger  = require('knex-logger');
const cookieSession = require('cookie-session')
app.use(cookieSession({
  name: 'session',
  keys: ['key1'],
}));
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");


// Seperated Routes for each Resource
const usersRoutes = require("./routes/users");
const mapsRoutes = require("./routes/maps");
const poisRoutes = require("./routes/pois");

// Load the logger first so all (static) HTTP requests are logged to STDOUT
// 'dev' = Concise output colored by response status for development use.
// The :status token will be colored red for server error codes, yellow for client error codes, cyan for redirection codes, and uncolored for all other codes.
app.use(morgan('dev'));

// Log knex SQL queries to STDOUT as well
app.use(knexLogger(knex));

app.use("/styles", sass({
  src: __dirname + "/styles",
  dest: __dirname + "/public/styles",
  debug: true,
  outputStyle: 'expanded'
}));
app.use(express.static("public"));

// Mount all resource routes
app.use("/api/users", usersRoutes(knex));
app.use("/api/maps", mapsRoutes(knex));
app.use("/api/pois", poisRoutes(knex));

// Home page
app.get("/", (req, res) => {
  let templateVars = { user: req.session.user_id} //test cookie to make header run.
  res.render("index", templateVars);
});

app.get("/register", (req, res) => {

})


//gets the json object of the matching ID
app.get("/data/:map_id", (req, res) => {
  var rendMap = {};
  var mapID = req.params.map_id;
  knex('maps')
  .where({
    id: mapID
  })
  .then((resMap) => {
    if (resMap.length > 0){
      rendMap['title'] = resMap[0].title;
      rendMap['lattitude'] = resMap[0].lattitude;
      rendMap['longitude'] = resMap[0].longitude;
      rendMap['user_id'] = resMap[0].user_id;
      rendMap['created_at'] = resMap[0].created_at;
      rendMap['updated_at'] = resMap[0].updated_at;
      console.log(rendMap);

      knex('pois')
      .where({
        map_id: mapID
      })
      .then((resPoints) => {
        console.log("searching POIs")
        if(resPoints.length > 0){
          var arrPois = [];
          resPoints.forEach((singlePoi) => {
            var poi = {
              id: singlePoi.id,
              title: singlePoi.title,
              desc: singlePoi.desc,
              lat: singlePoi.lat,
              lng: singlePoi.lng,
              imgurl: singlePoi.imgurl
            }
            arrPois.push(poi);
          });

          rendMap['arrPois'] = arrPois;
          console.log(rendMap);
        }
        res.json(rendMap);

      }).catch((error) =>{
        res.send(error);
      });

  } else {
    res.send("invalid map id");
  }
  }).catch((error) => {
    res.send(error);
  });

});

app.get("/maps/new", (req, res) => {
  let templateVars = { user: req.session.user_id} //test cookie to make header run.
  res.render("newMap", templateVars)
});

app.get("/maps/:id", (req, res) => {
   res.render("renderMap", {user: req.session.user_id, mapId: req.params.id});
});


app.listen(PORT, () => {
  console.log("Example app listening on port " + PORT);
});