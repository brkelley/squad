package user

import (
	"encoding/json"
	"errors"
	googleFirestore "cloud.google.com/go/firestore"
	firestore "squad/database/firestore"
	"squad/utils"
)

// User user struct
type User struct {
	ID 				string		`json:"id" bson:"_id,omitempty"`
	Email 			string		`json:"email,omitempty" bson:"email"`
	FirstName 		string		`json:"firstName,omitempty" bson:"firstName"`
	LastName 		string		`json:"lastName,omitempty" bson:"lastName"`
	SummonerID		string		`json:"summonerId,omitempty" bson:"summonerId"`
	SummonerName 	string		`json:"summonerName" bson:"summonerName"`
	DiscordID		string 		`json:"discordId" bson:"discordId"`
	DiscordName		string 		`json:"discordName" bson:"discordName"`
	UserFlags		[]string	`json:"userFlags"`
}

func GetUsers() ([]User, error) {
	usersAsBytes, dbErr := firestore.GetAll("users", "", "")
	if dbErr != nil {
		return []User{}, dbErr
	}

	users := make([]User, 0)
	usersBool := false;
	for _, userBytes := range usersAsBytes {
		var user User
		if jsonErr := json.Unmarshal(userBytes, &user); jsonErr != nil {
			return []User{}, jsonErr
		}
		// Obfuscation ftw
		user.SummonerID = ""
		user.FirstName = ""
		user.LastName = ""
		user.Email = ""
		user.UserFlags = make([]string, 0)

		// find out if user has added predictions
		userPredictionsAsBytes, predictionErr := firestore.GetAll("predictions", "userId", user.ID)
		if predictionErr != nil {
			return []User{}, predictionErr
		}
	
		if len(userPredictionsAsBytes) > 0 {
			user.UserFlags = append(user.UserFlags, "hasPredictions")
			usersBool = true
		}

		users = append(users, user)
	}

	if usersBool == false {
		for i := 0; i < len(users); i++ {
			users[i].UserFlags = append(users[i].UserFlags, "hasPredictions")
		}
	}

	return users, nil
}

func GetUser(id string) (User, error) {
	usersAsBytes, firestoreErr := firestore.GetByID("users", id)
	var user User
	if firestoreErr != nil {
		return User{}, firestoreErr
	}
	
	if jsonErr := json.Unmarshal(usersAsBytes, &user); jsonErr != nil {
		return User{}, jsonErr
	}

	// find out if user has added predictions
	userPredictionsAsBytes, predictionErr := firestore.GetAll("predictions", "userId", id)
	if predictionErr != nil {
		return User{}, predictionErr
	}

	if len(userPredictionsAsBytes) > 0 {
		user.UserFlags = append(user.UserFlags, "hasPredictions")
	}


	return user, nil
}

func AuthorizeDiscord(discordCode string) (Response, error) {
	discordResponse := utils.GetDiscordAuthorizationToken(discordCode)
	discordUser, discordErr := utils.GetDiscordUser(discordResponse.AccessToken)

	if discordErr != nil || discordUser.ID == "" || discordUser.Username == "" {
		return Response{}, discordErr
	}

	usersAsBytes, firestoreErr := firestore.GetAll("users", "discordId", discordUser.ID)
	var user User
	if firestoreErr != nil {
		return Response{}, firestoreErr
	} else if len(usersAsBytes) > 1 {
		return Response{}, errors.New("Multiple users with the same Discord ID")
	}

	if len(usersAsBytes) == 0 {
		user.DiscordID = discordUser.ID
		user.DiscordName = discordUser.Username

		return Response{
			User: user,
			JwtToken: "",
			DiscordInfo: discordResponse,
		}, nil
	}
	
	if jsonErr := json.Unmarshal(usersAsBytes[0], &user); jsonErr != nil {
		return Response{}, jsonErr
	}

	token, _ := utils.GenerateJwtToken(
		discordResponse.ExpiresIn,
		discordResponse.AccessToken,
		discordResponse.RefreshToken,
		user.ID,
	)

	return Response{
		User: user,
		JwtToken: token,
		DiscordInfo: discordResponse,
	}, nil
}

func RegisterNewUser(registerInfo RegisterBody) (Response, error) {
	registerBodyAsMap := utils.ConvertStructToMap(registerInfo)
	userJson, userErr := firestore.CreateNew("users", registerBodyAsMap)
	if userErr != nil {
		return Response{}, userErr
	}
	var user User
	if jsonErr := json.Unmarshal(userJson, &user); jsonErr != nil {
		return Response{}, jsonErr
	}

	token, tokenErr := utils.GenerateJwtToken(
		registerInfo.DiscordRegistration.ExpiresIn,
		registerInfo.DiscordRegistration.AccessToken,
		registerInfo.DiscordRegistration.RefreshToken,
		user.ID,
	)
	if tokenErr != nil {
		return Response{}, tokenErr
	}

	return Response{
		User: user,
		JwtToken: token,
	}, nil
}

func LinkAccountToDiscord(registerInfo RegisterBody, userID string) (Response, error) {
	updateFields := []googleFirestore.Update{
		{
			Path: "discordId",
			Value: registerInfo.User.DiscordID,
		},
		{
			Path: "discordName",
			Value: registerInfo.User.DiscordName,
		},
	}
	docAsBytes, updateErr := firestore.UpdateDoc("users", userID, updateFields)
	if updateErr != nil {
		return Response{}, updateErr
	}

	var user User
	if jsonErr := json.Unmarshal(docAsBytes, &user); jsonErr != nil {
		return Response{}, jsonErr
	}

	token, tokenErr := utils.GenerateJwtToken(
		registerInfo.DiscordRegistration.ExpiresIn,
		registerInfo.DiscordRegistration.AccessToken,
		registerInfo.DiscordRegistration.RefreshToken,
		user.ID,
	)
	if tokenErr != nil {
		return Response{}, tokenErr
	}

	return Response{
		User: user,
		JwtToken: token,
	}, nil
}
