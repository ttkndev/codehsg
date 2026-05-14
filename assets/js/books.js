document.addEventListener("DOMContentLoaded", () => {
  fetch("data/books.json")
    .then(res => res.json())
    .then(data => {
      const container = document.getElementById("book-feature");
      if (!container) return;

      if (container.dataset.mode === "top") {
        const topBooks = [...data].sort((a, b) => b.download_count - a.download_count).slice(0, 3);
        topBooks.forEach(book => container.insertAdjacentHTML("beforeend", renderBookCard(book)));
        return;
      }

      if (container.dataset.mode !== "all") return;

      const state = { perPage: 9, currentPage: 1, query: "", category: "", fileType: "", sort: "newest" };
      const searchEl = document.getElementById("book-search");
      const categoryEl = document.getElementById("book-category");
      const fileTypeEl = document.getElementById("book-file-type");
      const sortEl = document.getElementById("book-sort");
      const paginationEl = document.getElementById("book-pagination");
      const resultCountEl = document.getElementById("book-result-count");
      const totalCountEl = document.getElementById("book-total-count");
      const emptyEl = document.getElementById("book-empty");
      const sortLabelEl = document.getElementById("book-sort-label");

      const sortLabels = {
        newest: "Mới nhất (năm giảm dần)",
        downloads_desc: "Lượt tải cao nhất",
        views_desc: "Lượt xem cao nhất",
        title_asc: "Tên A → Z"
      };

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
          el.textContent = `${current.toLocaleString("vi-VN")}`;
        }, 20);
      };

      const categories = [...new Set(data.map(item => item.category).filter(Boolean))].sort((a, b) => a.localeCompare(b, "vi"));
      categories.forEach(category => categoryEl?.insertAdjacentHTML("beforeend", `<option value="${category}">${category}</option>`));

      const fileTypes = [...new Set(data.map(item => String(item.file_ext || "").trim().toLowerCase()).filter(Boolean))]
        .sort((a, b) => a.localeCompare(b, "vi", { numeric: true }));
      fileTypes.forEach(fileType => fileTypeEl?.insertAdjacentHTML("beforeend", `<option value="${fileType}">${fileType.toUpperCase()}</option>`));

      function updateHeroStats(items) {
        const sum = (arr, key) => arr.reduce((acc, item) => acc + (Number(item[key]) || 0), 0);
        animateCount(document.getElementById("hero-total-books"), items.length);
        animateCount(document.getElementById("hero-total-categories"), new Set(items.map(item => item.category).filter(Boolean)).size);
        animateCount(document.getElementById("hero-total-book-views"), sum(items, "view_count"));
        animateCount(document.getElementById("hero-total-book-downloads"), sum(items, "download_count"));
      }

      function getProcessedData() {
        let filtered = [...data];
        if (state.query) {
          const q = state.query.toLowerCase();
          filtered = filtered.filter(item =>
            [item.title, item.author, item.publisher, item.category].join(" ").toLowerCase().includes(q)
          );
        }
        if (state.category) filtered = filtered.filter(item => item.category === state.category);
        if (state.fileType) filtered = filtered.filter(item => String(item.file_ext || "").trim().toLowerCase() === state.fileType);

        filtered.sort((a, b) => {
          if (state.sort === "downloads_desc") return (b.download_count || 0) - (a.download_count || 0);
          if (state.sort === "views_desc") return (b.view_count || 0) - (a.view_count || 0);
          if (state.sort === "title_asc") return (a.title || "").localeCompare(b.title || "", "vi");
          return String(b.year || "").localeCompare(String(a.year || ""), "vi", { numeric: true });
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
        pageItems.forEach(book => container.insertAdjacentHTML("beforeend", renderBookCard(book)));

        emptyEl.classList.toggle("d-none", processed.length > 0);
        resultCountEl.textContent = processed.length;
        totalCountEl.textContent = data.length;
        sortLabelEl.textContent = sortLabels[state.sort] || sortLabels.newest;

        updateHeroStats(processed);
        renderPagination(totalPages);
      }

      searchEl?.addEventListener("input", e => {
        state.query = e.target.value.trim();
        state.currentPage = 1;
        renderAll();
      });
      categoryEl?.addEventListener("change", e => {
        state.category = e.target.value;
        state.currentPage = 1;
        renderAll();
      });
      fileTypeEl?.addEventListener("change", e => {
        state.fileType = e.target.value;
        state.currentPage = 1;
        renderAll();
      });
      sortEl?.addEventListener("change", e => {
        state.sort = e.target.value;
        state.currentPage = 1;
        renderAll();
      });

      renderAll();
    })
    .catch(err => console.error("Lỗi load books:", err));
});

document.addEventListener("click", e => {
  const target = e.target.closest(".book-img, .btn-preview-book");
  if (!target) return;
  const images = JSON.parse(target.getAttribute("data-images") || "[]");
  const title = target.getAttribute("data-title") || "Chi tiết học liệu";
  if (typeof openExamPreview === "function") openExamPreview(title, images);
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