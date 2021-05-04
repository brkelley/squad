package user

import (
	firestore "squad/database/firestore"
	"github.com/pollen5/discord-oauth2"
	"golang.org/x/oauth2"
	"golang.org/x/crypto/bcrypt"
	"encoding/json"
	"github.com/gorilla/mux"
	"log"
    "net/http"
	"squad/utils"
)

var state = "random"
var clientID = "805510957404782623"
var clientSecret = "wzWIkGByZ7DlGFa-HspHZYz_Sm4YHk9L"
var conf = &oauth2.Config{
	// This next 3 lines need to be modified before run.
	RedirectURL: "http://localhost:3000/auth/callback",
	ClientID: clientID,
	ClientSecret: clientSecret,
	Scopes: []string{discord.ScopeIdentify},
	Endpoint: discord.Endpoint,
}

// Response user bundle for sending data to FE
type Response struct {
	User		User 									`json:"user,omitempty"`
	JwtToken	string 									`json:"jwtToken,omitempty"`
	DiscordInfo utils.DiscordAuthorizationTokenResponse	`json:"discordInfo,omitempty"`
}

// RegisterUserRoutes registering routes for user
func RegisterUserRoutes(r *mux.Router) {
	r.Handle("/users", getUsers).Methods("GET")
	r.Handle("/users", registerNewUser).Methods("POST")
	r.Handle("/users/{id}", getUser).Methods("GET")
	r.Handle("/auth/riot/{summonerName}", authorizeSummonerName).Methods("GET")
	r.Handle("/auth/discord", authorizeDiscord).Methods("GET")
	r.Handle("/auth/validateToken", validateJwtToken).Methods("GET")
}

var getUsers = http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
    w.Header().Set("Content-Type", "application/json")

	users, userErr := GetUsers()

	if userErr != nil {
		w.WriteHeader(http.StatusInternalServerError)
		w.Write([]byte(`{ "message": "Server Error" }`))
		return
	}
	json.NewEncoder(w).Encode(users)
});

var getUser = http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	params := mux.Vars(r)
	user, userError := GetUser(params["id"])

	if userError != nil && userError.Error() == utils.DocumentNotFoundError {
		w.WriteHeader(http.StatusNotFound)
		w.Write([]byte(`{ "message": "no users found with id" }`))
		return
	} else if userError != nil {
		log.Fatal(userError)
	}
	// Obfuscation ftw
	user.SummonerID = ""

    json.NewEncoder(w).Encode(user)
});

var authorizeDiscord = http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	queryParams := r.URL.Query()
	code := queryParams["code"][0]

	userResponse, userErr := AuthorizeDiscord(code)
	if userErr != nil {
		w.WriteHeader(http.StatusInternalServerError)
		log.Fatal(userErr)
		json.NewEncoder(w).Encode(userErr)

		return
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(userResponse)
})

type JWTResponse struct {
	Token	string		`json:"token"`
	User	User		`json:"user"`
}
var validateJwtToken = http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	squadtoken := r.Header.Get("squadtoken")
	claims, _ := utils.ParseJwtToken(squadtoken)
	discordAccessToken := claims.DiscordAccessToken
	discordRefreshToken := claims.DiscordRefreshToken

	if _, discordErr := utils.GetDiscordUser(discordAccessToken); discordErr != nil {
		w.WriteHeader(http.StatusUnauthorized)
		w.Write([]byte(`{ "message:", "invalid jwt" }`))
		return
	}

	discordResponse := utils.RefreshDiscordAuthorizationToken(discordRefreshToken)
	if discordResponse.AccessToken == "" || discordResponse.RefreshToken == "" {
		w.WriteHeader(http.StatusUnauthorized)
		w.Write([]byte(`{ "message:", "invalid jwt" }`))
		return
	}
	token, _ := utils.GenerateJwtToken(
		discordResponse.ExpiresIn,
		discordResponse.AccessToken,
		discordResponse.RefreshToken,
		claims.UserID,
	)

	// Get user info
	user, userError := GetUser(claims.UserID)

	if userError != nil {
		w.WriteHeader(http.StatusNotFound)
		w.Write([]byte(`{ "message": "user not found" }`))
		return
	}
	// Obfuscation ftw
	user.SummonerID = ""

	response := JWTResponse{
		Token: token,
		User: user,
	}

    json.NewEncoder(w).Encode(response)
})

type RegisterBody struct {
	User					User									`json:"user"`
	DiscordRegistration		utils.DiscordAuthorizationTokenResponse	`json:"discordRegistration"`
}
var registerNewUser = http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	var registrationBody RegisterBody
	jsonError := json.NewDecoder(r.Body).Decode(&registrationBody)

	if jsonError != nil {
		w.WriteHeader(http.StatusBadRequest)
        w.Write([]byte(`{ "message": "Bad request body" }`))    
        return
	}

	usersWithAccountID, getErr := firestore.GetAll("users", "summonerId", registrationBody.User.SummonerID)
	if getErr != nil {
		w.WriteHeader(http.StatusInternalServerError)    
		w.Write([]byte(`{ "message": "` + getErr.Error() + `" }`))   
        return
	}
	if len(usersWithAccountID) > 1 {
		w.WriteHeader(http.StatusInternalServerError)    
		w.Write([]byte(`{ "message": "Multiple users exist with that account ID!" }`))   
        return
	}

	var userResponse Response
	var userErr error
	if len(usersWithAccountID) == 1 {
		var user User
		if jsonErr := json.Unmarshal(usersWithAccountID[0], &user); jsonErr != nil {
			w.WriteHeader(http.StatusInternalServerError)    
			w.Write([]byte(`{ "message": "` + jsonErr.Error() + `" }`))   
			return
		}
		userResponse, userErr = LinkAccountToDiscord(registrationBody, user.ID)
	} else {
		userResponse, userErr = RegisterNewUser(registrationBody)
	}

	if userErr != nil {
		w.WriteHeader(http.StatusBadRequest)
		log.Println(userErr)
        w.Write([]byte(`{ "message": "` + userErr.Error() + `" }`))    
        return
	}

	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(userResponse)
})

type RiotGamesAccountResponse struct {
	ID 				string	`json:"id"`
	AccountID 		string	`json:"accountId"`
	Puuid 			string	`json:"puuid"`
	Name	 		string	`json:"name"`
	ProfileIconID 	int		`json:"profileIconId"`
	RevisionDate 	int		`json:"revisionDate"`
	SummonerLevel	int		`json:"summonerLevel"`
}
var authorizeSummonerName = http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	params := mux.Vars(r)
	summonerName, _ := params["summonerName"]

	url := "https://na1.api.riotgames.com/lol/summoner/v4/summoners/by-name/" + summonerName
	headers := map[string]string{
		"X-Riot-Token": "RGAPI-45b394c8-0ac5-42e3-9398-230cc12a637f",
	}
	var account RiotGamesAccountResponse
	responsePackage, discordErr := utils.Get(url, headers)
	if responsePackage.StatusCode == 404 {
		w.WriteHeader(http.StatusNotFound)
		w.Write([]byte(`{ "message": "summoner name doesn't exist" }`))
		return
	}
	if discordErr != nil {
		w.WriteHeader(http.StatusNotFound)
		w.Write([]byte(`{ "message": "internal server error" }`))
		return
	}
	json.Unmarshal(responsePackage.Body, &account)

	json.NewEncoder(w).Encode(account)
})

func compareHashAndPassword(hashedPassword []byte, password []byte) error {
	return bcrypt.CompareHashAndPassword(hashedPassword, password)
}
