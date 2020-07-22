package database

import (
    b64 "encoding/base64"
    "google.golang.org/grpc/codes"
	"context"
	"errors"
	firebase "firebase.google.com/go"
	"cloud.google.com/go/firestore"
	"github.com/joho/godotenv"
	"google.golang.org/api/iterator"
    "encoding/json"
	"log"
	"google.golang.org/api/option"
	"os"
    "google.golang.org/grpc/status"
    "squad/utils"
)

var dbInstance *firestore.Client

func init() {
	if _, ok := os.LookupEnv("FIREBASE_CONFIG_SERVICE_ACCOUNT"); !ok {
		envReadErr := godotenv.Load("config.env")
		if envReadErr != nil {
			log.Fatalln(envReadErr)
		}
	}
	
	encodedServiceAccount := os.Getenv("FIREBASE_CONFIG_SERVICE_ACCOUNT")
	serviceAccountCreds, decodeErr := b64.StdEncoding.DecodeString(encodedServiceAccount)
	if decodeErr != nil {
		log.Fatalln(decodeErr)
	}

	ctx := context.Background()
	serviceAccount := option.WithCredentialsJSON(serviceAccountCreds)
	app, firebaseErr := firebase.NewApp(ctx, nil, serviceAccount)

	if firebaseErr != nil {
		log.Fatalln(firebaseErr)
	}

	client, clientErr := app.Firestore(ctx)
	if clientErr != nil {
		log.Fatalln(clientErr)
	}

	dbInstance = client
}

func GetAll(collectionName string, filterKey string, filterValue string) ([][]byte, error) {
	allObjs := make([][]byte, 0)

	var iter *firestore.DocumentIterator
	if filterKey != "" && filterValue != "" {
		iter = dbInstance.Collection(collectionName).Where(filterKey, "==", filterValue).Documents(context.Background())
	} else {
		iter = dbInstance.Collection(collectionName).Documents(context.Background())
	}

	for {
		doc, err := iter.Next()
		if err == iterator.Done {
			break
		}
		if err != nil {
			return [][]byte{}, err
		}
		docMap := doc.Data()
		docMap["id"] = doc.Ref.ID
		jsonString, jsonMarshalErr := json.Marshal(docMap)
		if jsonMarshalErr != nil {
			return [][]byte{}, jsonMarshalErr
		}

		allObjs = append(allObjs, jsonString)
	}

	return allObjs, nil
}

func GetByID(collectionName string, ID string) ([]byte, error) {
	documentSnapshot, docErr := dbInstance.Collection(collectionName).Doc(ID).Get(context.Background())
	if docErr != nil {
		if status.Code(docErr) == codes.NotFound {
			return []byte{}, errors.New(utils.DocumentNotFoundError)
		}

		return []byte{}, docErr
	}

	docMap := documentSnapshot.Data()
	docMap["id"] = documentSnapshot.Ref.ID
	docJsonString, jsonMarshalErr := json.Marshal(docMap)
	if jsonMarshalErr != nil {
		return []byte{}, jsonMarshalErr
	}

	return docJsonString, nil
}

func CreateNew(collectionName string, obj map[string]interface{}) ([]byte, error) {
	if obj["id"] != nil {
		delete(obj, "id")
	}
	docRef, _, err := dbInstance.Collection(collectionName).Add(context.Background(), obj)
	if err != nil {
		return []byte{}, err
	}

	obj["id"] = docRef.ID
	docJsonString, jsonMarshalErr := json.Marshal(obj)
	if jsonMarshalErr != nil {
		return []byte{}, jsonMarshalErr
	}

	return docJsonString, nil
}

func UpdateDoc(collectionName string, docId string, fields []firestore.Update) ([]byte, error) {
	_, docErr := dbInstance.Collection(collectionName).Doc(docId).Update(context.Background(), fields)
	if docErr != nil {
		return []byte{}, docErr
	}

	return GetByID(collectionName, docId)
}
