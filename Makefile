.PHONY: help up down logs test lint build format
help:
	@echo "up down logs test lint build format"
up:
	docker compose up
down:
	docker compose down
logs:
	docker compose logs -f
test:
	cd backend && go test ./...
lint:
	cd frontend && npm run lint
build:
	docker compose build
format:
	cd backend && gofmt -w .
