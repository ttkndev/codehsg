// book-detail.js
// Dùng helper từ utils.js

// =====================
// MAIN RENDER
// =====================
function renderDetail(book, allBooks) {
    document.title = `${book.title} | CodeHSG`;
    document.querySelector('meta[name="description"]')
        ?.setAttribute('content', `${book.title} - ${book.author} | CodeHSG`);

    // Related: từ related_ids hoặc cùng level/category
    let related = [];
    if (book.related_ids && book.related_ids.length > 0) {
        related = allBooks.filter(b => book.related_ids.includes(b.id));
    } else {
        related = allBooks
            .filter(b => b.id !== book.id && (b.level === book.level || b.category === book.category))
            .sort((a, b) => (b.view_count || 0) - (a.view_count || 0))
            .slice(0, 3);
    }

    const embedUrl = `https://drive.google.com/file/d/${book.drive_file_id}/preview`;

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
                            <a href="book.html" class="text-warning text-decoration-none">Học liệu</a>
                        </li>
                        <li class="breadcrumb-item active text-white-50 text-truncate" style="max-width:300px;">
                            ${book.title}
                        </li>
                    </ol>
                </nav>
                <h1 class="fw-bold text-white mb-2 fs-3">${book.title}</h1>
                <div class="d-flex flex-wrap gap-2 align-items-center">
                    <span class="badge ${levelBadgeClass(book.level)} px-3 py-2">${mapLevel(book.level)}</span>
                    <span class="badge bg-light text-dark px-3 py-2">${book.category}</span>
                    <span class="text-white-50 small"><i class="bi bi-person me-1"></i>${book.author}</span>
                    <span class="text-white-50 small"><i class="bi bi-eye me-1"></i>${formatNumber(book.view_count)} lượt xem</span>
                    <span class="text-white-50 small"><i class="bi bi-download me-1"></i>${formatNumber(book.download_count)} lượt tải</span>
                </div>
            </div>
        </div>

        <div class="container py-4">
            <div class="row g-4">

                <!-- LEFT: Preview + Mô tả + Gallery + Chia sẻ + Bình luận -->
                <div class="col-lg-8">

                    <!-- PDF Embed -->
                    <div class="card shadow-sm mb-4">
                        <div class="card-header bg-dark text-white d-flex align-items-center gap-2 py-2">
                            <i class="bi bi-file-earmark-pdf text-danger"></i>
                            <span class="fw-semibold small">Xem trước học liệu</span>
                            <a href="${book.drive_view}" target="_blank" rel="noopener noreferrer"
                               class="btn btn-outline-light btn-sm ms-auto py-0 px-2">
                               <i class="bi bi-box-arrow-up-right me-1"></i>Mở rộng
                            </a>
                        </div>
                        <div class="card-body p-0">
                            <iframe
                                src="${embedUrl}"
                                class="pdf-embed"
                                allow="autoplay"
                                title="Xem trước ${book.title}">
                            </iframe>
                        </div>
                    </div>

                    <!-- Mô tả -->
                    ${book.description ? `
                    <div class="card shadow-sm mb-4">
                        <div class="card-body">
                            <h5 class="fw-bold mb-3"><i class="bi bi-card-text text-warning me-2"></i>Mô tả</h5>
                            <div class="description-content">
                                ${renderDescription(book.description)}
                            </div>
                        </div>
                    </div>` : ''}

                    <!-- Chuyên đề (subcategory) -->
                    ${book.subcategory && book.subcategory.length > 0 ? `
                    <div class="card shadow-sm mb-4">
                        <div class="card-body">
                            <h5 class="fw-bold mb-3"><i class="bi bi-diagram-3 text-warning me-2"></i>Chuyên đề</h5>
                            <div class="d-flex flex-wrap gap-2">
                                ${book.subcategory.map(sub => `
                                    <span class="badge bg-light text-dark border px-3 py-2">
                                        <i class="bi bi-check2 me-1 text-success"></i>${formatSubcategory(sub)}
                                    </span>
                                `).join('')}
                            </div>
                        </div>
                    </div>` : ''}

                    <!-- Gallery (nếu có nhiều ảnh) -->
                    

                    <!-- Chia sẻ -->
                    <div class="card shadow-sm mb-4">
                        <div class="card-body">
                            <h5 class="fw-bold mb-3"><i class="bi bi-share text-warning me-2"></i>Chia sẻ</h5>
                            ${buildShareButtons()}
                        </div>
                    </div>

                </div>

                <!-- RIGHT: Ảnh bìa + Actions + Thông tin + Tags -->
                <div class="col-lg-4">

                    <!-- Ảnh bìa lớn -->
                    <div class="card shadow-sm mb-4 text-center">
                        <div class="card-body p-3">
                            <img src="${book.images[0]}" class="img-fluid rounded book-cover-lg"
                                alt="${book.title}">
                        </div>
                    </div>

                    <!-- Actions -->
                    <div class="card shadow-sm mb-4 border-warning">
                        <div class="card-body d-flex flex-column gap-2">
                            <a href="${book.drive_download}" target="_blank" rel="noopener noreferrer"
                               class="btn btn-warning fw-semibold">
                                <i class="bi bi-download me-2"></i>Tải về (${book.file_size})
                            </a>
                            <a href="${book.drive_view}" target="_blank" rel="noopener noreferrer"
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
                                        <td class="text-secondary small"><i class="bi bi-person me-1"></i>Tác giả</td>
                                        <td class="small fw-semibold">${book.author}</td>
                                    </tr>
                                    <tr>
                                        <td class="text-secondary small"><i class="bi bi-building me-1"></i>Nhà xuất bản</td>
                                        <td class="small">${book.publisher}</td>
                                    </tr>
                                    <tr>
                                        <td class="text-secondary small"><i class="bi bi-tag me-1"></i>Danh mục</td>
                                        <td><span class="badge bg-light text-dark border">${book.category}</span></td>
                                    </tr>
                                    <tr>
                                        <td class="text-secondary small"><i class="bi bi-mortarboard me-1"></i>Cấp học</td>
                                        <td><span class="badge ${levelBadgeClass(book.level)}">${mapLevel(book.level)}</span></td>
                                    </tr>
                                    <tr>
                                        <td class="text-secondary small"><i class="bi bi-calendar me-1"></i>Năm</td>
                                        <td class="small">${book.year}</td>
                                    </tr>
                                    <tr>
                                        <td class="text-secondary small"><i class="bi bi-file-text me-1"></i>Số trang</td>
                                        <td class="small">${book.pages} trang</td>
                                    </tr>
                                    <tr>
                                        <td class="text-secondary small"><i class="bi bi-file-earmark me-1"></i>Định dạng</td>
                                        <td class="small">${book.file_ext?.toUpperCase()} · ${book.file_size}</td>
                                    </tr>
                                    <tr>
                                        <td class="text-secondary small"><i class="bi bi-eye me-1"></i>Lượt xem</td>
                                        <td class="small">${formatNumber(book.view_count)}</td>
                                    </tr>
                                    <tr>
                                        <td class="text-secondary small"><i class="bi bi-download me-1"></i>Lượt tải</td>
                                        <td class="small">${formatNumber(book.download_count)}</td>
                                    </tr>
                                    <tr>
                                        <td class="text-secondary small"><i class="bi bi-person-badge me-1"></i>Đóng góp</td>
                                        <td class="small">${book.contributor}</td>
                                    </tr>
                                    <tr>
                                        <td class="text-secondary small"><i class="bi bi-calendar-plus me-1"></i>Ngày thêm</td>
                                        <td class="small">${formatDate(book.date_added)}</td>
                                    </tr>
                                    <tr>
                                        <td class="text-secondary small"><i class="bi bi-calendar-check me-1"></i>Cập nhật</td>
                                        <td class="small">${formatDate(book.last_updated)}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <!-- Tags -->
                    ${book.tags && book.tags.length > 0 ? `
                    <div class="card shadow-sm mb-4">
                        <div class="card-body">
                            <h5 class="fw-bold mb-3"><i class="bi bi-tags text-warning me-2"></i>Tags</h5>
                            <div>
                                ${book.tags.map(tag =>
                                    `<a href="book.html?q=${encodeURIComponent(tag)}"
                                        class="badge bg-light text-dark border me-1 mb-1 text-decoration-none">#${tag}</a>`
                                ).join('')}
                            </div>
                        </div>
                    </div>` : ''}

                </div>
            </div>

            <!-- Học liệu liên quan -->
            ${related.length > 0 ? `
            <section class="mt-2 mb-5">
                <div class="mb-3">
                    <h4 class="fw-bold mb-1"><i class="bi bi-grid text-warning me-2"></i>Học liệu liên quan</h4>
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
                <h4>Không tìm thấy học liệu</h4>
                <p class="text-secondary">Vui lòng quay lại danh sách học liệu.</p>
                <a href="book.html" class="btn btn-warning">Về kho học liệu</a>
            </div>`;
        return;
    }

    try {
        const allBooks = await fetch('data/books.json').then(res => res.json());
        const book = allBooks.find(b => b.id === id);

        if (!book) {
            document.getElementById('detail-main').innerHTML = `
                <div class="container py-5 text-center">
                    <i class="bi bi-file-earmark-x fs-1 text-warning d-block mb-3"></i>
                    <h4>Học liệu không tồn tại</h4>
                    <p class="text-secondary">ID <code>${id}</code> không khớp với bất kỳ học liệu nào.</p>
                    <a href="book.html" class="btn btn-warning">Về kho học liệu</a>
                </div>`;
            return;
        }

        renderDetail(book, allBooks);

    } catch (err) {
        console.error('Lỗi khi load book detail:', err);
        document.getElementById('detail-main').innerHTML = `
            <div class="container py-5 text-center">
                <i class="bi bi-wifi-off fs-1 text-warning d-block mb-3"></i>
                <h4>Không thể tải dữ liệu</h4>
                <p class="text-secondary">Vui lòng thử lại sau.</p>
                <a href="book.html" class="btn btn-warning">Về kho học liệu</a>
            </div>`;
    }
}

document.addEventListener('DOMContentLoaded', init);
