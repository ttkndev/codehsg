// ============================================================
// books.js — Trang danh sách học liệu (book.html)
// Phụ thuộc: utils.js (load trước)
// ============================================================

// ── Card builders ─────────────────────────────────────────────

/**
 * Card dạng LƯỚI: ảnh bìa ở trên chiếm full width,
 * thông tin bên dưới — tránh layout bị vỡ khi tên tác giả dài.
 */
function buildGridCard(book) {
    return buildBookStandardCard(book, {
        columnClass: 'col-sm-6 col-xl-4',
        coverHeight: CONFIG.BOOK_THUMB_HEIGHT
    });
}

/**
 * Card dạng DANH SÁCH: thumbnail nhỏ bên trái, thông tin bên phải.
 */
function buildListCard(book) {
    return buildBookStandardCard(book, {
        columnClass: 'col-12',
        coverHeight: CONFIG.BOOK_THUMB_HEIGHT
    });
}


// ── State ──────────────────────────────────────────────────────
let allBooks   = [];
let filtered   = [];
let currentPage = 1;
let currentView = 'grid';
const PAGE_SIZE = CONFIG.PAGE_SIZE;

// ── Hero stats ─────────────────────────────────────────────────
/** Render thống kê nhanh trong page-hero của book.html */
function renderHeroStats(books) {
    const el = document.getElementById('book-hero-stats');
    if (!el) return;

    const ready = books.filter(b => b.is_ready !== false);
    const countByCategory = (name) => ready.filter(b => b.category === name).length;

    // NNLT = Ngôn ngữ lập trình: đếm theo tags (không phân biệt hoa thường)
    const languageTags = ['c', 'c++', 'python', 'java', 'javascript', 'typescript', 'pascal', 'php', 'go', 'rust', 'kotlin', 'swift', 'ruby', 'c#'];
    const nnltCount = ready.filter(book => {
        const tags = (book.tags || []).map(tag => String(tag).toLowerCase());
        return tags.some(tag => languageTags.includes(tag));
    }).length;

    const stats = [
        { icon: 'bi bi-book', value: ready.length, title: 'Số học liệu' },
        { icon: 'bi bi-diagram-3', value: countByCategory('CTDL-GT'), title: 'CTDL-GT' },
        { icon: 'bi bi-journal-bookmark', value: countByCategory('Sách giáo khoa'), title: 'Sách giáo khoa' },
        { icon: 'bi bi-code-slash', value: nnltCount, title: 'NNLT' }
    ];

    el.innerHTML = '';
    stats.forEach(stat => {
        const col = document.createElement('div');
        col.className = 'col-md-3 col-6 mb-3';
        col.innerHTML = `
            <div class="card shadow-sm border-0">
                <div class="card-body text-center">
                    <i class="${stat.icon} fs-2 mb-2"></i>
                    <h3 class="fw-bold stat-value">0+</h3>
                    <p class="text-muted mb-0">${stat.title}</p>
                </div>
            </div>
        `;
        el.appendChild(col);
        animateValue(col.querySelector('.stat-value'), 0, stat.value, CONFIG.ANIMATE_DURATION);
    });
}

function renderLatestBookBadge(books) {
    const badge = document.getElementById('book-hero-latest');
    if (!badge) return;

    const readyBooks = books.filter(book => book.is_ready !== false && book.date_added);
    if (readyBooks.length === 0) {
        badge.innerHTML = `<i class="bi bi-stars me-1"></i>Chưa có sách mới được cập nhật`;
        return;
    }

    const latestBook = readyBooks.sort((a, b) => new Date(b.date_added) - new Date(a.date_added))[0];
    badge.innerHTML = `<i class="bi bi-stars me-1"></i>Sách mới thêm: ${latestBook.title}`;
}

// ── Category filter (dynamic) ──────────────────────────────────

/** Tạo checkbox danh mục từ dữ liệu thực tế */
function buildCategoryFilters(books) {
    const container = document.getElementById('category-filters');
    if (!container) return;

    const categories = [...new Set(books.map(b => b.category).filter(Boolean))].sort();
    container.innerHTML = categories.map(cat => `
        <label class="filter-check">
            <input type="checkbox" class="filter-category" value="${cat}"> ${cat}
        </label>
    `).join('');

    container.querySelectorAll('.filter-category').forEach(cb =>
        cb.addEventListener('change', applyFilters)
    );
}

// ── Filter & sort ──────────────────────────────────────────────

function getSelectedLevels() {
    return [...document.querySelectorAll('.filter-level:checked')].map(cb => parseInt(cb.value));
}

