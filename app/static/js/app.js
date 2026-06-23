$(document).ready(function () {
    function getCart() {
        return JSON.parse(localStorage.getItem('cafe_cart') || "[]");
    }

    function saveCart(cart) {
        localStorage.setItem('cafe_cart', JSON.stringify(cart));
        renderUI();
    }

    function renderUI() {
        const cartItemsContainer = $('#cart-items-container');
        cartItemsContainer.empty();
        
        const cart = getCart();

        if(cart.length === 0) {
            cartItemsContainer.append('<p id="cart-empty-message" class="text-muted text-center py-3">Корзина пуста. Выберите продукцию из меню...</p>');
            $('#mobile-cart-total').text('0.00 Р');
            $('#cart-total-amount').text('0.00 Р');
            $('#btn-submit-order').addClass('disabled');
        }
        else {
            $('#btn-submit-order').removeClass('disabled');

            let grandTotal = 0;

            cart.forEach(item => {
                let itemTotal = item.price * item.quantity;
                grandTotal += itemTotal;

                let rowHtml = `
                    <div class="d-flex justify-content-between align-items-center bg-light p-2 rounded mb-2 border border-light-subtle">
                        <div style="max-width: 70%;">
                            <span class="badge bg-primary me-1">${item.quantity}x</span>
                            <span class="fw-bold text-dark small">${item.name}</span>
                            <div class="text-muted ms-4" style="font-size: 0.75rem;">${Number(item.price).toFixed(2)} Р/шт</div>
                        </div>
                        <div class="text-end">
                            <span class="fw-bold text-dark small d-block mb-1">${itemTotal.toFixed(2)} Р</span>
                            <button type="button" 
                                    class="btn btn-link text-danger p-0 m-0 text-decoration-none small js-cart-remove" 
                                    data-id="${item.item_id}" 
                                    style="font-size: 0.8rem;">
                                Удалить
                            </button>
                        </div>
                    </div>
                `;

                cartItemsContainer.append(rowHtml);
            });

            $('#cart-total-amount').text(`${grandTotal.toFixed(2)} Р`);
            $('#mobile-cart-total').text(`${grandTotal.toFixed(2)} Р`);
        }
    }

    $(document).on('click', '.js-add-to-cart', function() {
        const itemId = $(this).data('id');
        const itemName = $(this).data('name');
        const itemPrice = parseFloat($(this).data('price'));

        const cart = getCart();
        const existingItem = cart.find(item => item.item_id === itemId);

        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({ item_id: itemId, name: itemName, price: itemPrice, quantity: 1 });
        }

        saveCart(cart);
    });

    $(document).on('click', '.js-cart-remove', function() {
        const itemId = $(this).data('id');
        const cart = getCart();
        const updatedCart = cart.filter(item => item.item_id !== itemId);
        saveCart(updatedCart);
    });

    $('#order-submission-form').on('submit', function(e) {
        e.preventDefault();
        const customerComment = $("#order-comment").val();
        const cart = getCart();
        const clearedCart = cart.map(({name, price, ...rest}) => rest);

        const orderPayload = {
            comment: customerComment,
            items: clearedCart
        };

        $.ajax({
            url: "/api/orders",
            type: 'POST',
            contentType: 'application/json', 
            dataType: 'json',
            data: JSON.stringify(orderPayload),

            success: function(response) {
                localStorage.removeItem('cafe_cart');
                $('#order-submission-form').trigger('reset');
                renderUI();
                alert(`Ваш заказ успешно отправлен в кофейню! Номер заказа: #${response.id} ☕`);
            },

            error: function(xhr, status, error) {
                console.error("Failed to submit order:", error);
                const errorDetail = xhr.responseJSON ? xhr.responseJSON.detail : "Unknown server error";
                alert("Something went wrong: " + JSON.stringify(errorDetail));
            }
        });
    });

    renderUI();

    if ($('#ws-status-indicator').length === 0) return;

    function connectWebSocket() {
        const socketProtocol = window.location.protocol === 'https:' ? 'wss://' : 'ws://';
        const wsUrl = socketProtocol + window.location.host + '/ws';
        const ws = new WebSocket(wsUrl);
        
        ws.onopen = function(event) {
            $('#ws-status-indicator')
                .text("Подключено")
                .removeClass('text-danger')
                .addClass('text-success');
        };

        ws.onclose = function(event) {
            $('#ws-status-indicator')
                .text("Соединение разорвано. Переподключение...")
                .removeClass('text-success')
                .addClass('text-danger');
            
            setTimeout(() => {
                connectWebSocket();
            }, 5000);
        };

        ws.onmessage = function(event) {
            const data = JSON.parse(event.data);
            console.log("Received a message from socket:", data);
            
            if (data.status === 'new') {
                if ($(`#card-order-${data.id}`).length === 0) {
                    let itemsHtml = '';
                    data.items.forEach(item => {
                        let name = (item.menu_item && item.menu_item.name) ? item.menu_item.name : `Товар ID: ${item.item_id}`;
                        itemsHtml += `<li><span class="badge bg-secondary me-1">${item.quantity}x</span> ${name}</li>`;
                    });

                    let orderCardHtml = `
                        <div class="card mb-3 border-0 shadow-sm" id="card-order-${data.id}">
                            <div class="card-body p-3">
                                <div class="d-flex justify-content-between align-items-center mb-2">
                                    <h6 class="fw-bold m-0 text-dark">Заказ #${data.id}</h6>
                                    <span class="text-muted small">Новый</span>
                                </div>
                                
                                <ul class="list-unstyled small text-dark my-3" style="line-height: 1.6;">
                                    ${itemsHtml}
                                </ul>
                                
                                ${data.comment ? `<div class="alert alert-warning p-2 small mb-3" style="font-size: 0.8rem;"><strong>Комментарий:</strong> ${data.comment}</div>` : ''}
                                
                                <button class="btn btn-warning btn-sm w-100 fw-bold js-btn-transition" 
                                        data-id="${data.id}" 
                                        data-target-status="in_progress">
                                    Начать приготовление
                                </button>
                            </div>
                        </div>
                    `;
                    $(orderCardHtml).prependTo('#kanban-stage-new');
                }
            }

            if (data.event === 'status_updated') {
                let orderCard = $(`#card-order-${data.id}`).detach();
                if(data.new_status === "in_progress") {
                    orderCard.find('.js-btn-transition').text('Оповестить о готовности');
                    orderCard.find('.js-btn-transition').data('target-status', 'ready');
                }
                else if (data.new_status === "ready") {
                    orderCard.find('.js-btn-transition').remove();
                    orderCard.find('.card-body').append(
                        `<div 
                            class="text-success text-center small fw-bold border border-success-subtle bg-success-subtle p-2 rounded">
                            Ожидает гостя
                        </div>`
                    );
                }
                orderCard.appendTo(`#kanban-stage-${data.new_status}`);
            };
        };
    }

    connectWebSocket();

    $(document).on('click', '.js-btn-transition', function() {
        const orderId = $(this).data('id');
        const targetStatus = $(this).data('target-status');
        
        const patchPayload = {
            id: orderId,
            status: targetStatus,
        };

        $.ajax({
            url: `/api/orders/${orderId}/status?new_status=${targetStatus}`,
            type: 'PATCH',
            contentType: 'application/json', 
            dataType: 'json',
            data: JSON.stringify(patchPayload),

            success: function(response) {
                console.log(`Order ${orderId} was successfully updated!`);
            },

            error: function(xhr, status, error) {
                console.error("Failed to submit order:", error);
                const errorDetail = xhr.responseJSON ? xhr.responseJSON.detail : "Unknown server error";
                alert("Something went wrong: " + JSON.stringify(errorDetail));
            }
        });
    });
});