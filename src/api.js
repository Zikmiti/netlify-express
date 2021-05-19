const express = require("express");
const serverless = require("serverless-http");
var request = require('request');

const app = express();
const router = express.Router();
// const port = 3000;

app.use(function (req, res, next) {

  // Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Origin', '*');

  // Request methods you wish to allow
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

  // Request headers you wish to allow
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader('Access-Control-Allow-Credentials', true);

  // Pass to next layer of middleware
  next();
});

router.get("/", (req, res) => {
  var options = {
    'method': 'GET',
    'url': 'https://ical-to-json.herokuapp.com/convert.json?url=http%3A%2F%2Fapplis.univ-nc.nc%2Fcgi-bin%2FWebObjects%2FServeurPlanning.woa%2Fwa%2FiCalendarOccupations%3Flogin%3D',
   
  };
  options.url += 'cmarin03';
  request(options, function (error, response) {
    if (error) throw new Error(error);
    res.json(JSON.parse(response.body))
  });
});


router.get("/:uid", (req, res) => {
  var options = {
    'method': 'GET',
    'url': 'https://ical-to-json.herokuapp.com/convert.json?url=http%3A%2F%2Fapplis.univ-nc.nc%2Fcgi-bin%2FWebObjects%2FServeurPlanning.woa%2Fwa%2FiCalendarOccupations%3Flogin%3D',
   
  };
  options.url += req.params.uid;
  request(options, function (error, response) {
    if (error) throw new Error(error);
    res.json(JSON.parse(response.body))
  });
});

app.use(`/.netlify/functions/api`, router);

// app.listen(port, () => {
//   console.log(`Example app listening at http://localhost:${port}`)
// })

module.exports = app;
module.exports.handler = serverless(app);
