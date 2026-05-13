// Đợi DOM tải xong để đảm bảo chèn HTML vào body thành công
document.addEventListener("DOMContentLoaded", function() {
    const modalHTML = `
    <div class="modal fade" id="examPreviewModal" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog modal-xl modal-dialog-centered">
            <div class="modal-content border-0 bg-transparent">
                <div class="modal-header border-0 pb-0">
                    <h5 class="modal-title text-white" id="examPreviewModalLabel">Xem nhanh tài liệu</h5>
                    <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Đóng"></button>
                </div>
                <div class="modal-body p-0">
                    <div id="exam-preview-carousel" class="carousel slide" data-bs-ride="false">
                        <div class="carousel-inner" id="exam-preview-inner">
                            <!-- JS sẽ render ảnh vào đây -->
                        </div>
                        <button class="custom-nav prev" type="button" data-bs-target="#exam-preview-carousel" data-bs-slide="prev">
                            <i class="bi bi-chevron-left"></i>
                        </button>
                        <button class="custom-nav next" type="button" data-bs-target="#exam-preview-carousel" data-bs-slide="next">
                            <i class="bi bi-chevron-right"></i>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>`;

    document.body.insertAdjacentHTML('beforeend', modalHTML);
});

/**
 * Hàm render và mở Modal - Đặt bên ngoài DOMContentLoaded để các file khác có thể gọi
 * @param {string} title - Tiêu đề hiển thị trên Modal
 * @param {Array} images - Mảng các đường dẫn ảnh
 */
function openExamPreview(title, images) {
    const label = document.getElementById('examPreviewModalLabel');
    const inner = document.getElementById('exam-preview-inner');
    const navButtons = document.querySelectorAll('.custom-nav');

    // 1. Cập nhật tiêu đề
    if (label) label.innerText = title;

    // 2. Render danh sách ảnh
    if (inner) {
        inner.innerHTML = images.map((src, index) => `
            <div class="carousel-item ${index === 0 ? 'active' : ''}">
                <img src="${src}" alt="Trang ${index + 1}">
            </div>
        `).join('');
    }

    // 3. Hiện/Ẩn nút dựa trên số lượng ảnh
    if (navButtons) {
        const displayStyle = images.length <= 1 ? 'none' : 'flex';
        navButtons.forEach(btn => btn.style.display = displayStyle);
    }

    // 4. Kích hoạt mở Modal của Bootstrap
    const modalElem = document.getElementById('examPreviewModal');
    const modalInstance = bootstrap.Modal.getOrCreateInstance(modalElem);
    modalInstance.show();
}