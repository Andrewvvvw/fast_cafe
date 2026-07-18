from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.database import get_db
from app.models import Tag, Category
from app.schemas import FiltersResponse, CategoryResponse, TagResponse

router = APIRouter(prefix="/api/filters", tags=["Filters API"])

@router.get("", response_model=FiltersResponse)
async def get_filters(
    db: AsyncSession = Depends(get_db),
) -> FiltersResponse:
    tags = (await db.execute(select(Tag))).scalars().all()
    categories = (await db.execute(select(Category))).scalars().all()

    return FiltersResponse(
        categories=[
            CategoryResponse.model_validate(category)
            for category in categories
        ],
        tags=[
            TagResponse.model_validate(tag)
            for tag in tags
        ],
    )