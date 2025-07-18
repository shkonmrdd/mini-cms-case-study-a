# Использование Bun для разработки Mini CMS

## Установка Bun

```bash
# macOS/Linux
curl -fsSL https://bun.sh/install | bash

# или через Homebrew (macOS)
brew install bun

# или npm (если bun еще не установлен)
npm install -g bun
```

## Запуск с Bun

### Быстрый старт
```bash
# Установить все зависимости одной командой
bun run install:all:bun

# Запустить приложение (backend + frontend)
bun run dev:bun
```

### Отдельные команды

```bash
# Backend TypeScript сервер
cd backend
bun run dev:bun

# Frontend React приложение  
cd frontend
bun run dev

# Инициализация базы данных
cd backend
bun run init-db:bun
```

## Преимущества Bun

- ⚡ **Быстрее npm/yarn** - до 10x быстрее установка пакетов
- 🚀 **Быстрый TypeScript runtime** - не нужна компиляция
- 📦 **Встроенный bundler** - альтернатива Webpack/Vite
- 🛠 **Встроенный test runner** - замена Jest
- 🔥 **Hot reload** - мгновенная перезагрузка при изменениях

## Команды проекта

| Действие | npm | bun |
|----------|-----|-----|
| Установка зависимостей | `npm run install:all` | `bun run install:all:bun` |
| Запуск разработки | `npm run dev` | `bun run dev:bun` |
| Сборка | `npm run build` | `bun run build:bun` |
| Запуск продакшн | `npm run start` | `bun run start:bun` |

## Production готовность

```bash
# Сборка frontend
bun run build:bun

# Запуск в production
bun run start:bun
```

## Совместимость

- ✅ Полная совместимость с npm пакетами
- ✅ TypeScript out-of-the-box
- ✅ Node.js API совместимость
- ✅ React/Vite поддержка

Используйте bun для быстрой разработки и npm для стабильного production! 