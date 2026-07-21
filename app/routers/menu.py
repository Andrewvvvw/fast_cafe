from fastapi import APIRouter, Depends, Query
from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession
from app.models import MenuItem, Tag
from app.database import get_db
from app.schemas import MenuItemResponse

router = APIRouter(prefix="/api/menu", tags=["Menu API"])

@router.get("", response_model=list[MenuItemResponse])
async def get_menu(
    category_id: int | None = None,
    tag_ids: list[int] | None = Query(default=None),
    db: AsyncSession = Depends(get_db)
):
    query = select(MenuItem).where(MenuItem.is_available.is_(True))

    if category_id is not None:
        query = query.where(MenuItem.category_id == category_id)

    if tag_ids:
        unique_tag_ids = set(tag_ids)

        query = query.join(MenuItem.tags).where(
            Tag.id.in_(unique_tag_ids)
        ).group_by(MenuItem.id).having(func.count(Tag.id.distinct()) == len(unique_tag_ids))

    result = await db.execute(query)
    return result.scalars().all()