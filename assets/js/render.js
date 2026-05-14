// assets/js/render.js

function renderExamCard(exam) {
  const pick = (...keys) => {
    for (const key of keys) {
      const value = exam?.[key];
      if (value !== undefined && value !== null && value !== "") return value;
    }
    return "";
  };

  const images = pick("images", "image_urls", "imageUrls", "thumbnails") || [];
  const cover = images[0] || "assets/images/ltc-banner.png";
  const organization = pick("organization", "organizer", "source");
  const year = pick("year", "school_year", "schoolYear");
  const grade = pick("grade", "level_name", "levelName");
  const subject = pick("subject", "category", "topic");
  const duration = pick("duration", "time_limit", "timeLimit");
  const fileExt = String(pick("file_ext", "fileExt", "ext") || "pdf").toUpperCase();
  const fileSize = pick("file_size", "fileSize", "size");
  const viewCount = Number(pick("view_count", "viewCount", "views") || 0);
  const downloadCount = Number(pick("download_count", "downloadCount", "downloads") || 0);
  const problemNames = pick("problem_names", "problemNames", "problems") || [];
  const problemCount = Number(pick("problem_count", "problemCount") || problemNames.length || 0);
  const solutionDetail = pick("solution_detail", "solutionDetail", "solutions");
  const testcaseCount = Array.isArray(exam?.testcases)
    ? exam.testcases.length
    : Array.isArray(solutionDetail?.problems)
      ? solutionDetail.problems.reduce((acc, item) => acc + (item.testcases?.length || 0), 0)
      : 0;

  return `
    <div class="col-12 col-md-4 mb-4">
      <div class="card h-100 shadow-sm">
        <div class="card-header fw-bold">
          <i class="bi bi-award text-warning"></i> ${exam.title}
        </div>
        <div class="card-body">
          <div class="row mb-2">
            <div class="col-4">
              <img src="${cover}" class="img-fluid rounded border exam-img" alt="Exam cover" data-images='${JSON.stringify(images)}'>
            </div>
            <div class="col-8">
              <h6 class="card-title mb-2"><i class="bi bi-building"></i> ${organization}</h6>
              <div class="row">
                <p class="col-6 small text-muted mb-1"><i class="bi bi-calendar-event"></i> ${year}</p>
                <p class="col-6 small text-muted mb-1"><i class="bi bi-mortarboard"></i> ${grade}</p>
              </div>
              <div class="row">
                <p class="col-6 small text-muted mb-1"><i class="bi bi-book"></i> ${subject}</p>
                <p class="col-6 small text-muted mb-1"><i class="bi bi-clock"></i> ${duration}</p>
              </div>
              <div class="row">
                <p class="col-6 small text-muted mb-1"><i class="bi bi-file-earmark-pdf" ></i> ${fileExt}</p>
                <p class="col-6 small text-muted mb-1"><i class="bi bi-hdd"></i> ${fileSize}</p>
              </div>
              <div class="row">
                <p class="col-6 small text-muted mb-1"><i class="bi bi-eye"></i> ${viewCount}</p>
                <p class="col-6 small text-muted mb-1"><i class="bi bi-download"></i> ${downloadCount}</p>
              </div>
              <div class="row">
                <div class="col-6">
                  <span class="badge bg-secondary w-100"><i class="bi bi-journal-text"></i> Lời giải: ${solutionDetail ? "Có" : "0"}</span>
                </div>
                <div class="col-6">
                  <span class="badge bg-info text-dark w-100"><i class="bi bi-code-slash"></i> Testcase: ${testcaseCount}</span>
                </div>
              </div>
            </div>
          </div>
          <div class="mt-2">
            <span class="small text-muted mb-1"><i class="bi bi-files"></i> ${problemCount} bài: </span>
            ${problemNames.map(p => `<span class="badge bg-light text-dark me-1">${p}</span>`).join("")}
          </div>
          <div class="mt-2">
            <span class="small text-muted mb-1"><i class="bi bi-share-fill"></i> ${exam.contributor}</span>
          </div>
        </div>
        <div class="card-footer d-flex justify-content-between">
          <a href="exam-detail.html?id=${encodeURIComponent(exam.id)}" class="btn btn-outline-primary btn-sm"><i class="bi bi-info-circle"></i> Chi tiết</a>
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
          <a href="book-detail.html?id=${encodeURIComponent(book.id)}" class="btn btn-outline-primary btn-sm"><i class="bi bi-info-circle"></i> Chi tiết</a>
          <a href="${book.drive_view}" class="btn btn-outline-secondary btn-sm" target="_blank" rel="noopener"><i class="bi bi-eye"></i> Xem nhanh</a>
          <a href="${book.drive_download}" class="btn btn-outline-success btn-sm"><i class="bi bi-download"></i> Tải về</a>
        </div>
      </div>
    </div>
  `;
}
