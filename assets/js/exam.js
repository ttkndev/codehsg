const EXAM_CONFIG = {
  pageSize: 9,
  maxPageButtons: 7,
  gradeOrder: ['Tiểu học', 'THCS', 'THPT']
};

let data = [], filtered = [], page = 1;

const gradeWeight = g => {
  const idx = EXAM_CONFIG.gradeOrder.indexOf(g || '');
  return idx === -1 ? 99 : idx;
};

const examTypeClass = tags => (tags.includes('hsg') ? 'icon-hsg' : 'icon-tht');
const examTypeLabel = tags => (tags.includes('hsg') ? 'HSG' : 'THT');

const card = i => {
  const tags = (i.tags || []).join(' ').toLowerCase();
  const problems = (i.problem_names || []).slice(0, 4);
  const hasSolution = Boolean(i.solution_detail);
  const hasTestcase = Array.isArray(i.testcases) && i.testcases.length > 0;
  const isFeatured = Boolean(i.is_featured);

  return `
    <div class="col-md-6 col-xl-4">
      <div class="card content-card exam-card">
        <div class="card-body p-3">
          <div class="d-flex align-items-start gap-3 mb-2">
            <div class="exam-doc-icon ${examTypeClass(tags)}"><i class="bi bi-patch-check"></i></div>
            <div class="flex-grow-1">
              <h2 class="h5 mb-1">${i.title} năm ${i.year || '...'}</h2>
              <p class="meta mb-0">${i.organization || 'CodeHSG'}</p>
            </div>
          </div>

          <div class="exam-problems mb-2">
            ${problems.map((n, idx) => `<span class="badge exam-chip">${idx + 1}. ${n}</span>`).join('') || '<span class="badge exam-chip">Chưa có problem_names</span>'}
          </div>
        <div class="row exam-stats mb-2">
          <div class="col-3"><i class="bi bi-file-earmark-pdf"></i> ${String(i.file_ext || 'pdf').toUpperCase()}</div>
          <div class="col-3"><i class="bi bi-list-ol"></i> ${i.problem_count || 0} bài</div>
          <div class="col-3"><i class="bi bi-clock"></i> ${i.duration || '-'}</div>
          <div class="col-3"><i class="bi bi-mortarboard"></i> ${i.grade || 'Khác'}</div>
        </div>

        <div class="row exam-stats mb-2">
          <div class="col-3"><i class="bi bi-person"></i> ${i.contributor || 'admin'}</div>
          <div class="col-3"><i class="bi bi-database"></i> ${i.file_size || '-'}</div>
          <div class="col-3"><i class="bi bi-eye"></i> ${(i.view_count || 0).toLocaleString('vi-VN')}</div>
          <div class="col-3"><i class="bi bi-download"></i> ${(i.download_count || 0).toLocaleString('vi-VN')}</div>
        </div>

          <div class="d-flex flex-wrap gap-2 exam-badges mb-2">
            <span class="badge text-bg-light border">${examTypeLabel(tags)}</span>
            ${hasSolution ? '<span class="badge text-bg-success">Lời giải</span>' : ''}
            ${hasTestcase ? '<span class="badge text-bg-info">Chấm điểm</span>' : ''}
            ${isFeatured ? '<span class="badge text-bg-warning">Nổi bật</span>' : ''}
          </div>

          <hr class="my-2">

          <div class="d-grid exam-actions">
            <a class="btn btn-sm btn-outline-primary" href="exam-detail.html?id=${encodeURIComponent(i.id)}"><i class="bi bi-info-circle me-1"></i> Chi tiết</a>
            <a class="btn btn-sm btn-primary" target="_blank" href="${i.drive_view || '#'}"><i class="bi bi-eye me-1"></i> Xem nhanh</a>
            <a class="btn btn-sm btn-outline-secondary" target="_blank" href="${i.drive_download || i.drive_view || '#'}"><i class="bi bi-download me-1"></i> Tải về</a>
          </div>
        </div>
      </div>
    </div>`;
};

function apply() { const q = document.getElementById('q').value.toLowerCase().trim(), g = document.getElementById('grade').value, s = document.getElementById('sort').value; filtered = data.filter(i => (!g || i.grade === g) && [i.title, i.organization, i.grade, i.year, ...(i.problem_names || []), ...(i.tags || [])].join(' ').toLowerCase().includes(q)); filtered.sort((a, b) => s === 'new' ? new Date(b.last_updated) - new Date(a.last_updated) : s === 'view' ? (b.view_count || 0) - (a.view_count || 0) : s === 'down' ? (b.download_count || 0) - (a.download_count || 0) : gradeWeight(a.grade) - gradeWeight(b.grade)); page = 1; render(); }
function pageItems(total, p) { const pages = Math.max(1, Math.ceil(total / EXAM_CONFIG.pageSize)); if (pages <= EXAM_CONFIG.maxPageButtons) return Array.from({ length: pages }, (_, i) => i + 1); const items = [1], span = 2, start = Math.max(2, p - span), end = Math.min(pages - 1, p + span); if (start > 2) items.push('...'); for (let i = start; i <= end; i++) items.push(i); if (end < pages - 1) items.push('...'); items.push(pages); return items; }
function render() { const total = filtered.length, pages = Math.max(1, Math.ceil(total / EXAM_CONFIG.pageSize)); if (page > pages) page = pages; const slice = filtered.slice((page - 1) * EXAM_CONFIG.pageSize, page * EXAM_CONFIG.pageSize); document.getElementById('list').innerHTML = slice.map(card).join('') || '<p>Không có dữ liệu phù hợp.</p>'; document.getElementById('count').textContent = `${slice.length}/${total}`; const paging = pageItems(total, page); document.getElementById('paging').innerHTML = `<li class="page-item ${page === 1 ? 'disabled' : ''}"><button class="page-link" onclick="page=Math.max(1,page-1);render()">‹</button></li>` + paging.map(it => it === '...' ? '<li class="page-item disabled"><span class="page-link">…</span></li>' : `<li class="page-item ${page === it ? 'active' : ''}"><button class="page-link" onclick="page=${it};render()">${it}</button></li>`).join('') + `<li class="page-item ${page === pages ? 'disabled' : ''}"><button class="page-link" onclick="page=Math.min(${pages},page+1);render()">›</button></li>`; }

(async () => {
  data = (await fetch('data/exams.json').then(r => r.json())).filter(i => i.is_ready);

  document.getElementById('stats').innerHTML = [
    ['bi-file-earmark-text', 'Tổng đề thi', `${data.length}+`],
    ['bi-building', 'Đơn vị ra đề', `${new Set(data.map(i => i.organization)).size}+`],
    ['bi-download', 'Lượt tải', `${data.reduce((s, i) => s + (i.download_count || 0), 0).toLocaleString('vi-VN')}+`],
    ['bi-calendar-check', 'Mới cập nhật', data[0]?.last_updated || '-']
  ].map(s => `<div class="col-6 col-lg-3"><div class="hero-stat text-center"><i class="bi ${s[0]} stat-icon"></i><div class="h4 mb-1 mt-2">${s[2]}</div><div class="small">${s[1]}</div></div></div>`).join('');

  document.getElementById('grade').innerHTML += [...new Set(data.map(i => i.grade).filter(Boolean))].sort((a, b) => gradeWeight(a) - gradeWeight(b)).map(g => `<option>${g}</option>`).join('');
  ['q', 'grade', 'sort'].forEach(id => document.getElementById(id).addEventListener('input', apply));
  filtered = [...data]; apply();
})();
