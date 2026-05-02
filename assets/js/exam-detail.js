const norm = t => (t ?? '').toString().trim().replace(/\r\n/g, '\n').replace(/\s+/g, ' ').toLowerCase();
const id = new URLSearchParams(location.search).get('id');

(async () => {
  const data = (await fetch('data/exams.json').then(r => r.json())).find(i => i.id === id && i.is_ready);
  if (!data) {
    document.getElementById('detail').innerHTML = '<div class="card content-card"><div class="card-body">Không tìm thấy đề thi.</div></div>';
    return;
  }

  const tests = data.testcases || [];
  const tags = data.tags || [];
  const hasSolution = Boolean((data.solution_detail || '').trim());
  document.title = `${data.title} | CodeHSG`;

  document.getElementById('detail').innerHTML = `
  <div class="card content-card mb-3">
    <div class="card-body p-4">
      <div class="d-flex justify-content-between align-items-start flex-wrap gap-2">
        <div>
          <h1 class="h3 mb-1">${data.title}</h1>
          <p class="meta mb-2"><i class="bi bi-building"></i> ${data.organization || '-'} · <i class="bi bi-calendar3"></i> ${data.year || '-'} · <i class="bi bi-mortarboard"></i> ${data.grade || '-'}</p>
        </div>
        <div class="d-flex flex-wrap gap-2">${tags.map(t=>`<span class="badge text-bg-light border">#${t}</span>`).join('') || '<span class="badge text-bg-light border">#exam</span>'}</div>
      </div>
    </div>
  </div>

  <div class="row g-3">
    <div class="col-lg-8">
      <div class="card content-card mb-3"><div class="card-body p-4">
        <h2 class="h5"><i class="bi bi-card-text me-2"></i>Mô tả đề</h2>
        <p class="detail-kv mb-0">${(data.description || 'Đang cập nhật mô tả.').replace(/\n/g, '<br>')}</p>
      </div></div>

      <div class="card content-card mb-3"><div class="card-body p-4">
        <h2 class="h5"><i class="bi bi-list-task me-2"></i>Danh sách bài toán (${(data.problem_names || []).length})</h2>
        <div class="exam-problems">${(data.problem_names || []).map((n, i)=>`<span class="badge exam-chip">${i+1}. ${n}</span>`).join('') || '<span class="badge exam-chip">Chưa cập nhật</span>'}</div>
      </div></div>

      <div class="card content-card mb-3" ${hasSolution ? '' : 'hidden'}><div class="card-body p-4">
        <h2 class="h5"><i class="bi bi-lightbulb me-2"></i>Gợi ý (solution_detail)</h2>
        <div class="testcase-box">${data.solution_detail || ''}</div>
      </div></div>

      <div class="card content-card" ${tests.length ? '' : 'hidden'}><div class="card-body p-4">
        <h2 class="h5"><i class="bi bi-check2-square me-2"></i>Testcase (Kiểm tra đáp án)</h2>
        ${tests.map((t, idx) => `<div class="testcase-box mb-2">
          <div class="small text-muted mb-1">Test #${idx + 1}</div>
          <div><b>Input:</b> <code>${t.input ?? '-'}</code></div>
          <div><b>Output mong đợi:</b> <code>${t.output ?? '-'}</code></div>
          <div class="input-group input-group-sm mt-2"><input class="form-control user-out" data-idx="${idx}" placeholder="Nhập output của bạn"><button class="btn btn-outline-success check-one" data-idx="${idx}"><i class="bi bi-check2-circle"></i></button></div>
          <div class="small mt-2 result" id="res-${idx}"></div>
        </div>`).join('')}
      </div></div>
    </div>

    <div class="col-lg-4">
      <div class="card content-card mb-3"><div class="card-body p-3">
        <h2 class="h6 mb-2"><i class="bi bi-image me-2"></i>Ảnh đề thi</h2>
        <div class="image-grid">${(data.images || []).map((img, idx)=>`<img src="${img}" class="exam-thumb rounded border" data-img="${img}" alt="Trang ${idx+1}">`).join('') || '<div class="small text-muted">Chưa có ảnh.</div>'}</div>
      </div></div>

      <div class="card content-card mb-3"><div class="card-body p-4">
        <h2 class="h6 mb-2"><i class="bi bi-info-circle me-2"></i>Thông tin</h2>
        <div class="exam-info-inline">
          <span><i class="bi bi-file-earmark"></i> ${String(data.file_ext || 'pdf').toUpperCase()} • ${data.file_size || '-'}</span>
          <span><i class="bi bi-clock"></i> ${data.duration || '-'}</span>
          <span><i class="bi bi-code-square"></i> ${data.language || 'C/C++'}</span>
          <span><i class="bi bi-diagram-3"></i> ${Array.isArray(data.level) ? (data.level.join(', ') || '-') : (data.level || '-')}</span>
        </div>
        <div class="d-grid gap-2 mt-3"><a class="btn btn-primary btn-sm" target="_blank" href="${data.drive_view || '#'}"><i class="bi bi-eye"></i> Làm bài</a><a class="btn btn-outline-primary btn-sm" target="_blank" href="${data.drive_download || data.drive_view || '#'}"><i class="bi bi-download"></i> Tải PDF</a></div>
      </div></div>

      <div class="card content-card"><div class="card-body p-4">
        <h2 class="h6 mb-3"><i class="bi bi-bar-chart-line me-2"></i>Thống kê đề thi</h2>
        <div class="row g-2 text-center">
          <div class="col-6"><div class="stat-box"><div class="h5 mb-0">${(data.view_count || 0).toLocaleString('vi-VN')}</div><small>Lượt xem</small></div></div>
          <div class="col-6"><div class="stat-box"><div class="h5 mb-0">${(data.download_count || 0).toLocaleString('vi-VN')}</div><small>Lượt tải</small></div></div>
          <div class="col-6"><div class="stat-box"><div class="h5 mb-0">${(data.problem_count || (data.problem_names || []).length)}</div><small>Bài toán</small></div></div>
          <div class="col-6"><div class="stat-box"><div class="h5 mb-0">${tests.length}</div><small>Testcase</small></div></div>
        </div>
      </div></div>
    </div>
  </div>`;

  document.querySelectorAll('.exam-thumb').forEach(el => el.addEventListener('click', () => {
    document.getElementById('previewImg').src = el.dataset.img;
    new bootstrap.Modal(document.getElementById('imageModal')).show();
  }));

  document.querySelectorAll('.check-one').forEach(btn => btn.addEventListener('click', () => {
    const idx = Number(btn.dataset.idx);
    const user = document.querySelector(`.user-out[data-idx="${idx}"]`).value;
    const ok = norm(user) === norm(tests[idx]?.output);
    const res = document.getElementById(`res-${idx}`);
    res.className = `small mt-2 result ${ok ? 'text-success' : 'text-danger'}`;
    res.textContent = ok ? '✅ Chính xác!' : '❌ Chưa đúng, thử lại nhé.';
  }));
})();
