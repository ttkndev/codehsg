// =====================
// HELPERS
// =====================
function mapLevel(level) {
    switch (level) {
        case 1: return "Tiểu học";
        case 2: return "THCS";
        case 3: return "THPT";
        case 4: return "THPT Chuyên";
        case 5: return "Đại học";
        default: return "Không rõ";
    }
}

function levelBadgeClass(level) {
    switch (level) {
        case 1: return "bg-info text-dark";
        case 2: return "bg-success";
        case 3: return "bg-primary";
        case 4: return "bg-warning text-dark";
        case 5: return "bg-danger";
        default: return "bg-secondary";
    }
}

function levelIcon(level) {
    switch (level) {
        case 1: return "bi-book";
        case 2: return "bi-journal";
        case 3: return "bi-mortarboard";
        case 4: return "bi-award";
        case 5: return "bi-building";
        default: return "bi-question-circle";
    }
}

function formatNumber(n) {
    if (!n) return '0';
    if (n >= 1000) return (n / 1000).toFixed(1) + 'k';
    return n;
}

// =====================
// CARD BUILDERS
// =====================
function buildGridCard(book) {
    return `
        <div class="col-md-6 col-xl-4 book-card-wrap">
            <div class="card h-100 shadow-sm">
                <div class="card-body d-flex flex-column p-3">
                    <div class="row g-2 mb-2">
                        <div class="col-4">
                            <a href="book-detail.html?id=${book.id}">
                                <img src="${book.images[0]}" class="img-fluid rounded border book-thumb"
                                    alt="${book.title}" loading="lazy">
                            </a>
                        </div>
                        <div class="col-8">
                            <a href="book-detail.html?id=${book.id}" class="text-decoration-none text-dark">
                                <h6 class="fw-bold mb-1 book-title">${book.title}</h6>
                            </a>
                            <div class="text-muted small mb-1">
                                <i class="bi bi-person me-1"></i>${book.author}
                            </div>
                            <div class="d-flex flex-wrap gap-1 mb-1">
                                <span class="badge ${levelBadgeClass(book.level)}">${mapLevel(book.level)}</span>
                                <span class="badge bg-light text-dark border">${book.category}</span>
                            </div>
                            <div class="row text-muted small">
                                <div class="col-6"><i class="bi bi-file-text me-1"></i>${book.pages} trang</div>
                                <div class="col-6"><i class="bi bi-calendar me-1"></i>${book.year}</div>
                                <div class="col-6"><i class="bi bi-eye me-1"></i>${formatNumber(book.view_count)}</div>
                                <div class="col-6"><i class="bi bi-download me-1"></i>${formatNumber(book.download_count)}</div>
                            </div>
                        </div>
                    </div>
                    <div class="text-muted small mb-2">
                        <i class="bi bi-building me-1"></i>${book.publisher}
                    </div>
                    <div class="mb-2 tags-row">
                        ${(book.tags || []).slice(0, 4).map(tag =>
                            `<span class="badge bg-light text-dark border me-1 mb-1">#${tag}</span>`
                        ).join('')}
                    </div>
                    <div class="d-flex gap-2 mt-auto">
                        <a href="book-detail.html?id=${book.id}" class="btn btn-outline-primary btn-sm flex-fill">
                            <i class="bi bi-info-circle me-1"></i>Chi tiết
                        </a>
                        <a href="${book.drive_view}" target="_blank" rel="noopener noreferrer"
                            class="btn btn-outline-success btn-sm flex-fill">
                            <i class="bi bi-eye me-1"></i>Xem
                        </a>
                        <a href="${book.drive_download}" target="_blank" rel="noopener noreferrer"
                            class="btn btn-outline-secondary btn-sm">
                            <i class="bi bi-download"></i>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function buildListCard(book) {
    return `
        <div class="col-12">
            <div class="card shadow-sm">
                <div class="card-body p-3">
                    <div class="row align-items-center g-2">
                        <div class="col-auto">
                            <a href="book-detail.html?id=${book.id}">
                                <img src="${book.images[0]}" class="rounded border book-thumb-sm"
                                    alt="${book.title}" loading="lazy">
                            </a>
                        </div>
                        <div class="col">
                            <div class="d-flex flex-wrap align-items-center gap-2 mb-1">
                                <a href="book-detail.html?id=${book.id}" class="text-decoration-none text-dark">
                                    <h6 class="fw-bold mb-0">${book.title}</h6>
                                </a>
                                <span class="badge ${levelBadgeClass(book.level)}">${mapLevel(book.level)}</span>
                                <span class="badge bg-light text-dark border">${book.category}</span>
                            </div>
                            <div class="text-muted small mb-1">
                                <i class="bi bi-person me-1"></i>${book.author}
                                <span class="mx-2">·</span>
                                <i class="bi bi-building me-1"></i>${book.publisher}
                                <span class="mx-2">·</span>
                                <i class="bi bi-file-text me-1"></i>${book.pages} trang
                                <span class="mx-2">·</span>
                                <i class="bi bi-eye me-1"></i>${formatNumber(book.view_count)}
                                <span class="mx-2">·</span>
                                <i class="bi bi-download me-1"></i>${formatNumber(book.download_count)}
                            </div>
                            <div>
                                ${(book.tags || []).slice(0, 5).map(tag =>
                                    `<span class="badge bg-light text-dark border me-1">#${tag}</span>`
                                ).join('')}
                            </div>
                        </div>
                        <div class="col-auto d-flex gap-2">
                            <a href="book-detail.html?id=${book.id}" class="btn btn-outline-primary btn-sm">
                                <i class="bi bi-info-circle me-1"></i>Chi tiết
                            </a>
                            <a href="${book.drive_view}" target="_blank" rel="noopener noreferrer"
                                class="btn btn-outline-success btn-sm">
                                <i class="bi bi-eye me-1"></i>Xem
                            </a>
                            <a href="${book.drive_download}" target="_blank" rel="noopener noreferrer"
                                class="btn btn-outline-secondary btn-sm">
                                <i class="bi bi-download"></i>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// =====================
