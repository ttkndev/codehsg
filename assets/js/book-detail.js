document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("book-detail-container");
  const id = new URLSearchParams(window.location.search).get("id");
  if (!id) return (container.innerHTML = '<div class="alert alert-warning">Thiếu mã học liệu.</div>');

  fetch("data/books.json").then(r => r.json()).then(data => {
    const book = data.find(x => x.id === id);
    if (!book) return (container.innerHTML = '<div class="alert alert-danger">Không tìm thấy học liệu.</div>');

    const related = data.filter(x => x.id !== id).filter(x => (book.related_ids || []).includes(x.id) || x.category === book.category).slice(0, 4);
    const relatedHtml = related.map(item => `<a class="list-group-item list-group-item-action" href="book-detail.html?id=${encodeURIComponent(item.id)}">${item.title}</a>`).join("");
    const shareUrl = `${window.location.origin}${window.location.pathname}?id=${encodeURIComponent(book.id)}`;

    container.innerHTML = `<a href="books.html" class="btn btn-outline-secondary btn-sm mb-3"><i class="bi bi-arrow-left"></i> Quay lại</a>
      <div class="card border-0 shadow-sm"><div class="card-body p-4"><h1 class="h3">${book.title}</h1>
      <div class="row g-3 mb-4"><div class="col-md-3"><img class="img-fluid rounded border" src="${book.images?.[0] || ''}"></div><div class="col-md-9">
      <p class="mb-2"><strong>Tác giả:</strong> ${book.author || 'N/A'}</p><p class="mb-2"><strong>Nhà xuất bản:</strong> ${book.publisher || 'N/A'}</p><p class="mb-2"><strong>Danh mục:</strong> ${book.category || 'N/A'}</p><p class="mb-2"><strong>Số trang:</strong> ${book.pages || 0}</p></div></div>
      <h2 class="h5">Chia sẻ học liệu</h2><div class="mb-3 d-flex gap-2 flex-wrap"><button class="btn btn-outline-dark" onclick="navigator.clipboard.writeText('${shareUrl}')">Sao chép link</button><a class="btn btn-outline-primary" target="_blank" href="https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}">Facebook</a></div>
      <h2 class="h5">Mô tả</h2><div class="alert alert-secondary">${book.description || 'Chưa có mô tả.'}</div>
      <h2 class="h5">Học liệu liên quan</h2><div class="list-group">${relatedHtml || '<div class="text-muted">Hiện chưa có học liệu liên quan.</div>'}</div>
      </div></div>`;
  }).catch(() => container.innerHTML = '<div class="alert alert-danger">Lỗi tải dữ liệu học liệu.</div>');
});
