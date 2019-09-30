const express    = require('express'),
      cors       = require('cors'),
      app        = express(),
      bodyParser = require('body-parser'),
      passport   = require('passport');

app.use(cors());

// database
require('./database/database.js');

// Passport config
require('./config/passport.js');

app.use(bodyParser.json());
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function (user, done) {
    console.log('serializing: ' + user.id);
    done(null, user.id);
});
  
passport.deserializeUser(function (id, done) {
    console.log('deserializing');
    User.findById(id, function (err, user) {
        done(err, user);
    });
});

// error handlers
// Catch unauthorised errors
app.use(function (err, req, res, next) {
    if (err.name === 'UnauthorizedError') {
        res.status(401);
        res.json({"message" : err.name + ": " + err.message});
    }
});

app.use(function (req, res, next) {
    // console.log(req.headers);
    next();
});

// routes
require('./routes/routes.js')(app);

const port = 4444;

app.listen(port, function () {
    console.log(`Listening on port ${port}...`);
});
