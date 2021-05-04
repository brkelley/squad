package utils

import (
	"encoding/json"
)

func ConvertStructToMap(obj interface{}) map[string]interface{} {
    var asMap map[string]interface{}
	bytes, _ := json.Marshal(obj)
    json.Unmarshal(bytes, &asMap)

	return asMap
}