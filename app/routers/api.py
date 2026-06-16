from fastapi import APIRouter, status, Depends, HTTPException
from app.schemas import OrderResponse, OrderCreate
from app.models import Order, OrderItem, OrderStatus
from app.database import get_db
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.websocket import manager

router = APIRouter(prefix="/api/orders", tags=["Orders API"])

@router.post("", response_model=OrderResponse, status_code=status.HTTP_201_CREATED)
async def create_order(order_data: OrderCreate, db: AsyncSession = Depends(get_db)) -> Order:
    order = Order(comment=order_data.comment)
    
    db.add(order)
    await db.flush()

    for item in order_data.items:
        order_item = OrderItem(order_id = order.id, item_id = item.item_id, quantity=item.quantity)
        db.add(order_item)
    
    await db.commit()
    await db.refresh(order)

    order_json = OrderResponse.model_validate(order).model_dump(mode="json")
    await manager.broadcast(order_json)

    return order

@router.patch("/{order_id}/status", response_model=OrderResponse)
async def update_order_status(order_id: int, new_status: OrderStatus, db: AsyncSession = Depends(get_db)) -> Order:
    result = await db.execute(select(Order).where(Order.id == order_id))
    order = result.scalar_one_or_none()

    if order is None:
        raise HTTPException(status_code=404, detail="Order not found")
    
    order.status = new_status

    await db.commit()
    await db.refresh(order)

    await manager.broadcast({"event": "status_updated", "order_id": order_id, "status": new_status})
    return order