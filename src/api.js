const express = require("express");
const serverless = require("serverless-http");
const ical2json = require("ical2json");
var request = require('request');
const http = require('http');
const fs = require('fs');


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
  
var file = fs.createWriteStream("data.ics");

  var options = {
    'method': 'GET',
    // 'url': 'https://ical-to-json.herokuapp.com/convert.json?url=http%3A%2F%2Fapplis.univ-nc.nc%2Fcgi-bin%2FWebObjects%2FServeurPlanning.woa%2Fwa%2FiCalendarOccupations%3Flogin%3D',
    'url':"http://applis.univ-nc.nc/cgi-bin/WebObjects/ServeurPlanning.woa/wa/iCalendarOccupations?login=mlorella"
   
  };


  const request = http.get(options.url, function(response) {
  response.pipe(file);

  fs.readFile(file.path, 'utf8' , (err, data) => {
    if (err) {
      console.error(err)
      return
    }
    let icalData = data;

    let output = ical2json.convert(icalData);
    console.log(output)
    res.json(output)
  })

  });
});


router.get("/:uid", (req, res) => {

  var file = fs.createWriteStream(`${req.params.uid}.ics`);
  var options = {
    'method': 'GET',
    // 'url': 'https://ical-to-json.herokuapp.com/convert.json?url=http%3A%2F%2Fapplis.univ-nc.nc%2Fcgi-bin%2FWebObjects%2FServeurPlanning.woa%2Fwa%2FiCalendarOccupations%3Flogin%3D',
    'url':"http://applis.univ-nc.nc/cgi-bin/WebObjects/ServeurPlanning.woa/wa/iCalendarOccupations?login="
  
  };

  options.url += req.params.uid;

  const request = http.get(options.url, function(response) {
  response.pipe(file).on('finish', function() {


    var icalData = fs.readFileSync(file.path, 'utf8');

    let output = ical2json.convert(icalData);

    res.json(output)
  });

    
  });

});


app.use(`/.netlify/functions/api`, router);

// app.listen(port, () => {
//   console.log(`Example app listening at http://localhost:${port}`)
// })

module.exports = app;
module.exports.handler = serverless(app);
