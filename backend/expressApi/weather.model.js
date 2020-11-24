const sql = require("./db.js");

// constructor
const Weather = function(Weather) {
  this.fid = Weather.fid;
  this.city = Weather.city;
  this.temp = Weather.temp;
  this.extraData = Weather.extraData;
};



Weather.getAll = result => {
  sql.query("SELECT * FROM `openweather`", (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    console.log("Weather Data: ", res);
    result(null, res);
  });
};




module.exports = Weather;