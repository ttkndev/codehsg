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

      const state = { perPage: 9, currentPage: 1 };
      const pagination = document.getElementById("book-pagination");
      const resultCountEl = document.getElementById("book-result-count");
      const totalCountEl = document.getElementById("book-total-count");
      const emptyEl = document.getElementById("book-empty");

      function updateHeroStats(items) {
        const sum = (arr, key) => arr.reduce((acc, item) => acc + (Number(item[key]) || 0), 0);
        const setText = (id, value) => {
          const el = document.getElementById(id);
          if (el) el.textContent = value.toLocaleString("vi-VN");
        };

        setText("hero-total-books", items.length);
        setText("hero-total-categories", new Set(items.map(item => item.category).filter(Boolean)).size);
        setText("hero-total-book-views", sum(items, "view_count"));
        setText("hero-total-book-downloads", sum(items, "download_count"));
      }

      function renderPage(page) {
        container.innerHTML = "";
        const start = (page - 1) * state.perPage;
        const pageItems = data.slice(start, start + state.perPage);
        pageItems.forEach(book => container.insertAdjacentHTML("beforeend", renderBookCard(book)));

        if (resultCountEl) resultCountEl.textContent = data.length;
        if (totalCountEl) totalCountEl.textContent = data.length;
        if (emptyEl) emptyEl.classList.toggle("d-none", data.length > 0);
      }

      function renderPagination() {
        pagination.innerHTML = "";
        const totalPages = Math.ceil(data.length / state.perPage);
        if (totalPages <= 1) return;

        for (let i = 1; i <= totalPages; i++) {
          const btn = document.createElement("button");
          btn.className = `btn btn-sm ${i === state.currentPage ? "btn-primary" : "btn-outline-primary"}`;
          btn.textContent = i;
          btn.addEventListener("click", () => {
            state.currentPage = i;
            renderPage(state.currentPage);
            renderPagination();
          });
          pagination.appendChild(btn);
        }
      }

      updateHeroStats(data);
      renderPage(state.currentPage);
      renderPagination();
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
