package usecase

import "backend/internal/domain"

type Health struct{}

func NewHealth() Health             { return Health{} }
func (Health) Check() domain.Health { return domain.Health{Status: "ok"} }