function getSelectedCategories() {
    return [...document.querySelectorAll('.filter-category:checked')].map(cb => cb.value);
}

function applyFilters() {
    const query      = document.getElementById('search-input').value.toLowerCase().trim();
    const levels     = getSelectedLevels();
    const categories = getSelectedCategories();
    const sort       = document.getElementById('sort-select').value;

    // Chỉ hiển thị tài nguyên đã sẵn sàng
    filtered = allBooks.filter(book => {
        if (book.is_ready === false) return false;
        const matchSearch = !query ||
            book.title.toLowerCase().includes(query) ||
            (book.author || '').toLowerCase().includes(query) ||
            (book.publisher || '').toLowerCase().includes(query) ||
            (book.tags || []).some(t => t.toLowerCase().includes(query));
        const matchLevel    = levels.length === 0     || levels.includes(book.level);
        const matchCategory = categories.length === 0 || categories.includes(book.category);
        return matchSearch && matchLevel && matchCategory;
    });

    filtered.sort((a, b) => {
        if (sort === 'date_added') return new Date(b.date_added) - new Date(a.date_added);
        if (sort === 'pages_asc')  return (a.pages || 0) - (b.pages || 0);
        if (sort === 'pages_desc') return (b.pages || 0) - (a.pages || 0);
        return (b[sort] || 0) - (a[sort] || 0);
    });

    currentPage = 1;
    render();
}

// ── Render ─────────────────────────────────────────────────────

function render() {
    const container = document.getElementById('book-container');
    const countEl   = document.getElementById('result-count');
    const total      = filtered.length;
    const totalPages = Math.ceil(total / PAGE_SIZE);
    const start      = (currentPage - 1) * PAGE_SIZE;
    const pageItems  = filtered.slice(start, start + PAGE_SIZE);

    if (total === 0) {
        countEl.textContent = 'Không có kết quả';
    } else {
        countEl.textContent =
            `Hiển thị ${Math.min(start + 1, total)}–${Math.min(start + PAGE_SIZE, total)} trong ${total} học liệu`;
    }

    if (pageItems.length === 0) {
        container.innerHTML = `
            <div class="col-12 text-center py-5 text-secondary">
                <i class="bi bi-search fs-1 d-block mb-3 opacity-25"></i>
                <p class="mb-0">Không tìm thấy học liệu phù hợp.</p>
            </div>`;
        renderPagination(totalPages);
        return;
    }

    container.className = currentView === 'grid' ? 'row g-3' : 'row g-2';
    container.innerHTML = pageItems.map(book =>
        currentView === 'grid' ? buildGridCard(book) : buildListCard(book)
    ).join('');

    renderPagination(totalPages);
}

function renderPagination(totalPages) {
    const ul = document.getElementById('pagination');
    if (totalPages <= 1) { ul.innerHTML = ''; return; }

    let html = `
        <li class="page-item ${currentPage === 1 ? 'disabled' : ''}">
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

    html += `
        <li class="page-item ${currentPage === totalPages ? 'disabled' : ''}">
            <a class="page-link" href="#" data-page="${currentPage + 1}" aria-label="Trang sau">
                <i class="bi bi-chevron-right"></i>
            </a>
        </li>`;

    ul.innerHTML = html;
}

// ── Events ─────────────────────────────────────────────────────

function bindEvents() {
    // Tìm kiếm có debounce 280ms
    let searchTimer;
    document.getElementById('search-input').addEventListener('input', () => {
        clearTimeout(searchTimer);
        searchTimer = setTimeout(applyFilters, CONFIG.DEBOUNCE_MS);
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

    // Pagination — event delegation
    document.getElementById('pagination').addEventListener('click', e => {
        e.preventDefault();
        const link = e.target.closest('[data-page]');
        if (!link) return;
        const page       = parseInt(link.dataset.page);
        const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
        if (page < 1 || page > totalPages) return;
        currentPage = page;
        render();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // Toggle grid / list
    document.querySelectorAll('.view-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.view-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentView = btn.dataset.view;
            render();
        });
    });
}

// ── URL param ?q= (từ click tag ở trang khác) ─────────────────

function readUrlParams() {
    const q = new URLSearchParams(location.search).get('q');
    if (q) {
        const input = document.getElementById('search-input');
        if (input) input.value = q;
    }
}

// ── Init ───────────────────────────────────────────────────────

async function init() {
    const container = document.getElementById('book-container');
    try {
        allBooks = await fetch('data/books.json').then(res => res.json());
        renderLatestBookBadge(allBooks);
        renderHeroStats(allBooks);
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
