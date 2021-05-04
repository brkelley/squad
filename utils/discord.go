package utils

import (
	"encoding/json"
)

var clientID = "805510957404782623"
var clientSecret = "wzWIkGByZ7DlGFa-HspHZYz_Sm4YHk9L"

type DiscordUser struct {
	ID 				string 	`json:"id"`
	Username 		string 	`json:"username"`
	Avatar 			string 	`json:"avatar"`
	Discriminator 	string 	`json:"discriminator"`
	PublicFlags 	int 	`json:"public_flags"`
	flags 			int 	`json:"flags"`
	locale 			string 	`json:"locale"`
	MfaEnabled 		bool 	`json:"mfa_enabled"`
}

type DiscordAuthorizationTokenResponse struct {
	AccessToken 	string 	`json:"access_token"`
	TokenType 		string 	`json:"token_type"`
	ExpiresIn 		int64 	`json:"expires_in"`
	RefreshToken 	string 	`json:"refresh_token"`
	Scope 			string 	`json:"scope"`
}

func GetDiscordAuthorizationToken(code string, hostname string, redirectUri string) DiscordAuthorizationTokenResponse {
	var discordResponse DiscordAuthorizationTokenResponse
	url := "https://discord.com/api/v8/oauth2/token"
	body := map[string]string {
		"client_id": clientID,
		"client_secret": clientSecret,
		"grant_type": "authorization_code",
		"redirect_uri": redirectUri,
		"scope": "identify",
		"code": code,
	}
	headers := map[string]string {
		"Content-Type": "application/x-www-form-urlencoded",
	}

	responsePackage := Post(url, body, headers)
	json.Unmarshal(responsePackage.Body, &discordResponse)

	return discordResponse
}

func RefreshDiscordAuthorizationToken(refreshToken string) DiscordAuthorizationTokenResponse {
	var discordResponse DiscordAuthorizationTokenResponse
	url := "https://discord.com/api/v8/oauth2/token"
	body := map[string]string {
		"client_id": clientID,
		"client_secret": clientSecret,
		"grant_type": "refresh_token",
		"redirect_uri": "http://localhost:5555/auth/redirect",
		"scope": "identify",
		"refresh_token": refreshToken,
	}
	headers := map[string]string {
		"Content-Type": "application/x-www-form-urlencoded",
	}

	responsePackage := Post(url, body, headers)
	json.Unmarshal(responsePackage.Body, &discordResponse)

	return discordResponse

}

func GetDiscordUser(accessToken string) (DiscordUser, error) {
	var discordUser DiscordUser
	url := "https://discord.com/api/v8/users/@me"
	headers := map[string]string {
		"Content-Type": "application/x-www-form-urlencoded",
		"Authorization": "Bearer " + accessToken,
	}
	responsePackage, err := Get(url, headers)

	if err != nil {
		return DiscordUser{}, err
	}

	json.Unmarshal(responsePackage.Body, &discordUser)

	return discordUser, nil
}
