package predictions

import (
	"net/http"
	"encoding/json"
	"log"
	"github.com/gorilla/mux"
)

func RegisterUserRoutes(r *mux.Router) {
	r.HandleFunc("/predictions", getAllPredictions).Methods("GET")
	r.HandleFunc("/predictions", createOrSavePredictions).Methods("POST")
}

func getAllPredictions(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	predictions, predictionErr := GetAllPredictions()
	if predictionErr != nil {
		w.WriteHeader(http.StatusInternalServerError)
		log.Fatal(predictionErr)
		json.NewEncoder(w).Encode(predictionErr)

		return
	}

	json.NewEncoder(w).Encode(predictions)
}

func createOrSavePredictions(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	predictionsToSave := make([]Prediction, 0)
	if jsonErr := json.NewDecoder(r.Body).Decode(&predictionsToSave); jsonErr != nil {
		w.WriteHeader(http.StatusBadRequest)    
        w.Write([]byte(`{ "message": "Invalid request" }`)) 
        return
	}

	predictions, predictionErr := CreateOrSavePredictions(predictionsToSave)

	if predictionErr != nil {
		log.Println(predictionErr)
		w.WriteHeader(http.StatusBadRequest)    
        w.Write([]byte(`{ "message": "Invalid request" }`))
		return
	}

	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(predictions)
}