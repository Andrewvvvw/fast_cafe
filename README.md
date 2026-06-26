# Fast Cafe - Real-time Pre-order & Dashboard System

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Click%20Here-B453E2?style=flat-square)](http://2.59.161.183/)


A B2B business system for automating orders at a local coffee shop. It allows customers to place pre-orders via a web interface, while enabling baristas to receive them instantly on a real-time dashboard.

## Project stack
* **Backend:** Python 3.13, FastAPI (Async), Uvicorn
* **Database:** PostgreSQL, SQLAlchemy 2.0 (Async Engine), asyncpg
* **Frontend:** HTML5 (Jinja2), Bootstrap 5, JavaScript (jQuery AJAX, WebSockets)
* **DevOps:** Docker, Docker Compose

## Architectural features
* **Full Async Lifecycle:** The entire request processing and database interaction cycle is implemented using `async/await` for high throughput.
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
