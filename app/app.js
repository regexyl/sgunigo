// SGUniGo requirements
const path = require("path"); // core node.js module
const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv"); // Zero-dependency module that loads environment variables from a .env file into process.env
const morgan = require("morgan"); // For logging - any request to the page would be shown in the console
const exphbs = require("express-handlebars"); // Template engine - layout that has HTML head and body tags that saves you from repeating in each file
const passport = require("passport");
const session = require("express-session");
const MongoStore = require("connect-mongo"); // Express session middleware
const connectDB = require("./config/db");
// SingPass requirements
const favicon = require('serve-favicon');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

// Load config - pass  object with global variables to path
dotenv.config({ path: `./config/${process.env.NODE_ENV}.env` });

console.log(process.env.MYINFO_APP_REDIRECT_URL)
// Passport config
require("./config/passport")(passport); // pass in const passport as an argument - refer to passport.js' module.exports function argument

connectDB();
const app = express();

// Body parser - added for POST request in stories/add
app.use(express.urlencoded({ extended: false })); // If extended is false, you cannot post "nested objects" e.g. { person: { name: cw } }
app.use(cookieParser());
app.use(express.json());

// Logging
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev")); // Add Morgan middleware that shows HTTP methods, etc. in the console while in dev mode
}

// Handlebars
app.engine(
  ".hbs",
  exphbs({
    defaultLayout: "main",
    extname: ".hbs",
  })
);
app.set("view engine", ".hbs"); // default extension is .hbs

// Handlebars helper functions
const hbs = exphbs.create({});
hbs.handlebars.registerHelper('ifEquals', function(arg1, arg2, options) {
  return (arg1 == arg2) ? options.fn(this) : options.inverse(this);
});

hbs.handlebars.registerHelper('hideNric', function(nric) {
  return '*****'.concat(nric.slice(5))
});

// Sessions
app.use(
  session({
    secret: "keyboard cat",
    resave: false, // Don't save the session if nothing is modified
    saveUninitialized: false, // Don't create session until something is stored
    // cookie: { secure: true } // Cookie will not work without HTTPS
    store: MongoStore.create({
      mongoUrl: mongoose.connection.client.s.url,
    }),
  })
);

// Passport middleware
app.use(passport.initialize())
app.use(passport.session())

// Static folder
app.use(express.static(path.join(__dirname, "public"))) // __dirname - current dir

// Routes
app.use("/", require("./routes/index"))
app.use("/auth", require("./routes/auth"))
app.use("/applications", require("./routes/applications"))
app.use("/admin", require("./routes/admin"))

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers
// print stacktrace on error
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render(`error/${err.status}`, {
        message: err.message,
        error: err
    });
});


const PORT = process.env.PORT || 3001

app.listen(
  PORT,
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
);
