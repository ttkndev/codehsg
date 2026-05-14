document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("exam-detail-container");
  const params = new URLSearchParams(window.location.search);
  const examId = params.get("id");

  const escapeHtml = value => String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#39;");

  const renderSolutionSection = exam => {
    const detail = exam.solution_detail;

    if (!detail || typeof detail !== "object") {
      return '<div class="alert alert-secondary mb-4">Hiện chưa có dữ liệu hướng dẫn giải cho đề này.</div>';
    }

    const problems = Array.isArray(detail.problems) ? detail.problems : [];
    const hasAnySolution = problems.some(problem => Array.isArray(problem.solutions) && problem.solutions.length > 0);

    const metaBadges = `
      <div class="d-flex flex-wrap gap-2 mb-3">
        <span class="badge bg-${detail.verified ? "success" : "secondary"}-subtle text-${detail.verified ? "success" : "secondary"}-emphasis border">
          <i class="bi bi-patch-check"></i> ${detail.verified ? "Đã xác minh" : "Chưa xác minh"}
        </span>
        ${detail.last_updated ? `<span class="badge bg-light text-dark border"><i class="bi bi-clock-history"></i> Cập nhật: ${escapeHtml(detail.last_updated)}</span>` : ""}
        <span class="badge bg-light text-dark border"><i class="bi bi-list-task"></i> ${problems.length} bài</span>
      </div>
    `;

    if (!hasAnySolution) {
      return `${metaBadges}<div class="alert alert-secondary mb-4">Chưa có lời giải chi tiết cho từng bài.</div>`;
    }

    const accordionId = `solution-accordion-${escapeHtml(exam.id)}`;
    const items = problems.map((problem, idx) => {
      const solutions = Array.isArray(problem.solutions) ? problem.solutions : [];
      const itemId = `${accordionId}-${idx}`;

      if (!solutions.length) {
        return `
          <div class="accordion-item">
            <h2 class="accordion-header" id="heading-${itemId}">
              <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapse-${itemId}" aria-expanded="false" aria-controls="collapse-${itemId}">
                <strong class="me-2">Bài ${idx + 1}:</strong> ${escapeHtml(problem.problem_name || problem.problem_id || `Bài ${idx + 1}`)}
              </button>
            </h2>
            <div id="collapse-${itemId}" class="accordion-collapse collapse" aria-labelledby="heading-${itemId}" data-bs-parent="#${accordionId}">
              <div class="accordion-body text-muted">Chưa có lời giải cho bài này.</div>
            </div>
          </div>
        `;
      }

      const solutionCards = solutions.map((sol, solutionIndex) => `
        <div class="border rounded p-3 mb-3 bg-light-subtle">
          <div class="d-flex flex-wrap align-items-center gap-2 mb-2">
            <span class="badge bg-primary">Lời giải ${solutionIndex + 1}</span>
            ${sol.language ? `<span class="badge bg-dark-subtle text-dark-emphasis border">${escapeHtml(sol.language)}</span>` : ""}
            ${sol.source ? `<span class="badge bg-info-subtle text-info-emphasis border">${escapeHtml(sol.source)}</span>` : ""}
          </div>
          ${sol.approach ? `<div class="mb-2"><strong>Ý tưởng:</strong><div class="mt-1">${escapeHtml(sol.approach)}</div></div>` : ""}
          ${sol.complexity ? `<div class="mb-2"><strong>Độ phức tạp:</strong> ${escapeHtml(sol.complexity)}</div>` : ""}
          ${sol.code ? `<details><summary class="fw-semibold">Xem mã nguồn</summary><pre class="mt-2 mb-0 p-2 bg-white border rounded"><code>${escapeHtml(sol.code)}</code></pre></details>` : ""}
          ${sol.notes ? `<div class="mt-2 text-muted">${escapeHtml(sol.notes)}</div>` : ""}
        </div>
      `).join("");

      return `
        <div class="accordion-item">
          <h2 class="accordion-header" id="heading-${itemId}">
            <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapse-${itemId}" aria-expanded="false" aria-controls="collapse-${itemId}">
              <strong class="me-2">Bài ${idx + 1}:</strong> ${escapeHtml(problem.problem_name || problem.problem_id || `Bài ${idx + 1}`)}
              <span class="badge bg-success-subtle text-success-emphasis border ms-2">${solutions.length} lời giải</span>
            </button>
          </h2>
          <div id="collapse-${itemId}" class="accordion-collapse collapse" aria-labelledby="heading-${itemId}" data-bs-parent="#${accordionId}">
            <div class="accordion-body">${solutionCards}</div>
          </div>
        </div>
      `;
    }).join("");

    return `${metaBadges}<div class="accordion mb-4" id="${accordionId}">${items}</div>`;
  };

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

      const solutionProblems = Array.isArray(exam.solution_detail?.problems) ? exam.solution_detail.problems : [];
      const problemStats = solutionProblems.map(problem => ({
        solutionCount: Array.isArray(problem?.solutions) ? problem.solutions.length : 0,
        testcaseCount: Array.isArray(problem?.testcases) ? problem.testcases.length : 0
      }));
      const problems = (exam.problem_names || []).map((item, index) => {
        const stats = problemStats[index] || { solutionCount: 0, testcaseCount: 0 };
        return `<li class="list-group-item d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-2"><span><strong>Bài ${index + 1}:</strong> ${item}</span><span class="d-flex gap-2"><span class="badge bg-success-subtle text-success-emphasis border">${stats.solutionCount} lời giải</span><span class="badge bg-info-subtle text-info-emphasis border">${stats.testcaseCount} testcase</span></span></li>`;
      }).join("");
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
          <span>${item.title} <span class="text-muted">(${item.year}) - ${item.organization}</span></span>
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
            ${renderSolutionSection(exam)}
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
      `.replace('<div class="row g-3 mb-3"> ... </div>', `<div class="row g-3 mb-3">
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
