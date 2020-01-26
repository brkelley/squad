const express    = require('express'),
      cors       = require('cors'),
      bodyParser = require('body-parser'),
      jwt        = require('jsonwebtoken'),
      passport   = require('passport'),
      app        = express(),
      router     = express.Router(),
      routes     = require('./routes/routes.js')
      axios      = require('axios'),
      cache      = require('./cache/cache.js'),
      last       = require('lodash/last'),
      LEAGUES    = require('./constants/leagues.json');

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

routes(router);
app.use('/api/v1', router);

// a few functions to run at startup
(async () => {
    const leagueIds = LEAGUES.filter(league => ['LEC', 'LCS'].includes(league.name)).map(el => el.id);
    const headers = {
        'x-api-key': '0TvQnueqKa5mxJntVWt0w4LpLfEkrV1Ta8rQBb9Z'
    };
    let esportsUrl = 'https://esports-api.lolesports.com/persisted/gw/getTournamentsForLeague?hl=en-US';

    let leagues;
    try {
        const data = await axios.get(`${esportsUrl}&leagueId=${leagueIds}`, { headers });
        leagues = data.data.data.leagues;
    } catch (error) {
        console.log('ERROR IN INIT FUNCTION');
        console.log(error)
    }

    const currentTournamentIds = [];

    // Algorithm right now is just to return the latest tournament for LCS & LEC
    leagues.forEach(league => {
        const tournamentsSortedByEndDate = league.tournaments.sort((first, second) => {
            return new Date(first.endDate).getTime() - new Date(second.endDate).getTime();
        });
        currentTournamentIds.push(last(tournamentsSortedByEndDate.map(el => el.id)));
    });

    cache.set('currentTournamentIds', currentTournamentIds);
})();

const port = process.env.PORT || 4444;

app.listen(port, function () {
    console.log(`Listening on port ${port}...`);
});