// STATE
// =====================
let allBooks = [];
let filtered = [];
let currentPage = 1;
let currentView = 'grid';
const PAGE_SIZE = 9;

// =====================
// BUILD CATEGORY FILTERS DYNAMICALLY
// =====================
function buildCategoryFilters(books) {
    const categories = [...new Set(books.map(b => b.category).filter(Boolean))].sort();
    const container = document.getElementById('category-filters');
    if (!container) return;
    container.innerHTML = categories.map(cat => `
        <label class="filter-check">
            <input type="checkbox" class="filter-category" value="${cat}"> ${cat}
        </label>
    `).join('');
    // Bind events after render
    container.querySelectorAll('.filter-category').forEach(cb =>
        cb.addEventListener('change', applyFilters)
    );
}

// =====================
// FILTER & SORT
// =====================
function getSelectedLevels() {
    return [...document.querySelectorAll('.filter-level:checked')].map(cb => parseInt(cb.value));
}

function getSelectedCategories() {
    return [...document.querySelectorAll('.filter-category:checked')].map(cb => cb.value);
}

function applyFilters() {
    const query = document.getElementById('search-input').value.toLowerCase().trim();
    const levels = getSelectedLevels();
    const categories = getSelectedCategories();
    const sort = document.getElementById('sort-select').value;

    filtered = allBooks.filter(book => {
        const matchSearch = !query ||
            book.title.toLowerCase().includes(query) ||
            (book.author || '').toLowerCase().includes(query) ||
            (book.publisher || '').toLowerCase().includes(query) ||
            (book.tags || []).some(t => t.toLowerCase().includes(query));
        const matchLevel = levels.length === 0 || levels.includes(book.level);
        const matchCategory = categories.length === 0 || categories.includes(book.category);
        return matchSearch && matchLevel && matchCategory;
    });

    filtered.sort((a, b) => {
        if (sort === 'date_added') return new Date(b.date_added) - new Date(a.date_added);
        if (sort === 'pages') return (b.pages || 0) - (a.pages || 0);
        return (b[sort] || 0) - (a[sort] || 0);
    });

    currentPage = 1;
    render();
}

