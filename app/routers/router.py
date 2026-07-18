from fastapi import APIRouter

from app.routers.filters import router as filters_router
from app.routers.menu import router as menu_router
from app.routers.orders import router as orders_router
from app.routers.pages import router as pages_router

router = APIRouter()

router.include_router(menu_router)
router.include_router(orders_router)
router.include_router(filters_router)
router.include_router(pages_router)