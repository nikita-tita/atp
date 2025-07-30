# =============================================================================
# ATP PLATFORM - MAKEFILE
# =============================================================================
# Удобные команды для разработки и развертывания

.PHONY: help setup build up down restart logs clean test lint format

# Цвета для вывода
RED=\033[0;31m
GREEN=\033[0;32m
YELLOW=\033[1;33m
BLUE=\033[0;34m
NC=\033[0m # No Color

# Переменные
COMPOSE_FILE=docker-compose.dev.yml
PROJECT_NAME=atp-platform

# =============================================================================
# HELP
# =============================================================================

help: ## Показать эту справку
	@echo "$(BLUE)ATP Platform - Доступные команды:$(NC)"
	@echo ""
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "$(GREEN)%-20s$(NC) %s\n", $$1, $$2}'
	@echo ""
	@echo "$(YELLOW)Примеры использования:$(NC)"
	@echo "  make setup     # Первоначальная настройка проекта"
	@echo "  make up        # Запустить все сервисы"
	@echo "  make logs      # Посмотреть логи всех сервисов"
	@echo "  make down      # Остановить все сервисы"

# =============================================================================
# DEVELOPMENT COMMANDS
# =============================================================================

setup: ## Первоначальная настройка проекта
	@echo "$(BLUE)🚀 Настройка ATP Platform...$(NC)"
	@if [ ! -f .env ]; then \
		echo "$(YELLOW)📄 Создание .env файла из .env.example...$(NC)"; \
		cp .env.example .env; \
		echo "$(GREEN)✅ .env файл создан. Отредактируйте его перед запуском!$(NC)"; \
	else \
		echo "$(GREEN)✅ .env файл уже существует$(NC)"; \
	fi
	@echo "$(BLUE)🔧 Создание папок для логов...$(NC)"
	@mkdir -p logs/{nginx,services}
	@echo "$(BLUE)🔧 Создание SSL сертификатов для разработки...$(NC)"
	@mkdir -p infrastructure/nginx/ssl
	@if [ ! -f infrastructure/nginx/ssl/cert.pem ]; then \
		openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
			-keyout infrastructure/nginx/ssl/key.pem \
			-out infrastructure/nginx/ssl/cert.pem \
			-subj "/C=US/ST=State/L=City/O=Organization/CN=localhost"; \
		echo "$(GREEN)✅ SSL сертификаты созданы$(NC)"; \
	fi
	@echo "$(GREEN)🎉 Настройка завершена!$(NC)"
	@echo "$(YELLOW)⚠️  Не забудьте отредактировать .env файл перед запуском$(NC)"

build: ## Собрать все Docker образы
	@echo "$(BLUE)🔨 Сборка Docker образов...$(NC)"
	docker-compose -f $(COMPOSE_FILE) -p $(PROJECT_NAME) build --no-cache
	@echo "$(GREEN)✅ Сборка завершена$(NC)"

up: ## Запустить все сервисы
	@echo "$(BLUE)🚀 Запуск ATP Platform...$(NC)"
	docker-compose -f $(COMPOSE_FILE) -p $(PROJECT_NAME) up -d
	@echo "$(GREEN)✅ Все сервисы запущены$(NC)"
	@echo "$(BLUE)🌐 Доступные сервисы:$(NC)"
	@echo "  Web App:       http://localhost:3000"
	@echo "  Admin Panel:   http://localhost:3100"
	@echo "  API Gateway:   http://localhost"
	@echo "  Auth Service:  http://localhost:3001"
	@echo "  RabbitMQ UI:   http://localhost:15672 (admin/admin)"
	@echo "  MinIO Console: http://localhost:9001 (admin/admin123)"

up-infra: ## Запустить только инфраструктурные сервисы (БД, кэш и т.д.)
	@echo "$(BLUE)🗄️  Запуск инфраструктурных сервисов...$(NC)"
	docker-compose -f $(COMPOSE_FILE) -p $(PROJECT_NAME) up -d postgres redis elasticsearch clickhouse rabbitmq minio
	@echo "$(GREEN)✅ Инфраструктура запущена$(NC)"

down: ## Остановить все сервисы
	@echo "$(BLUE)🛑 Остановка ATP Platform...$(NC)"
	docker-compose -f $(COMPOSE_FILE) -p $(PROJECT_NAME) down
	@echo "$(GREEN)✅ Все сервисы остановлены$(NC)"

restart: ## Перезапустить все сервисы
	@echo "$(BLUE)🔄 Перезапуск ATP Platform...$(NC)"
	$(MAKE) down
	$(MAKE) up
	@echo "$(GREEN)✅ Перезапуск завершен$(NC)"

restart-service: ## Перезапустить конкретный сервис (использование: make restart-service SERVICE=auth-service)
	@if [ -z "$(SERVICE)" ]; then \
		echo "$(RED)❌ Укажите сервис: make restart-service SERVICE=auth-service$(NC)"; \
		exit 1; \
	fi
	@echo "$(BLUE)🔄 Перезапуск сервиса $(SERVICE)...$(NC)"
	docker-compose -f $(COMPOSE_FILE) -p $(PROJECT_NAME) restart $(SERVICE)
	@echo "$(GREEN)✅ Сервис $(SERVICE) перезапущен$(NC)"

# =============================================================================
# LOGS AND MONITORING
# =============================================================================

logs: ## Показать логи всех сервисов
	docker-compose -f $(COMPOSE_FILE) -p $(PROJECT_NAME) logs -f

logs-service: ## Показать логи конкретного сервиса (использование: make logs-service SERVICE=auth-service)
	@if [ -z "$(SERVICE)" ]; then \
		echo "$(RED)❌ Укажите сервис: make logs-service SERVICE=auth-service$(NC)"; \
		exit 1; \
	fi
	docker-compose -f $(COMPOSE_FILE) -p $(PROJECT_NAME) logs -f $(SERVICE)

status: ## Показать статус всех сервисов
	@echo "$(BLUE)📊 Статус сервисов ATP Platform:$(NC)"
	docker-compose -f $(COMPOSE_FILE) -p $(PROJECT_NAME) ps

health: ## Проверить health checks всех сервисов
	@echo "$(BLUE)🏥 Проверка здоровья сервисов:$(NC)"
	@services="postgres redis elasticsearch clickhouse rabbitmq minio auth-service verification-service marketplace-service analytics-service notification-service payment-service"; \
	for service in $$services; do \
		status=$$(docker-compose -f $(COMPOSE_FILE) -p $(PROJECT_NAME) ps -q $$service | xargs docker inspect --format='{{.State.Health.Status}}' 2>/dev/null || echo "not running"); \
		if [ "$$status" = "healthy" ]; then \
			echo "$(GREEN)✅ $$service: healthy$(NC)"; \
		elif [ "$$status" = "unhealthy" ]; then \
			echo "$(RED)❌ $$service: unhealthy$(NC)"; \
		elif [ "$$status" = "starting" ]; then \
			echo "$(YELLOW)🔄 $$service: starting$(NC)"; \
		else \
			echo "$(RED)💀 $$service: not running$(NC)"; \
		fi; \
	done

# =============================================================================
# DATABASE MANAGEMENT
# =============================================================================

db-migrate: ## Выполнить миграции базы данных
	@echo "$(BLUE)🗄️  Выполнение миграций базы данных...$(NC)"
	# TODO: Добавить команды миграций когда будут готовы схемы
	@echo "$(YELLOW)⚠️  Миграции пока не настроены$(NC)"

db-seed: ## Заполнить базу данных тестовыми данными
	@echo "$(BLUE)🌱 Заполнение базы данных тестовыми данными...$(NC)"
	# TODO: Добавить seed данные
	@echo "$(YELLOW)⚠️  Seed данные пока не настроены$(NC)"

db-backup: ## Создать резервную копию базы данных
	@echo "$(BLUE)💾 Создание резервной копии базы данных...$(NC)"
	@timestamp=$$(date +%Y%m%d_%H%M%S); \
	docker-compose -f $(COMPOSE_FILE) -p $(PROJECT_NAME) exec -T postgres pg_dump -U postgres atp_platform > "backup_$$timestamp.sql"; \
	echo "$(GREEN)✅ Резервная копия создана: backup_$$timestamp.sql$(NC)"

db-restore: ## Восстановить базу данных из резервной копии (использование: make db-restore BACKUP=backup_20240116_120000.sql)
	@if [ -z "$(BACKUP)" ]; then \
		echo "$(RED)❌ Укажите файл резервной копии: make db-restore BACKUP=backup_20240116_120000.sql$(NC)"; \
		exit 1; \
	fi
	@if [ ! -f "$(BACKUP)" ]; then \
		echo "$(RED)❌ Файл $(BACKUP) не найден$(NC)"; \
		exit 1; \
	fi
	@echo "$(BLUE)🔄 Восстановление базы данных из $(BACKUP)...$(NC)"
	docker-compose -f $(COMPOSE_FILE) -p $(PROJECT_NAME) exec -T postgres psql -U postgres -d atp_platform < $(BACKUP)
	@echo "$(GREEN)✅ База данных восстановлена$(NC)"

# =============================================================================
# DEVELOPMENT TOOLS
# =============================================================================

shell: ## Открыть shell в контейнере (использование: make shell SERVICE=auth-service)
	@if [ -z "$(SERVICE)" ]; then \
		echo "$(RED)❌ Укажите сервис: make shell SERVICE=auth-service$(NC)"; \
		exit 1; \
	fi
	docker-compose -f $(COMPOSE_FILE) -p $(PROJECT_NAME) exec $(SERVICE) /bin/sh

test: ## Запустить тесты во всех сервисах
	@echo "$(BLUE)🧪 Запуск тестов...$(NC)"
	# TODO: Добавить команды тестирования когда будут готовы тесты
	@echo "$(YELLOW)⚠️  Тесты пока не настроены$(NC)"

lint: ## Проверить код линтерами
	@echo "$(BLUE)🔍 Проверка кода линтерами...$(NC)"
	# TODO: Добавить команды линтинга
	@echo "$(YELLOW)⚠️  Линтеры пока не настроены$(NC)"

format: ## Отформатировать код
	@echo "$(BLUE)✨ Форматирование кода...$(NC)"
	# TODO: Добавить команды форматирования
	@echo "$(YELLOW)⚠️  Форматирование пока не настроено$(NC)"

# =============================================================================
# CLEANUP
# =============================================================================

clean: ## Очистить Docker volumes и образы
	@echo "$(BLUE)🧹 Очистка Docker ресурсов...$(NC)"
	docker-compose -f $(COMPOSE_FILE) -p $(PROJECT_NAME) down -v
	docker system prune -f
	@echo "$(GREEN)✅ Очистка завершена$(NC)"

clean-all: ## Полная очистка (включая образы)
	@echo "$(RED)⚠️  ВНИМАНИЕ: Это удалит ВСЕ образы, контейнеры и volumes!$(NC)"
	@read -p "Вы уверены? (y/N): " confirm; \
	if [ "$$confirm" = "y" ] || [ "$$confirm" = "Y" ]; then \
		docker-compose -f $(COMPOSE_FILE) -p $(PROJECT_NAME) down -v --rmi all; \
		docker system prune -a -f --volumes; \
		echo "$(GREEN)✅ Полная очистка завершена$(NC)"; \
	else \
		echo "$(YELLOW)Операция отменена$(NC)"; \
	fi

# =============================================================================
# PRODUCTION COMMANDS
# =============================================================================

deploy-staging: ## Развернуть в staging окружении
	@echo "$(BLUE)🚀 Развертывание в staging...$(NC)"
	# TODO: Добавить команды деплоя в staging
	@echo "$(YELLOW)⚠️  Staging деплой пока не настроен$(NC)"

deploy-production: ## Развернуть в production окружении
	@echo "$(BLUE)🚀 Развертывание в production...$(NC)"
	# TODO: Добавить команды деплоя в production
	@echo "$(YELLOW)⚠️  Production деплой пока не настроен$(NC)"

# =============================================================================
# MONITORING
# =============================================================================

metrics: ## Открыть Prometheus metrics
	@echo "$(BLUE)📊 Открытие метрик Prometheus...$(NC)"
	@echo "Перейдите на: http://localhost:9090"

grafana: ## Открыть Grafana dashboard
	@echo "$(BLUE)📈 Открытие Grafana dashboard...$(NC)"
	@echo "Перейдите на: http://localhost:3001 (admin/admin)"

# =============================================================================
# DEFAULT TARGET
# =============================================================================

# Если команда не указана, показать справку
.DEFAULT_GOAL := help 