// =====================
// RENDER
// =====================
function render() {
    const container = document.getElementById('book-container');
    const countEl = document.getElementById('result-count');
    const total = filtered.length;
    const totalPages = Math.ceil(total / PAGE_SIZE);
    const start = (currentPage - 1) * PAGE_SIZE;
    const pageItems = filtered.slice(start, start + PAGE_SIZE);

    countEl.textContent = total === 0
        ? 'Không có kết quả'
        : `Hiển thị ${Math.min(start + 1, total)}–${Math.min(start + PAGE_SIZE, total)} trong ${total} học liệu`;

    if (pageItems.length === 0) {
        container.innerHTML = `
            <div class="col-12 text-center py-5 text-secondary">
                <i class="bi bi-search fs-1 d-block mb-3 opacity-25"></i>
                <p class="mb-0">Không tìm thấy học liệu phù hợp.</p>
            </div>`;
        renderPagination(0, 1);
        return;
    }

    container.className = currentView === 'grid' ? 'row g-3' : 'row g-2';
    container.innerHTML = pageItems.map(book =>
        currentView === 'grid' ? buildGridCard(book) : buildListCard(book)
    ).join('');

    renderPagination(total, totalPages);
}

function renderPagination(total, totalPages) {
    const ul = document.getElementById('pagination');
    if (totalPages <= 1) { ul.innerHTML = ''; return; }

    let html = '';
    html += `<li class="page-item ${currentPage === 1 ? 'disabled' : ''}">
        <a class="page-link" href="#" data-page="${currentPage - 1}" aria-label="Trang trước">
            <i class="bi bi-chevron-left"></i>
        </a>
    </li>`;

    for (let i = 1; i <= totalPages; i++) {
        if (i === 1 || i === totalPages || (i >= currentPage - 1 && i <= currentPage + 1)) {
            html += `<li class="page-item ${i === currentPage ? 'active' : ''}">
                <a class="page-link" href="#" data-page="${i}">${i}</a>
            </li>`;
        } else if (i === currentPage - 2 || i === currentPage + 2) {
            html += `<li class="page-item disabled"><span class="page-link">…</span></li>`;
        }
    }

    html += `<li class="page-item ${currentPage === totalPages ? 'disabled' : ''}">
        <a class="page-link" href="#" data-page="${currentPage + 1}" aria-label="Trang sau">
            <i class="bi bi-chevron-right"></i>
        </a>
    </li>`;

    ul.innerHTML = html;
}

// =====================
// EVENTS
// =====================
function bindEvents() {
    let searchTimer;
    document.getElementById('search-input').addEventListener('input', () => {
        clearTimeout(searchTimer);
        searchTimer = setTimeout(applyFilters, 280);
    });

    document.querySelectorAll('.filter-level').forEach(cb =>
        cb.addEventListener('change', applyFilters)
    );

    document.getElementById('sort-select').addEventListener('change', applyFilters);

    document.getElementById('reset-filters').addEventListener('click', () => {
        document.getElementById('search-input').value = '';
        document.querySelectorAll('.filter-level, .filter-category').forEach(cb => cb.checked = false);
        document.getElementById('sort-select').value = 'view_count';
        applyFilters();
    });

    document.getElementById('pagination').addEventListener('click', e => {
        e.preventDefault();
        const link = e.target.closest('[data-page]');
        if (!link) return;
        const page = parseInt(link.dataset.page);
        const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
        if (page < 1 || page > totalPages) return;
        currentPage = page;
        render();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    document.querySelectorAll('.view-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.view-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentView = btn.dataset.view;
            render();
        });
    });
}

// =====================
// URL PARAM: q (từ tag click)
// =====================
function readUrlParams() {
    const params = new URLSearchParams(location.search);
    const q = params.get('q');
    if (q) {
        const input = document.getElementById('search-input');
        if (input) input.value = q;
    }
}

// =====================
// INIT
// =====================
async function init() {
    const container = document.getElementById('book-container');
    try {
        allBooks = await fetch('data/books.json').then(res => res.json());
        buildCategoryFilters(allBooks);
        readUrlParams();
        bindEvents();
        applyFilters();
    } catch (err) {
        console.error('Lỗi khi load books:', err);
        container.innerHTML = `
            <div class="col-12">
                <div class="alert alert-warning text-center">
                    Không thể tải danh sách học liệu. Vui lòng thử lại sau.
                </div>
            </div>`;
    }
}

document.addEventListener('DOMContentLoaded', init);
