// assets/js/exams.js
document.addEventListener("DOMContentLoaded", () => {
  fetch("data/exams.json")
    .then(res => res.json())
    .then(data => {
      const container = document.getElementById("exam-feature");

      // Nếu đang ở index.html → chỉ lấy top 3
      if (container && container.dataset.mode === "top") {
        const topExams = data.sort((a, b) => b.view_count - a.view_count).slice(0, 3);
        topExams.forEach(exam => container.insertAdjacentHTML("beforeend", renderExamCard(exam)));
      }

      // Nếu đang ở exams.html → load tất cả + phân trang
      if (container && container.dataset.mode === "all") {
        const perPage = 9;
        let currentPage = 1;

        function renderPage(page) {
          container.innerHTML = "";
          const start = (page - 1) * perPage;
          const end = start + perPage;
          const pageItems = data.slice(start, end);
          pageItems.forEach(exam => container.insertAdjacentHTML("beforeend", renderExamCard(exam)));
        }

        // Render trang đầu
        renderPage(currentPage);

        // Tạo nút phân trang
        const pagination = document.getElementById("exam-pagination");
        const totalPages = Math.ceil(data.length / perPage);
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
    .catch(err => console.error("Lỗi load exams:", err));
});
