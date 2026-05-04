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

function formatNumber(n) {
    if (!n) return '0';
    if (n >= 1000) return (n / 1000).toFixed(1) + 'k';
    return n;
}

function formatDate(dateStr) {
    if (!dateStr) return '—';
    const d = new Date(dateStr);
    return d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

// Render mô tả: chuyển emoji-list thành HTML dễ đọc
function renderDescription(desc) {
    if (!desc) return '';
    return desc
        .split('\n')
        .map(line => line.trim())
        .filter(Boolean)
        .map(line => `<p class="mb-1">${line}</p>`)
        .join('');
}

// =====================
// SHARE
// =====================
function buildShareButtons(exam) {
    const url = encodeURIComponent(location.href);
    const title = encodeURIComponent(exam.title + ' - CodeHSG');
    return `
        <div class="d-flex flex-wrap gap-2">
            <a href="https://www.facebook.com/sharer/sharer.php?u=${url}"
               target="_blank" rel="noopener noreferrer"
               class="btn btn-sm btn-outline-primary">
                <i class="bi bi-facebook me-1"></i>Facebook
            </a>
            <a href="https://twitter.com/intent/tweet?url=${url}&text=${title}"
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

// =====================
// RELATED CARDS
// =====================
function buildRelatedCard(exam) {
    return `
        <div class="col-md-4">
            <div class="card h-100 shadow-sm exam-card">
                <div class="card-body p-3 d-flex flex-column">
                    <div class="row g-2 mb-2">
                        <div class="col-4">
                            <img src="${exam.images[0]}" class="img-fluid rounded border" alt="${exam.title}" loading="lazy">
                        </div>
                        <div class="col-8">
                            <a href="exam-detail.html?id=${exam.id}" class="text-decoration-none text-dark">
                                <h6 class="fw-bold mb-1 small">${exam.title}</h6>
                            </a>
                            <div class="text-muted" style="font-size:0.78rem;">
                                <span class="badge ${levelBadgeClass(exam.level)} me-1">${mapLevel(exam.level)}</span>
                                ${exam.year}
                            </div>
                        </div>
                    </div>
                    <div class="mt-auto">
                        <a href="exam-detail.html?id=${exam.id}" class="btn btn-outline-primary btn-sm w-100">
                            <i class="bi bi-info-circle me-1"></i>Xem chi tiết
                        </a>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// =====================
// MAIN RENDER
// =====================
function renderDetail(exam, allExams) {
    // Update page title & meta
    document.title = `${exam.title} | CodeHSG`;
    document.querySelector('meta[name="description"]')
        ?.setAttribute('content', `${exam.title} - ${exam.organization} ${exam.year} | CodeHSG`);

    // Related exams: từ related_ids hoặc cùng level, loại bỏ chính nó
    let related = [];
    if (exam.related_ids && exam.related_ids.length > 0) {
        related = allExams.filter(e => exam.related_ids.includes(e.id));
    } else {
        related = allExams
            .filter(e => e.id !== exam.id && e.level === exam.level)
            .sort((a, b) => (b.view_count || 0) - (a.view_count || 0))
            .slice(0, 3);
    }

    const embedUrl = `https://drive.google.com/file/d/${exam.drive_file_id}/preview`;

    const html = `
        <!-- Page Hero -->
        <div class="page-hero">
            <div class="container py-4">
                <nav aria-label="breadcrumb">
                    <ol class="breadcrumb breadcrumb-modern mb-2">
                        <li class="breadcrumb-item">
                            <a href="index.html" class="text-warning text-decoration-none breadcrumb-home-link"><i class="bi bi-house-door-fill me-1"></i>Trang chủ</a>
                        </li>
                        <li class="breadcrumb-item">
                            <a href="exam.html" class="text-warning text-decoration-none">Đề thi</a>
                        </li>
                        <li class="breadcrumb-item active text-white-50 text-truncate" style="max-width:300px;">${exam.title}</li>
                    </ol>
                </nav>
                <h1 class="fw-bold text-white mb-2 fs-3">${exam.title}</h1>
                <div class="d-flex flex-wrap gap-2 align-items-center">
                    <span class="badge ${levelBadgeClass(exam.level)} px-3 py-2">${mapLevel(exam.level)}</span>
                    <span class="text-white-50 small"><i class="bi bi-building me-1"></i>${exam.organization}</span>
                    <span class="text-white-50 small"><i class="bi bi-calendar me-1"></i>${exam.year}</span>
                    <span class="text-white-50 small"><i class="bi bi-eye me-1"></i>${formatNumber(exam.view_count)} lượt xem</span>
                    <span class="text-white-50 small"><i class="bi bi-download me-1"></i>${formatNumber(exam.download_count)} lượt tải</span>
                </div>
            </div>
        </div>

        <div class="container py-4">
            <div class="row g-4">

                <!-- LEFT: PDF Preview + mô tả -->
                <div class="col-lg-8">

                    <!-- PDF Embed -->
                    <div class="card shadow-sm mb-4">
                        <div class="card-header bg-dark text-white d-flex align-items-center gap-2 py-2">
                            <i class="bi bi-file-earmark-pdf text-danger"></i>
                            <span class="fw-semibold small">Xem trước đề thi</span>
                            <a href="${exam.drive_view}" target="_blank" rel="noopener noreferrer"
                               class="btn btn-outline-light btn-sm ms-auto py-0 px-2">
                               <i class="bi bi-box-arrow-up-right me-1"></i>Mở rộng
                            </a>
                        </div>
                        <div class="card-body p-0">
                            <iframe
                                src="${embedUrl}"
                                class="pdf-embed"
                                allow="autoplay"
                                title="Xem trước ${exam.title}">
                            </iframe>
                        </div>
                    </div>

                    <!-- Mô tả -->
                    ${exam.description ? `
                    <div class="card shadow-sm mb-4">
                        <div class="card-body">
                            <h5 class="fw-bold mb-3"><i class="bi bi-card-text text-warning me-2"></i>Mô tả</h5>
                            <div class="description-content">
                                ${renderDescription(exam.description)}
                            </div>
                        </div>
                    </div>` : ''}

                    <!-- Danh sách bài thi -->
                    ${exam.problem_names && exam.problem_names.length > 0 ? `
                    <div class="card shadow-sm mb-4">
                        <div class="card-body">
                            <h5 class="fw-bold mb-3"><i class="bi bi-list-ol text-warning me-2"></i>Danh sách bài thi</h5>
                            <ol class="mb-0 ps-3">
                                ${exam.problem_names.map(name => `<li class="mb-1">${name}</li>`).join('')}
                            </ol>
                        </div>
                    </div>` : ''}

                    <!-- Chia sẻ -->
                    <div class="card shadow-sm mb-4">
                        <div class="card-body">
                            <h5 class="fw-bold mb-3"><i class="bi bi-share text-warning me-2"></i>Chia sẻ</h5>
                            ${buildShareButtons(exam)}
                        </div>
                    </div>

                    <!-- Bình luận (Facebook Comments) -->
                    <div class="card shadow-sm mb-4">
                        <div class="card-body">
                            <h5 class="fw-bold mb-3"><i class="bi bi-chat-dots text-warning me-2"></i>Bình luận</h5>
                            <div class="fb-comments-placeholder text-center py-4 text-secondary bg-light rounded">
                                <i class="bi bi-facebook fs-2 mb-2 d-block text-primary opacity-50"></i>
                                <p class="small mb-2">Bình luận qua Facebook</p>
                                <a href="${exam.drive_view}" target="_blank" rel="noopener noreferrer"
                                   class="btn btn-outline-primary btn-sm">
                                    <i class="bi bi-box-arrow-up-right me-1"></i>Xem và bình luận trên Drive
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- RIGHT: Thông tin chi tiết + actions -->
                <div class="col-lg-4">

                    <!-- Actions -->
                    <div class="card shadow-sm mb-4 border-warning">
                        <div class="card-body d-flex flex-column gap-2">
                            <a href="${exam.drive_download}" target="_blank" rel="noopener noreferrer"
                               class="btn btn-warning fw-semibold">
                                <i class="bi bi-download me-2"></i>Tải về (${exam.file_size})
                            </a>
                            <a href="${exam.drive_view}" target="_blank" rel="noopener noreferrer"
                               class="btn btn-outline-success">
                                <i class="bi bi-eye me-2"></i>Xem trên Google Drive
                            </a>
                        </div>
                    </div>

                    <!-- Thông tin chi tiết -->
                    <div class="card shadow-sm mb-4">
                        <div class="card-body">
                            <h5 class="fw-bold mb-3"><i class="bi bi-info-circle text-warning me-2"></i>Thông tin</h5>
                            <table class="table table-sm table-borderless mb-0 detail-table">
                                <tbody>
                                    <tr>
                                        <td class="text-secondary small"><i class="bi bi-building me-1"></i>Tổ chức</td>
                                        <td class="small fw-semibold">${exam.organization}</td>
                                    </tr>
                                    <tr>
                                        <td class="text-secondary small"><i class="bi bi-mortarboard me-1"></i>Cấp học</td>
                                        <td><span class="badge ${levelBadgeClass(exam.level)}">${mapLevel(exam.level)}</span></td>
                                    </tr>
                                    <tr>
                                        <td class="text-secondary small"><i class="bi bi-calendar me-1"></i>Năm học</td>
                                        <td class="small">${exam.year}</td>
                                    </tr>
                                    <tr>
                                        <td class="text-secondary small"><i class="bi bi-list-check me-1"></i>Số bài</td>
                                        <td class="small">${exam.problem_count} bài</td>
                                    </tr>
                                    <tr>
                                        <td class="text-secondary small"><i class="bi bi-clock me-1"></i>Thời gian</td>
                                        <td class="small">${exam.duration}</td>
                                    </tr>
                                    <tr>
                                        <td class="text-secondary small"><i class="bi bi-file-earmark me-1"></i>Định dạng</td>
                                        <td class="small">${exam.file_ext?.toUpperCase()} · ${exam.file_size}</td>
                                    </tr>
                                    <tr>
                                        <td class="text-secondary small"><i class="bi bi-eye me-1"></i>Lượt xem</td>
                                        <td class="small">${formatNumber(exam.view_count)}</td>
                                    </tr>
                                    <tr>
                                        <td class="text-secondary small"><i class="bi bi-download me-1"></i>Lượt tải</td>
                                        <td class="small">${formatNumber(exam.download_count)}</td>
                                    </tr>
                                    <tr>
                                        <td class="text-secondary small"><i class="bi bi-person-badge me-1"></i>Đóng góp</td>
                                        <td class="small">${exam.contributor}</td>
                                    </tr>
                                    <tr>
                                        <td class="text-secondary small"><i class="bi bi-calendar-plus me-1"></i>Ngày thêm</td>
                                        <td class="small">${formatDate(exam.date_added)}</td>
                                    </tr>
                                    <tr>
                                        <td class="text-secondary small"><i class="bi bi-calendar-check me-1"></i>Cập nhật</td>
                                        <td class="small">${formatDate(exam.last_updated)}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <!-- Tags -->
                    ${exam.tags && exam.tags.length > 0 ? `
                    <div class="card shadow-sm mb-4">
                        <div class="card-body">
                            <h5 class="fw-bold mb-3"><i class="bi bi-tags text-warning me-2"></i>Tags</h5>
                            <div>
                                ${exam.tags.map(tag =>
                                    `<a href="exam.html?q=${encodeURIComponent(tag)}"
                                        class="badge bg-light text-dark border me-1 mb-1 text-decoration-none">#${tag}</a>`
                                ).join('')}
                            </div>
                        </div>
                    </div>` : ''}

                </div>
            </div>

            <!-- Đề thi liên quan -->
            ${related.length > 0 ? `
            <section class="mt-2 mb-5">
                <div class="mb-3">
                    <h4 class="fw-bold mb-1"><i class="bi bi-grid text-warning me-2"></i>Đề thi liên quan</h4>
                    <div class="section-underline"></div>
                </div>
                <div class="row g-3">
                    ${related.map(buildRelatedCard).join('')}
                </div>
            </section>` : ''}
        </div>
    `;

    document.getElementById('detail-main').innerHTML = html;

    // Copy link button
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

// =====================
// INIT
// =====================
async function init() {
    const params = new URLSearchParams(location.search);
    const id = params.get('id');

    if (!id) {
        document.getElementById('detail-main').innerHTML = `
            <div class="container py-5 text-center">
                <i class="bi bi-exclamation-circle fs-1 text-warning d-block mb-3"></i>
                <h4>Không tìm thấy đề thi</h4>
                <p class="text-secondary">Vui lòng quay lại danh sách đề thi.</p>
                <a href="exam.html" class="btn btn-warning">Về kho đề thi</a>
            </div>`;
        return;
    }

    try {
        const allExams = await fetch('data/exams.json').then(res => res.json());
        const exam = allExams.find(e => e.id === id);

        if (!exam) {
            document.getElementById('detail-main').innerHTML = `
                <div class="container py-5 text-center">
                    <i class="bi bi-file-earmark-x fs-1 text-warning d-block mb-3"></i>
                    <h4>Đề thi không tồn tại</h4>
                    <p class="text-secondary">ID <code>${id}</code> không khớp với bất kỳ đề thi nào.</p>
                    <a href="exam.html" class="btn btn-warning">Về kho đề thi</a>
                </div>`;
            return;
        }

        renderDetail(exam, allExams);

    } catch (err) {
        console.error('Lỗi khi load exam detail:', err);
        document.getElementById('detail-main').innerHTML = `
            <div class="container py-5 text-center">
                <i class="bi bi-wifi-off fs-1 text-warning d-block mb-3"></i>
                <h4>Không thể tải dữ liệu</h4>
                <p class="text-secondary">Vui lòng thử lại sau.</p>
                <a href="exam.html" class="btn btn-warning">Về kho đề thi</a>
            </div>`;
    }
}

document.addEventListener('DOMContentLoaded', init);
