package proplay

import (
	"net/http"
	"encoding/json"
	"log"
	"github.com/gorilla/mux"
	"squad/utils"
)


func RegisterUserRoutes(r *mux.Router) {
	r.HandleFunc("/pro-play/teams", getTeams).Methods("GET")
	r.HandleFunc("/pro-play/leagues", getLeagues).Methods("GET")
	r.HandleFunc("/pro-play/tournaments", getTournamentsByLeague).Methods("GET")
	r.HandleFunc("/pro-play/matches", getMatches).Methods("GET")
}

func getTeams(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	leagueNames := make([]string, 0)
	leagues, _ := utils.GetPredictionLeagues()
	for _, league := range leagues {
		leagueNames = append(leagueNames, league.Name)
	}
	teams, err := utils.GetTeams(leagueNames)

	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		log.Fatal(err)
		json.NewEncoder(w).Encode(err)
		return
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(teams)
}

func getLeagues(w http.ResponseWriter, r *http.Request) {
    w.Header().Set("Content-Type", "application/json")
	leaguesResponse, err := utils.GetLeagues()

	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		log.Fatal(err)
		json.NewEncoder(w).Encode(err)
		return
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(leaguesResponse)
}

func getTournamentsByLeague(w http.ResponseWriter, r *http.Request) {
    w.Header().Set("Content-Type", "application/json")
	tournamentsResponse, err := utils.GetTournamentsByLeague([]string{})

	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		log.Fatal(err)
		json.NewEncoder(w).Encode(err)
		return
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(tournamentsResponse)
}

func getMatches(w http.ResponseWriter, r *http.Request) {
    w.Header().Set("Content-Type", "application/json")

	matchIDMap, mapErr := getMatchIDMap()
	if mapErr != nil {
		w.WriteHeader(http.StatusInternalServerError)
		log.Fatal(mapErr)
		json.NewEncoder(w).Encode(mapErr)
		return
	}

	// Get the league IDs (right now that's hardcoded)
	leagues, _ := utils.GetPredictionLeagues()
	leagueIDs := make([]string, 0)
	for _, league := range leagues {
		leagueIDs = append(leagueIDs, league.ID)
	}

	// Now, get all the tournament IDs of all the leagues
	tournaments, tournamentError := utils.GetTournamentsByLeague(leagueIDs)
	if tournamentError != nil {
		w.WriteHeader(http.StatusInternalServerError)
		log.Fatal(tournamentError)
		json.NewEncoder(w).Encode(tournamentError)
		return
	}

	// Finally, get the schedule from the tournaments
	// We actually need to do this tournament-by-tournament so we can assign the
	// correct tournament slug to the match
	finalMatches := make([]utils.MatchMetadata, 0)
	for _, tournament := range tournaments {
		tournamentIDs := []string{tournament.ID}
		currentSchedule, scheduleErr := utils.GetStructuredSchedule(tournamentIDs)
		if scheduleErr != nil {
			w.WriteHeader(http.StatusInternalServerError)
			log.Fatal(scheduleErr)
			json.NewEncoder(w).Encode(scheduleErr)
			return
		}

		for _, stage := range currentSchedule[0].Stages {
			stageCopy := stage
			log.Println(stage)
			stageCopy.Sections = make([]utils.TournamentSection, 0)

			for _, section := range stage.Sections {
				sectionCopy := section
				sectionCopy.Matches = make([]utils.Match, 0)
				sectionCopy.Rankings = make([]utils.ScheduleRanking, 0)

				for _, match := range section.Matches {
					matchInfo, ok := matchIDMap[match.ID]
					if ok {
						tournamentMetadata := utils.TournamentMetadata{
							Tournament: tournament,
							Stage: stageCopy,
							Section: sectionCopy,
						}
						matchInfo.TournamentMetadata = tournamentMetadata
						matchInfo.Match.PreviousMatchIDs = match.PreviousMatchIDs
						finalMatches = append(finalMatches, matchInfo)
					}
				}
			}
		}
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(finalMatches)
}

func getMatchIDMap() (map[string]utils.MatchMetadata, error) {
	// get all relevant league IDs (don't worry about error, this is the constant endpoint)
	leagues, _ := utils.GetPredictionLeagues()
	leagueIDs := make([]string, 0)
	for _, league := range leagues {
		leagueIDs = append(leagueIDs, league.ID)
	}
	
	matchByIDMap := make(map[string]utils.MatchMetadata)
	matchResponse, matchesErr := utils.GetMatchDetails(leagueIDs, "")
	if matchesErr != nil {
		return map[string]utils.MatchMetadata{}, matchesErr
	}

	for _, match := range matchResponse.Data.Schedule.Events {
		matchByIDMap[match.Match.ID] = match
	}

	newPageTokenIter := matchResponse.Data.Schedule.Pages.Newer
	oldPageTokenIter := matchResponse.Data.Schedule.Pages.Older
	for newPageTokenIter != "" {
		matchResponse, matchesErr = utils.GetMatchDetails(leagueIDs, newPageTokenIter)
		if matchesErr != nil {
			return map[string]utils.MatchMetadata{}, matchesErr
		}

		for _, match := range matchResponse.Data.Schedule.Events {
			matchByIDMap[match.Match.ID] = match
		}

		newPageTokenIter = matchResponse.Data.Schedule.Pages.Newer
	}

	// iterate three times to older (there's a better way to do this)
	matchResponse, matchesErr = utils.GetMatchDetails(leagueIDs, oldPageTokenIter)
	if matchesErr != nil {
		return map[string]utils.MatchMetadata{}, matchesErr
	}

	for _, match := range matchResponse.Data.Schedule.Events {
		matchByIDMap[match.Match.ID] = match
	}

	oldPageTokenIter = matchResponse.Data.Schedule.Pages.Older
		
	matchResponse, matchesErr = utils.GetMatchDetails(leagueIDs, oldPageTokenIter)
	if matchesErr != nil {
		return map[string]utils.MatchMetadata{}, matchesErr
	}

	for _, match := range matchResponse.Data.Schedule.Events {
		matchByIDMap[match.Match.ID] = match
	}

	oldPageTokenIter = matchResponse.Data.Schedule.Pages.Older

	matchResponse, matchesErr = utils.GetMatchDetails(leagueIDs, oldPageTokenIter)
	if matchesErr != nil {
		return map[string]utils.MatchMetadata{}, matchesErr
	}

	for _, match := range matchResponse.Data.Schedule.Events {
		matchByIDMap[match.Match.ID] = match
	}

	oldPageTokenIter = matchResponse.Data.Schedule.Pages.Older

	return matchByIDMap, nil
}
