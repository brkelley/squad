package utils

import (
	"errors"
	"github.com/dgrijalva/jwt-go"
	"time"
)

// Create the JWT key used to create the signature
var jwtKey = []byte("gsph_squad")

// SquadJwtClaims Create a struct that will be encoded to a JWT.
// We add jwt.StandardClaims as an embedded type, to provide fields like expiry time
type SquadJwtClaims struct {
	DiscordAccessToken 		string `json:"access_token"`
	DiscordRefreshToken		string `json:"refresh_token"`
	UserID					string `json:"userId"`
	jwt.StandardClaims
}

func GenerateJwtToken(expiresIn int64, accessToken string, refreshToken string, userID string) (string, error) {
	expirationTime := time.Now().Add(time.Duration(expiresIn) * time.Second)

	claims := &SquadJwtClaims{
		DiscordAccessToken: accessToken,
		DiscordRefreshToken: refreshToken,
		UserID: userID,
		StandardClaims: jwt.StandardClaims{
			ExpiresAt: expirationTime.Unix(),
		},
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	tokenString, err := token.SignedString(jwtKey)
	if err != nil {
		return "", err
	}

	return tokenString, nil
}

func ParseJwtToken(tokenString string) (SquadJwtClaims, error) {
	token, parseError := jwt.ParseWithClaims(tokenString, &SquadJwtClaims{}, func(token *jwt.Token) (interface{}, error) {
		return jwtKey, nil
	})

	if parseError != nil {
		return SquadJwtClaims{}, parseError
	}

	claims, ok := token.Claims.(*SquadJwtClaims)

	if ok && token.Valid {
		return *claims, nil
	}

	return *claims, errors.New("invalid jwt token")
}
