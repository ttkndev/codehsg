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
    if (n >= 1000) return (n / 1000).toFixed(1) + 'k';
    return n;
}

// =====================
// CARD BUILDERS
// =====================
function buildGridCard(exam) {
    return buildExamStandardCard(
        exam,
        getExamListingCardOptions({
            columnClass: 'col-md-6 col-xl-4',
            showAllProblemNames: true,
            enablePreviewModal: true,
        })
    );
}

function buildListCard(exam) {
    return buildExamStandardCard(
        exam,
        getExamListingCardOptions({
            columnClass: 'col-12',
            showAllProblemNames: true,
            showFullTitle: true,
            enablePreviewModal: true,
        })
    );
}

// =====================
// STATE
// =====================
let allExams = [];
let filtered = [];
let currentPage = 1;
let currentView = 'grid';
const PAGE_SIZE = 6;

function renderLatestExamBadge(exams) {
    const badge = document.getElementById('exam-hero-latest');
    if (!badge) return;

    const examsWithDate = exams.filter(exam => exam.date_added);
    if (examsWithDate.length === 0) {
        badge.innerHTML = `<i class="bi bi-stars me-1"></i>Chưa có đề thi mới được cập nhật`;
        return;
    }

    const latestExam = examsWithDate.sort((a, b) => new Date(b.date_added) - new Date(a.date_added))[0];
    badge.innerHTML = `<i class="bi bi-stars me-1"></i>Đề thi mới thêm: ${latestExam.title}`;
}

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

    document.getElementById('exam-container').addEventListener('click', e => {
        const trigger = e.target.closest('.exam-preview-trigger');
        if (!trigger) return;
        e.preventDefault();

        const card = trigger.closest('.exam-card-wrap');
        const detailLink = card?.querySelector('a[href^="exam-detail.html?id="]');
        const examId = detailLink ? new URL(detailLink.href, window.location.href).searchParams.get('id') : null;
        const exam = allExams.find(item => String(item.id) === String(examId));
        if (!exam || !Array.isArray(exam.images) || exam.images.length === 0) return;

        openExamPreviewModal(exam);
    });
}

function openExamPreviewModal(exam) {
    const modalEl = document.getElementById('examImageModal');
    const titleEl = document.getElementById('examImageModalLabel');
    const bodyEl = document.getElementById('examImageModalBody');
    if (!modalEl || !titleEl || !bodyEl) return;

    titleEl.textContent = exam.title || 'Ảnh đề thi';

    const carouselId = 'examImageCarousel';
    bodyEl.innerHTML = `
        <div id="${carouselId}" class="carousel slide" data-bs-ride="false">
            <div class="carousel-inner">
                ${exam.images.map((img, index) => `
                    <div class="carousel-item ${index === 0 ? 'active' : ''}">
                        <img src="${img}" class="d-block w-100 exam-modal-image rounded" alt="${exam.title} - trang ${index + 1}">
                    </div>
                `).join('')}
            </div>
            ${exam.images.length > 1 ? `
                <button class="carousel-control-prev" type="button" data-bs-target="#${carouselId}" data-bs-slide="prev">
                    <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                    <span class="visually-hidden">Ảnh trước</span>
                </button>
                <button class="carousel-control-next" type="button" data-bs-target="#${carouselId}" data-bs-slide="next">
                    <span class="carousel-control-next-icon" aria-hidden="true"></span>
                    <span class="visually-hidden">Ảnh sau</span>
                </button>
            ` : ''}
        </div>
    `;

    bootstrap.Modal.getOrCreateInstance(modalEl).show();
}

// =====================
// INIT
// =====================
async function init() {
    const container = document.getElementById('exam-container');
    try {
        allExams = await fetch('data/exams.json').then(res => res.json());
        renderLatestExamBadge(allExams);
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
