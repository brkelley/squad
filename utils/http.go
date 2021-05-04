package utils

import (
	"bytes"
	"io/ioutil"
	"log"
	"net/http"
	urlService "net/url"
	// "encoding/json"
)

var client = &http.Client{}

type HttpResponse struct {
	Body []byte
	StatusCode int
}

// Get wraps getter to obfuscate golang's process
func Get(url string, headers map[string]string) (HttpResponse, error) {
	req, _ := http.NewRequest(http.MethodGet, url, nil)
	for key, value := range headers {
		req.Header.Add(key, value)
	}

	resp, err := client.Do(req);
	if err != nil {
		log.Fatalf("Error %s", err)
		return HttpResponse{}, err
	}
	defer resp.Body.Close()
	respAsBytes, _ := ioutil.ReadAll(resp.Body)

	return HttpResponse{
		Body: respAsBytes,
		StatusCode: resp.StatusCode,
	}, nil
}

func Post(url string, body map[string]string, headers map[string]string) HttpResponse {
	data := urlService.Values{}
	for key, value := range body {
		data.Add(key, value)
	}
	req, _ := http.NewRequest(http.MethodPost, url, bytes.NewBufferString(data.Encode()))
	for key, value := range headers {
		req.Header.Add(key, value)
	}

	resp, err := client.Do(req);
	if err != nil {
        log.Fatalf("Error %s", err)
	}
	defer resp.Body.Close()
	respAsBytes, _ := ioutil.ReadAll(resp.Body)

	return HttpResponse{
		Body: respAsBytes,
		StatusCode: resp.StatusCode,
	}
}