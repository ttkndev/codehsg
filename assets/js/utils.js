// ============================================================
// utils.js — Hàm dùng chung cho toàn bộ dự án CodeHSG
// Import file này TRƯỚC tất cả các file JS khác
// ============================================================



// ── Cấu hình toàn cục ───────────────────────────────────────

const CONFIG = {
    PAGE_SIZE: 6,
    FEATURED_COUNT: 3,
    DEBOUNCE_MS: 280,
    ANIMATE_DURATION: 1500,
    BOOK_THUMB_HEIGHT: 180,
    BOOK_LIST_THUMB_WIDTH: 124,
    BOOK_LIST_THUMB_HEIGHT: 168,
};

// ── Book cards (dùng chung) ─────────────────────────────────

function buildBookStandardCard(book, options = {}) {
    const {
        columnClass = 'col-md-4 mb-4',
        cardClass = 'card h-100 shadow-sm',
        coverHeight = CONFIG.BOOK_THUMB_HEIGHT,
    } = options;

    return `
        <div class="${columnClass} book-card-wrap">
            <div class="${cardClass}">
                <div class="card-body d-flex flex-column">
                    <div class="row mb-2 g-2 align-items-start">
                        <div class="col-4">
                            <a href="book-detail.html?id=${book.id}" class="d-block" style="height:${coverHeight}px;">
                                <img src="${book.images?.[0] || ''}" class="img-fluid rounded w-100 h-100" style="object-fit:cover; object-position:top;" alt="${book.title}" loading="lazy">
                            </a>
                        </div>
                        <div class="col-8">
                            <a href="book-detail.html?id=${book.id}" class="text-decoration-none text-dark">
                                <h6 class="fw-bold mb-2 book-title">${book.title}</h6>
                            </a>
                            <div class="row text-muted small mb-1 g-1">
                                <div class="col-6"><i class="bi ${levelIcon(book.level)} me-1"></i>${mapLevel(book.level)}</div>
                                <div class="col-6"><i class="bi bi-calendar me-1"></i>${book.year || '—'}</div>
                            </div>
                            <div class="row text-muted small mb-1 g-1">
                                <div class="col-6"><i class="bi bi-person-badge me-1"></i>${book.contributor || '—'}</div>
                                <div class="col-6"><i class="bi bi-file-text me-1"></i>${book.pages || 0} trang</div>
                            </div>
                            <div class="row text-muted small mb-1 g-1">
                                <div class="col-6"><i class="bi bi-file-earmark-pdf me-1"></i>${(book.file_ext || 'pdf').toUpperCase()}</div>
                                <div class="col-6"><i class="bi bi-hdd me-1"></i>${book.file_size || '—'}</div>
                            </div>
                            <div class="row text-muted small mb-1 g-1">
                                <div class="col-6"><i class="bi bi-eye me-1"></i>${formatNumber(book.view_count)}</div>
                                <div class="col-6"><i class="bi bi-download me-1"></i>${formatNumber(book.download_count)}</div>
                            </div>
                        </div>
                    </div>

                    <p class="text-muted small mb-2 book-meta-line"><i class="bi bi-person me-1"></i>${book.author || 'Đang cập nhật'}</p>
                    <div class="d-flex flex-wrap justify-content-between text-muted mb-2 small gap-1">
                        <span><i class="bi bi-building me-1"></i>${book.publisher || '—'}</span>
                        <span><i class="bi bi-tag me-1"></i>${book.category || '—'}</span>
                    </div>

                    <hr class="my-2">
                    <div class="mb-2 tags-row">
                        ${(book.tags || []).slice(0, 5).map(tag => `<span class="badge bg-light text-dark border me-1 mb-1">#${tag}</span>`).join('')}
                    </div>

                    <div class="d-flex justify-content-center gap-2 mt-auto flex-wrap">
                        <a href="book-detail.html?id=${book.id}" class="btn btn-outline-primary btn-sm flex-fill">
                            <i class="bi bi-info-circle"></i> Chi tiết
                        </a>
                        <a href="${book.drive_view}" target="_blank" rel="noopener noreferrer" class="btn btn-outline-success btn-sm flex-fill">
                            <i class="bi bi-eye"></i> Xem
                        </a>
                        <a href="${book.drive_download}" target="_blank" rel="noopener noreferrer" class="btn btn-outline-secondary btn-sm flex-fill">
                            <i class="bi bi-download"></i> Tải
                        </a>
                    </div>
                </div>
            </div>
        </div>
    `;
}


// ── Exam cards (dùng chung) ─────────────────────────────────

function buildExamStandardCard(exam, options = {}) {
    const {
        columnClass = 'col-md-4 mb-4',
        cardClass = 'card h-100 shadow-sm exam-card',
        thumbClass = 'img-fluid rounded border exam-thumb',
        maxTags = 4,
    } = options;

    return `
        <div class="${columnClass} exam-card-wrap">
            <div class="${cardClass}">
                <div class="card-body d-flex flex-column p-3">
                    <div class="row g-2 mb-2">
                        <div class="col-4">
                            <a href="exam-detail.html?id=${exam.id}">
                                <img src="${exam.images?.[0] || ''}" class="${thumbClass}" alt="${exam.title}" loading="lazy">
                            </a>
                        </div>
                        <div class="col-8">
                            <a href="exam-detail.html?id=${exam.id}" class="text-decoration-none text-dark">
                                <h6 class="fw-bold mb-1 exam-title">${exam.title}</h6>
                            </a>
                            <div class="text-muted small mb-1">
                                <i class="bi bi-building me-1"></i>${exam.organization || '—'}
                            </div>
                            <div class="d-flex flex-wrap gap-1 mb-1">
                                <span class="badge ${levelBadgeClass(exam.level)}">${mapLevel(exam.level)}</span>
                                <span class="badge bg-light text-dark border">${exam.year || '—'}</span>
                            </div>
                            <div class="row text-muted small">
                                <div class="col-6"><i class="bi bi-list-check me-1"></i>${exam.problem_count || 0} bài</div>
                                <div class="col-6"><i class="bi bi-clock me-1"></i>${exam.duration || '—'}</div>
                                <div class="col-6"><i class="bi bi-eye me-1"></i>${formatNumber(exam.view_count)}</div>
                                <div class="col-6"><i class="bi bi-download me-1"></i>${formatNumber(exam.download_count)}</div>
                            </div>
                        </div>
                    </div>
                    <div class="mb-2 tags-row">
                        ${(exam.tags || []).slice(0, maxTags).map(tag =>
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
                            class="btn btn-outline-secondary btn-sm flex-fill">
                            <i class="bi bi-download"></i>Tải
                        </a>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// ── Cấp học ─────────────────────────────────────────────────

/** Trả về tên cấp học từ level (1–5) */
function mapLevel(level) {
    const map = { 1: "Tiểu học", 2: "THCS", 3: "THPT", 4: "THPT Chuyên", 5: "Đại học" };
    return map[level] ?? "Không rõ";
}

/** Trả về class Bootstrap badge tương ứng level */
function levelBadgeClass(level) {
    const map = {
        1: "bg-info text-dark",
        2: "bg-success",
        3: "bg-primary",
        4: "bg-warning text-dark",
        5: "bg-danger"
    };
    return map[level] ?? "bg-secondary";
}

/** Trả về tên icon Bootstrap Icons tương ứng level */
function levelIcon(level) {
    const map = {
        1: "bi-book",
        2: "bi-journal",
        3: "bi-mortarboard",
        4: "bi-award",
        5: "bi-building"
    };
    return map[level] ?? "bi-question-circle";
}

// ── Format số & ngày ─────────────────────────────────────────

/** Rút gọn số lớn: 1200 → "1.2k" */
function formatNumber(n) {
    if (!n || isNaN(n)) return '0';
    if (n >= 1000) return (n / 1000).toFixed(1) + 'k';
    return String(n);
}

/** Format ngày ISO sang dd/mm/yyyy tiếng Việt */
function formatDate(dateStr) {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleDateString('vi-VN', {
        day: '2-digit', month: '2-digit', year: 'numeric'
    });
}

// ── Mô tả ────────────────────────────────────────────────────

/**
 * Chuyển mô tả dạng plain-text nhiều dòng sang HTML.
 * Mỗi dòng không trống → <p>
 */
function renderDescription(desc) {
    if (!desc) return '';
    return desc
        .split('\n')
        .map(line => line.trim())
        .filter(Boolean)
        .map(line => `<p class="mb-1">${line}</p>`)
        .join('');
}

// ── Share buttons ────────────────────────────────────────────

/**
 * Tạo HTML các nút chia sẻ mạng xã hội.
 * @param {string} title - Tiêu đề để share (sẽ được encode)
 */
function buildShareButtons(title) {
    const url   = encodeURIComponent(location.href);
    const text  = encodeURIComponent(title + ' - CodeHSG');
    return `
        <div class="d-flex flex-wrap gap-2">
            <a href="https://www.facebook.com/sharer/sharer.php?u=${url}"
               target="_blank" rel="noopener noreferrer"
               class="btn btn-sm btn-outline-primary">
                <i class="bi bi-facebook me-1"></i>Facebook
            </a>
            <a href="https://twitter.com/intent/tweet?url=${url}&text=${text}"
               target="_blank" rel="noopener noreferrer"
               class="btn btn-sm btn-outline-info">
                <i class="bi bi-twitter-x me-1"></i>Twitter / X
            </a>
            <button class="btn btn-sm btn-outline-secondary" id="copy-link-btn">
                <i class="bi bi-link-45deg me-1"></i>Sao chép link
            </button>
        </div>
    `;
}

/**
 * Gắn sự kiện cho nút "Sao chép link" (sau khi đã render vào DOM).
 * Gọi hàm này sau khi buildShareButtons() đã được chèn vào trang.
 */
function bindCopyLinkBtn() {
    document.getElementById('copy-link-btn')?.addEventListener('click', () => {
        navigator.clipboard.writeText(location.href).then(() => {
            const btn = document.getElementById('copy-link-btn');
            btn.innerHTML = '<i class="bi bi-check2 me-1"></i>Đã sao chép!';
            btn.classList.replace('btn-outline-secondary', 'btn-success');
            setTimeout(() => {
                btn.innerHTML = '<i class="bi bi-link-45deg me-1"></i>Sao chép link';
                btn.classList.replace('btn-success', 'btn-outline-secondary');
            }, 2000);
        });
    });
}

// ── Contributors ─────────────────────────────────────────────

/** Tạo màu avatar nhất quán từ tên (không random mỗi lần render) */
function nameToColor(name) {
    const colors = [
        '#4f46e5', '#0891b2', '#059669', '#d97706',
        '#dc2626', '#7c3aed', '#db2777', '#065f46'
    ];
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
        hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
}

/** Lấy chữ cái cuối của tên (hỗ trợ tên tiếng Việt: "Nguyễn Văn A" → "A") */
function getInitial(name) {
    const parts = name.trim().split(/\s+/);
    return parts[parts.length - 1].charAt(0).toUpperCase();
}

// ── Subcategory label (books) ─────────────────────────────────

/** Map slug chuyên đề sang tên hiển thị tiếng Việt */
function formatSubcategory(sub) {
    const map = {
        'cau-truc-du-lieu':  'Cấu trúc dữ liệu',
        'giai-thuat':        'Giải thuật',
        'hsg-tinh':          'HSG Tỉnh',
        'hsg-quoc-gia':      'HSG Quốc gia',
        'lap-trinh-co-ban':  'Lập trình cơ bản',
        'quy-hoach-dong':    'Quy hoạch động',
        'do-thi':            'Đồ thị',
        'so-hoc':            'Số học',
        'hinh-hoc':          'Hình học tính toán',
    };
    return map[sub] ?? sub;
}

// ── Animate counter (index stats) ────────────────────────────

/**
 * Chạy hiệu ứng đếm số từ start đến end trong duration ms.
 * @param {HTMLElement} element - Phần tử hiển thị giá trị
 */
function animateValue(element, start, end, duration) {
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        element.textContent = Math.floor(progress * (end - start) + start) + '+';
        if (progress < 1) window.requestAnimationFrame(step);
    };
    window.requestAnimationFrame(step);
}