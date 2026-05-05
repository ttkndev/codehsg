async function loadFeaturedBooks() {
    const container = document.getElementById('featured-books');
    try {
        const books = await fetch('data/books.json').then(res => res.json());

        books.sort((a, b) => (b.view_count || 0) - (a.view_count || 0));
        const topBooks = books.slice(0, CONFIG.FEATURED_COUNT);

        container.innerHTML = topBooks.map(book =>
            buildBookStandardCard(book, {
                columnClass: 'col-md-4 mb-4',
                coverHeight: CONFIG.BOOK_THUMB_HEIGHT
            })
        ).join('');
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
