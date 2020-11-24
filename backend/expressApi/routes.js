module.exports = app => {
    const Weather = require("./weather.controller.js");

    // Retrieve all Weather
    app.get("/weather", Weather.findAll);
  

  };