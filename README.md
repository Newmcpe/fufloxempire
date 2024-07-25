[<img src="https://img.shields.io/badge/Telegram-%40Me-orange">](https://t.me/Newmcpe)
[<img src="https://img.shields.io/badge/Language-English-red?style=flat">](https://github.com/Newmcpe/fuflomuskempire/blob/master/README.en.md)

# fuflomuskempire

Бот, автоматически прокачивающий аккаунт в Musk Empire

## Модули

| Модуль                                                               | Статус |
|----------------------------------------------------------------------|:------:|
| Автокликер                                                           |   ✅    |
| Покупка наиболее выгодных улучшений                                  |   ✅    |
| Автоматический сбор оффлайн-дохода (не нужно заходить каждые 3 часа) |   ✅    |
| Автоматические сражения в PvP-режиме                                 |   ✅    |

## Функционал

| Функция                                                 | Статус |
|---------------------------------------------------------|:------:|
| Включение и отключение модулей бота                     |   ✅    |
| Настройка задержек                                      |   ⌛    |
| Настройка минимального баланса для улучшений и сражений |   ✅    |

## Запуск

Требования:

- [Node.js](https://nodejs.org/)
- [pnpm](https://pnpm.io/)
- [Docker](https://www.docker.com/)
- Создать Telegram-приложение [здесь](https://my.telegram.org/)

### Без Docker

```bash
pnpm install
copy .env-example .env # Укажите API_ID и API_HASH своего приложения в Telegram
pnpm start
```

### С Docker

Добавьте в переменные среды

```
CONFIG_PATH=cfg/
```

Создайте внутри проекта папку cfg и переместите туда свой конфиг, созданный при запуске без Docker. Такое действие
необходимо из-за бага одной из библиотек.

Далее запустите docker-compose

```bash
docker compose up -d
```

## Благодарность

✨ Если вам понравился бот и вы хотите поддержать автора, вы можете сделать это зарегистрировавшись
по [реферальной ссылке](https://t.me/muskempire_bot/game?startapp=hero277588744) автора. Спасибо :3 ❤️