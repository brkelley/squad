package utils

import (
	"encoding/json"
	// "log"
	"time"
)

var lolesportsKey = "0TvQnueqKa5mxJntVWt0w4LpLfEkrV1Ta8rQBb9Z"
var esportsHeader = map[string]string {
	"x-api-key": lolesportsKey,
}
var esportsURLBase = "https://esports-api.lolesports.com/persisted/gw"

type League struct {
	Name		string	`json:"name"`
	Slug		string	`json:"slug"`
	ID			string	`json:"id,omitempty"`
	Image		string	`json:"image,omitempty"`
	Priority	int		`json:"priority,omitempty"`
	Region		string	`json:"region,omitempty"`
}
type Team struct {
	Code				string			`json:"code"`
	Image				string			`json:"image"`
	Name				string			`json:"name"`
	// Full Team Detail Fields
	ID					string			`json:"id,omitempty"`
	Slug				string			`json:"slug,omitempty"`
	AlternativeImage	string			`json:"alternativeImage,omitempty"`
	HomeLeague			*Region			`json:"homeLeague,omitempty"`
	Players				*[]Player		`json:"players,omitempty"`
	// MatchDetails fields
	Result				*MatchResult	`json:"result,omitempty"`
	Record				*TeamRecord		`json:"record,omitempty"`
}
type TeamRecord struct {
	Wins		int		`json:"wins"`
	Losses		int		`json:"losses"`
}
type Region struct {
	Name		string	`json:"name"`
	Region		string	`json:"region"`
}
type Player struct {
	ID				string	`json:"id"`
	SummonerName	string	`json:"summonerName"`
	FirstName		string	`json:"firstName"`
	LastName		string	`json:"lastName"`
	Image			string	`json:"image"`
	Role			string	`json:"role"`
}
type Tournament struct {
	ID			string		`json:"id"`
	Slug		string		`json:"slug"`
	StartDate	string		`json:"startDate"`
	EndDate		string		`json:"endDate"`
}
type MatchMetadata struct {
	StartTime			string				`json:"startTime"`
	State				string				`json:"state"`
	Type				string				`json:"type"`
	BlockName			string				`json:"blockName"`
	League				League				`json:"league"`
	Match				Match				`json:"match"`
	// return info
	TournamentMetadata	TournamentMetadata	`json:"tournamentMetadata,omitempty"`
}
type TournamentMetadata struct {
	Tournament		Tournament			`json:"tournament,omitempty"`
	Stage			TournamentStage		`json:"stage,omitempty"`
	Section			TournamentSection	`json:"section,omitempty"`
}
type Match struct {
	ID				string			`json:"id"`
	Flags			[]string		`json:"flags"`
	Teams			[]Team			`json:"teams"`
	// getSchedule metadata
	Strategy		*struct {
		Type			string		`json:"type"`
		Count			int			`json:"count"`
	}								`json:"strategy,omitempty"`
	// getStandings metadata
	State		string				`json:"state,omitempty"`
	PreviousMatchIDs	[]string	`json:"previousMatchIds"`
}
type MatchResult struct {
	Outcome		string		`json:"outcome"`
	GameWins	int			`json:"gameWins"`
}
type TournamentSchedule struct {
	Stages		[]TournamentStage		`json:"stages"`
}
type TournamentStage struct {
	Name		string					`json:"name"`
	Type		string					`json:"type"`
	Slug		string					`json:"slug"`
	Sections	[]TournamentSection		`json:"sections,omitempty"`
}
type TournamentSection struct {
	Name		string					`json:"name"`
	Matches		[]Match					`json:"matches,omitempty"`
	Rankings	[]ScheduleRanking		`json:"rankings,omitempty"`
}
type ScheduleRanking struct {
	Ordinal		int						`json:"ordinal"`
	Teams		[]Team					`json:"teams"`
}

type LeaguesResponse struct {
	Data	struct {
		Leagues	[]League	`json:"leagues"`
	}						`json:"data"`
}
func GetLeagues() ([]League, error) {
	getLeaguesURL := "/getLeagues?hl=en-US"
	responsePackage, err := Get(esportsURLBase + getLeaguesURL, esportsHeader)

	if err != nil {
		return []League{}, err
	}

	var leaguesResponse LeaguesResponse
	jsonErr := json.Unmarshal(responsePackage.Body, &leaguesResponse)
	
	if jsonErr != nil {
		return []League{}, jsonErr
	}

	return leaguesResponse.Data.Leagues, nil
}

// GetPredictionLeagues returns league data constants
func GetPredictionLeagues() ([]League, error) {
	leaguesConstants := []League {
		League {
			Name: "Worlds",
			Slug: "worlds",
			ID: "98767975604431411",
			Image: "http://static.lolesports.com/leagues/1592594612171_WorldsDarkBG.png",
    		Priority: 300,
    		Region: "INTERNATIONAL",
		},
		{
			Name: "LCS",
			Slug: "lcs",
			ID: "98767991299243165",
			Image: "http://static.lolesports.com/leagues/LCSNew-01-FullonDark.png",
			Priority: 1,
			Region: "NORTH AMERICA",
		  },
		  {
			Name: "LEC",
			Slug: "lec",
			ID: "98767991302996019",
			Image: "http://static.lolesports.com/leagues/1592516184297_LEC-01-FullonDark.png",
			Priority: 3,
			Region: "EUROPE",
		  },
		  {
			Name: "MSI",
			Slug: "msi",
			ID: "98767991325878492",
			Image: "http://static.lolesports.com/leagues/1592594634248_MSIDarkBG.png",
			Priority: 301,
			Region: "INTERNATIONAL",
		  },
	}
	return leaguesConstants, nil
}

