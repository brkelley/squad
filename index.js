const express    = require('express'),
      cors       = require('cors'),
      bodyParser = require('body-parser'),
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

    if (!req.headers.squadtoken || req.headers.squadtoken === 'undefined' || req.headers.squadtoken === 'null') {
        res.status(401).end();
        return;
    }
    next();
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
    const leagues = LEAGUES.filter(league => ['LEC', 'LCS'].includes(league.name));
    const headers = {
        'x-api-key': '0TvQnueqKa5mxJntVWt0w4LpLfEkrV1Ta8rQBb9Z'
    };
    let esportsUrl = 'https://esports-api.lolesports.com/persisted/gw/getTournamentsForLeague?hl=en-US';

    let tournamentsByLeague;
    try {
        const data = await axios.get(`${esportsUrl}&leagueId=${leagues.map(el => el.id)}`, { headers });
        tournamentsByLeague = data.data.data.leagues;
    } catch (error) {
        console.log('ERROR IN INIT FUNCTION');
        console.log(error)
    }

    const currentTournamentIds = {};

    // Algorithm right now is just to return the latest tournament for LCS & LEC
    tournamentsByLeague.forEach((league, index) => {
        const tournamentsSortedByEndDate = league.tournaments.sort((first, second) => {
            return new Date(first.endDate).getTime() - new Date(second.endDate).getTime();
        });
        const leagueId = leagues[index].id;
        currentTournamentIds[leagueId] = last(tournamentsSortedByEndDate).id;
    });

    cache.set('currentTournamentIds', currentTournamentIds);
})();

const port = process.env.PORT || 4444;

app.listen(port, function () {
    console.log(`Listening on port ${port}...`);
});
