from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.models import MenuItem
from decimal import Decimal

async def seed_cafe_menu(session: AsyncSession):
    desired_items = [
        {
            "name": "Эспрессо",
            "price": Decimal("2.00"),
            "description": "Классический крепкий черный кофе.",
            "image": "espresso.webp"
        },
        {
            "name": "Доппио",
            "price": Decimal("3.00"),
            "description": "Двойная порция классического эспрессо.",
            "image": "doppio.webp"
        },
        {
            "name": "Ристретто",
            "price": Decimal("2.00"),
            "description": "Крепкий кофейный концентрат, плотный вкус.",
            "image": "ristretto.webp"
        },
        {
            "name": "Лунго",
            "price": Decimal("2.20"),
            "description": "Эспрессо с повышенным содержанием воды.",
            "image": "lungo.webp"
        },
        {
            "name": "Американо",
            "price": Decimal("2.20"),
            "description": "Эспрессо, разбавленный горячей водой.",
            "image": "americano.webp"
        },
        {
            "name": "Фильтр-кофе",
            "price": Decimal("2.50"),
            "description": "Мягкий черный кофе капельного заваривания.",
            "image": "filter-coffee.webp"
        },
        {
            "name": "Капучино",
            "price": Decimal("3.00"),
            "description": "Идеальный баланс кофе и молочной пены.",
            "image": "cappucino.webp"
        },
        {
            "name": "Латте",
            "price": Decimal("3.50"),
            "description": "Нежный молочный напиток на основе эспрессо.",
            "image": "latte.webp"
        },
        {
            "name": "Флэт Уайт",
            "price": Decimal("4.00"),
            "description": "Насыщенный кофейный вкус с тонкой пенкой.",
            "image": "flat-white.webp"
        },
        {
            "name": "Раф-кофе",
            "price": Decimal("4.50"),
            "description": "Сливочный напиток со вкусом ванильного мороженого.",
            "image": "raf.webp"
        },
        {
            "name": "Мокачино",
            "price": Decimal("4.20"),
            "description": "Кофейно-молочный микс с добавлением шоколада.",
            "image": "mocha.webp"
        },
        {
            "name": "Макиато",
            "price": Decimal("2.50"),
            "description": "Эспрессо с каплей нежной молочной пены.",
            "image": "makiato.webp"
        },
        {
            "name": "Латте Макиато",
            "price": Decimal("3.80"),
            "description": "Слоистый кофейный коктейль с пышной пеной.",
            "image": "latte-makiato.webp"
        },
        {
            "name": "Кортадо",
            "price": Decimal("3.20"),
            "description": "Испанский рецепт: кофе и молоко 1:1.",
            "image": "cortado.webp"
        },
        {
            "name": "Кофе по-венски",
            "price": Decimal("4.00"),
            "description": "Черный кофе под шапкой взбитых сливок.",
            "image": "vienna-coffee.webp"
        },
        {
            "name": "Кон Панна",
            "price": Decimal("2.80"),
            "description": "Порция эспрессо с нежными взбитыми сливками.",
            "image": "con-panna.webp"
        },
        {
            "name": "Пикколо Латте",
            "price": Decimal("3.00"),
            "description": "Миниатюрный латте с ярким вкусом кофе.",
            "image": "piccolo-latte.webp"
        }
    ]

    for item_data in desired_items:
        result = await session.execute(
            select(MenuItem).where(MenuItem.name == item_data["name"])
        )
        existing_item = result.scalar_one_or_none()

        if not existing_item:
            new_item = MenuItem(
                name=item_data["name"],
                price=item_data["price"],
                description=item_data["description"],
                image=item_data.get("image"),
                is_available=True
            )
            session.add(new_item)
            print(f"Сидинг: добавлен новый товар -> {item_data['name']}")

    await session.commit()