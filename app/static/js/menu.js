import { getItem } from "./cart.js";

let items;

export function getMenuItems() {
    return items;
}

export async function loadMenu(filters) {
    
    const params = new URLSearchParams();

    if(filters) {
        const categoryId = filters["categoryId"];
        const tagIds = filters["tagIds"];
        
        if(categoryId !== null && categoryId !== undefined) {
            params.append("category_id", categoryId);
        }

        if (Array.isArray(tagIds) && tagIds.length > 0){
            tagIds.forEach(tagId => {
                params.append("tag_ids", tagId);
            });
        }
    }

    const url = `/api/menu?${params.toString()}`;
    console.log(`Sending api request on url: ${url}`);

    const response = await fetch(url);
    items = await response.json();
    renderMenu(items);
}

function createCard(item) {
    return `
        <div class="group bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col">
            <div class="relative h-48 w-full bg-slate-100 overflow-hidden">
                <img 
                    src="/static/images/products/${item.image_path || "default.webp"}"
                    alt="${item.name}"
                    class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                >

                <div class="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-bold text-slate-900 shadow-sm">
                    ${item.price} Р
                </div>
            </div>
            
            <div class="p-6 flex flex-col flex-grow">
                <h3 class="text-lg font-bold text-slate-900 mb-1 group-hover:text-amber-600 transition-colors">
                    ${item.name}
                </h3>

                <p class="text-sm text-slate-500 flex-grow mb-4">
                    ${item.description || "Классическая позиция нашего заведения."}
                </p>
                <div class="cart-controls" data-item-id="${item.id}">
                    ${createCartButton(item)}
                </div>
            </div>
        </div>
    `;
}

export function renderMenu(items) {
    $("#menu-grid").html("");

    items.forEach(item => {
        $("#menu-grid").append(createCard(item));
    });
}

function createCartButton(item) {
    const cartItem = getItem(item.id);

    if (!cartItem) {
        return `
            <button
                class="add-to-cart-btn w-full bg-slate-50 border border-slate-200 text-slate-700 py-2.5 rounded-xl font-medium hover:bg-amber-600 hover:text-white hover:border-transparent transition-all duration-200 active:scale-[0.98] whitespace-nowrap text-sm sm:text-base"
                data-id="${item.id}"
                data-name="${item.name}"
                data-price="${item.price}"
            >
                В корзину
            </button>
        `;
    }

    return `
        <div class="cart-controls w-full flex items-center justify-between bg-slate-50 border border-slate-200 rounded-xl overflow-hidden text-sm sm:text-base">
            <button
                class="decrease-cart-btn w-1/3 py-2.5 text-slate-700 font-semibold hover:bg-amber-600 hover:text-white transition-all duration-200 active:scale-[0.98]"
                data-id="${item.id}"
                aria-label="Уменьшить количество"
            >
                −
            </button>

            <span class="w-1/3 text-center font-semibold text-slate-700">
                ${cartItem.quantity}
            </span>

            <button
                class="increase-cart-btn w-1/3 py-2.5 text-slate-700 font-semibold hover:bg-amber-600 hover:text-white transition-all duration-200 active:scale-[0.98]"
                data-id="${item.id}"
                aria-label="Увеличить количество"
            >
                +
            </button>
        </div>
    `;
}