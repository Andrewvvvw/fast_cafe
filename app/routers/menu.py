from fastapi import APIRouter, Request, Depends
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.models import MenuItem
from app.database import get_db
from app.schemas import MenuItemResponse

router = APIRouter(prefix="/api/menu", tags=["Menu API"])

@router.get("", response_model=list[MenuItemResponse])
async def get_menu(request: Request, db: AsyncSession = Depends(get_db)):
    query = select(MenuItem).where(MenuItem.is_available)
    result = await db.execute(query)
    return result.scalars().all()