from fastapi import APIRouter, Request, Depends
from fastapi.templating import Jinja2Templates
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, desc
from sqlalchemy.orm import selectinload

from app.database import get_db
from app.models import Order, OrderItem

router = APIRouter(tags=["Frontend Pages"])
templates = Jinja2Templates(directory="app/templates")

@router.get("/")
async def get_menu_page(request: Request):
    return templates.TemplateResponse(
        request=request,
        name="menu.html",
    )

@router.get("/dashboard")
async def get_dashboard(request: Request, db: AsyncSession = Depends(get_db)):
    query = (
        select(Order)
        .options(
            selectinload(Order.items).selectinload(OrderItem.menu_item)
        )
        .order_by(desc(Order.created_at))
    )
    
    result = await db.execute(query)
    orders = result.scalars().all()
    
    return templates.TemplateResponse(
        request=request,
        name="dashboard.html",
        context={"orders": orders}
    )