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

// routes
const user = require('./routes/user/user.js');
const predictionsMatches = require('./routes/predictions/predictions-matches.js');

app.use(bodyParser.json());

app.get('/matches', predictionsMatches.matches);
app.post('/user/register', user.register);

const port = 4444;

app.listen(port, function () {
    console.log(`Listening on port ${port}...`);
});
