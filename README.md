# Fast Cafe - Real-time Pre-order & Dashboard Platform

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Click%20Here-B453E2?style=flat-square)](http://fast-cafe.duckdns.org/)


A web-based pre-order platform designed for coffee shops. It allows customers to place orders online while enabling baristas to manage incoming orders through a real-time dashboard.

## Project stack
* **Backend:** Python 3.13, FastAPI (Async), Uvicorn
* **Database:** PostgreSQL, SQLAlchemy 2.0 (Async Engine), asyncpg
* **Frontend:** HTML5 (Jinja2), Tailwind, JavaScript (jQuery AJAX, WebSockets)
* **DevOps:** Docker, Docker Compose

## Screenshots

### Customer interface
<img width="493" height="593" alt="image" src="https://github.com/user-attachments/assets/f3d503cc-571f-49b7-a79c-5ab7e022f2ee" />

### Barista dashboard
<img width="1122" height="636" alt="image" src="https://github.com/user-attachments/assets/7e2e8114-7b0a-495b-bd33-c6389bafcad5" />

## Project structure
```
├── app
│   ├── config.py              # Application configuration and environment variables
│   ├── database.py            # Database connection, engine, and session management
│   ├── main.py                # FastAPI application entry point
│   ├── models.py              # SQLAlchemy ORM models
│   ├── routers                # API route handlers
│   │   ├── filters.py         # Endpoints for loading categories and tags
│   │   ├── menu.py            # Endpoints for retrieving and filtering menu items
│   │   ├── orders.py          # Endpoints for creating and managing orders
│   │   ├── pages.py           # Endpoints for rendering HTML pages
│   │   └── router.py          # Combines all routers into a single router
│   ├── schemas.py             # Pydantic schemas
│   ├── static                 # Static frontend assets
│   │   ├── css
│   │   │   └── style.css      # Application styles
│   │   ├── images
│   │   │   └── products       # Product images
│   │   └── js
│   │       ├── app.js         # Frontend entry point and application initialization
│   │       ├── filters.js     # Filter state management and UI interactions
│   │       ├── menu.js        # Menu loading, rendering, and filtering logic
│   │       └── translations.js   # UI text translations and localization
│   ├── templates              # HTML templates
│   │   ├── base.html          # Base layout shared by all pages
│   │   ├── dashboard.html     # Barista dashboard page
│   │   └── menu.html          # Customer menu page
│   ├── utils.py               # Helper functions and database seeding
│   └── websocket.py           # WebSocket connection manager for real-time updates
├── docker-compose.yml         # Multi-container Docker configuration
├── Dockerfile                 # Docker image build instructions
├── nginx.conf                 # Nginx reverse proxy configuration
├── README.md                  # Project documentation
└── requirements.txt           # Python dependencies
```

## Architectural features
* **Full Async Lifecycle:** The application uses asynchronous request handling and database operations with async/await throughout the backend.
* **Real-time WebSockets:** Implemented a Connection Manager to broadcast new orders to staff dashboard instantly.
* **Data Integrity & Efficiency:** Strict data validation using Pydantic schemas and explicit `selectinload/joinedload` strategies to prevent N+1 queries.

## How to start the system (Docker)
1. Clone this repo
   ```bash
   git clone https://github.com/Andrewvvvw/fast_cafe.git
   ```
2. Launch the containers:
   ```bash
   cd fast_cafe
   docker compose up --build
   ```
3. The app will be available on: http://localhost:8000
4. API Documentation will be available at http://localhost:8000/docs
