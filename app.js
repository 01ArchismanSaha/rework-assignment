const express = require("express");
const cors = require("cors");
const bodyParser = require('body-parser');
const dotenv = require('dotenv');

const path = require("path");

const app = express();
dotenv.config();
app.use(cors());
app.use(bodyParser.json())

const sequelize = require("./util/Database");
// requiring models
const Book = require("./models/Book");
const Author = require("./models/Author");
const Magazine = require("./models/Magazine");

// requiring routes
const appRoutes = require('./routes/appRoutes')

app.use('/', appRoutes);

sequelize
//   .sync({ force: true })
  .sync()
  .then(() => {
    app.listen(3000, () => {
      console.log("Server listening on port 3000");
    });
  })
  .catch((err) => console.log(err));
