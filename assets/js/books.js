// assets/js/books.js
document.addEventListener("DOMContentLoaded", () => {
  fetch("data/books.json")
    .then(res => res.json())
    .then(data => {
      const container = document.getElementById("book-feature");

      // Nếu đang ở index.html → chỉ lấy top 3
      if (container && container.dataset.mode === "top") {
        const topBooks = data.sort((a, b) => b.download_count - a.download_count).slice(0, 3);
        topBooks.forEach(book => {
          container.insertAdjacentHTML("beforeend", renderBookCard(book));
        });
      }

      // Nếu đang ở books.html → load tất cả + phân trang
      if (container && container.dataset.mode === "all") {
        const perPage = 9; // số card mỗi trang
        let currentPage = 1;

        function renderPage(page) {
          container.innerHTML = "";
          const start = (page - 1) * perPage;
          const end = start + perPage;
          const pageItems = data.slice(start, end);
          pageItems.forEach(book => {
            container.insertAdjacentHTML("beforeend", renderBookCard(book));
          });
        }

        // Render trang đầu
        renderPage(currentPage);

        // Tạo nút phân trang
        const pagination = document.getElementById("book-pagination");
        const totalPages = Math.ceil(data.length / perPage);
        pagination.innerHTML = "";
        for (let i = 1; i <= totalPages; i++) {
          const btn = document.createElement("button");
          btn.className = "btn btn-sm btn-outline-primary me-1";
          btn.textContent = i;
          btn.addEventListener("click", () => {
            currentPage = i;
            renderPage(currentPage);
          });
          pagination.appendChild(btn);
        }
      }
    })
    .catch(err => console.error("Lỗi load books:", err));
});
