from fastapi import APIRouter, Request, Depends
from fastapi.templating import Jinja2Templates
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, desc

from app.database import get_db
from app.models import MenuItem, Order

router = APIRouter(tags=["Frontend Pages"])
templates = Jinja2Templates(directory="app/templates")

@router.get("/")
async def get_menu(request: Request, db: AsyncSession = Depends(get_db)):
    query = select(MenuItem).where(MenuItem.is_available == True)
    result = await db.execute(query)

    menu_items = result.scalars().all()
    return templates.TemplateResponse(
        request=request,
        name="menu.html",
        context={"menu_items": menu_items}
    )

@router.get("/dashboard")
async def get_dashboard(request: Request, db: AsyncSession = Depends(get_db)):
    query = select(Order).order_by(desc(Order.created_at))
    result = await db.execute(query)

    orders = result.scalars().all()
    return templates.TemplateResponse(
        request=request,
        name="dashboard.html",
        context={"orders": orders}
    )