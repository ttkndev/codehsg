// assets/js/render.js

function renderExamCard(exam) {
  return `
    <div class="col-12 col-md-4 mb-4">
      <div class="card h-100 shadow-sm">
        <div class="card-header fw-bold">
          <i class="bi bi-award text-warning"></i> ${exam.title}
        </div>
        <div class="card-body">
          <div class="row mb-2">
            <div class="col-4">
              <img src="${exam.images[0]}" class="img-fluid rounded border exam-img" alt="Exam cover" data-images='${JSON.stringify(exam.images)}'>
            </div>
            <div class="col-8">
              <h6 class="card-title mb-2"><i class="bi bi-building"></i> ${exam.organization}</h6>
              <div class="row">
                <p class="col-6 small text-muted mb-1"><i class="bi bi-calendar-event"></i> ${exam.year}</p>
                <p class="col-6 small text-muted mb-1"><i class="bi bi-mortarboard"></i> ${exam.grade}</p>
              </div>
              <div class="row">
                <p class="col-6 small text-muted mb-1"><i class="bi bi-book"></i> ${exam.subject}</p>
                <p class="col-6 small text-muted mb-1"><i class="bi bi-clock"></i> ${exam.duration}</p>
              </div>
              <div class="row">
                <p class="col-6 small text-muted mb-1"><i class="bi bi-file-earmark-pdf" ></i> ${exam.file_ext.toUpperCase()}</p>
                <p class="col-6 small text-muted mb-1"><i class="bi bi-hdd"></i> ${exam.file_size}</p>
              </div>
              <div class="row">
                <p class="col-6 small text-muted mb-1"><i class="bi bi-eye"></i> ${exam.view_count}</p>
                <p class="col-6 small text-muted mb-1"><i class="bi bi-download"></i> ${exam.download_count}</p>
              </div>
              <div class="row">
                <div class="col-6">
                  <span class="badge bg-secondary w-100"><i class="bi bi-journal-text"></i> Lời giải: ${exam.solution_detail ? "Có" : "0"}</span>
                </div>
                <div class="col-6">
                  <span class="badge bg-info text-dark w-100"><i class="bi bi-code-slash"></i> Testcase: ${exam.testcases.length}</span>
                </div>
              </div>
            </div>
          </div>
          <div class="mt-2">
            <span class="small text-muted mb-1"><i class="bi bi-files"></i> ${exam.problem_count} bài: </span>
            ${exam.problem_names.map(p => `<span class="badge bg-light text-dark me-1">${p}</span>`).join("")}
          </div>
          <div class="mt-2">
            <span class="small text-muted mb-1"><i class="bi bi-share-fill"></i> ${exam.contributor}</span>
          </div>
        </div>
        <div class="card-footer d-flex justify-content-between">
          <a href="#" class="btn btn-outline-primary btn-sm"><i class="bi bi-info-circle"></i> Chi tiết</a>
          <a href="${exam.drive_view}" class="btn btn-outline-secondary btn-sm" target="_blank" rel="noopener"><i class="bi bi-eye"></i> Xem nhanh</a>
          <a href="${exam.drive_download}" class="btn btn-outline-success btn-sm"><i class="bi bi-download"></i> Tải về</a>
        </div>
      </div>
    </div>
  `;
}

function renderBookCard(book) {
  // Xử lý ngôn ngữ hiển thị
  let langDisplay = book.language;
  if (langDisplay === "vi") langDisplay = "Tiếng Việt";
  else if (langDisplay === "en") langDisplay = "Tiếng Anh";

  return `
    <div class="col-12 col-md-4 mb-4">
      <div class="card h-100 shadow-sm">
        <div class="card-header fw-bold">
          <i class="bi bi-journal-bookmark text-success"></i> ${book.title}
        </div>
        <div class="card-body">
          <div class="row mb-2">
            <div class="col-4">
              <img src="${book.images[0]}" class="img-fluid rounded border book-img" alt="Book cover" data-images='${JSON.stringify(book.images)}'>
            </div>
            <div class="col-8">
              <h6 class="card-title mb-2"><i class="bi bi-building"></i> ${book.category}</h6>
              <div class="row">
                <p class="col-6 small text-muted mb-1"><i class="bi bi-calendar-event"></i> ${book.year}</p>
                <p class="col-6 small text-muted mb-1"><i class="bi bi-share-fill"></i> ${book.contributor}</p>
              </div>
              <div class="row">
                <p class="col-6 small text-muted mb-1"><i class="bi bi-file-earmark-richtext"></i> ${book.pages} trang</p>
                <p class="col-6 small text-muted mb-1"><i class="bi bi-translate"></i> ${langDisplay}</p>
              </div>              
              <div class="row">
                <p class="col-6 small text-muted mb-1"><i class="bi bi-file-earmark-text"></i> ${book.file_ext.toUpperCase()}</p>
                <p class="col-6 small text-muted mb-1"><i class="bi bi-hdd"></i> ${book.file_size}</p>
              </div>
              <div class="row">
                <p class="col-6 small text-muted mb-1"><i class="bi bi-eye"></i> ${book.view_count}</p>
                <p class="col-6 small text-muted mb-1"><i class="bi bi-download"></i> ${book.download_count}</p>
              </div>
              <p class="col-12 small text-muted mb-1"><i class="bi bi-collection"></i> ${book.publisher}</p>
            </div>
          </div>
          <div class="mt-2">
            <p class="mb-2 small text-muted"><i class="bi bi-people"></i> ${book.author}</p>
          </div>
          <div class="mt-2">
            ${(book.tags || []).slice(0, 5).map(tag => `<span class="badge bg-light text-dark me-1">#${tag}</span>`).join("")}
          </div>
        </div>
        <div class="card-footer d-flex justify-content-between">
          <a href="#" class="btn btn-outline-primary btn-sm"><i class="bi bi-info-circle"></i> Chi tiết</a>
          <a href="${book.drive_view}" class="btn btn-outline-secondary btn-sm" target="_blank" rel="noopener"><i class="bi bi-eye"></i> Xem nhanh</a>
          <a href="${book.drive_download}" class="btn btn-outline-success btn-sm"><i class="bi bi-download"></i> Tải về</a>
        </div>
      </div>
    </div>
  `;
}
