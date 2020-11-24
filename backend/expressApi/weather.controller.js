const weather = require("./weather.model.js");



// Retrieve all Customers from the database.
exports.findAll = (req, res) => {
  weather.getAll((err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving customers."
      });
    else res.send(data);
  });
};