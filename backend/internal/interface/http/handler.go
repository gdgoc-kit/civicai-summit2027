package http

import (
	"encoding/json"
	"backend/internal/usecase"
	"net/http"
)

func NewHandler(health usecase.Health) http.Handler {
	mux := http.NewServeMux()
	mux.HandleFunc("GET /health", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		_ = json.NewEncoder(w).Encode(health.Check())
	})
	return mux
}
