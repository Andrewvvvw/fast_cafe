from fastapi import FastAPI
from fastapi.templating import Jinja2Templates
from contextlib import asynccontextmanager
from app.database import engine, Base, async_session_maker
from fastapi.staticfiles import StaticFiles
from app.utils import seed_cafe_menu

templates = Jinja2Templates(directory="app/templates")

@asynccontextmanager
async def lifespan(app: FastAPI):
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    async with async_session_maker() as session:
        await seed_cafe_menu(session)

    yield

app = FastAPI(title = "Fast Cafe", lifespan=lifespan)
app.mount("/static", StaticFiles(directory="app/static"), name="static")

# app.include_router(pages_router)
# app.include_router(api_router)

