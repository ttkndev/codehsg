// exams.js
// Dùng helper từ utils.js


function renderHeroStats(exams){
 const el=document.getElementById('exam-hero-stats'); if(!el) return;
 const ready=exams.filter(e=>e.is_ready!==false);
 const totalViews=ready.reduce((s,e)=>s+(e.view_count||0),0);
 el.innerHTML=`<span class="me-3"><i class="bi bi-file-earmark-text text-warning me-1"></i><strong>${ready.length}</strong> đề thi</span><span><i class="bi bi-eye text-warning me-1"></i><strong>${formatNumber(totalViews)}</strong> lượt xem</span>`;
}
// =====================
// CARD BUILDERS
// =====================
function buildGridCard(exam) {
    return `
        <div class="col-md-6 col-xl-4 exam-card-wrap">
            <div class="card h-100 shadow-sm exam-card">
                <div class="card-body d-flex flex-column p-3">
                    <div class="row g-2 mb-2">
                        <div class="col-4">
                            <a href="exam-detail.html?id=${exam.id}">
                                <img src="${exam.images[0]}" class="img-fluid rounded border exam-thumb" alt="${exam.title}" loading="lazy">
                            </a>
                        </div>
                        <div class="col-8">
                            <a href="exam-detail.html?id=${exam.id}" class="text-decoration-none text-dark">
                                <h6 class="fw-bold mb-1 exam-title">${exam.title}</h6>
                            </a>
                            <div class="text-muted small mb-1">
                                <i class="bi bi-building me-1"></i>${exam.organization}
                            </div>
                            <div class="d-flex flex-wrap gap-1 mb-1">
                                <span class="badge ${levelBadgeClass(exam.level)}">${mapLevel(exam.level)}</span>
                                <span class="badge bg-light text-dark border">${exam.year}</span>
                            </div>
                            <div class="meta-grid text-muted small">
                                <div class="meta-item"><i class="bi bi-list-check me-1"></i>${exam.problem_count} bài</div>
                                <div class="meta-item"><i class="bi bi-clock me-1"></i>${exam.duration}</div>
                                <div class="meta-item"><i class="bi bi-eye me-1"></i>${formatNumber(exam.view_count)}</div>
                                <div class="meta-item"><i class="bi bi-download me-1"></i>${formatNumber(exam.download_count)}</div>
                        </div>
                    </div>
                    <div class="mb-2 tags-row">
                        ${(exam.tags || []).slice(0, 4).map(tag =>
                            `<span class="badge bg-light text-dark border me-1 mb-1">#${tag}</span>`
                        ).join('')}
                    </div>
                    <div class="d-flex gap-2 mt-auto">
                        <a href="exam-detail.html?id=${exam.id}" class="btn btn-outline-primary btn-sm flex-fill">
                            <i class="bi bi-info-circle me-1"></i>Chi tiết
                        </a>
                        <a href="${exam.drive_view}" target="_blank" rel="noopener noreferrer"
                            class="btn btn-outline-success btn-sm flex-fill">
                            <i class="bi bi-eye me-1"></i>Xem
                        </a>
                        <a href="${exam.drive_download}" target="_blank" rel="noopener noreferrer"
                            class="btn btn-outline-secondary btn-sm">
                            <i class="bi bi-download"></i>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function buildListCard(exam) {
    return `
        <div class="col-12 exam-card-wrap">
            <div class="card shadow-sm exam-card">
                <div class="card-body p-3">
                    <div class="row align-items-center g-2">
                        <div class="col-auto">
                            <a href="exam-detail.html?id=${exam.id}">
                                <img src="${exam.images[0]}" class="rounded border exam-thumb-sm" alt="${exam.title}" loading="lazy">
                            </a>
                        </div>
                        <div class="col">
                            <div class="d-flex flex-wrap align-items-center gap-2 mb-1">
                                <a href="exam-detail.html?id=${exam.id}" class="text-decoration-none text-dark">
                                    <h6 class="fw-bold mb-0">${exam.title}</h6>
                                </a>
                                <span class="badge ${levelBadgeClass(exam.level)}">${mapLevel(exam.level)}</span>
                                <span class="badge bg-light text-dark border">${exam.year}</span>
                            </div>
                            <div class="text-muted small mb-1">
                                <i class="bi bi-building me-1"></i>${exam.organization}
                                <span class="mx-2">·</span>
                                <i class="bi bi-list-check me-1"></i>${exam.problem_count} bài
                                <span class="mx-2">·</span>
                                <i class="bi bi-clock me-1"></i>${exam.duration}
                                <span class="mx-2">·</span>
                                <i class="bi bi-eye me-1"></i>${formatNumber(exam.view_count)}
                                <span class="mx-2">·</span>
                                <i class="bi bi-download me-1"></i>${formatNumber(exam.download_count)}
                            </div>
                            <div>
                                ${(exam.tags || []).slice(0, 5).map(tag =>
                                    `<span class="badge bg-light text-dark border me-1">#${tag}</span>`
                                ).join('')}
                            </div>
                        </div>
                        <div class="col-auto d-flex gap-2">
                            <a href="exam-detail.html?id=${exam.id}" class="btn btn-outline-primary btn-sm">
                                <i class="bi bi-info-circle me-1"></i>Chi tiết
                            </a>
                            <a href="${exam.drive_view}" target="_blank" rel="noopener noreferrer"
                                class="btn btn-outline-success btn-sm">
                                <i class="bi bi-eye me-1"></i>Xem
                            </a>
                            <a href="${exam.drive_download}" target="_blank" rel="noopener noreferrer"
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
let allExams = [];
let filtered = [];
let currentPage = 1;
let currentView = 'grid';
const PAGE_SIZE = 9;

