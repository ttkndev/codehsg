function animateValue(element, start, end, duration) {
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        const value = Math.floor(progress * (end - start) + start);
        element.textContent = value + '+';
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    window.requestAnimationFrame(step);
}

async function loadStats() {
    const statsContainer = document.getElementById('stats');

    try {
        const exams = await fetch('data/exams.json').then(res => res.json());
        const books = await fetch('data/books.json').then(res => res.json());

        const examCount = exams.length;
        const bookCount = books.length;

        const totalViews = exams.reduce((sum, e) => sum + (e.view_count || 0), 0)
                          + books.reduce((sum, b) => sum + (b.view_count || 0), 0);

        const totalDownloads = exams.reduce((sum, e) => sum + (e.download_count || 0), 0)
                              + books.reduce((sum, b) => sum + (b.download_count || 0), 0);

        const stats = [
            { icon: 'bi bi-file-earmark-text', value: examCount, title: 'Đề thi' },
            { icon: 'bi bi-book', value: bookCount, title: 'Học liệu' },
            { icon: 'bi bi-eye', value: totalViews, title: 'Lượt xem' },
            { icon: 'bi bi-download', value: totalDownloads, title: 'Lượt tải' }
        ];

        statsContainer.innerHTML = '';

        stats.forEach(stat => {
            const col = document.createElement('div');
            col.className = 'col-md-3 col-6 mb-3';
            col.innerHTML = `
                <div class="card shadow-sm border-0">
                    <div class="card-body text-center">
                        <i class="${stat.icon} fs-2 mb-2"></i>
                        <h3 class="fw-bold stat-value">0+</h3>
                        <p class="text-muted mb-0">${stat.title}</p>
                    </div>
                </div>
            `;
            statsContainer.appendChild(col);

            const valueElement = col.querySelector('.stat-value');
            animateValue(valueElement, 0, stat.value, 1500); // chạy trong 1.5s
        });
    } catch (error) {
        console.error('Lỗi khi load thống kê:', error);
        statsContainer.innerHTML = `
            <div class="col-12">
                <div class="alert alert-warning text-center">
                    Không thể tải thống kê lúc này.
                </div>
            </div>
        `;
    }
}

document.addEventListener('DOMContentLoaded', loadStats);
