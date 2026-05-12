async function loadFeaturedExams() {
    const container = document.getElementById('featured-exams');
    try {
        const exams = await fetch('data/exams.json').then(res => res.json());

        // Sort theo lượt xem giảm dần, lấy top 3
        exams.sort((a, b) => (b.view_count || 0) - (a.view_count || 0));
        const featured = exams.slice(0, 3);

        container.innerHTML = '';

        container.innerHTML = featured.map(exam =>
            buildExamStandardCard(exam, {
                columnClass: 'col-md-4 mb-4',
                cardClass: 'card h-100 shadow-sm exam-card',
                thumbClass: 'img-fluid rounded border exam-thumb',
                maxTags: 4,
                showExamTags: false,
                showAllProblemNames: true,
                statusBelowProblemNames: true,
                showFullTitle: true,
                enablePreviewModal: true
            })
        ).join('');

        bindFeaturedExamPreviewModal();
    } catch (error) {
        console.error('Lỗi khi load exams:', error);
        container.innerHTML = `
            <div class="col-12">
                <div class="alert alert-warning text-center">
                    Không thể tải danh sách đề thi nổi bật lúc này.<br>
                    Vui lòng thử lại sau hoặc xem toàn bộ danh sách tại
                    <a href="exam.html" class="alert-link">trang Đề thi</a>.
                </div>
            </div>
        `;
    }
}

function bindFeaturedExamPreviewModal() {
    const modalEl = document.getElementById('exam-preview-modal');
    if (!modalEl || !window.bootstrap) return;

    const modal = bootstrap.Modal.getOrCreateInstance(modalEl);
    const modalImg = document.getElementById('exam-preview-image');
    const modalTitle = document.getElementById('exam-preview-title');

    document.querySelectorAll('.exam-preview-trigger').forEach(trigger => {
        trigger.addEventListener('click', (event) => {
            event.preventDefault();
            if (!modalImg) return;
            modalImg.src = trigger.dataset.previewSrc || '';
            modalImg.alt = trigger.dataset.previewTitle || 'Preview';
            if (modalTitle) modalTitle.textContent = trigger.dataset.previewTitle || 'Xem ảnh đề thi';
            modal.show();
        });
    });
}

document.addEventListener('DOMContentLoaded', loadFeaturedExams);
