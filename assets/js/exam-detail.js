// exam-detail.js
// Dùng helper từ utils.js

// =====================
// MAIN RENDER
// =====================
function renderDetail(exam, allExams) {
    // Update page title & meta
    document.title = `${exam.title} | CodeHSG`;
    document.querySelector('meta[name="description"]')
        ?.setAttribute('content', `${exam.title} - ${exam.organization} ${exam.year} · ${exam.organization} | CodeHSG`);

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
                    <ol class="breadcrumb mb-2">
                        <li class="breadcrumb-item">
                            <a href="index.html" class="text-warning text-decoration-none">Trang chủ</a>
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
                    <span class="text-white-50 small"><i class="bi bi-calendar me-1"></i>${exam.year} · ${exam.organization}</span>
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
