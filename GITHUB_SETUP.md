# 🚀 Инструкция по загрузке проекта на GitHub

## 📋 Шаги для создания репозитория:

### 1. Создайте репозиторий на GitHub
1. Перейдите на https://github.com
2. Нажмите "New repository" или "+" → "New repository"
3. Название: `atp-platform`
4. Описание: `ATP Platform - Aviation Trading Platform`
5. Выберите "Public" или "Private"
6. **НЕ** ставьте галочки на "Add a README file", "Add .gitignore", "Choose a license"
7. Нажмите "Create repository"

### 2. Подключите локальный репозиторий
После создания репозитория, GitHub покажет команды. Выполните:

```bash
# Добавьте remote (замените YOUR_USERNAME на ваше имя пользователя)
git remote add origin https://github.com/YOUR_USERNAME/atp-platform.git

# Отправьте код
git branch -M main
git push -u origin main
```

### 3. Альтернативный способ через SSH
Если у вас настроен SSH ключ:

```bash
git remote add origin git@github.com:YOUR_USERNAME/atp-platform.git
git branch -M main
git push -u origin main
```

## 📊 Статистика проекта:
- **117 файлов** в первом коммите
- **38,157 строк** кода
- **Полная архитектура** микросервисов
- **Frontend + Admin Panel** готовы к деплою
- **Vercel деплой** настроен

## 🌐 Ссылки:
- **Production URL:** https://atp-platform-web-7ycsutg21-nikitas-projects-c62d7451.vercel.app
- **Vercel Dashboard:** https://vercel.com/nikitas-projects-c62d7451/atp-platform-web-app

## 🎯 Что дальше:
1. Создайте репозиторий на GitHub
2. Выполните команды выше
3. Настройте GitHub Actions для автоматического деплоя
4. Добавьте collaborators если нужно 