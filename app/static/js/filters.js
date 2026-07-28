export async function loadFilters() {
    const response = await fetch("/api/filters");
    const filters = await response.json();
    renderFilters(filters);
    initFilterContainers();
}

function renderFilters(filters) {
    $("#category-grid").html("");
    $("#tag-grid").html("");

    filters["categories"].forEach(category => {
        $("#category-grid").append(createCategoryButton(category));
    });

    filters["tags"].forEach(tag => {
        $("#tag-grid").append(createTagButton(tag));
    });
}

function createCategoryButton(category) {
    return `
        <button
            class="
                category-filter
                px-5 py-2.5
                rounded-full
                border border-slate-300
                bg-white
                text-slate-700
                font-medium
                shadow-sm
                transition-all duration-200
                hover:border-amber-500
                hover:text-amber-600
                hover:shadow-md
                active:scale-95
            "
            data-category-id="${category.id}"
        >
            ${category.name}
        </button>
    `;
}

function createTagButton(tag) {
    return `
        <button
            class="
                tag-filter
                px-4 py-2
                rounded-full
                border border-slate-200
                bg-slate-100
                text-slate-600
                text-sm
                font-medium
                transition-all duration-200
                hover:border-amber-400
                hover:bg-amber-50
                hover:text-amber-700
                active:scale-95
            "
            data-tag-id="${tag.id}"
        >
            ${tag.name}
        </button>
    `;
}

function initFilterContainers() {
    let selectedCategoryId = null;
    const selectedTagIds = new Set();

    const categoriesContainer = document.querySelector("#category-grid");
    categoriesContainer.addEventListener("click", function (event) {
        const button = event.target.closest(".category-filter");

        if (!button) {
            return;
        }

        const categoryId = Number(button.dataset.categoryId);
        if(selectedCategoryId === categoryId) {
            selectedCategoryId = null;
        }
        else {
            const oldButton = document.querySelector(
                `.category-filter[data-category-id="${selectedCategoryId}"]`
            ); 
            if(oldButton) {
                oldButton.classList.remove("active");
            }
            selectedCategoryId = categoryId;
        }
        button.classList.toggle('active');

        console.log(`Clicked button with category ${categoryId}(${button.innerText}). Selected category: ${selectedCategoryId}`);
        sendFiltersChangedEvent(selectedCategoryId, selectedTagIds);
    });

    const tagsContainer = document.querySelector("#tag-grid");
    tagsContainer.addEventListener("click", function (event) {
        const button = event.target.closest(".tag-filter");

        if (!button) {
            return;
        }

        const tagId = Number(button.dataset.tagId);
        button.classList.toggle("active");
        if (selectedTagIds.has(tagId)) {
            selectedTagIds.delete(tagId);
        } else {
            selectedTagIds.add(tagId);
        }

        console.log(`Clicked button with tag ${tagId}(${button.innerText}). Selected tags: ${Array.from(selectedTagIds)}`);    
        sendFiltersChangedEvent(selectedCategoryId, selectedTagIds);
    });
}


function sendFiltersChangedEvent(selectedCategoryId, selectedTagIds) {
    const filters = {
        categoryId: selectedCategoryId,
        tagIds: Array.from(selectedTagIds)
    };
    document.dispatchEvent(
        new CustomEvent("filtersChanged", {
            detail: filters
        })
    );
}