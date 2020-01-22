const express    = require('express'),
      cors       = require('cors'),
    //   app        = express(),
      bodyParser = require('body-parser'),
      jwt        = require('jsonwebtoken'),
      path       = require('path'),
      passport   = require('passport');

const app = express();
const router = express.Router();
const routes = require('./routes/routes.js');

require('./database/firestore/firestore.js');

app.use(cors());

// Passport config
require('./config/passport.js');

// error handlers
// Catch unauthorised errors
app.use((req, res, next) => {
    if (req.url.includes('/login') ||
        req.url.includes('/register') ||
        req.url.includes('/user') ||
        req.url.includes('/user/validateToken') ||
        req.url.includes('/user/updatePassword') ||
        req.url.includes('/user/validateSummonerName')) {
        next();
        return;
    }

    if (!req.headers.squadtoken) {
        res.status(401).end();
        return;
    }

    const { exp } = jwt.decode(req.headers.squadtoken);
    const valid = exp > (new Date().getTime() / 1000);
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
// require('./routes/routes.js')(app);
routes(router);
app.use('/api/v1', router);

const port = process.env.PORT || 4444;

app.listen(port, function () {
    console.log(`Listening on port ${port}...`);
});
