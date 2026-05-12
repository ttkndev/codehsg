async function loadFeaturedExams() {
    const container = document.getElementById('featured-exams');
    try {
        const exams = await fetch('data/exams.json').then(res => res.json());

        // Sort theo lượt xem giảm dần, lấy top 3
        exams.sort((a, b) => (b.view_count || 0) - (a.view_count || 0));
        const featured = exams.slice(0, 3);

        container.innerHTML = '';

        container.innerHTML = featured.map(exam =>
            buildExamStandardCard(
                exam,
                getExamStandardCardOptions({
                    columnClass: 'col-md-4 mb-4'
                })
            )
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
