.PHONY: help build up down logs clean

help:
@echo "Доступные команды:"
@echo "  make build  - пересобрать все контейнеры"
@echo "  make up     - запустить контейнеры"
@echo "  make down   - остановить контейнеры"
@echo "  make logs   - посмотреть логи"
@echo "  make clean  - остановить и удалить все"

build:
docker-compose build

up:
docker-compose up -d

down:
docker-compose down

logs:
docker-compose logs -f

clean:
docker-compose down -v
docker system prune -f
