import { loadMenu } from "./menu.js";
import { loadFilters } from "./filters.js";
import { addItem, removeItem, getCartSize, clearCart, getCartItems, getCart } from "./cart.js";

$(document).ready(async function () {
    function updateCartUI() {
        let count = 0;
        let total = 0;
        let html = '';

        if (getCartSize() === 0) {
            html = `
                <div class="text-center py-8 text-slate-400">
                    <i class="fa-solid fa-box-open text-4xl mb-2"></i>
                    <p class="text-sm">Корзина пуста. Добавьте что-нибудь вкусное!</p>
                </div>`;
            $('#checkout-btn').prop('disabled', true).addClass('opacity-50 cursor-not-allowed');
        } else {
            $('#checkout-btn').prop('disabled', false).removeClass('opacity-50 cursor-not-allowed');
            const cart = getCart();
            cart.forEach((item) => {
                count += item.quantity;
                total += item.price * item.quantity;
                html += `
                    <div class="flex justify-between items-center py-3 border-b border-slate-100 last:border-0">
                        <div>
                            <h4 class="font-semibold text-slate-900 text-sm">${item.name}</h4>
                            <p class="text-xs text-slate-500">${item.price} Р × ${item.quantity}</p>
                        </div>
                        <div class="flex items-center gap-2">
                            <span class="text-sm font-bold text-slate-800">${item.price * item.quantity} Р</span>
                            <button class="remove-item-btn text-rose-500 hover:text-rose-700 p-1.5 rounded-lg hover:bg-rose-50 transition-colors" data-id="${item.id}">
                                <i class="fa-solid fa-trash-can text-sm"></i>
                            </button>
                        </div>
                    </div>`;
            });
        }

        $('#cart-count').text(count);
        $('#cart-total-price').text(total + ' Р');
        $('#cart-items-container').html(html);
    }

    $('#open-cart-btn').click(function() {
        updateCartUI();
        $('#cart-modal').removeClass('hidden');
    });

    $('.close-cart').click(function() {
        $('#cart-modal').addClass('hidden');
    });

    $(document).on('click', '.add-to-cart-btn', function () {
        const id = parseInt($(this).data('id'));
        const name = $(this).data('name');
        const price = parseFloat($(this).data('price'));

        addItem(id, name, price);
        updateCartUI();

    });

    $(document).on('click', '.remove-item-btn', function () {
        const id = Number($(this).data('id'));
        removeItem(id);
        updateCartUI();
    });

    $('#checkout-btn').click(function () {
        if (getCartSize() === 0) return;

        const orderData = {
            items: getCartItems(),
            comment:  $('#order-comment').val()
        };

        $.ajax({
            url: '/api/orders',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(orderData),
            success: function (response) {
                alert(`Успешно! Ваш заказ #${response.id} оформлен.`);
                clearCart();
                
                $('#order-comment').val('');

                $('#cart-modal').addClass('hidden');
                updateCartUI();
            },
            error: function () {
                alert('Произошла ошибка при отправке заказа.');
            }
        });
    });

    if ($('#cart-count').length) {
        updateCartUI();
    }

    function updateCounts() {
        if ($('#status-new').length) {
            $('#count-new').text($('#status-new > div').length);
            $('#count-progress').text($('#status-progress > div').length);
            $('#count-ready').text($('#status-ready > div').length);
        }
    }

    updateCounts();

    $('.order-time-render').each(function() {
        const isoStr = $(this).data('iso');
        if (isoStr) {
            const localTime = new Date(isoStr + 'Z').toLocaleTimeString([], {
                hour: '2-digit', 
                minute: '2-digit',
                hour12: false,
                timeZone: 'Europe/Moscow'
            });
            $(this).text(localTime);
        }
    });

    if ($('#status-new').length) {
        function setupWebSocket() {
            const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
            const wsUrl = `${protocol}//${window.location.host}/ws`;
            const socket = new WebSocket(wsUrl);

            socket.onopen = function() {
                $('#ws-status-indicator').text("WebSocket активен").removeClass('text-rose-400').addClass('text-slate-300');
            };

            socket.onmessage = function (event) {
                const data = JSON.parse(event.data);
                console.log("Получено сокет-сообщение от бэкенда:", data);

                if (data.status === 'new') {
                    if ($(`#card-order-${data.id}`).length === 0) {
                        let itemsHtml = '';
                        data.items.forEach(item => {
                            let name = (item.menu_item && item.menu_item.name) ? item.menu_item.name : `Товар ID: ${item.item_id}`;
                            itemsHtml += `<li class="text-xs text-slate-600 flex justify-between"><span>• ${name}</span> <span class="font-medium text-slate-800">×${item.quantity}</span></li>`;
                        });

                        let commentHtml = data.comment ? `
                            <div class="bg-amber-50 border border-amber-100 text-amber-800 p-2 rounded-lg text-xs mb-2">
                                <strong>Комментарий:</strong> ${data.comment}
                            </div>` : '';

                        let timeStr = new Date(data.created_at + 'Z').toLocaleTimeString([], {
                            hour: '2-digit', 
                            minute: '2-digit',
                            hour12: false,
                            timeZone: 'Europe/Moscow'
                        });

                        let cardHtml = `
                            <div class="bg-white border border-slate-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow duration-200" id="card-order-${data.id}">
                                <div class="flex justify-between items-center mb-2">
                                    <span class="text-xs font-bold text-slate-400">#${data.id}</span>
                                    <span class="text-xs font-medium text-slate-500">${timeStr}</span>
                                </div>
                                <ul class="space-y-1 my-2 border-y border-slate-50 py-2">
                                    ${itemsHtml}
                                </ul>
                                ${commentHtml}
                                <button class="change-status-btn w-full mt-3 bg-blue-600 text-white py-1.5 rounded-xl text-xs font-semibold hover:bg-blue-700 transition-colors shadow-sm shadow-blue-600/10" data-id="${data.id}" data-status="in_progress">Начать готовить</button>
                            </div>`;

                        $('#status-new').prepend(cardHtml);
                        updateCounts();
                    }
                }

                if (data.event === 'status_updated') {
                    if (data.new_status === 'completed') {
                        $(`#card-order-${data.id}`).remove();
                        updateCounts();
                    } else {
                        let orderCard = $(`#card-order-${data.id}`).detach();
                        if (orderCard.length) {
                            let btn = orderCard.find('.change-status-btn');
                            
                            if (data.new_status === 'in_progress') {
                                btn.text('Готов к выдаче')
                                   .removeClass('bg-blue-600 hover:bg-blue-700 shadow-blue-600/10')
                                   .addClass('bg-amber-500 hover:bg-amber-600 shadow-amber-500/10')
                                   .data('status', 'ready');
                                $('#status-progress').append(orderCard);
                            } 
                            else if (data.new_status === 'ready') {
                                btn.text('Выдан гостю')
                                   .removeClass('bg-amber-500 hover:bg-amber-600 shadow-amber-500/10')
                                   .addClass('bg-slate-800 hover:bg-slate-900')
                                   .data('status', 'completed');
                                $('#status-ready').append(orderCard);
                            }
                            updateCounts();
                        }
                    }
                }
            };

            socket.onclose = function() {
                $('#ws-status-indicator').text("Соединение потеряно").removeClass('text-slate-300').addClass('text-rose-400');
                setTimeout(setupWebSocket, 3000);
            };
        }

        setupWebSocket();

        $(document).on('click', '.change-status-btn', function () {
            console.log("change status button pressed")
            const orderId = $(this).data('id');
            const nextStatus = $(this).data('status');

            $.ajax({
                url: `/api/orders/${orderId}/status?new_status=${nextStatus}`,
                type: 'PATCH',
                success: function () {},
                error: function(xhr) {
                    console.error("Ошибка при смене статуса заказа:", xhr);
                }
            });
        });
    }

    if (document.querySelector("#menu-grid")) {
        await loadFilters();
        await loadMenu();
    }

    document.addEventListener("filtersChanged", function (event) {
        const filters = event.detail;
        loadMenu(filters);
    });
});