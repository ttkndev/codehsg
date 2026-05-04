// Quy đổi level sang tên cấp học
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

// Chọn icon theo level
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

async function loadFeaturedBooks() {
    const container = document.getElementById('featured-books');
    try {
        const books = await fetch('data/books.json').then(res => res.json());

        // Sort theo lượt xem giảm dần, lấy top 3
        books.sort((a, b) => (b.view_count || 0) - (a.view_count || 0));
        const topBooks = books.slice(0, 3);

        container.innerHTML = '';

        topBooks.forEach(book => {
            const col = document.createElement('div');
            col.className = 'col-md-4 mb-4';
            col.innerHTML = `
                <div class="card h-100 shadow-sm">
                    <div class="card-body d-flex flex-column">

                        <!-- Hàng đầu: ảnh + thông tin -->
                        <div class="row mb-2">
                            <div class="col-4">
                                <img src="${book.images[0]}" class="img-fluid rounded" alt="${book.title}">
                            </div>
                            <div class="col-8">
                                <h6 class="fw-bold mb-2">${book.title}</h6>
                                <div class="row text-muted small mb-1">
                                    <div class="col-6"><i class="bi ${levelIcon(book.level)} me-1"></i>${mapLevel(book.level)}</div>
                                    <div class="col-6"><i class="bi bi-calendar me-1"></i>${book.year}</div>
                                </div>
                                <div class="row text-muted small mb-1">
                                    <div class="col-6"><i class="bi bi-person-badge me-1"></i>${book.contributor}</div>
                                    <div class="col-6"><i class="bi bi-file-text me-1"></i>${book.pages} trang</div>
                                </div>
                                <!-- Kiểu tệp + dung lượng -->
                                <div class="row text-muted small mb-1">
                                    <div class="col-6"><i class="bi bi-file-earmark-pdf me-1"></i>${book.file_ext.toUpperCase()}</div>
                                    <div class="col-6"><i class="bi bi-hdd me-1"></i>${book.file_size}</div>
                                </div>
                                <!-- Lượt xem + lượt tải -->
                                <div class="row text-muted small mb-1">
                                    <div class="col-6"><i class="bi bi-eye me-1"></i>${book.view_count}</div>
                                    <div class="col-6"><i class="bi bi-download me-1"></i>${book.download_count}</div>
                                </div>
                            </div>
                        </div>

                        <!-- Author -->
                        <p class="text-muted small mb-2"><i class="bi bi-person me-1"></i>${book.author}</p>

                        <!-- Publisher + Category -->
                        <div class="d-flex justify-content-between text-muted mb-2 small">
                            <span><i class="bi bi-building me-1"></i>${book.publisher}</span>
                            <span><i class="bi bi-tag me-1"></i>${book.category}</span>
                        </div>

                        <hr class="my-2">

                        <!-- Tags -->
                        <div class="mb-2">
                            ${(book.tags || []).map(tag =>
                                `<span class="badge bg-light text-dark border me-1">#${tag}</span>`
                            ).join('')}
                        </div>

                        <!-- Buttons -->
                        <div class="d-flex justify-content-center gap-2 mt-auto">
                            <a href="detail.html?id=${book.id}" class="btn btn-outline-primary btn-sm flex-fill" title="Chi tiết">
                                <i class="bi bi-info-circle"></i> Chi tiết
                            </a>
                            <a href="${book.drive_view}" target="_blank" rel="noopener noreferrer" class="btn btn-outline-success btn-sm flex-fill" title="Xem nhanh">
                                <i class="bi bi-eye"></i> Xem nhanh
                            </a>
                            <a href="${book.drive_download}" target="_blank" rel="noopener noreferrer" class="btn btn-outline-secondary btn-sm flex-fill" title="Tải về">
                                <i class="bi bi-download"></i> Tải về
                            </a>
                        </div>
                    </div>
                </div>
            `;
            container.appendChild(col);
        });
    } catch (error) {
        console.error('Lỗi khi load books:', error);
        container.innerHTML = `
            <div class="col-12">
                <div class="alert alert-warning text-center">
                    Không thể tải dữ liệu học liệu nổi bật lúc này.<br>
                    Vui lòng thử lại sau hoặc xem toàn bộ danh sách tại
                    <a href="book.html" class="alert-link">trang Học liệu</a>.
                </div>
            </div>
        `;
    }
}

document.addEventListener('DOMContentLoaded', loadFeaturedBooks);
