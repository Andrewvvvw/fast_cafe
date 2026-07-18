export async function loadMenu() {
    const response = await fetch("/api/menu");
    const items = await response.json();
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
                
                <button 
                    class="add-to-cart-btn w-full bg-slate-50 border border-slate-200 text-slate-700 py-2.5 rounded-xl font-medium hover:bg-amber-600 hover:text-white hover:border-transparent transition-all duration-200 active:scale-[0.98] whitespace-nowrap text-sm sm:text-base"
                    data-id="${item.id}" 
                    data-name="${item.name}" 
                    data-price="${item.price}"
                >
                    <i class="fa-solid fa-plus mr-1.5 text-xs"></i>
                    В корзину
                </button>
            </div>
        </div>
    `;
}

function renderMenu(items) {
    $("#menu-grid").html("");

    items.forEach(item => {
        $("#menu-grid").append(createCard(item));
    });
}
