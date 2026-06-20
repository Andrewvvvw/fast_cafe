from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.models import MenuItem
from decimal import Decimal

async def seed_cafe_menu(session: AsyncSession):
    result = await session.execute(select(MenuItem))
    items = result.scalars().all()

    if not items:
        cappucino = MenuItem(name="Каппучино", price=Decimal("3.00"), is_available=True)
        latte = MenuItem(name="Латте", price=Decimal("3.50"), is_available=True)
        croissant = MenuItem(name="Круассан", price=Decimal("2.50"), is_available=True)
        cappucino1 = MenuItem(name="Каппучино2", price=Decimal("3.00"), is_available=True)
        latte1 = MenuItem(name="Латте2", price=Decimal("3.50"), is_available=True)
        croissant1 = MenuItem(name="Круассан2", price=Decimal("2.50"), is_available=True)

        session.add_all([cappucino, latte, croissant, cappucino1, latte1, croissant1])
        await session.commit()