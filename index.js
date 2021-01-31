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
      get        = require('lodash/get'),
      LEAGUES    = require('./constants/leagues.json')
      moment     = require('moment');

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
    const LEAGUE_NAMES = ['LEC', 'LCS', 'Worlds', 'MSI'];
    const leagues = LEAGUES.filter(league => LEAGUE_NAMES.includes(league.name));
    const headers = {
        'x-api-key': '0TvQnueqKa5mxJntVWt0w4LpLfEkrV1Ta8rQBb9Z'
    };
    let getTournamentsForLeagueUrl = 'https://esports-api.lolesports.com/persisted/gw/getTournamentsForLeague?hl=en-US';
    let getTeamsUrl = 'https://esports-api.lolesports.com/persisted/gw/getTeams?hl=en-US';

    let tournamentsByLeague;
    let teams;
    try {
        const data = await axios.get(`${getTournamentsForLeagueUrl}&leagueId=${leagues.map(el => el.id)}`, { headers });
        tournamentsByLeague = data.data.data.leagues;

        const teamData = await axios.get(`${getTeamsUrl}`, { headers });
        teams = teamData.data.data.teams;
    } catch (error) {
        throw new Error(error);
    }

    const currentTime = moment();
    const currentYear = currentTime.year();

    const currentTournamentArr = tournamentsByLeague.reduce((acc, league, index) => {
        const currentTournaments = league.tournaments
            .filter((tournament) => {
                const startMoment = moment(tournament.startDate);
                const startYear = startMoment.year();
                
                return startYear === currentYear;
            })
            .map((tournament) => ({
                ...tournament,
                leagueId: leagues[index].id,
                leagueName: leagues[index].name
            }));
        
        acc.push(...currentTournaments);

        return acc;
    }, []);

    teams = teams.filter((team) => LEAGUE_NAMES.includes(get(team, 'homeLeague.name', null)));

    cache.set('currentTournaments', currentTournamentArr);
    cache.set('currentTeams', teams);
})();

const port = process.env.PORT || 4444;

app.listen(port, function () {
    console.log(`Listening on port ${port}...`);
});
