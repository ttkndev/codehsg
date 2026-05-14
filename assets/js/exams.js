// assets/js/exams.js
document.addEventListener("DOMContentLoaded", () => {
  fetch("data/exams.json")
    .then(res => res.json())
    .then(data => {
      const container = document.getElementById("exam-feature");
      if (!container) return;

      if (container.dataset.mode === "top") {
        const topExams = [...data].sort((a, b) => b.view_count - a.view_count).slice(0, 3);
        topExams.forEach(exam => container.insertAdjacentHTML("beforeend", renderExamCard(exam)));
        return;
      }

      if (container.dataset.mode !== "all") return;

      const state = {
        perPage: 9,
        currentPage: 1,
        query: "",
        grade: "",
        year: "",
        sort: "newest"
      };

      const searchEl = document.getElementById("exam-search");
      const gradeEl = document.getElementById("exam-grade");
      const yearEl = document.getElementById("exam-year");
      const sortEl = document.getElementById("exam-sort");
      const paginationEl = document.getElementById("exam-pagination");
      const emptyEl = document.getElementById("exam-empty");
      const resultCountEl = document.getElementById("exam-result-count");
      const totalCountEl = document.getElementById("exam-total-count");
      const sortLabelEl = document.getElementById("exam-sort-label");

      const sortLabels = {
        newest: "Mới nhất (năm giảm dần)",
        views_desc: "Lượt xem cao nhất",
        downloads_desc: "Lượt tải cao nhất",
        title_asc: "Tên A → Z"
      };

      const grades = [...new Set(data.map(item => item.grade))].sort();
      grades.forEach(grade => gradeEl.insertAdjacentHTML("beforeend", `<option value="${grade}">${grade}</option>`));

      const getYearSortValue = year => {
        const match = String(year || "").match(/\d{4}/);
        return match ? Number(match[0]) : Number.POSITIVE_INFINITY;
      };

      const years = [...new Set(data.map(item => String(item.year || "").trim()).filter(Boolean))]
        .sort((a, b) => getYearSortValue(a) - getYearSortValue(b) || a.localeCompare(b, "vi"));
      years.forEach(year => yearEl.insertAdjacentHTML("beforeend", `<option value="${year}">${year}</option>`));

      function updateHeroStats(items) {
        const sum = (arr, key) => arr.reduce((acc, item) => acc + (Number(item[key]) || 0), 0);
        const animateCount = (el, target) => {
          if (!el) return;
          let current = 0;
          const step = Math.max(1, Math.ceil(target / 80));
          const timer = setInterval(() => {
            current += step;
            if (current >= target) {
              current = target;
              clearInterval(timer);
            }
            el.textContent = current.toLocaleString("vi-VN");
          }, 20);
        };

        const setText = (id, value) => {
          animateCount(document.getElementById(id), Number(value) || 0);
        };

        setText("hero-total-exams", items.length);
        setText("hero-total-problems", sum(items, "problem_count"));
        setText("hero-total-views", sum(items, "view_count"));
        setText("hero-total-downloads", sum(items, "download_count"));
      }

      function getProcessedData() {
        let filtered = [...data];

        if (state.query) {
          const q = state.query.toLowerCase();
          filtered = filtered.filter(item =>
            [item.title, item.organization, item.subject, item.grade, item.contributor]
              .join(" ")
              .toLowerCase()
              .includes(q)
          );
        }

        if (state.grade) filtered = filtered.filter(item => item.grade === state.grade);
        if (state.year) filtered = filtered.filter(item => String(item.year) === state.year);

        filtered.sort((a, b) => {
          if (state.sort === "views_desc") return b.view_count - a.view_count;
          if (state.sort === "downloads_desc") return b.download_count - a.download_count;
          if (state.sort === "title_asc") return a.title.localeCompare(b.title, "vi");
          const yearDiff = (Number(b.year) || 0) - (Number(a.year) || 0);
          if (yearDiff !== 0) return yearDiff;
          const updatedDiff = new Date(b.last_updated || 0).getTime() - new Date(a.last_updated || 0).getTime();
          if (updatedDiff !== 0) return updatedDiff;
          return (Number(b.id) || 0) - (Number(a.id) || 0);
        });

        return filtered;
      }

      function renderPagination(totalPages) {
        paginationEl.innerHTML = "";
        if (totalPages <= 1) return;

        for (let i = 1; i <= totalPages; i++) {
          const btn = document.createElement("button");
          btn.className = `btn btn-sm ${i === state.currentPage ? "btn-primary" : "btn-outline-primary"}`;
          btn.textContent = i;
          btn.addEventListener("click", () => {
            state.currentPage = i;
            renderAll();
          });
          paginationEl.appendChild(btn);
        }
      }

      function renderAll() {
        const processed = getProcessedData();
        const totalPages = Math.max(1, Math.ceil(processed.length / state.perPage));

        if (state.currentPage > totalPages) state.currentPage = 1;

        const start = (state.currentPage - 1) * state.perPage;
        const pageItems = processed.slice(start, start + state.perPage);

        container.innerHTML = "";
        pageItems.forEach(exam => container.insertAdjacentHTML("beforeend", renderExamCard(exam)));

        emptyEl.classList.toggle("d-none", processed.length > 0);
        resultCountEl.textContent = processed.length;
        totalCountEl.textContent = data.length;
        sortLabelEl.textContent = sortLabels[state.sort] || sortLabels.newest;

        updateHeroStats(processed);
        renderPagination(totalPages);
      }

      searchEl.addEventListener("input", e => {
        state.query = e.target.value.trim();
        state.currentPage = 1;
        renderAll();
      });

      gradeEl.addEventListener("change", e => {
        state.grade = e.target.value;
        state.currentPage = 1;
        renderAll();
      });

      yearEl.addEventListener("change", e => {
        state.year = e.target.value;
        state.currentPage = 1;
        renderAll();
      });

      sortEl.addEventListener("change", e => {
        state.sort = e.target.value;
        state.currentPage = 1;
        renderAll();
      });

      renderAll();
    })
    .catch(err => console.error("Lỗi load exams:", err));
});

// Sự kiện click để mở Preview bằng hàm dùng chung
document.addEventListener("click", e => {
  const target = e.target.closest(".exam-img, .btn-preview");

  if (target) {
    const images = JSON.parse(target.getAttribute("data-images") || "[]");
    const title = target.getAttribute("data-title") || "Xem nhanh đề thi";

    if (typeof openExamPreview === "function") {
      openExamPreview(title, images);
    } else {
      console.error("Hàm openExamPreview chưa được load!");
    }
  }
});

document.addEventListener("click", e => {
  if (e.target.closest(".btn-copy-link")) {
    e.preventDefault();
    const btn = e.target.closest(".btn-copy-link");
    const link = btn.getAttribute("data-link");

    navigator.clipboard.writeText(link).then(() => {
      // Thông báo nhỏ khi copy thành công
      btn.textContent = "Đã copy!";
      setTimeout(() => {
        btn.innerHTML = '<i class="bi bi-share-fill"></i> Chia sẻ';
      }, 1500);
    }).catch(err => {
      console.error("Không copy được:", err);
    });
  }
});
