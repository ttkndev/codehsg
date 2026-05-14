document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("exam-detail-container");
  const params = new URLSearchParams(window.location.search);
  const examId = params.get("id");

  if (!examId) {
    container.innerHTML = `<div class="alert alert-warning">Thiếu mã đề thi. Vui lòng quay lại danh sách đề thi.</div>`;
    return;
  }

  fetch("data/exams.json")
    .then(res => res.json())
    .then(data => {
      const exam = data.find(item => item.id === examId);

      if (!exam) {
        container.innerHTML = `<div class="alert alert-danger">Không tìm thấy đề thi phù hợp.</div>`;
        return;
      }

      const tags = (exam.tags || []).map(tag => `<span class="badge bg-light text-dark border me-1 mb-1">#${tag}</span>`).join("");
      const problems = (exam.problem_names || []).map((item, index) => `<li class="list-group-item"><strong>Bài ${index + 1}:</strong> ${item}</li>`).join("");
      const gallery = (exam.images || []).map((img, index) => `
        <div class="col-6 col-md-4 col-lg-3">
          <img src="${img}" alt="Trang ${index + 1}" class="img-fluid rounded border shadow-sm w-100 exam-img"
            data-images='${JSON.stringify(exam.images || [])}' data-title="${exam.title}">
        </div>
      `).join("");

      const shareUrl = `${window.location.origin}${window.location.pathname}?id=${encodeURIComponent(exam.id)}`;
      const shareText = encodeURIComponent(`Xem đề thi: ${exam.title}`);
      const relatedExams = data
        .filter(item => item.id !== exam.id)
        .filter(item => (exam.related_ids || []).includes(item.id) || item.grade === exam.grade || item.organization === exam.organization)
        .slice(0, 4);
      const relatedHtml = relatedExams.map(item => `
        <a href="exam-detail.html?id=${encodeURIComponent(item.id)}" class="list-group-item list-group-item-action d-flex justify-content-between align-items-center">
          <span>${item.title} <span class="text-muted">(${item.year})</span></span>
          <span class="badge bg-primary-subtle text-primary-emphasis">${item.grade}</span>
        </a>
      `).join("");

      container.innerHTML = `
        <div class="mb-3">
          <a href="exams.html" class="btn btn-outline-secondary btn-sm"><i class="bi bi-arrow-left"></i> Quay lại danh sách</a>
        </div>

        <div class="card border-0 shadow-sm mb-4">
          <div class="card-body p-4">
            <h1 class="h3 fw-bold mb-3">${exam.title}</h1>
            <div class="row g-3 mb-3"> ... </div>
            <div class="row g-3 mb-4">
              <div class="col-6 col-md-3"><span class="badge bg-primary-subtle text-primary-emphasis w-100 py-2"><i class="bi bi-eye"></i> ${exam.view_count} lượt xem</span></div>
              <div class="col-6 col-md-3"><span class="badge bg-success-subtle text-success-emphasis w-100 py-2"><i class="bi bi-download"></i> ${exam.download_count} lượt tải</span></div>
              <div class="col-6 col-md-3"><span class="badge bg-warning-subtle text-warning-emphasis w-100 py-2"><i class="bi bi-file-earmark-text"></i> ${exam.file_ext.toUpperCase()} · ${exam.file_size}</span></div>
              <div class="col-6 col-md-3"><span class="badge bg-info-subtle text-info-emphasis w-100 py-2"><i class="bi bi-list-check"></i> ${exam.problem_count} bài</span></div>
            </div>
            <div class="d-flex gap-2 flex-wrap mb-4">
              <a href="${exam.drive_view}" target="_blank" rel="noopener" class="btn btn-outline-primary"><i class="bi bi-eye"></i> Xem nhanh</a>
              <a href="${exam.drive_download}" class="btn btn-success"><i class="bi bi-download"></i> Tải đề</a>
            </div>
            <h2 class="h5 fw-bold">Chia sẻ đề thi</h2>
            <div class="d-flex gap-2 flex-wrap mb-4">
              <button class="btn btn-outline-dark" onclick="navigator.clipboard.writeText('${shareUrl}')"><i class="bi bi-link-45deg"></i> Sao chép link</button>
              <a target="_blank" rel="noopener" href="https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}" class="btn btn-outline-primary"><i class="bi bi-facebook"></i> Facebook</a>
              <a target="_blank" rel="noopener" href="https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${shareText}" class="btn btn-outline-info"><i class="bi bi-telegram"></i> Telegram</a>
            </div>
            <h2 class="h5 fw-bold">Danh sách bài toán</h2>
            <ul class="list-group mb-4">${problems || '<li class="list-group-item">Chưa cập nhật danh sách bài.</li>'}</ul>
            <h2 class="h5 fw-bold">Hướng dẫn giải</h2>
            <div class="alert alert-secondary mb-4">${exam.solution_detail ? exam.solution_detail : 'Hiện chưa có dữ liệu hướng dẫn giải cho đề này.'}</div>
            <h2 class="h5 fw-bold">Testcase</h2>
            <ul class="list-group mb-4">${(exam.testcases || []).length ? exam.testcases.map((tc, i) => `<li class="list-group-item">Test ${i + 1}: ${tc}</li>`).join("") : '<li class="list-group-item text-muted">Hiện chưa có dữ liệu testcase.</li>'}</ul>
            <h2 class="h5 fw-bold">Tags</h2>
            <div class="mb-4">${tags || '<span class="text-muted">Chưa có tags.</span>'}</div>
            <h2 class="h5 fw-bold">Đề liên quan</h2>
            <div class="list-group mb-4">${relatedHtml || '<div class="text-muted">Hiện chưa có đề liên quan.</div>'}</div>
            <h2 class="h5 fw-bold">Ảnh đề thi (bấm để xem lớn)</h2>
            <div class="row g-3">${gallery || '<p class="text-muted">Chưa có ảnh.</p>'}</div>
          </div>
        </div>
      `.replace('<div class="row g-3 mb-3"> ... </div>',`<div class="row g-3 mb-3">
              <div class="col-6 col-md-3"><div class="p-3 bg-light rounded h-100"><div class="small text-muted">Đơn vị ra đề</div><div class="fw-semibold">${exam.organization}</div></div></div>
              <div class="col-6 col-md-3"><div class="p-3 bg-light rounded h-100"><div class="small text-muted">Năm học</div><div class="fw-semibold">${exam.year}</div></div></div>
              <div class="col-6 col-md-3"><div class="p-3 bg-light rounded h-100"><div class="small text-muted">Khối</div><div class="fw-semibold">${exam.grade}</div></div></div>
              <div class="col-6 col-md-3"><div class="p-3 bg-light rounded h-100"><div class="small text-muted">Thời gian</div><div class="fw-semibold">${exam.duration}</div></div></div>
            </div>`);
    })
    .catch(() => {
      container.innerHTML = `<div class="alert alert-danger">Lỗi tải dữ liệu đề thi.</div>`;
    });
});

// Mở modal xem ảnh ở trang chi tiết
 document.addEventListener("click", e => {
  const target = e.target.closest(".exam-img");
  if (!target) return;
  const images = JSON.parse(target.getAttribute("data-images") || "[]");
  const title = target.getAttribute("data-title") || "Xem ảnh đề thi";
  if (typeof openExamPreview === "function") openExamPreview(title, images);
});
