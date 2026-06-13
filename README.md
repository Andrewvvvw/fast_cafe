# Fast Cafe - Real-time Pre-order & Dashboard System

Бизнес-система (B2B) для автоматизации заказов в локальной кофейне. Позволяет клиентам оформлять предзаказы через веб-интерфейс, а бариста - мгновенно получать их на доску в реальном времени.

## Технологический стек
* **Backend:** Python 3.13, FastAPI (Async), Uvicorn
* **Database:** PostgreSQL, SQLAlchemy 2.0 (Async Engine), asyncpg
* **Frontend:** HTML5 (Jinja2), Bootstrap 5, JavaScript (jQuery AJAX, WebSockets)
* **DevOps:** Docker, Docker Compose

## Архитектурные особенности
* **Полная асинхронность:** Весь цикл обработки запросов и работы с БД реализован через `async/await` для высокой пропускной способности.
* **WebSockets Real-time:** Реализован Connection Manager для бродкаста новых заказов на экраны персонала.
* **Data Integrity:** Строгая валидация данных на базе Pydantic-схем и защита от проблем типа N+1 в ORM.

## Как запустить проект (Docker)
1. Склонируйте репозиторий
2. Запустите команду в корне проекта:
   ```bash
   docker-compose up --build
   ```
3. Приложение будет доступно по адресу: http://localhost:8000