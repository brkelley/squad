package main

import (
    "fmt"
    "log"
    "time"
    "net/http"
    "github.com/gorilla/mux"
    "github.com/rs/cors"
    User "squad/user"
    "os"
    Predictions "squad/predictions"
    ProPlay "squad/proplay"
    "squad/utils"
    "regexp"
)

// PORT port number for the server to listen on
var PORT = os.Getenv("PORT")

func loggingMiddleware(next http.Handler) http.Handler {
    return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
        log.Println(r.Method + "\t" + r.RequestURI)
        // Call the next handler, which can be another middleware in the chain, or the final handler.
        next.ServeHTTP(w, r)
    })
}

func authenticationMiddleware(next http.Handler) http.Handler {
    ignoredRoutes := [...]string{"/api/v2/auth/discord", "/api/v2/auth/riot/(.*)", "api/v2/users"}

    return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
        for _, route := range ignoredRoutes {
            if match, _ := regexp.MatchString(route, r.URL.Path); match {
                next.ServeHTTP(w, r)

                return
            }
        }

        squadtoken := r.Header.Get("squadtoken")

        if squadtoken == "" {
            w.WriteHeader(http.StatusUnauthorized)
            w.Header().Set("Content-Type", "application/json")
            w.Write([]byte("Unauthorized"))

            return
        }

        claims, jwtError := utils.ParseJwtToken(squadtoken)
        currentTimestamp := time.Now().Unix()
        isExpired := currentTimestamp > claims.ExpiresAt

        if jwtError != nil || isExpired || claims.DiscordAccessToken == "" || claims.DiscordRefreshToken == "" {
            w.WriteHeader(http.StatusUnauthorized)
            w.Header().Set("Content-Type", "application/json")
            w.Write([]byte("Unauthorized"))

            return
        }

        next.ServeHTTP(w, r)
    })
}

func handleRequests() {
    squadRouter := mux.NewRouter().StrictSlash(true)
    api := squadRouter.PathPrefix("/api/v2").Subrouter()
    Predictions.RegisterUserRoutes(api)
    User.RegisterUserRoutes(api)
    ProPlay.RegisterUserRoutes(api)

    api.Use(loggingMiddleware)
    api.Use(authenticationMiddleware)

    if PORT == "" {
        PORT = "4444"
    }
    fmt.Println("Starting SQUAD server on port " + PORT)
    corsWrapper := cors.New(cors.Options{
        AllowedMethods: []string{"GET", "POST"},
        AllowedHeaders: []string{"Content-Type", "Origin", "Accept", "*"},
    })
    log.Fatal(http.ListenAndServe("0.0.0.0:" + PORT, corsWrapper.Handler(squadRouter)))
}

func main() {
    handleRequests()
}
