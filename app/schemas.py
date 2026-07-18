from pydantic import BaseModel, ConfigDict
from app.models import OrderStatus
from datetime import datetime
from decimal import Decimal
from pydantic import Field

class MenuItemResponse(BaseModel):
    id: int
    name: str
    description: str | None
    price: Decimal
    image_path: str | None

    model_config = ConfigDict(from_attributes=True)

class OrderItemCreate(BaseModel):
    item_id: int
    quantity: int = Field(gt=0)

class OrderItemResponse(BaseModel):
    id: int
    item_id: int
    quantity: int
    price: Decimal
    
    menu_item: MenuItemResponse

    model_config = ConfigDict(from_attributes=True)

class OrderCreate(BaseModel):
    comment: str | None = None
    items: list[OrderItemCreate] = Field(min_length=1)

class OrderResponse(BaseModel):
    id: int
    status: OrderStatus
    created_at: datetime
    comment: str | None
    items: list[OrderItemResponse]

    model_config = ConfigDict(from_attributes=True)

class TagResponse(BaseModel):
    id: int
    name: str

    model_config = ConfigDict(from_attributes=True)

class CategoryResponse(BaseModel):
    id: int
    name: str

    model_config = ConfigDict(from_attributes=True)

class FiltersResponse(BaseModel):
    categories: list[CategoryResponse]
    tags: list[TagResponse]