// =====================
// FILTER & SORT
// =====================
function getSelectedLevels() {
    return [...document.querySelectorAll('.filter-level:checked')].map(cb => parseInt(cb.value));
}

function applyFilters() {
    const query = document.getElementById('search-input').value.toLowerCase().trim();
    const levels = getSelectedLevels();
    const sort = document.getElementById('sort-select').value;

    filtered = allExams.filter(exam => {
        const matchSearch = !query ||
            exam.title.toLowerCase().includes(query) ||
            (exam.organization || '').toLowerCase().includes(query) ||
            (exam.tags || []).some(t => t.toLowerCase().includes(query));
        const matchLevel = levels.length === 0 || levels.includes(exam.level);
        return matchSearch && matchLevel;
    });

    filtered.sort((a, b) => {
        if (sort === 'date_added') return new Date(b.date_added) - new Date(a.date_added);
        if (sort === 'year') return (b.year || '').localeCompare(a.year || '');
        return (b[sort] || 0) - (a[sort] || 0);
    });

    currentPage = 1;
    render();
}

// =====================
// RENDER
// =====================
function render() {
    const container = document.getElementById('exam-container');
    const countEl = document.getElementById('result-count');
    const total = filtered.length;
    const totalPages = Math.ceil(total / PAGE_SIZE);
    const start = (currentPage - 1) * PAGE_SIZE;
    const pageItems = filtered.slice(start, start + PAGE_SIZE);

    countEl.textContent = `Hiển thị ${Math.min(start + 1, total)}–${Math.min(start + PAGE_SIZE, total)} trong ${total} đề thi`;

    if (pageItems.length === 0) {
        container.innerHTML = `
            <div class="col-12 text-center py-5 text-secondary">
                <i class="bi bi-search fs-1 d-block mb-3 opacity-25"></i>
                <p class="mb-0">Không tìm thấy đề thi phù hợp.</p>
            </div>`;
        renderPagination(0, 1);
        return;
    }

    container.className = currentView === 'grid' ? 'row g-3' : 'row g-2';
    container.innerHTML = pageItems.map(exam =>
        currentView === 'grid' ? buildGridCard(exam) : buildListCard(exam)
    ).join('');

    renderPagination(total, totalPages);
}

function renderPagination(total, totalPages) {
    const ul = document.getElementById('pagination');
    if (totalPages <= 1) { ul.innerHTML = ''; return; }

    let html = '';

    // Prev
    html += `<li class="page-item ${currentPage === 1 ? 'disabled' : ''}">
        <a class="page-link" href="#" data-page="${currentPage - 1}" aria-label="Trang trước">
            <i class="bi bi-chevron-left"></i>
        </a>
    </li>`;

    // Pages
    for (let i = 1; i <= totalPages; i++) {
        if (
            i === 1 || i === totalPages ||
            (i >= currentPage - 1 && i <= currentPage + 1)
        ) {
            html += `<li class="page-item ${i === currentPage ? 'active' : ''}">
                <a class="page-link" href="#" data-page="${i}">${i}</a>
            </li>`;
        } else if (i === currentPage - 2 || i === currentPage + 2) {
            html += `<li class="page-item disabled"><span class="page-link">…</span></li>`;
        }
    }

    // Next
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
    // Debounce search
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
        document.querySelectorAll('.filter-level').forEach(cb => cb.checked = false);
        document.getElementById('sort-select').value = 'view_count';
        applyFilters();
    });

    // Pagination (event delegation)
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

    // View toggle
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
// INIT
// =====================
async function init() {
    const container = document.getElementById('exam-container');
    try {
        allExams = await fetch('data/exams.json').then(res => res.json());
        renderHeroStats(allExams);
        filtered = [...allExams];
        bindEvents();
        applyFilters();
    } catch (err) {
        console.error('Lỗi khi load exams:', err);
        container.innerHTML = `
            <div class="col-12">
                <div class="alert alert-warning text-center">
                    Không thể tải danh sách đề thi. Vui lòng thử lại sau.
                </div>
            </div>`;
    }
}

document.addEventListener('DOMContentLoaded', init);
