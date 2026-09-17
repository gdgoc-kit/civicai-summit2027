package main

import (
	apphttp "backend/internal/interface/http"
	"backend/internal/usecase"
	"log"
	"net/http"
)

func main() {
	handler := apphttp.NewHandler(usecase.NewHealth())
	log.Println("listening on 0.0.0.0:8080")
	log.Fatal(http.ListenAndServe("0.0.0.0:8080", handler))
}
