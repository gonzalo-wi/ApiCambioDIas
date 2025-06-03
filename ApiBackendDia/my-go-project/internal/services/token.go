package services

import (
    "encoding/json"
    "errors"
    "net/http"
)

func ObtenerJmapToken() (string, error) {
    url := "https://servicios.el-jumillano.com.ar:8443/jmap2token/token"
    req, err := http.NewRequest("GET", url, nil)
    if err != nil {
        return "", err
    }
    req.Header.Set("Content-Type", "application/json")
    req.Header.Set("Authorization", "Basic d2F2eTpDMkRBRkNBQ0U2Rjg5REVBMjE0N0NFRDlDODNDMTJGMQ==")

    client := &http.Client{}
    resp, err := client.Do(req)
    if err != nil {
        return "", err
    }
    defer resp.Body.Close()

    var result struct {
        Token string `json:"token"`
    }
    if err := json.NewDecoder(resp.Body).Decode(&result); err != nil {
        return "", err
    }
    if result.Token == "" {
        return "", errors.New("no se recibió token")
    }
    return result.Token, nil
}