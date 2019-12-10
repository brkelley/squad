const express    = require('express'),
      cors       = require('cors'),
      app        = express(),
      bodyParser = require('body-parser'),
      jwt        = require('jsonwebtoken'),
      passport   = require('passport');

app.use(cors());

// database
require('./database/database.js');

// Passport config
require('./config/passport.js');

// error handlers
// Catch unauthorised errors
app.use((req, res, next) => {
    if (req.url.includes('/login') || req.url.includes('/register') || req.url.includes('/user/validate')) {
        next();
        return;
    }

    if (!req.headers.squadtoken) {
        res.status(401).end();
        return;
    }

    const { exp } = jwt.decode(req.headers.squadtoken);
    const valid = exp < (new Date().getTime() / 1000);
    if (valid) {
        next();
    } else {
        res.status(401).end();
    }
});

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

// routes
require('./routes/routes.js')(app);

const port = 4444;

app.listen(port, function () {
    console.log(`Listening on port ${port}...`);
});
