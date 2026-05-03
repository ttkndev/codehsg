async function loadFeaturedExams() {
    const container = document.getElementById('featured-exams');
    try {
        const exams = await fetch('data/exams.json').then(res => res.json());
        const featured = exams.slice(0, 3);

        container.innerHTML = '';

        featured.forEach(exam => {
            const col = document.createElement('div');
            col.className = 'col-md-4 mb-4';
            col.innerHTML = `
                <div class="card h-100 shadow-sm">
                    <div class="card-body d-flex flex-column">

                        <!-- Hàng đầu: ảnh + thông tin -->
                        <div class="row mb-2">
                            <div class="col-4">
                                <img src="${exam.images[0]}" class="img-fluid rounded border" alt="${exam.title}">
                            </div>
                            <div class="col-8">
                                <h6 class="fw-bold mb-2">${exam.title}</h6>
                                <!-- Tổ chức -->
                                <div class="text-muted small mb-1">
                                    <i class="bi bi-building me-1"></i>${exam.organization}
                                </div>
                                <!-- Năm + grade -->
                                <div class="row text-muted small mb-1">
                                    <div class="col-6"><i class="bi bi-calendar me-1"></i>${exam.year}</div>
                                    <div class="col-6"><i class="bi bi-mortarboard me-1"></i>${exam.grade}</div>
                                </div>
                                <!-- Số câu + thời gian -->
                                <div class="row text-muted small mb-1">
                                    <div class="col-6"><i class="bi bi-list-check me-1"></i>${exam.problem_count} câu</div>
                                    <div class="col-6"><i class="bi bi-clock me-1"></i>${exam.duration}</div>
                                </div>
                                <!-- Kiểu tệp + dung lượng -->
                                <div class="row text-muted small mb-1">
                                    <div class="col-6"><i class="bi bi-file-earmark-pdf text-danger me-1"></i>${exam.file_ext.toUpperCase()}</div>
                                    <div class="col-6"><i class="bi bi-hdd me-1"></i>${exam.file_size}</div>
                                </div>
                                <!-- Lượt xem + lượt tải -->
                                <div class="row text-muted small mb-1">
                                    <div class="col-6"><i class="bi bi-eye me-1"></i>${exam.view_count}</div>
                                    <div class="col-6"><i class="bi bi-download me-1"></i>${exam.download_count}</div>
                                </div>
                            </div>
                        </div>

                        <hr class="my-2">

                        <!-- Tags -->
                        <div class="mb-2">
                            ${(exam.tags || []).map(tag =>
                                `<span class="badge bg-light text-dark border me-1">#${tag}</span>`
                            ).join('')}
                        </div>

                        <!-- Buttons: chỉ icon -->
                        <div class="d-flex justify-content-center gap-2 mt-auto">
                            <a href="${exam.drive_view}" target="_blank" class="btn btn-outline-primary btn-sm" title="Chi tiết">
                                <i class="bi bi-info-circle"></i> Chi tiết
                            </a>
                            <a href="${exam.drive_view}" target="_blank" class="btn btn-outline-success btn-sm" title="Xem">
                                <i class="bi bi-eye"></i> Xem nhanh
                            </a>
                            <a href="${exam.drive_download}" target="_blank" class="btn btn-outline-danger btn-sm" title="Tải">
                                <i class="bi bi-download"></i> Tải về
                            </a>
                        </div>
                    </div>
                </div>
            `;
            container.appendChild(col);
        });
    } catch (error) {
        console.error('Lỗi khi load exams:', error);
        container.innerHTML = `
            <div class="col-12">
                <div class="alert alert-warning text-center">
                    Không thể tải danh sách đề thi nổi bật lúc này.
                </div>
            </div>
        `;
    }
}

document.addEventListener('DOMContentLoaded', loadFeaturedExams);
