package predictions

import (
	"encoding/json"
	googleFirestore "cloud.google.com/go/firestore"
	database "squad/database/firestore"
	"squad/utils"
)

type Prediction struct {
	ID			string	`json:"id" firestore:"id,omitempty"`
	UserID		string	`json:"userId" firestore:"userId"`
	Prediction	string	`json:"prediction" firestore:"prediction"`
	Timestamp	int64	`json:"timestamp" firestore:"timestamp"`
	MatchID		string	`json:"matchId" firestore:"matchId"`
}

func GetAllPredictions() ([]Prediction, error) {
	predictionsAsBytes, dbErr := database.GetAll("predictions", "", "")
	if dbErr != nil {
		return []Prediction{}, dbErr
	}
	
	predictions := make([]Prediction, 0)
	for _, predictionBytes := range predictionsAsBytes {
		var prediction Prediction
		jsonErr := json.Unmarshal(predictionBytes, &prediction)

		if jsonErr != nil {
			return []Prediction{}, jsonErr
		}

		predictions = append(predictions, prediction)
	}

	return predictions, nil
}

func CreateOrSavePredictions(predictions []Prediction) ([]Prediction, error) {
	collectedPredictions := make([]Prediction, 0)
	for _, prediction := range predictions {
		if prediction.ID != "" {
			fields := []googleFirestore.Update{
				{
					Path: "prediction",
					Value: prediction.Prediction,
				},
				{
					Path: "timestamp",
					Value: prediction.Timestamp,
				},
			}

			predictionBytes, predictionErr := database.UpdateDoc("predictions", prediction.ID, fields)

			if predictionErr != nil {
				return []Prediction{}, predictionErr
			}

			var updatedPrediction Prediction
			if byteErr := json.Unmarshal(predictionBytes, &updatedPrediction); byteErr != nil {
				return []Prediction{}, byteErr
			}

			collectedPredictions = append(collectedPredictions, updatedPrediction)
		} else {
			predictionAsMap := utils.ConvertStructToMap(prediction)
			predictionBytes, createErr := database.CreateNew("predictions", predictionAsMap)
			if createErr != nil {
				return []Prediction{}, createErr
			}

			var savedPrediction Prediction
			if byteErr := json.Unmarshal(predictionBytes, &savedPrediction); byteErr != nil {
				return []Prediction{}, byteErr
			}

			collectedPredictions = append(collectedPredictions, savedPrediction)
		}
	}

	return collectedPredictions, nil
}
