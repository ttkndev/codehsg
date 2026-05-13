document.addEventListener("DOMContentLoaded", () => {
  Promise.all([
    fetch("data/exams.json").then(res => res.json()),
    fetch("data/books.json").then(res => res.json())
  ])
  .then(([exams, books]) => {
    // Đếm số lượng đề thi và học liệu
    const examCount = exams.length;
    const bookCount = books.length;

    // Tính tổng lượt xem và tải (nếu có trường view_count, download_count)
    const totalViews = exams.reduce((sum, e) => sum + (e.view_count || 0), 0)
                      + books.reduce((sum, b) => sum + (b.view_count || 0), 0);

    const totalDownloads = exams.reduce((sum, e) => sum + (e.download_count || 0), 0)
                          + books.reduce((sum, b) => sum + (b.download_count || 0), 0);

    // Gán vào hero
    document.getElementById("stat-exams").textContent = examCount;
    document.getElementById("stat-books").textContent = bookCount;
    document.getElementById("stat-views").textContent = totalViews;
    document.getElementById("stat-downloads").textContent = totalDownloads;
  })
  .catch(err => console.error("Lỗi load thống kê:", err));
});