type TeamsResponse struct {
	Data	struct {
		Teams	[]Team	`json:"teams"`
	}					`json:"data"`
}
func GetTeams(regionNames []string) ([]Team, error) {
	getTeamsURL := "/getTeams?hl=en-US"
	responsePackage, httpErr := Get(esportsURLBase + getTeamsURL, esportsHeader)
	if httpErr != nil {
		return []Team{}, httpErr
	}

	var teamsResponse TeamsResponse
	jsonErr := json.Unmarshal(responsePackage.Body, &teamsResponse)
	if jsonErr != nil {
		return []Team{}, jsonErr
	}

	finalTeams := make([]Team, 0)
	for _, team := range teamsResponse.Data.Teams {
		if team.HomeLeague != nil {
			finalTeams = append(finalTeams, team)
		}
	}

	return finalTeams, nil
}

type TournamentResponse struct {
	Data		struct {
		Leagues		[]struct {
			Tournaments		[]Tournament	`json:"tournaments"`
		}									`json:"leagues"`
	}										`json:"data"`
}
func GetTournamentsByLeague(leagueIDs []string) ([]Tournament, error) {
	getTournamentsURL := "/getTournamentsForLeague?hl=en-US"
	if len(leagueIDs) != 0 {
		for leagueIndex, leagueID := range leagueIDs {
			if leagueIndex == 0 {
				getTournamentsURL += "&leagueId=" + leagueID
			} else {
				getTournamentsURL += "," + leagueID
			}
		}
	}
	
	responsePackage, httpErr := Get(esportsURLBase + getTournamentsURL, esportsHeader)
	if httpErr != nil {
		return []Tournament{}, httpErr
	}

	var tournamentResponse TournamentResponse
	jsonErr := json.Unmarshal(responsePackage.Body, &tournamentResponse)
	if jsonErr != nil {
		return []Tournament{}, jsonErr
	}

	allTournaments := make([]Tournament, 0)
	layout := "2006-01-02"
	for _, tournamentsByLeague := range tournamentResponse.Data.Leagues {
		for _, tournament := range tournamentsByLeague.Tournaments {
			startTime, timeErr := time.Parse(layout, tournament.StartDate)
			if timeErr != nil {
				return []Tournament{}, timeErr
			}

			currentTime := time.Now()

			if currentTime.Year() == startTime.Year() {
				allTournaments = append(allTournaments, tournament)
			}
		}
	}

	return allTournaments, nil
}

type MatchResponse struct {
	Data		struct {
		Schedule	struct {
			Updated		string				`json:"updated"`
			Events		[]MatchMetadata		`json:"events"`
			Pages		struct {
				Older		string			`json:"older"`
				Newer		string			`json:"newer"`
			}								`json:"pages"`
		}									`json:"schedule"`
	}										`json:"data"`
}
func GetMatchDetails(leagueIDs []string, pageToken string) (MatchResponse, error) {
	getMatchDetailsURL := "/getSchedule?hl=en-US"
	for leagueIDIndex, leagueID := range leagueIDs {
		if leagueIDIndex == 0 {
			getMatchDetailsURL += "&leagueId=" + leagueID
		} else {
			getMatchDetailsURL += "," + leagueID
		}
	}

	if pageToken != "" {
		getMatchDetailsURL += "&pageToken=" + pageToken
	}

	responsePackage, httpErr := Get(esportsURLBase + getMatchDetailsURL, esportsHeader)
	if httpErr != nil {
		return MatchResponse{}, httpErr
	}

	var matchResponse MatchResponse
	jsonErr := json.Unmarshal(responsePackage.Body, &matchResponse)
	if jsonErr != nil {
		return MatchResponse{}, jsonErr
	}

	return matchResponse, nil
}

type ScheduleResponse struct {
	Data			struct {
		Standings		[]TournamentSchedule	`json:"standings"`
	}											`json:"data"`
}
func GetStructuredSchedule(tournamentIDs []string) ([]TournamentSchedule, error) {
	getStructuredScheduleURL := "/getStandings?hl=en-US"
	for tournamentIDIndex, tournamentID := range tournamentIDs {
		if tournamentIDIndex == 0 {
			getStructuredScheduleURL += "&tournamentId=" + tournamentID
		} else {
			getStructuredScheduleURL += "," + tournamentID
		}
	}

	responsePackage, httpErr := Get(esportsURLBase + getStructuredScheduleURL, esportsHeader)
	if httpErr != nil {
		return []TournamentSchedule{}, httpErr
	}

	var scheduleResponse ScheduleResponse
	jsonErr := json.Unmarshal(responsePackage.Body, &scheduleResponse)
	if jsonErr != nil {
		return []TournamentSchedule{}, jsonErr
	}

	return scheduleResponse.Data.Standings, nil
}
