const cart = JSON.parse(localStorage.getItem('cafe_cart')) || [];

export function getCart() {
    return cart;
}

export function addItem(id, name, price) {
    const existing = cart.find(item => item.id === id);
    if (existing) {
        existing.quantity += 1;
    } else {
        cart.push({ id, name, price, quantity: 1 });
    }
    localStorage.setItem('cafe_cart', JSON.stringify(cart));
}

export function removeItem(id) {
    const index = cart.findIndex(item => item.id === id);

    if (index !== -1) {
        cart.splice(index, 1);
    }
    
    localStorage.setItem('cafe_cart', JSON.stringify(cart));
}

export function getCartSize() {
    return cart.length;
}

export function getCartItems() {
    return cart.map(item => ({
        item_id: item.id,
        quantity: item.quantity
    }));
}

export function clearCart() {
    cart.length = 0;
    localStorage.removeItem('cafe_cart');
}