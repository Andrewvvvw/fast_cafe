from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.models import MenuItem, Category, Tag
from decimal import Decimal

async def seed_menu_item_categories(session: AsyncSession):
    category_names = [
        "Coffee"
    ]

    for category in category_names:
        result = await session.execute(
            select(Category).where(Category.name == category)
        )
        existing_category = result.scalar_one_or_none()

        if not existing_category:
            new_category = Category(
                name=category
            )
            session.add(new_category)
            print(f"Seeding: added new menu item category -> {new_category}")

    await session.commit()


async def seed_menu_item_tags(session: AsyncSession):
    tag_names = [
        "Hot",
        "Cold",
        "Milk",
        "Cream",
        "Whipped Cream",
        "Chocolate",
    ]

    for tag in tag_names:
        result = await session.execute(
            select(Tag).where(Tag.name == tag)
        )
        existing_tag = result.scalar_one_or_none()

        if not existing_tag:
            new_tag = Tag(
                name=tag
            )
            session.add(new_tag)
            print(f"Seeding: added new menu item tag -> {new_tag}")

    await session.commit()


async def seed_menu_items(session: AsyncSession):
    desired_items = [
        {
            "name": "Эспрессо",
            "price": Decimal("2.00"),
            "description": "Классический крепкий черный кофе.",
            "image": "espresso.webp",
            "category_id": 1,
            "tags": ["Hot"]
        },
        {
            "name": "Доппио",
            "price": Decimal("3.00"),
            "description": "Двойная порция классического эспрессо.",
            "image": "doppio.webp",
            "category_id": 1,
            "tags": ["Hot"]
        },
        {
            "name": "Ристретто",
            "price": Decimal("2.00"),
            "description": "Крепкий кофейный концентрат, плотный вкус.",
            "image": "ristretto.webp",
            "category_id": 1,
            "tags": ["Hot"]
        },
        {
            "name": "Лунго",
            "price": Decimal("2.20"),
            "description": "Эспрессо с повышенным содержанием воды.",
            "image": "lungo.webp",
            "category_id": 1,
            "tags": ["Hot"]
        },
        {
            "name": "Американо",
            "price": Decimal("2.20"),
            "description": "Эспрессо, разбавленный горячей водой.",
            "image": "americano.webp",
            "category_id": 1,
            "tags": ["Hot"]
        },
        {
            "name": "Фильтр-кофе",
            "price": Decimal("2.50"),
            "description": "Мягкий черный кофе капельного заваривания.",
            "image": "filter-coffee.webp",
            "category_id": 1,
            "tags": ["Hot"]
        },
        {
            "name": "Капучино",
            "price": Decimal("3.00"),
            "description": "Идеальный баланс кофе и молочной пены.",
            "image": "cappucino.webp",
            "category_id": 1,
            "tags": ["Hot", "Milk"]
        },
        {
            "name": "Латте",
            "price": Decimal("3.50"),
            "description": "Нежный молочный напиток на основе эспрессо.",
            "image": "latte.webp",
            "category_id": 1,
            "tags": ["Hot", "Milk"]
        },
        {
            "name": "Флэт Уайт",
            "price": Decimal("4.00"),
            "description": "Насыщенный кофейный вкус с тонкой пенкой.",
            "image": "flat-white.webp",
            "category_id": 1,
            "tags": ["Hot", "Milk"]
        },
        {
            "name": "Раф-кофе",
            "price": Decimal("4.50"),
            "description": "Сливочный напиток со вкусом ванильного мороженого.",
            "image": "raf.webp",
            "category_id": 1,
            "tags": ["Hot", "Milk", "Cream"]
        },
        {
            "name": "Мокачино",
            "price": Decimal("4.20"),
            "description": "Кофейно-молочный микс с добавлением шоколада.",
            "image": "mocha.webp",
            "category_id": 1,
            "tags": ["Hot", "Milk", "Chocolate"]
        },
        {
            "name": "Макиато",
            "price": Decimal("2.50"),
            "description": "Эспрессо с каплей нежной молочной пены.",
            "image": "makiato.webp",
            "category_id": 1,
            "tags": ["Hot", "Milk"]
        },
        {
            "name": "Латте Макиато",
            "price": Decimal("3.80"),
            "description": "Слоистый кофейный коктейль с пышной пеной.",
            "image": "latte-makiato.webp",
            "category_id": 1,
            "tags": ["Hot", "Milk"]
        },
        {
            "name": "Кортадо",
            "price": Decimal("3.20"),
            "description": "Испанский рецепт: кофе и молоко 1:1.",
            "image": "cortado.webp",
            "category_id": 1,
            "tags": ["Hot", "Milk"]
        },
        {
            "name": "Кофе по-венски",
            "price": Decimal("4.00"),
            "description": "Черный кофе под шапкой взбитых сливок.",
            "image": "vienna-coffee.webp",
            "category_id": 1,
            "tags": ["Hot", "Cream"]
        },
        {
            "name": "Кон Панна",
            "price": Decimal("2.80"),
            "description": "Порция эспрессо с нежными взбитыми сливками.",
            "image": "con-panna.webp",
            "category_id": 1,
            "tags": ["Hot", "Cream"]
        },
        {
            "name": "Пикколо Латте",
            "price": Decimal("3.00"),
            "description": "Миниатюрный латте с ярким вкусом кофе.",
            "image": "piccolo-latte.webp",
            "category_id": 1,
            "tags": ["Hot", "Milk"]
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
                image_path=item_data.get("image"),
                category_id=item_data["category_id"],
                is_available=True
            )

            result = await session.execute(select(Tag))
            tags = {
                tag.name: tag
                for tag in result.scalars()
            }
            new_item.tags = [
                tags[name]
                for name in item_data["tags"]
            ]

            session.add(new_item)
            print(f"Seeding: added new menu item -> {item_data['name']}")

    await session.commit()

async def seed_cafe_menu(session: AsyncSession):
    await seed_menu_item_categories(session)
    await seed_menu_item_tags(session)
    await seed_menu_items(session)