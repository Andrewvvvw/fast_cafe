from pydantic import BaseModel, ConfigDict
from app.models import OrderStatus
from datetime import datetime
from decimal import Decimal

class MenuItemResponse(BaseModel):
    id: int
    name: str
    description: str | None
    price: Decimal
    is_available: bool
    image: str | None

    model_config = ConfigDict(from_attributes=True)

class OrderItemCreate(BaseModel):
    item_id: int
    quantity: int

class OrderItemResponse(BaseModel):
    id: int
    item_id: int
    quantity: int
    
    menu_item: MenuItemResponse

    model_config = ConfigDict(from_attributes=True)

class OrderCreate(BaseModel):
    comment: str | None = None
    items: list[OrderItemCreate]

class OrderResponse(BaseModel):
    id: int
    status: OrderStatus
    created_at: datetime
    comment: str | None
    items: list[OrderItemResponse]

    model_config = ConfigDict(from_attributes=True)