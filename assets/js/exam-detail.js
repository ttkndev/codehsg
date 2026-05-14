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
          <img src="${img}" alt="Trang ${index + 1}" class="img-fluid rounded border shadow-sm w-100">
        </div>
      `).join("");

      container.innerHTML = `
        <div class="mb-3">
          <a href="exams.html" class="btn btn-outline-secondary btn-sm"><i class="bi bi-arrow-left"></i> Quay lại danh sách</a>
        </div>

        <div class="card border-0 shadow-sm mb-4">
          <div class="card-body p-4">
            <h1 class="h3 fw-bold mb-3">${exam.title}</h1>
            <p class="text-muted mb-3">${exam.description || "Chưa có mô tả chi tiết."}</p>

            <div class="row g-3 mb-3">
              <div class="col-6 col-md-3"><div class="p-3 bg-light rounded h-100"><div class="small text-muted">Đơn vị ra đề</div><div class="fw-semibold">${exam.organization}</div></div></div>
              <div class="col-6 col-md-3"><div class="p-3 bg-light rounded h-100"><div class="small text-muted">Năm học</div><div class="fw-semibold">${exam.year}</div></div></div>
              <div class="col-6 col-md-3"><div class="p-3 bg-light rounded h-100"><div class="small text-muted">Khối</div><div class="fw-semibold">${exam.grade}</div></div></div>
              <div class="col-6 col-md-3"><div class="p-3 bg-light rounded h-100"><div class="small text-muted">Thời gian</div><div class="fw-semibold">${exam.duration}</div></div></div>
            </div>

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

            <h2 class="h5 fw-bold">Danh sách bài toán</h2>
            <ul class="list-group mb-4">${problems || '<li class="list-group-item">Chưa cập nhật danh sách bài.</li>'}</ul>

            <h2 class="h5 fw-bold">Tags</h2>
            <div class="mb-4">${tags || '<span class="text-muted">Chưa có tags.</span>'}</div>

            <h2 class="h5 fw-bold">Ảnh đề thi</h2>
            <div class="row g-3">${gallery || '<p class="text-muted">Chưa có ảnh.</p>'}</div>
          </div>
        </div>
      `;
    })
    .catch(() => {
      container.innerHTML = `<div class="alert alert-danger">Lỗi tải dữ liệu đề thi.</div>`;
    });
});
