document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("book-detail-container");
  const id = new URLSearchParams(window.location.search).get("id");
  if (!id) return (container.innerHTML = '<div class="alert alert-warning">Thiếu mã học liệu.</div>');

  fetch("data/books.json").then(r => r.json()).then(data => {
    const book = data.find(x => x.id === id);
    if (!book) return (container.innerHTML = '<div class="alert alert-danger">Không tìm thấy học liệu.</div>');

    const related = data.filter(x => x.id !== id).filter(x => (book.related_ids || []).includes(x.id) || x.category === book.category).slice(0, 4);
    const relatedHtml = related.map(item => `
      <a class="list-group-item list-group-item-action d-flex justify-content-between align-items-center" href="book-detail.html?id=${encodeURIComponent(item.id)}">
        <span>${item.title} <span class="text-muted">(${item.year})</span></span>
        <span class="badge bg-success-subtle text-success-emphasis">${item.category || "Khác"}</span>
      </a>`).join("");
    const tags = (book.tags || []).map(tag => `<span class="badge bg-light text-dark border me-1 mb-1">#${tag}</span>`).join("");
    const gallery = (book.images || []).map((img, index) => `
      <div class="col-6 col-md-4 col-lg-3">
        <img src="${img}" alt="Trang ${index + 1}" class="img-fluid rounded border shadow-sm w-100 book-img"
          data-images='${JSON.stringify(book.images || [])}' data-title="${book.title}">
      </div>`).join("");
    const shareUrl = `${window.location.origin}${window.location.pathname}?id=${encodeURIComponent(book.id)}`;

    container.innerHTML = `<a href="books.html" class="btn btn-outline-secondary btn-sm mb-3"><i class="bi bi-arrow-left"></i> Quay lại danh sách</a>
      <div class="card border-0 shadow-sm"><div class="card-body p-4"><h1 class="h3 fw-bold mb-3">${book.title}</h1>
      <div class="row g-3 mb-4">
        <div class="col-6 col-md-3"><div class="p-3 bg-light rounded h-100"><div class="small text-muted">Tác giả</div><div class="fw-semibold">${book.author || "N/A"}</div></div></div>
        <div class="col-6 col-md-3"><div class="p-3 bg-light rounded h-100"><div class="small text-muted">Nhà xuất bản</div><div class="fw-semibold">${book.publisher || "N/A"}</div></div></div>
        <div class="col-6 col-md-3"><div class="p-3 bg-light rounded h-100"><div class="small text-muted">Danh mục</div><div class="fw-semibold">${book.category || "N/A"}</div></div></div>
        <div class="col-6 col-md-3"><div class="p-3 bg-light rounded h-100"><div class="small text-muted">Số trang</div><div class="fw-semibold">${book.pages || 0}</div></div></div>
      </div>
      <div class="row g-3 mb-4">
        <div class="col-6 col-md-3"><span class="badge bg-primary-subtle text-primary-emphasis w-100 py-2"><i class="bi bi-eye"></i> ${book.view_count} lượt xem</span></div>
        <div class="col-6 col-md-3"><span class="badge bg-success-subtle text-success-emphasis w-100 py-2"><i class="bi bi-download"></i> ${book.download_count} lượt tải</span></div>
        <div class="col-6 col-md-3"><span class="badge bg-warning-subtle text-warning-emphasis w-100 py-2"><i class="bi bi-file-earmark-text"></i> ${book.file_ext?.toUpperCase() || "N/A"} · ${book.file_size || "N/A"}</span></div>
        <div class="col-6 col-md-3"><span class="badge bg-info-subtle text-info-emphasis w-100 py-2"><i class="bi bi-translate"></i> ${book.language || "N/A"}</span></div>
      </div>
      <div class="d-flex gap-2 flex-wrap mb-4"><a href="${book.drive_view}" target="_blank" rel="noopener" class="btn btn-outline-primary"><i class="bi bi-eye"></i> Xem nhanh</a><a href="${book.drive_download}" class="btn btn-success"><i class="bi bi-download"></i> Tải học liệu</a></div>
      <h2 class="h5 fw-bold">Chia sẻ học liệu</h2><div class="mb-4 d-flex gap-2 flex-wrap"><button class="btn btn-outline-dark" onclick="navigator.clipboard.writeText('${shareUrl}')"><i class="bi bi-link-45deg"></i> Sao chép link</button><a class="btn btn-outline-primary" target="_blank" href="https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}"><i class="bi bi-facebook"></i> Facebook</a></div>
      <h2 class="h5 fw-bold">Mô tả</h2><div class="alert alert-secondary mb-4">${book.description || 'Chưa có mô tả.'}</div>
      <h2 class="h5 fw-bold">Tags</h2><div class="mb-4">${tags || '<span class="text-muted">Chưa có tags.</span>'}</div>
      <h2 class="h5 fw-bold">Học liệu liên quan</h2><div class="list-group mb-4">${relatedHtml || '<div class="text-muted">Hiện chưa có học liệu liên quan.</div>'}</div>
      <h2 class="h5 fw-bold">Ảnh học liệu (bấm để xem lớn)</h2><div class="row g-3">${gallery || '<p class="text-muted">Chưa có ảnh.</p>'}</div>
      </div></div>`;
  }).catch(() => container.innerHTML = '<div class="alert alert-danger">Lỗi tải dữ liệu học liệu.</div>');
});

// Mở modal xem ảnh cho học liệu
 document.addEventListener("click", e => {
  const target = e.target.closest(".book-img");
  if (!target) return;
  const images = JSON.parse(target.getAttribute("data-images") || "[]");
  const title = target.getAttribute("data-title") || "Xem ảnh học liệu";
  if (typeof openExamPreview === "function") openExamPreview(title, images);
});
