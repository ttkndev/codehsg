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
                showFullTitle: true
            })
        ).join('');
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

document.addEventListener('DOMContentLoaded', loadFeaturedExams);
