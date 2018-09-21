//Enviourment configaration
require("dotenv").config();
const PORT = process.env.PORT || 5000;

// import all external modules
const express = require("express");
const session = require("express-session");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const fs = require("fs");
const { resolve } = require("path");

// create express app
const app = express();
app.use(bodyParser.json({ limit: "5mb" }));
app.use(bodyParser.urlencoded({ limit: "5mb", extended: false }));
app.use(cookieParser());
app.use(morgan("common"));

// generate session
app.use(
  session({
    secret: process.env.SESSION_SECRET || "__DUMMY_SESSION_KEY__",
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: eval(process.env.COOKIE_MAX_AGE) }
  })
);

// import router modules
const auth = require("./authentication");
const login = require("./routes/login");
const cust = require("./routes/customer");
const asset = require("./routes/asset");
const assetConfig = require("./routes/config");
const order = require("./routes/order");
const challan = require("./routes/challan");
const branch = require("./routes/branch");
const user = require("./routes/user");
const organization = require("./routes/organization");
const roles = require("./routes/roles");
const vendor = require("./routes/vendor");

/**
 * serve all static files without any session authentication
 */
app.use(express.static("../build"));

/**
 * login router should be called without any session authentication
 * since session is created after login
 */
app.use("/login", login);

/**
 * authenticate all request to check if user has valid session
 */
app.use(auth);

/**
 * all router added after main authentication module
 * so that all API request made will be validated against
 * session information first in the main auth module
 */
app.use("/cust", cust);
app.use("/asset", asset);
app.use("/config", assetConfig);
app.use("/order", order);
app.use("/challan", challan);
app.use("/branch", branch);
app.use("/user", user);
app.use("/organization", organization);
app.use("/roles", roles);
app.use("/vendor", vendor);

/**
 *
 *
 * serve React's index.html file from build folder
 * browser request comes in for any url
 *
 *
 */

app.get("*", function(req, res) {
  let indexHtml = fs.readFileSync(resolve("../build/index.html"), "utf8");
  res.header("Content-Type", "text/html");
  res.status(200).send(indexHtml);
});

/**
 *
 * start the server on the given PORT
 *
 */
app.listen(PORT, () => console.log("server started on port " + PORT));

/**
 * handle uncaughtException to stop server from crashing.
 * NOTE: preety bad way of exception handling,
 * usually add some unnoticed bug in the application
 * should be removed if possible
 */
process.on("uncaughtException", err => {
  console.log("uncaughtException handler: ", err);
});

/**
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 */
